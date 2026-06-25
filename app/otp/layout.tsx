import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "One-Time Password verification page for secure access to DK Creative Solutions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OtpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
