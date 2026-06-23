// ALL TEMPLATE DATA BACKUP

import {
  Zap,
  Gem,
  Headset,
  Cpu,
  Wallet,
  Brush,
  MessageCircle,
  PencilRuler,
  Code2,
  TestTube2,
  PackageCheck,
  GraduationCap,
  Droplets,
  UserSquare2,
  CalendarRange,
  Sparkles,
  CloudSun,
  Hand,
  Film,
  Image as ImageIcon,
  Palette,
  Rocket,
  LayoutTemplate,
} from "lucide-react";
import type { FeatureItem } from "@/types";

export const features: FeatureItem[] = [
  {
    id: "fast-delivery",
    icon: Zap,
    title: "Fast Delivery",
    description:
      "Clear timelines and milestone check-ins so your project ships on schedule, every time.",
  },
  {
    id: "premium-quality",
    icon: Gem,
    title: "Premium Quality",
    description:
      "Every pixel, transition, and line of code is reviewed against an enterprise-grade quality bar.",
  },
  {
    id: "responsive-support",
    icon: Headset,
    title: "Responsive Support",
    description:
      "Direct access during and after delivery — questions and revisions get same-day responses.",
  },
  {
    id: "modern-technologies",
    icon: Cpu,
    title: "Modern Technologies",
    description:
      "Built on Next.js, TypeScript, and current best practices — future-proof from day one.",
  },
  {
    id: "affordable-pricing",
    icon: Wallet,
    title: "Affordable Pricing",
    description:
      "Transparent, project-based quotes with no hidden costs — premium work without agency overhead.",
  },
  {
    id: "creative-designs",
    icon: Brush,
    title: "Creative Designs",
    description:
      "Distinctive visual direction tailored to your brand, never a recycled template.",
  },
];


import type { PosterItem } from "@/types";

export const posters: PosterItem[] = [
  { id: "ig-01", title: "Festive Sale Carousel", category: "Instagram Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-02", title: "Minimal Quote Post", category: "Instagram Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-03", title: "Product Drop Teaser", category: "Instagram Posters", aspect: "story", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-04", title: "Brand Anniversary Post", category: "Instagram Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop" },
  { id: "event-01", title: "Music Night Poster", category: "Event Posters", aspect: "portrait", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" },
  { id: "event-02", title: "Tech Meetup Poster", category: "Event Posters", aspect: "portrait", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop" },
  { id: "event-03", title: "Wedding Invite Poster", category: "Event Posters", aspect: "portrait", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-01", title: "Flash Sale Banner", category: "Promotional Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-02", title: "App Launch Promo", category: "Promotional Posters", aspect: "story", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-03", title: "Festival Offer Poster", category: "Promotional Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-01", title: "Corporate Profile Card", category: "Business Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-02", title: "Service Rate Card", category: "Business Posters", aspect: "portrait", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-03", title: "Hiring Announcement", category: "Business Posters", aspect: "square", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1521791136368-1a851900d141?q=80&w=600&auto=format&fit=crop" },
  { id: "event-04", title: "Workshop Poster", category: "Event Posters", aspect: "portrait", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-05", title: "Testimonial Highlight", category: "Instagram Posters", aspect: "square", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-04", title: "Black Friday Poster", category: "Promotional Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" },
];

export const posterCategories = [
  "All",
  "Instagram Posters",
  "Event Posters",
  "Promotional Posters",
  "Business Posters",
] as const;



import type { ProcessStepItem } from "@/types";

export const processSteps: ProcessStepItem[] = [
  {
    id: "step-1",
    step: "01",
    title: "Requirement Discussion",
    description:
      "We start with a focused call to understand your goals, audience, and the outcome you're hiring for.",
    icon: MessageCircle,
  },
  {
    id: "step-2",
    step: "02",
    title: "Planning & Design",
    description:
      "Wireframes, mood boards, and a clear scope are mapped out before a single line of code is written.",
    icon: PencilRuler,
  },
  {
    id: "step-3",
    step: "03",
    title: "Development & Editing",
    description:
      "Your site, video, or design is built in focused sprints, with progress shared at every milestone.",
    icon: Code2,
  },
  {
    id: "step-4",
    step: "04",
    title: "Testing & Revisions",
    description:
      "Cross-device QA, performance checks, and revision rounds make sure everything holds up in the real world.",
    icon: TestTube2,
  },
  {
    id: "step-5",
    step: "05",
    title: "Final Delivery",
    description:
      "You receive the finished, production-ready files along with deployment support and documentation.",
    icon: PackageCheck,
  },
];



import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    id: "cognito-learning-platform",
    category: "Web Development",
    title: "Cognito Learning Platform",
    description:
      "A full-stack e-learning platform with course tracking, quizzes, and a progress dashboard for students and instructors.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "gold",
    icon: GraduationCap,
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "bloodhub",
    category: "Web Development",
    title: "BloodHub",
    description:
      "A blood donation network connecting donors with nearby requests in real time, with location-based matching.",
    tech: ["React", "Node.js", "MongoDB", "Socket.io"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "silver",
    icon: Droplets,
    thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "portfolio-website",
    category: "Web Development",
    title: "Portfolio Website",
    description:
      "A motion-driven personal portfolio template with case-study pages, dark mode, and buttery-smooth scroll animation.",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "gold",
    icon: UserSquare2,
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "event-management-system",
    category: "Web Development",
    title: "Event Management System",
    description:
      "An end-to-end platform for creating events, selling tickets, and managing attendee check-in with QR codes.",
    tech: ["Next.js", "Prisma", "Stripe", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "silver",
    icon: CalendarRange,
    thumbnailUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "snaplearn",
    category: "Mobile Apps",
    title: "SnapLearn",
    description:
      "A flashcard-based micro-learning app that turns photos of notes into spaced-repetition study decks.",
    tech: ["React Native", "Expo", "Firebase"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "gold",
    icon: Sparkles,
    thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "weather-app",
    category: "Mobile Apps",
    title: "Weather App",
    description:
      "A minimal, animated weather app with hyper-local forecasts, severe-weather alerts, and home-screen widgets.",
    tech: ["React Native", "TypeScript", "OpenWeather API"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "silver",
    icon: CloudSun,
    thumbnailUrl: "https://images.unsplash.com/photo-1530908268418-e1d834b67885?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "sign-language-learning-app",
    category: "Mobile Apps",
    title: "Sign Language Learning App",
    description:
      "An accessibility-first app teaching sign language through interactive lessons, camera-based practice, and quizzes.",
    tech: ["React Native", "TensorFlow Lite", "Firebase"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "gold",
    icon: Hand,
    thumbnailUrl: "https://images.unsplash.com/photo-1516534775068-ba3e84589d90?q=80&w=600&auto=format&fit=crop"
  },
];

export const projectCategories = ["All", "Web Development", "Mobile Apps", "Both"] as const;



import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    id: "web-development",
    icon: Code2,
    title: "Web Development",
    description:
      "Fast, scalable websites built on modern frameworks — engineered for performance, accessibility, and growth.",
    features: ["Next.js & React", "API integrations", "CMS-driven content"],
    actionType: "popup"
  },
  {
    id: "video-editing",
    icon: Film,
    title: "Video Editing",
    description:
      "Cinematic edits, motion graphics, and short-form content that hold attention and drive engagement.",
    features: ["Reels & Shorts", "Color grading", "Motion graphics"],
    actionType: "popup"
  },
  {
    id: "poster-design",
    icon: ImageIcon,
    title: "Poster Design",
    description:
      "Bold visual identity pieces for campaigns, events, and promotions — designed to stop the scroll.",
    features: ["Social campaigns", "Print-ready files", "Brand-consistent"],
    actionType: "popup"
  },
  {
    id: "ui-ux-design",
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Interfaces that feel effortless. Research-backed design systems built for clarity and conversion.",
    features: ["Wireframes & prototypes", "Design systems", "Usability testing"],
    actionType: "popup"
  },
  {
    id: "seo-optimization",
    icon: Rocket,
    title: "SEO Optimization",
    description:
      "Technical SEO, structured data, and performance tuning that get your site found and keep it fast.",
    features: ["Core Web Vitals", "Schema markup", "On-page SEO"],
    actionType: "popup"
  },
  {
    id: "portfolio-websites",
    icon: LayoutTemplate,
    title: "Portfolio Websites",
    description:
      "Personal and studio portfolios that present your best work with the polish of a flagship product.",
    features: ["Case-study layouts", "Custom animation", "One-page or multi-page"],
    actionType: "popup"
  },
];


import type { StatItem } from "@/types";

export const stats: StatItem[] = [
  { id: "projects", value: 50, suffix: "+", label: "Projects Delivered" },
  { id: "clients", value: 20, suffix: "+", label: "Happy Clients" },
  { id: "services", value: 3, suffix: "+", label: "Core Services" },
  { id: "satisfaction", value: 100, suffix: "%", label: "Client Satisfaction" },
];


import type { TestimonialItem } from "@/types";

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    name: "Ananya Rao",
    role: "Founder",
    company: "Lumen Studio",
    quote:
      "DK rebuilt our website from the ground up and the difference was night and day. The animations feel expensive without ever feeling slow.",
    rating: 5,
    initials: "AR",
  },
  {
    id: "t2",
    name: "Karthik Subramaniam",
    role: "Marketing Lead",
    company: "Northfield Foods",
    quote:
      "Our Instagram posters finally look like they belong to a brand twice our size. Turnaround was fast and revisions were painless.",
    rating: 5,
    initials: "KS",
  },
  {
    id: "t3",
    name: "Priya Menon",
    role: "Co-founder",
    company: "Cognito Labs",
    quote:
      "The learning platform DK built handles thousands of students without breaking a sweat. Communication throughout was excellent.",
    rating: 5,
    initials: "PM",
  },
  {
    id: "t4",
    name: "Rohan Das",
    role: "Event Director",
    company: "Eventura",
    quote:
      "From concept to final cut, the video edits captured exactly the energy we wanted. Our shorts now consistently outperform past content.",
    rating: 5,
    initials: "RD",
  },
  {
    id: "t5",
    name: "Sneha Iyer",
    role: "Product Manager",
    company: "Sparkline App",
    quote:
      "Clean UI, thoughtful UX, and genuinely fast delivery. DK asked the right questions before writing a single line of code.",
    rating: 5,
    initials: "SI",
  },
];


import type { VideoItem } from "@/types";

export const videoItems: VideoItem[] = [
  {
    id: "brand-reel-01",
    title: "Brand Launch Reel",
    category: "Reel Preview",
    duration: "0:32",
    type: "reel",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-3831-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "product-reel-02",
    title: "Product Showcase Reel",
    category: "Reel Preview",
    duration: "0:28",
    type: "reel",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-keyboard-4054-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "color-grade-before-after",
    title: "Cinematic Color Grade",
    category: "Before / After",
    duration: "0:15",
    type: "before-after",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-woman-walking-slowly-in-a-forest-41913-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "audio-cleanup-before-after",
    title: "Audio & Pacing Cleanup",
    category: "Before / After",
    duration: "0:20",
    type: "before-after",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dj-adjusting-sound-on-audio-mixer-41611-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "short-01",
    title: "Tech Tips Short",
    category: "YouTube Shorts",
    duration: "0:45",
    type: "short",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-41712-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "short-02",
    title: "Behind the Scenes Short",
    category: "YouTube Shorts",
    duration: "0:38",
    type: "short",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-at-a-studio-41604-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "motion-01",
    title: "Logo Reveal Animation",
    category: "Motion Graphics",
    duration: "0:10",
    type: "motion-graphics",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-glowing-neon-tunnel-41703-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "motion-02",
    title: "Kinetic Typography Promo",
    category: "Motion Graphics",
    duration: "0:18",
    type: "motion-graphics",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-typing-text-on-a-computer-screen-41709-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
  }
];

export const videoFilters = [
  { id: "all", label: "All" },
  { id: "reel", label: "Reel Previews" },
  { id: "before-after", label: "Before / After" },
  { id: "short", label: "YouTube Shorts" },
  { id: "motion-graphics", label: "Motion Graphics" },
] as const;


