"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";

import { resolveIcon } from "@/lib/icons";
import type { ServiceItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
    setPriority("standard");
    setOtpHash("");
    setEnteredCode("");
    setShowVerifyStep(false);

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
        <DialogContent className="max-w-md bg-black border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-display text-xl font-bold">
              Request a Quote
            </DialogTitle>
            <DialogDescription className="text-dk-muted text-sm">
              Fill out the details below, and we will get back to you with a customized estimate.
            </DialogDescription>
          </DialogHeader>

          {showVerifyStep ? (
            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5 text-center py-2">
                <p className="text-xs text-dk-muted leading-relaxed">
                  We have sent a 4-digit verification code to <span className="text-primary font-medium">{email}</span>. Please enter it below to complete your quote request.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-otp" className="text-xs font-mono uppercase tracking-wider text-dk-muted text-center">
                  4-Digit Code
                </label>
                <input
                  id="inquiry-otp"
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
                <button
                  type="button"
                  onClick={() => setShowVerifyStep(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-dk-bg shadow-glow-sm transition-transform hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin inline-block mr-1.5" />
                      Submitting...
                    </>
                  ) : (
                    "Verify & Submit"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4 mt-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-name" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Full Name
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-email" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Email Address
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-phone" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Phone Number
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-category" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Project Category
                </label>
                <select
                  id="inquiry-category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none bg-black"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Both (Web & Mobile)">Both (Web & Mobile)</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Poster Design">Poster Design</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Timeline Priority Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-priority" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Timeline / Priority
                </label>
                <select
                  id="inquiry-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none bg-black"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="More than 3 Months">More than 3 Months</option>
                </select>
              </div>

              {/* Conditional Sub-Category options */}
              {(category === "Web Development" || category === "Mobile Apps" || category === "Both (Web & Mobile)") && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-web-type" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Desired Platform/Type
                  </label>
                  <select
                    id="inquiry-web-type"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none bg-black"
                  >
                    <option value="Full Stack Web App">Full Stack Web App</option>
                    <option value="iOS & Android Mobile App">iOS & Android Mobile App</option>
                    <option value="E-commerce Website">E-commerce Website</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {category === "Video Editing" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-video-type" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                    Video Format
                  </label>
                  <select
                    id="inquiry-video-type"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none bg-black"
                  >
                    <option value="Reels / Shorts (Vertical)">Reels / Shorts (Vertical)</option>
                    <option value="Full Form Video (Landscape)">Full Form Video (Landscape)</option>
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Promo / Ad Video">Promo / Ad Video</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-details" className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Additional Details
                </label>
                <textarea
                  id="inquiry-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us more about your ideas, features, or design requirements..."
                  rows={3}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20 focus:border-primary/50 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || sendingOtp}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient py-2.5 text-sm font-bold text-dk-bg shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
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
