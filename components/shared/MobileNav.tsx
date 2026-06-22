"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, siteConfig } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-y-0 right-0 z-[70] flex h-full w-[82%] max-w-sm flex-col border-l border-white/10 bg-[#0b0b0b] p-6"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <div className="flex items-center justify-between">
                  <DialogPrimitive.Title asChild>
                    <span className="flex items-center gap-2.5">
                      <Logo size={34} />
                      <span className="font-display text-sm font-semibold text-white">
                        DK Creative
                      </span>
                    </span>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close asChild>
                    <button
                      className="rounded-full p-2 text-dk-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>

                <nav className="mt-10 flex flex-1 flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i + 0.1 }}
                      className="rounded-lg px-3 py-3 font-display text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-primary"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                  <Button asChild size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                    <a href="#contact">Hire Me</a>
                  </Button>
                  <a
                    href={`tel:${siteConfig.phoneRaw}`}
                    className="text-center text-sm text-dk-muted hover:text-white"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
