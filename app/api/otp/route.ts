import { NextRequest, NextResponse } from "next/server";
import { generateOTPHash } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 1. Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Set expiry to 5 minutes from now
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // 3. Send email using Nodemailer helper (async)
    await sendOTPEmail(email, code);

    // 4. Generate signed verification token
    const otpHash = generateOTPHash(email, code, expiresAt);

    return NextResponse.json({
      success: true,
      otpHash,
      // For developer convenience/demo mode when SMTP keys aren't set yet:
      // (This serves as a visual feedback in the UI toast, so they don't have to check console in dev)
      code: process.env.EMAIL_SERVER_HOST ? undefined : code,
    });
  } catch (error) {
    console.error("Failed to generate OTP:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during OTP generation" },
      { status: 500 }
    );
  }
}
