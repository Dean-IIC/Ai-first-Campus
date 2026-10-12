import {
  Atom,
  BookOpen,
  BrainCircuit,
  Briefcase,
  CircuitBoard,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  MapPin,
  Microscope,
  Newspaper,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "./ui";

export type Area = {
  key: string;
  href: string;
  title: string;
  short: string;
  text: string;
  tone: Tone;
  icon: LucideIcon;
  links?: { label: string; href: string }[];
};

export const AREAS: Record<string, Area> = {
  departments: {
    key: "departments",
    href: "/academics",
    title: "Departments",
    short: "Departments",
    text: "Five engineering departments, basic sciences, humanities, and physical education and sports.",
    tone: "green",
    icon: BookOpen,
  },
  programmes: {
    key: "programmes",
    href: "/programmes",
    title: "Programmes",
    short: "Programmes",
    text: "Bachelor of Engineering in five branches, under the VTU curriculum.",
    tone: "green",
    icon: GraduationCap,
  },
  uhv: {
    key: "uhv",
    href: "/uhv",
    title: "Universal Human Values",
    short: "UHV",
    text: "Induction, coursework and mentoring that build character alongside technical skill.",
    tone: "green",
    icon: HeartHandshake,
    links: [
      { label: "About UHV", href: "/uhv" },
      { label: "UHV activities", href: "/uhv#activities" },
    ],
  },
  research: {
    key: "research",
    href: "/research",
    title: "Research and development",
    short: "R&D",
    text: "Doctoral research, funded projects and focus areas from AI and quantum to core engineering.",
    tone: "amber",
    icon: FlaskConical,
    links: [
      { label: "Research focus", href: "/research" },
      { label: "Research projects", href: "/research#projects" },
    ],
  },
  researchCentres: {
    key: "researchCentres",
    href: "/research/centres",
    title: "Research centres",
    short: "Research centres",
    text: "Six research centres: CSE, ECE, ME, Chemistry, Physics and Mathematics.",
    tone: "amber",
    icon: Microscope,
    links: [{ label: "See all research centres", href: "/research/centres" }],
  },
  consultancy: {
    key: "consultancy",
    href: "/consultancy",
    title: "Consultancy projects",
    short: "Consultancy",
    text: "Faculty-led teams that take on engineering, software and AI problems for industry.",
    tone: "amber",
    icon: Briefcase,
    links: [
      { label: "Recent projects", href: "/consultancy#projects" },
      { label: "Request consultancy", href: "/consultancy#enquire" },
    ],
  },
  training: {
    key: "training",
    href: "/corporate-training",
    title: "Corporate training",
    short: "Corporate training",
    text: "Short programmes in AI, quantum computing, software and core engineering for working teams.",
    tone: "amber",
    icon: Presentation,
    links: [
      { label: "Programmes", href: "/corporate-training#programmes" },
      { label: "Plan a programme", href: "/corporate-training#enquire" },
    ],
  },
  ieee: {
    key: "ieee",
    href: "/ieee",
    title: "IEEE Student Branch",
    short: "IEEE",
    text: "Technical talks, workshops, competitions and IEEE membership for students.",
    tone: "rose",
    icon: CircuitBoard,
    links: [{ label: "About the branch", href: "/ieee" }],
  },
  dashboards: {
    key: "dashboards",
    href: "/ai-quantum/dashboards",
    title: "AI and quantum dashboards",
    short: "Dashboards",
    text: "Live views of how AI and quantum computing are used across the campus.",
    tone: "teal",
    icon: LayoutDashboard,
  },
  aiFirst: {
    key: "aiFirst",
    href: "/ai-quantum/ai-first",
    title: "AI First campus",
    short: "AI First",
    text: "AI Faculty Champions, AI Student Ambassadors, AI in every programme, and clear rules for safe and fair AI.",
    tone: "teal",
    icon: BrainCircuit,
  },
  aiChampions: {
    key: "aiChampions",
    href: "/ai-quantum/champions",
    title: "AI Champions and Ambassadors",
    short: "AI Champions",
    text: "Fifteen AI Faculty Champions and fifty AI Student Ambassadors.",
    tone: "teal",
    icon: Users,
  },
  quantumLab: {
    key: "quantumLab",
    href: "/ai-quantum/quantum-lab",
    title: "Quantum Lab",
    short: "Quantum Lab",
    text: "Learning tracks, circuit simulators, real quantum hardware and quantum-safe security.",
    tone: "teal",
    icon: Atom,
  },
  news: {
    key: "news",
    href: "/news",
    title: "News and events",
    short: "News",
    text: "Campus news, events and announcements.",
    tone: "rose",
    icon: Newspaper,
  },
  contact: {
    key: "contact",
    href: "/contact",
    title: "Contact",
    short: "Contact",
    text: "Address, directions and a contact form.",
    tone: "blue",
    icon: MapPin,
  },
};
