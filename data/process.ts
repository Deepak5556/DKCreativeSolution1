import {
  MessageCircle,
  PencilRuler,
  Code2,
  TestTube2,
  PackageCheck,
} from "lucide-react";
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
