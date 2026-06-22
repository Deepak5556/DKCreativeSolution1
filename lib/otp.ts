import crypto from "crypto";

const SECRET = process.env.OTP_SECRET || "dk_creative_solutions_secret_otp_key_2026";

/**
 * Generates a signed, stateless verification hash for an OTP.
 */
export function generateOTPHash(email: string, code: string, expiresAt: number): string {
  const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
  const hash = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${hash}.${expiresAt}`;
}

/**
 * Cryptographically verifies if the entered OTP is correct and has not expired.
 */
export function verifyOTPHash(email: string, code: string, hashWithExpiry: string): boolean {
  if (!hashWithExpiry || !hashWithExpiry.includes(".")) {
    return false;
  }

  try {
    const [hash, expiresAtStr] = hashWithExpiry.split(".");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false; // Expired or invalid format
    }

    const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
    const expectedHash = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    
    return hash === expectedHash;
  } catch {
    return false;
  }
}
