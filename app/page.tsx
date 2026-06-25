import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { Hero } from "@/sections/Hero";
import { Stats } from "@/sections/Stats";
import { Services } from "@/sections/Services";

const SectionFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
  </div>
);

const Projects = dynamic(() => import("@/sections/Projects").then((m) => m.Projects), {
  loading: SectionFallback,
});
const VideoPortfolio = dynamic(
  () => import("@/sections/VideoPortfolio").then((m) => m.VideoPortfolio),
  { loading: SectionFallback }
);
const PosterGallery = dynamic(
  () => import("@/sections/PosterGallery").then((m) => m.PosterGallery),
  { loading: SectionFallback }
);
const WhyChooseUs = dynamic(
  () => import("@/sections/WhyChooseUs").then((m) => m.WhyChooseUs),
  { loading: SectionFallback }
);
const Process = dynamic(() => import("@/sections/Process").then((m) => m.Process), {
  loading: SectionFallback,
});
const Testimonials = dynamic(
  () => import("@/sections/Testimonials").then((m) => m.Testimonials),
  { loading: SectionFallback }
);
const Contact = dynamic(() => import("@/sections/Contact").then((m) => m.Contact), {
  loading: SectionFallback,
});

export const metadata: Metadata = {
  title: {
    absolute: "DK Creative Solutions | Web Development | Digital Marketing | SEO | Video Editing | UI/UX Design",
  },
  description:
    "DK Creative Solutions offers professional web development, UI/UX design, SEO, digital marketing, video editing, graphic design, poster design, landing pages, portfolio websites, business websites, React development, Flutter development, and complete digital solutions for businesses and creators.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Projects />
      <VideoPortfolio />
      <PosterGallery />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <Contact />
    </>
  );
}
