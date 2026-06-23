"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ArrowLeft, ShieldAlert, Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otpHash, setOtpHash] = useState("");

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // References for the 4 input elements
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Resend Timer countdown
  useEffect(() => {
    if (timer <= 0 || step !== "otp") return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setOtpHash(data.otpHash);
        setStep("otp");
        setTimer(30);
        
        if (data.code) {
          toast.success("Verification code generated (Demo Mode)!", {
            description: `Please verify your email using code: ${data.code}`,
            duration: 10000,
          });
        } else {
          toast.success("Verification code sent!", {
            description: `Please check your email inbox at ${email}.`,
          });
        }
      } else {
        toast.error(data.error || "Failed to generate verification code");
      }
    } catch {
      toast.error("Network error during verification request");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle number input and focus change
  const handleChange = (index: number, val: string) => {
    // Keep only numbers
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1); // Take only the last digit entered
    setOtp(newOtp);

    // Focus next box if current is filled
    if (index < 3 && cleanVal) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Current is empty, delete previous and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      } else {
        // Delete current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Paste handler
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pastedData.length === 4) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs[3].current?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setOtp(["", "", "", ""]);
    handleSendOtp(); // Re-trigger the API call
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, otpHash }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        toast.success("Security check complete!", {
          description: "Your email has been verified.",
        });
      } else {
        setErrorCount((prev) => prev + 1);
        toast.error("Incorrect verification code", {
          description: data.error || "Please try again.",
        });
        setOtp(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch {
      toast.error("Network error during verification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#050505] px-4 py-12 text-white">
      {/* Decorative Brand Glow Orbs */}
      <GlowOrb color="gold" size={400} className="-left-40 top-1/4" />
      <GlowOrb color="silver" size={350} className="-right-32 bottom-1/4" />
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-dk-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Studio
        </Link>

        {/* Glassmorphic Device Mockup Container */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-md shadow-glow-md border-glow-hover transition-all duration-300">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-gradient opacity-20 group-hover:opacity-60 transition-opacity" />

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {/* Monogram logo */}
                <div className="mb-6 flex justify-center">
                  <div className="relative rounded-full p-2.5 border border-white/5 bg-white/[0.01]">
                    <Logo size={72} animateRing={step === "otp" && timer > 0} />
                  </div>
                </div>

                {step === "email" ? (
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="text-center mb-6">
                      <h1 className="font-display text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        Verify your identity
                      </h1>
                      <p className="mt-2.5 text-xs text-dk-muted leading-relaxed max-w-xs mx-auto">
                        Enter your email address to receive a secure login code.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-dk-muted/50 focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !email}
                      className="w-full bg-gold-gradient py-6 text-sm font-bold text-dk-bg shadow-glow-sm hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending Code...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifySubmit} className="flex flex-col gap-6">
                    <div className="text-center mb-6">
                      <h1 className="font-display text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        Two-Factor authentication
                      </h1>
                      <p className="mt-2.5 text-xs text-dk-muted leading-relaxed max-w-xs mx-auto">
                        We sent a security verification code to your email address:
                        <span className="block mt-1 font-mono text-white/90 font-medium">
                          {email}
                        </span>
                      </p>
                    </div>

                    {/* Email Icon Mock Bubble */}
                    <div className="mb-6 flex justify-center">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
                        <Mail className="h-4 w-4 text-primary animate-pulse" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-dk-muted">
                          Awaiting Code
                        </span>
                      </div>
                    </div>

                    {/* Verification Boxes */}
                    <div className="flex justify-center gap-3" onPaste={handlePaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={inputRefs[idx]}
                          type="text"
                          maxLength={1}
                          required
                          value={digit}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="h-14 w-12 rounded-xl border border-white/10 bg-white/[0.02] text-center font-display text-xl font-bold text-white focus:border-primary/60 focus:bg-white/[0.04] focus:outline-none transition-all focus:scale-105"
                        />
                      ))}
                    </div>

                    {/* Resend Link */}
                    <div className="text-center text-xs font-mono">
                      {timer > 0 ? (
                        <span className="text-dk-muted">
                          Resend code in <span className="text-primary font-bold">{timer}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={submitting}
                          className="text-primary hover:underline font-bold transition-all disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    {/* Errors count warning */}
                    {errorCount > 0 && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive-foreground text-red-400"
                      >
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span>Code error. Please try again.</span>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gold-gradient py-6 text-sm font-bold text-dk-bg shadow-glow-sm hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying Securely...
                        </>
                      ) : (
                        "Submit Security Code"
                      )}
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp(["", "", "", ""]);
                        setOtpHash("");
                      }}
                      className="text-xs text-dk-muted hover:text-white transition-colors"
                    >
                      Use a different email
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="mb-6 rounded-full bg-primary/10 border border-primary/20 p-4 text-primary animate-bounce">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                  Verification Successful
                </h2>
                <p className="mt-3 text-xs text-dk-muted leading-relaxed max-w-xs">
                  Your identity has been confirmed securely via email OTP.
                </p>

                <Link href="/" className="w-full mt-8">
                  <Button className="w-full bg-gold-gradient py-6 text-sm font-bold text-dk-bg shadow-glow-sm hover:scale-[1.02] transition-all">
                    Return to Home Studio
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
