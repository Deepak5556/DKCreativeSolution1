export const siteConfig = {
  name: "DK Creative Solutions",
  shortName: "DK Creative",
  tagline: "Transforming Ideas Into Digital Experiences",
  description:
    "DK Creative Solutions is a freelance creative technology studio specializing in website development, UI/UX design, video editing, and poster design. We build premium digital experiences for ambitious brands.",
  url: "https://www.dkcreativesolutions.com",
  ogImage: "/og-image.png",
  email: "hello@dkcreativesolutions.com",
  phone: "+91 9972879256",
  phoneRaw: "+919972879256",
  location: "India (Remote / Worldwide)",
  founder: "DK",
  keywords: [
    "DK Creative Solutions",
    "freelance web developer",
    "Next.js developer India",
    "UI UX designer",
    "video editor freelancer",
    "poster designer",
    "landing page development",
    "portfolio website development",
    "freelance creative agency",
  ],
  links: {
    github: "https://github.com/dk-creative-solutions",
    linkedin: "https://www.linkedin.com/in/dk-creative-solutions",
    instagram: "https://www.instagram.com/dk.creativesolutions",
    twitter: "https://twitter.com/dkcreativesoln",
    youtube: "https://www.youtube.com/@dkcreativesolutions",
    behance: "https://www.behance.net/dkcreativesolutions",
    whatsapp: "https://wa.me/919972879256",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Video Editing", href: "#video-editing" },
  { label: "Posters", href: "#posters" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICE_OPTIONS = [
  "Website Development",
  "Video Editing",
  "Poster Design",
  "UI/UX Design",
  "Landing Page Development",
  "Portfolio Website Development",
  "Other",
] as const;
