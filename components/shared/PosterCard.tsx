"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Image as ImageIcon, Maximize2 } from "lucide-react";
import { ArtworkTile } from "@/components/shared/ArtworkTile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PosterItem } from "@/types";

const aspectClass: Record<PosterItem["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  story: "aspect-[9/16]",
};

interface PosterCardProps {
  poster: PosterItem;
  index: number;
}

export function PosterCard({ poster, index }: PosterCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          layout
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
          whileHover={{ y: -4 }}
          className={`group relative mb-4 block w-full overflow-hidden rounded-2xl border border-white/10 border-glow-hover ${aspectClass[poster.aspect]}`}
        >
          {poster.imageUrl ? (
            <Image
              src={poster.imageUrl}
              alt={poster.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <ArtworkTile
              seed={poster.id}
              icon={ImageIcon}
              accent={poster.palette === "mixed" ? "mixed" : poster.palette}
              className="h-full w-full"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
            <Maximize2 className="h-5 w-5 text-white" />
            <span className="px-4 text-center text-sm font-semibold text-white">
              {poster.title}
            </span>
          </div>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-black border-white/10 text-white">
        <div className={`relative mb-4 w-full overflow-hidden rounded-xl bg-neutral-900 ${aspectClass[poster.aspect]}`}>
          {poster.imageUrl ? (
            <Image
              src={poster.imageUrl}
              alt={poster.title}
              fill
              className="object-cover"
            />
          ) : (
            <ArtworkTile
              seed={poster.id}
              icon={ImageIcon}
              accent={poster.palette === "mixed" ? "mixed" : poster.palette}
              className="h-full w-full"
            />
          )}
        </div>
        <DialogHeader>
          <Badge className="mb-2 w-fit">{poster.category}</Badge>
          <DialogTitle className="text-white">{poster.title}</DialogTitle>
          <DialogDescription className="text-dk-muted">
            Designed for brand-consistent visual storytelling — final files delivered
            print-ready and optimised for social.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
