"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { MobileNav } from "@/components/shared/MobileNav";
import { Button } from "@/components/ui/button";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { NAV_LINKS } from "@/lib/constants";
import { useSiteConfig } from "@/components/shared/SiteConfigProvider";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const config = useSiteConfig();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const nameParts = config.name.split(" ");
  const firstPart = nameParts.slice(0, -1).join(" ");
  const lastPart = nameParts.slice(-1).join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gold-gradient"
        style={{ scaleX: scrollProgress }}
      />

      <div className="glass mx-auto mt-0 border-b border-white/10 px-0">
        <div className="container flex h-20 items-center justify-between">
          <a href="#home" className="flex items-center gap-3" aria-label={`${config.name} home`}>
            <Logo size={42} />
            <span className="hidden font-display text-lg font-semibold tracking-tight text-white sm:inline">
              {firstPart} <span className="text-gradient-gold">{lastPart}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/75 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild size="sm">
              <a href="#contact">Hire Me</a>
            </Button>
          </div>

          <button
            className="rounded-full border border-white/10 p-2.5 text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
