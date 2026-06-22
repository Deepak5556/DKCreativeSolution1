"use client";

import { usePathname } from "next/navigation";
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, siteConfig } from "@/lib/constants";
import { services } from "@/data/services";

const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { label: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
  { label: "Twitter", href: siteConfig.links.twitter, icon: Twitter },
  { label: "YouTube", href: siteConfig.links.youtube, icon: Youtube },
];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070707]">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />

      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <a href="#home" className="flex items-center gap-3">
              <Logo size={44} />
              <span className="font-display text-lg font-semibold text-white">
                DK Creative <span className="text-gradient-gold">Solutions</span>
              </span>
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-dk-muted">
              A freelance creative-technology studio building premium websites,
              interfaces, video edits, and visual design for ambitious brands.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-glow-sm"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Quick Links
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-dk-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Services
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-dk-muted transition-colors hover:text-primary"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Contact
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="flex items-start gap-3 text-sm text-dk-muted transition-colors hover:text-primary"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-3 text-sm text-dk-muted transition-colors hover:text-primary"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-dk-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {siteConfig.location}
              </li>
              <li>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-primary/40 hover:text-primary"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-dk-muted sm:flex-row">
          <p>
            © {year} DK Creative Solutions. All rights reserved.
          </p>
          <p>
            Designed &amp; built with <span className="text-primary">Next.js</span> by DK Creative
            Solutions.
          </p>
        </div>
      </div>
    </footer>
  );
}
