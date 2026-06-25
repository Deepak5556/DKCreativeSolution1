"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import { resolveIcon } from "@/lib/icons";
import type { ServiceItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Services() {
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [activeQuoteService, setActiveQuoteService] = useState<ServiceItem | null>(null);

  // Inquiry Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [priority, setPriority] = useState("1 Month");
  const [subCategory, setSubCategory] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Verification states
  const [otpHash, setOtpHash] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [showVerifyStep, setShowVerifyStep] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Validation Touched States
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Form Validation Helpers
  const isNameValid = name.trim().length >= 3 && name.trim().length <= 50 && /^[a-zA-Z\s]+$/.test(name.trim());
  const isPhoneValid = phone.length === 10 && /^[6-9]\d{9}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isNameValid && isPhoneValid && isEmailValid;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^a-zA-Z\s]/g, "");
    val = val.replace(/\s{2,}/g, " ");
    if (val.startsWith(" ")) {
      val = val.trimStart();
    }
    setName(val);
    setNameTouched(true);
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    setName(name.trim());
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/\D/g, "");
    if (val.length > 10) {
      val = val.slice(0, 10);
    }
    setPhone(val);
    setPhoneTouched(true);
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/\D/g, "").slice(0, 10);
    if (cleanedText) {
      setPhone(cleanedText);
      setPhoneTouched(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, "");
    setEmail(val);
    setEmailTouched(true);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmail(email.trim());
  };

  useEffect(() => {
    fetch("/api/content/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const resolved = data.map((item) => ({
            ...item,
            icon: resolveIcon(item.icon),
          }));
          setServicesList(resolved);
        }
      })
      .catch((err) => console.error("Error loading services:", err))
      .finally(() => {
        window.dispatchEvent(new CustomEvent("sectionLoaded", { detail: "services" }));
      });
  }, []);

  // Handle selecting a service and opening the modal
  const handleSelectQuote = (service: ServiceItem | null) => {
    setActiveQuoteService(service);
    
    // Reset all form inputs and verification states
    setName("");
    setEmail("");
    setPhone("");
    setDetails("");
    setPriority("1 Month");
    setOtpHash("");
    setEnteredCode("");
    setShowVerifyStep(false);

    // Reset touched states
    setNameTouched(false);
    setEmailTouched(false);
    setPhoneTouched(false);

    if (service) {
      const title = service.title.toLowerCase();
      if (title.includes("web") || title.includes("portfolio")) {
        setCategory("Web Development");
        setSubCategory("Full Stack Web App");
      } else if (title.includes("video")) {
        setCategory("Video Editing");
        setSubCategory("Reels / Shorts (Vertical)");
      } else if (title.includes("poster")) {
        setCategory("Poster Design");
        setSubCategory("");
      } else if (title.includes("ui") || title.includes("ux")) {
        setCategory("UI/UX Design");
        setSubCategory("");
      } else {
        setCategory("Other");
        setSubCategory("");
      }
    }
  };

  // Handle category drop down change to pre-fill dynamic subCategory default
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (val === "Web Development" || val === "Mobile Apps" || val === "Both (Web & Mobile)") {
      setSubCategory("Full Stack Web App");
    } else if (val === "Video Editing") {
      setSubCategory("Reels / Shorts (Vertical)");
    } else {
      setSubCategory("");
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showVerifyStep) {
      // Step 1: Trigger email verification code from backend
      setSendingOtp(true);
      try {
        const res = await fetch("/api/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOtpHash(data.otpHash);
          setEnteredCode("");
          setShowVerifyStep(true);
          
          if (data.code) {
            toast.success("Verification code generated (Demo Mode)!", {
              description: `Please verify your email using code: ${data.code}`,
              duration: 10000,
            });
          } else {
            toast.success("Verification code sent!", {
              description: `Please check your email inbox at ${email} for the code.`,
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
      return;
    }

    // Step 2: Validate code and submit to local DB with server-side validation
    setSubmitting(true);

    const payload = {
      id: "query-" + Date.now(),
      name,
      email,
      phone,
      category,
      priority,
      subCategory,
      details,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/content/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          item: payload,
          otpHash,
          otpCode: enteredCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Inquiry submitted! We will contact you soon.");
        handleSelectQuote(null);
      } else {
        toast.error(data.error || "Failed to submit inquiry");
      }
    } catch {
      toast.error("Network error during lead submission");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="services" className="relative bg-dk-bg py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="What I Do"
          title="Services built for"
          highlight="measurable impact"
          description="From first wireframe to final export — a focused set of services, each handled end-to-end with the same attention to detail."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              onSelectQuote={handleSelectQuote}
            />
          ))}
        </div>
      </div>

      {/* Lead Capture Dialog Form */}
      <Dialog open={!!activeQuoteService} onOpenChange={(open) => !open && handleSelectQuote(null)}>
        <DialogContent className="w-[95%] max-w-md bg-[#050505] border-white/10 text-white max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-display text-xl font-bold">
              Request a Quote
            </DialogTitle>
            <DialogDescription className="text-dk-muted text-sm">
              Fill out the details below, and we will get back to you with a customized estimate.
            </DialogDescription>
          </DialogHeader>

          {showVerifyStep ? (
            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-1.5 text-center py-2">
                <p className="text-xs text-dk-muted leading-relaxed">
                  We have sent a 4-digit verification code to <span className="text-primary font-medium">{email}</span>. Please enter it below to complete your quote request.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="inquiry-otp" className="text-xs font-mono uppercase tracking-wider text-dk-muted text-center">
                  4-Digit Code
                </label>
                <input
                  id="inquiry-otp"
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className="w-full h-12 text-center font-mono text-lg tracking-[0.2em] rounded-2xl border border-white/10 bg-[#0D0D0D] px-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  style={{ transition: "all 0.25s ease" }}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVerifyStep(false)}
                  className="rounded-2xl border border-white/15 h-12 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/5 active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gold-gradient h-12 px-6 text-sm font-bold text-dk-bg shadow-glow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Verify & Submit"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-5 mt-2">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="inquiry-name" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    maxLength={50}
                    value={name}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    placeholder="John Doe"
                    className={cn(
                      "w-full h-12 rounded-2xl border bg-[#0D0D0D] pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                      nameTouched && !isNameValid
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                        : nameTouched && isNameValid
                        ? "border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/20 focus:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        : "border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                    )}
                    style={{ transition: "all 0.25s ease" }}
                  />
                  {nameTouched && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isNameValid ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in fade-in zoom-in duration-200" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 animate-in fade-in zoom-in duration-200" />
                      )}
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {nameTouched && !isNameValid && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="text-xs text-red-500 font-medium"
                    >
                      Please enter a valid full name (letters only).
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email & Phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="inquiry-email" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="inquiry-email"
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      placeholder="john@example.com"
                      className={cn(
                        "w-full h-12 rounded-2xl border bg-[#0D0D0D] pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        emailTouched && !isEmailValid
                          ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                          : emailTouched && isEmailValid
                          ? "border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/20 focus:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                      )}
                      style={{ transition: "all 0.25s ease" }}
                    />
                    {emailTouched && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isEmailValid ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in fade-in zoom-in duration-200" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 animate-in fade-in zoom-in duration-200" />
                        )}
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {emailTouched && !isEmailValid && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="text-xs text-red-500 font-medium"
                      >
                        Enter a valid email address.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="inquiry-phone" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="inquiry-phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      onPaste={handlePhonePaste}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="+91 9876543210"
                      className={cn(
                        "w-full h-12 rounded-2xl border bg-[#0D0D0D] pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        phoneTouched && !isPhoneValid
                          ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                          : phoneTouched && isPhoneValid
                          ? "border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/20 focus:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                      )}
                      style={{ transition: "all 0.25s ease" }}
                    />
                    {phoneTouched && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isPhoneValid ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in fade-in zoom-in duration-200" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 animate-in fade-in zoom-in duration-200" />
                        )}
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {phoneTouched && !isPhoneValid && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="text-xs text-red-500 font-medium"
                      >
                        Enter a valid 10-digit Indian mobile number.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Project Category
                </label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="inquiry-category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Apps">Mobile Apps</SelectItem>
                    <SelectItem value="Both (Web & Mobile)">Both (Web & Mobile)</SelectItem>
                    <SelectItem value="Video Editing">Video Editing</SelectItem>
                    <SelectItem value="Poster Design">Poster Design</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline Priority Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Timeline / Priority
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="inquiry-priority">
                    <SelectValue placeholder="Select Timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Month">1 Month</SelectItem>
                    <SelectItem value="2 Months">2 Months</SelectItem>
                    <SelectItem value="3 Months">3 Months</SelectItem>
                    <SelectItem value="More than 3 Months">More than 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Sub-Category options */}
              {(category === "Web Development" || category === "Mobile Apps" || category === "Both (Web & Mobile)") && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Desired Platform/Type
                  </label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger id="inquiry-web-type">
                      <SelectValue placeholder="Select Platform Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Stack Web App">Full Stack Web App</SelectItem>
                      <SelectItem value="iOS & Android Mobile App">iOS & Android Mobile App</SelectItem>
                      <SelectItem value="E-commerce Website">E-commerce Website</SelectItem>
                      <SelectItem value="Custom Software">Custom Software</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {category === "Video Editing" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Video Format
                  </label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger id="inquiry-video-type">
                      <SelectValue placeholder="Select Video Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reels / Shorts (Vertical)">Reels / Shorts (Vertical)</SelectItem>
                      <SelectItem value="Full Form Video (Landscape)">Full Form Video (Landscape)</SelectItem>
                      <SelectItem value="YouTube Video">YouTube Video</SelectItem>
                      <SelectItem value="Promo / Ad Video">Promo / Ad Video</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-2">
                <label htmlFor="inquiry-details" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Additional Details
                </label>
                <textarea
                  id="inquiry-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us more about your ideas, features, or design requirements..."
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-4 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(212,175,55,0.15)] resize-none"
                  style={{ transition: "all 0.25s ease" }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || submitting || sendingOtp}
                className="mt-2 h-12 w-full flex items-center justify-center gap-2 rounded-2xl bg-gold-gradient text-sm font-bold text-dk-bg shadow-glow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none active:scale-95"
              >
                {submitting || sendingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {sendingOtp ? "Sending OTP..." : "Submitting Request..."}
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
