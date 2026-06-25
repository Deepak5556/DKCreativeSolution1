"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { sendContactEmail, isEmailJsConfigured } from "@/lib/emailjs";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { useSiteConfig } from "@/components/shared/SiteConfigProvider";
import { ShortsThumbnailSelector, type ThumbnailOption } from "@/components/shared/ShortsThumbnailSelector";

export function Contact() {
  const config = useSiteConfig();
  const [submitted, setSubmitted] = useState(false);

  // Verification states
  const [otpHash, setOtpHash] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<ContactFormValues | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailOption | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", service: "", message: "" },
  });

  const selectedService = watch("service");

  const onSubmit = async (values: ContactFormValues) => {
    setSendingOtp(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpHash(data.otpHash);
        setPendingValues(values);
        setEnteredCode("");
        setShowVerifyModal(true);
        
        if (data.code) {
          toast.success("Verification code generated (Demo Mode)!", {
            description: `Please verify your email using code: ${data.code}`,
            duration: 10000,
          });
        } else {
          toast.success("Verification code sent!", {
            description: `Please check your email inbox at ${values.email} for the code.`,
          });
        }
      } else {
        toast.error(data.error || "Failed to generate verification code");
      }
    } catch {
      toast.error("Network error during verification email request");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingValues || !otpHash) return;

    setVerifying(true);
    try {
      let finalDetails = pendingValues.message;
      if (pendingValues.service === "Video Editing" && selectedThumbnail) {
        finalDetails += `\n\n[Optimized Shorts Thumbnail Selection]\nSelected Frame: ${selectedThumbnail.name}\nEstimated CTR Potential: ${selectedThumbnail.ctr}%\nPreview URL (Base64/Data): ${selectedThumbnail.url.substring(0, 100)}...`;
      }

      // 1. Submit to local DB with server-side validation properties
      const queryPayload = {
        id: "query-" + Date.now(),
        name: pendingValues.name,
        email: pendingValues.email,
        phone: pendingValues.phone,
        category: pendingValues.service,
        priority: "1 Month",
        subCategory: "",
        details: finalDetails,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/content/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          item: queryPayload,
          otpHash,
          otpCode: enteredCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect or expired verification code.");
      }

      // 2. Submit to EmailJS
      if (isEmailJsConfigured) {
        await sendContactEmail({
          ...pendingValues,
          message: finalDetails,
        });
      } else {
        console.warn("EmailJS not configured. Form payload:", pendingValues);
        await new Promise((r) => setTimeout(r, 900));
      }

      setSubmitted(true);
      setShowVerifyModal(false);
      setPendingValues(null);
      setOtpHash("");
      toast.success("Message sent!", {
        description: "Thanks for reaching out — I'll reply within 24 hours.",
      });
      reset();
    } catch (error) {
      toast.error("Verification failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or email me directly.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32">
      <GlowOrb color="gold" size={460} className="-right-40 top-0" />
      <GlowOrb color="silver" size={380} className="-left-32 bottom-0" />

      <div className="container relative">
        <SectionHeading
          eyebrow="Start Your Project"
          title="Let's Consult on Your"
          highlight="Digital Goals"
          description="Contact DK Creative Solutions for website design, digital marketing, video editing, and SEO services. I will reply within 24 hours."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Contact info */}
          <div className="flex flex-col gap-6">
            {[
              { icon: Phone, label: "Phone", value: config.phone, href: `tel:${config.phoneRaw}` },
              { icon: Mail, label: "Email", value: config.email, href: `mailto:${config.email}` },
              { icon: MapPin, label: "Location", value: config.location },
              { icon: Clock, label: "Response Time", value: "Within 24 hours" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-dk-bg">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-dk-muted">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-white hover:text-primary">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass rounded-2xl p-6 sm:p-8"
            noValidate
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle2 className="h-14 w-14 text-primary" />
                <h3 className="font-display text-xl font-semibold text-white">
                  Message sent
                </h3>
                <p className="max-w-sm text-sm text-dk-muted">
                  Thanks for reaching out — I&apos;ll review your project details and get
                  back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="service">Service Required</Label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="service" aria-invalid={!!errors.service}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.service && (
                    <p className="text-xs text-destructive">{errors.service.message}</p>
                  )}
                </div>

                {selectedService === "Video Editing" && (
                  <div className="sm:col-span-2 animate-fadeIn">
                    <ShortsThumbnailSelector
                      onSelectThumbnail={setSelectedThumbnail}
                      selectedThumbnail={selectedThumbnail}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, and goals..."
                    aria-invalid={!!errors.message}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting || sendingOtp} className="sm:col-span-2">
                  {isSubmitting || sendingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {sendingOtp ? "Sending OTP..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {!isEmailJsConfigured && (
                  <p className="text-center text-xs text-dk-muted sm:col-span-2">
                    Demo mode — add your EmailJS keys to <code>.env.local</code> to enable
                    live email delivery. See README.md.
                  </p>
                )}
              </div>
            )}
          </motion.form>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <Dialog open={showVerifyModal} onOpenChange={(open) => !open && setShowVerifyModal(false)}>
        <DialogContent className="max-w-md bg-black border-white/10 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-white font-display text-xl font-bold">
              Verify Email Address
            </DialogTitle>
            <DialogDescription className="text-dk-muted text-sm mt-1">
              We have sent a 4-digit verification code to <span className="text-primary font-medium">{pendingValues?.email}</span>. Please enter it below to complete your submission.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyAndSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="verification-otp" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                4-Digit Code
              </Label>
              <Input
                id="verification-otp"
                type="text"
                maxLength={4}
                required
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ""))}
                placeholder="1234"
                className="text-center font-mono text-lg tracking-[0.2em] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVerifyModal(false)}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={verifying}
                className="rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-dk-bg shadow-glow-sm transition-transform hover:-translate-y-0.5"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Verify & Submit"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
