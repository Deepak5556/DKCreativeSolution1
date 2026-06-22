"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VideoCard } from "@/components/shared/VideoCard";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { ArtworkTile } from "@/components/shared/ArtworkTile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { videoItems as fallbackVideos, videoFilters } from "@/data/videos";
import type { VideoItem } from "@/types";

function renderVideoPlayer(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split(/[?#]/)[0] || "";
    }
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    );
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1]?.split(/[?#]/)[0] || "";
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
        title="Vimeo video player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    );
  }

  return (
    <video
      src={url}
      controls
      autoPlay
      className="h-full w-full object-contain"
    />
  );
}

export function VideoPortfolio() {
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<VideoItem | null>(null);
  const [videosList, setVideosList] = useState<VideoItem[]>(fallbackVideos);

  useEffect(() => {
    fetch("/api/content/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideosList(data);
      })
      .catch((err) => console.error("Error loading videos:", err));
  }, []);

  const beforeAfterItems = useMemo(
    () => videosList.filter((v) => v.type === "before-after"),
    [videosList]
  );

  const gridItems = useMemo(
    () =>
      videosList.filter((v) => {
        if (v.type === "before-after") return false;
        if (filter === "all") return true;
        return v.type === filter;
      }),
    [filter, videosList]
  );

  const showBeforeAfter = filter === "all" || filter === "before-after";

  return (
    <section id="video-editing" className="relative bg-dk-bg py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Video Editing"
          title="A portfolio built for"
          highlight="attention spans"
          description="Reels, shorts, and motion graphics edited for retention — plus a look at the grade and pacing work behind the scenes."
        />

        <div className="mt-10 flex justify-center">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              {videoFilters.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {showBeforeAfter && (
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {beforeAfterItems.map((video) => (
              <BeforeAfterSlider key={video.id} video={video} />
            ))}
          </div>
        )}

        {gridItems.length > 0 && (
          <motion.div
            layout
            className="mt-14 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          >
            {gridItems.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} onPlay={setActive} />
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className={`bg-black border-white/10 text-white transition-all duration-300 ${active?.type === "reel" || active?.type === "short" ? "max-w-[350px] sm:max-w-[380px]" : "max-w-2xl"}`}>
          {active && (
            <>
              <div className={`relative mb-4 overflow-hidden rounded-xl bg-black flex items-center justify-center w-full ${active.type === "reel" || active.type === "short" ? "aspect-[9/16]" : "aspect-video"}`}>
                {active.videoUrl ? (
                  renderVideoPlayer(active.videoUrl)
                ) : (
                  <>
                    {active.thumbnailUrl ? (
                      <img
                        src={active.thumbnailUrl}
                        alt={active.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ArtworkTile seed={active.id} icon={Sparkles} accent="gold" className="h-full w-full" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <Play className="h-6 w-6 fill-white text-white" />
                      </span>
                    </div>
                  </>
                )}
              </div>
              <DialogHeader>
                <DialogTitle className="text-white">{active.title}</DialogTitle>
                <DialogDescription className="text-dk-muted">
                  {active.category} · {active.duration}
                  {!active.videoUrl && (
                    <>
                      {" "}· full edit available on request. This preview uses placeholder artwork; drop your exported video file into /public and swap the player in VideoPortfolio.tsx to go live.
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
