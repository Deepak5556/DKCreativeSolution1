import { NextRequest, NextResponse } from "next/server";
import { verifyOTPHash } from "@/lib/otp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, code, otpHash } = await request.json();

    if (!email || !code || !otpHash) {
      return NextResponse.json(
        { success: false, error: "Missing required verification fields." },
        { status: 400 }
      );
    }

    const isValid = verifyOTPHash(email, code, otpHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Verification code is incorrect or expired." },
        { status: 400 }
      );
    }

    // Usually you'd set an HTTP-only cookie here or return a session token
    // For this demonstration, we'll just return success.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
