"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Globe, Mail, Share2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { siteConfig as fallbackConfig } from "@/lib/constants";

export function SiteSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    shortName: "",
    tagline: "",
    description: "",
    url: "",
    ogImage: "",
    email: "",
    phone: "",
    phoneRaw: "",
    location: "",
    founder: "",
    keywords: "",
    whatsappUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    behanceUrl: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/content/site_settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const row = data[0];
          setFormData({
            id: row.id || "",
            name: row.name || fallbackConfig.name,
            shortName: row.shortName || fallbackConfig.shortName,
            tagline: row.tagline || fallbackConfig.tagline,
            description: row.description || fallbackConfig.description,
            url: row.url || fallbackConfig.url,
            ogImage: row.ogImage || fallbackConfig.ogImage,
            email: row.email || fallbackConfig.email,
            phone: row.phone || fallbackConfig.phone,
            phoneRaw: row.phoneRaw || fallbackConfig.phoneRaw,
            location: row.location || fallbackConfig.location,
            founder: row.founder || fallbackConfig.founder,
            keywords: Array.isArray(row.keywords) ? row.keywords.join(", ") : "",
            whatsappUrl: row.whatsappUrl || fallbackConfig.links.whatsapp || "",
            instagramUrl: row.instagramUrl || fallbackConfig.links.instagram || "",
            linkedinUrl: row.linkedinUrl || fallbackConfig.links.linkedin || "",
            githubUrl: row.githubUrl || fallbackConfig.links.github || "",
            twitterUrl: row.twitterUrl || fallbackConfig.links.twitter || "",
            youtubeUrl: row.youtubeUrl || fallbackConfig.links.youtube || "",
            behanceUrl: row.behanceUrl || fallbackConfig.links.behance || "",
          });
        } else {
          // Initialize with fallback config from file
          setFormData({
            id: "",
            name: fallbackConfig.name,
            shortName: fallbackConfig.shortName,
            tagline: fallbackConfig.tagline,
            description: fallbackConfig.description,
            url: fallbackConfig.url,
            ogImage: fallbackConfig.ogImage,
            email: fallbackConfig.email,
            phone: fallbackConfig.phone,
            phoneRaw: fallbackConfig.phoneRaw,
            location: fallbackConfig.location,
            founder: fallbackConfig.founder,
            keywords: fallbackConfig.keywords.join(", "),
            whatsappUrl: fallbackConfig.links.whatsapp || "",
            instagramUrl: fallbackConfig.links.instagram || "",
            linkedinUrl: fallbackConfig.links.linkedin || "",
            githubUrl: fallbackConfig.links.github || "",
            twitterUrl: fallbackConfig.links.twitter || "",
            youtubeUrl: fallbackConfig.links.youtube || "",
            behanceUrl: fallbackConfig.links.behance || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load site settings. Initializing with defaults.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const keywordsArray = formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

      // Construct payload. Note: The API/DB helper will convert these camelCase keys to snake_case automatically.
      const payloadItem = {
        id: formData.id || undefined, // undefined will let DB auto-generate it if new
        name: formData.name,
        shortName: formData.shortName,
        tagline: formData.tagline,
        description: formData.description,
        url: formData.url,
        ogImage: formData.ogImage,
        email: formData.email,
        phone: formData.phone,
        phoneRaw: formData.phoneRaw,
        location: formData.location,
        founder: formData.founder,
        keywords: keywordsArray,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        instagramUrl: formData.instagramUrl,
        twitterUrl: formData.twitterUrl,
        youtubeUrl: formData.youtubeUrl,
        behanceUrl: formData.behanceUrl,
        whatsappUrl: formData.whatsappUrl,
      };

      const res = await fetch("/api/content/site_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "overwrite",
          data: [payloadItem],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      // Update local id state if it was created
      if (Array.isArray(data.data) && data.data.length > 0 && data.data[0].id) {
        setFormData(prev => ({ ...prev, id: data.data[0].id }));
      }

      toast.success("Site settings updated successfully!");
    } catch (err: unknown) {
      console.error("Save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn max-w-5xl">
      {/* 1. GENERAL SETTINGS */}
      <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/60 p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-dk-bg">
            <Globe className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-white">General &amp; SEO settings</h3>
            <p className="text-[10px] text-dk-muted">Configure metadata and global branding properties.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Studio / Company Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. DK Creative Solutions"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              placeholder="e.g. DK Creative"
              required
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Transforming Ideas Into Digital Experiences"
              required
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="description">SEO Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief, keywords-rich description of your business..."
              className="min-h-24"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="e.g. https://www.dkcreativesolutions.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ogImage">OpenGraph Image Path/URL</Label>
            <Input
              id="ogImage"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleChange}
              placeholder="e.g. /og-image.png"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="founder">Founder / Creative Director</Label>
            <Input
              id="founder"
              name="founder"
              value={formData.founder}
              onChange={handleChange}
              placeholder="e.g. DK"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="keywords">SEO Keywords (Comma Separated)</Label>
            <Input
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="freelance, web developer, designer"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTACT DETAILS */}
      <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/60 p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-dk-bg">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Contact details</h3>
            <p className="text-[10px] text-dk-muted">Specify the address, phone numbers, and default contact email.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Public / Support Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@dkcreativesolutions.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location / Office Address</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. India (Remote / Worldwide)"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone Number (Display Format)</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9972879256"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneRaw">Phone Number (Raw Format for Links)</Label>
            <Input
              id="phoneRaw"
              name="phoneRaw"
              value={formData.phoneRaw}
              onChange={handleChange}
              placeholder="e.g. +919972879256 (no spaces)"
              required
            />
            <span className="text-[10px] text-dk-muted flex items-start gap-1">
              <Info className="h-3 w-3 shrink-0 text-primary mt-0.5" />
              Used for <code>tel:</code> action links (e.g. <code>tel:+919972879256</code>)
            </span>
          </div>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA PROFILES */}
      <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/60 p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-dk-bg">
            <Share2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Social Media Profiles</h3>
            <p className="text-[10px] text-dk-muted">Add or edit profile links to display in headers, footers and contact pages.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="whatsappUrl">WhatsApp Chat Link</Label>
            <Input
              id="whatsappUrl"
              name="whatsappUrl"
              type="url"
              value={formData.whatsappUrl}
              onChange={handleChange}
              placeholder="e.g. https://wa.me/919972879256"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.instagram.com/dk.creativesolutions"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.linkedin.com/in/dk-creative-solutions"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="e.g. https://github.com/dk-creative-solutions"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="twitterUrl">Twitter / X URL</Label>
            <Input
              id="twitterUrl"
              name="twitterUrl"
              type="url"
              value={formData.twitterUrl}
              onChange={handleChange}
              placeholder="e.g. https://twitter.com/dkcreativesoln"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="youtubeUrl">YouTube Channel URL</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.youtube.com/@dkcreativesolutions"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="behanceUrl">Behance URL</Label>
            <Input
              id="behanceUrl"
              name="behanceUrl"
              type="url"
              value={formData.behanceUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.behance.net/dkcreativesolutions"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end pt-4 border-t border-white/5">
        <Button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-dk-bg shadow-glow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-dk-bg" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 text-dk-bg" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
