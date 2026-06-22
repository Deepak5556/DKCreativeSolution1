import {
  GraduationCap,
  Droplets,
  UserSquare2,
  CalendarRange,
  Sparkles,
  CloudSun,
  Hand,
} from "lucide-react";
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
