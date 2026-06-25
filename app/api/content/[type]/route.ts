import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyOTPHash } from "@/lib/otp";
import { sendQueryNotificationEmail } from "@/lib/nodemailer";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_TYPES = [
  "services",
  "projects",
  "videos",
  "posters",
  "stats",
  "testimonials",
  "process",
  "features",
  "queries",
  "site_settings",
  "change_history",
];

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  if (type === "queries" && !(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await readData(type);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
  }
}

interface DataItem {
  id: string;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { action, item, id } = body;

    const isPublicCreateQuery = type === "queries" && action === "create";
    if (!isPublicCreateQuery && !(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isPublicCreateQuery) {
      const { otpHash, otpCode } = body;
      const email = item?.email;

      if (!otpHash || !otpCode || !email) {
        return NextResponse.json(
          { error: "Email verification required to submit inquiries." },
          { status: 400 }
        );
      }

      const isValid = verifyOTPHash(String(email), String(otpCode), String(otpHash));
      if (!isValid) {
        return NextResponse.json(
          { error: "Verification code is incorrect or expired." },
          { status: 400 }
        );
      }
    }

    const currentData = await readData(type);
    const typedData = currentData as DataItem[];

    let updatedData: unknown[] = [...typedData];

    if (action === "create") {
      updatedData.push(item);
      if (type === "queries") {
        try {
          await sendQueryNotificationEmail(item as Record<string, unknown>);
        } catch (emailErr) {
          console.error("Failed to send query notification email:", emailErr);
        }
      }
    } else if (action === "update") {
      const typedItem = item as DataItem;
      updatedData = typedData.map((d) => (d.id === typedItem.id ? item : d));
    } else if (action === "delete") {
      const itemToDelete = typedData.find((d) => d.id === id);
      if (itemToDelete) {
        const urlsToDelete = [
          itemToDelete.imageUrl,
          itemToDelete.beforeImageUrl,
          itemToDelete.thumbnailUrl,
          itemToDelete.videoUrl,
        ].filter((u): u is string => typeof u === "string" && u !== "");

        for (const url of urlsToDelete) {
          if (url.includes("/storage/v1/object/public/")) {
            try {
              const parts = url.split("/storage/v1/object/public/");
              if (parts.length >= 2) {
                const pathParts = parts[1].split("/");
                const bucket = pathParts[0];
                const filePath = pathParts.slice(1).join("/");
                if (bucket && filePath) {
                  console.log(`Server-side deleting storage file: bucket=${bucket}, path=${filePath}`);
                  await supabase.storage.from(bucket).remove([filePath]);
                }
              }
            } catch (err) {
              console.error("Failed to delete storage file on item deletion:", err);
            }
          }
        }
      }
      updatedData = typedData.filter((d) => d.id !== id);
    } else if (action === "overwrite") {
      if (Array.isArray(body.data)) {
        updatedData = body.data;
      } else {
        return NextResponse.json(
          { error: "Data must be an array" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await writeData(type, updatedData);

    // Log the successful modification to change_history table
    if (type !== "queries" && type !== "change_history") {
      try {
        let itemTitle = "N/A";
        if (action === "delete") {
          itemTitle = `Deleted item (ID: ${id})`;
        } else if (action === "overwrite") {
          itemTitle = `Overwrote all ${type} data`;
        } else if (item && typeof item === "object") {
          const typedItem = item as Record<string, unknown>;
          itemTitle = String(typedItem.title || typedItem.name || typedItem.label || typedItem.id || "N/A");
        }

        await supabase.from("change_history").insert({
          content_type: type,
          action: action,
          item_title: itemTitle,
        });
      } catch (logErr) {
        console.error("Failed to log change history:", logErr);
      }
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save data";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
