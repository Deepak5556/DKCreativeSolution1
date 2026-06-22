"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#111111] border border-white/10 text-white rounded-xl shadow-glow-sm font-body",
          description: "text-dk-muted",
          actionButton: "bg-gold-gradient text-dk-bg",
          cancelButton: "bg-white/10 text-white",
          success: "border-primary/30",
          error: "border-destructive/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
