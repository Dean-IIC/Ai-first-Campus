import {
  CircuitBoard,
  FlaskConical,
  HeartHandshake,
  Lightbulb,
  Link2,
  Scale,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Portal } from "./types";
import type { Tone } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  uhv: HeartHandshake,
  research: FlaskConical,
  "idea-lab": Lightbulb,
  skills: Wrench,
  alumni: Users,
  "equal-opportunity": Scale,
  ieee: CircuitBoard,
};

const CATEGORY_TONE: Record<string, Tone> = {
  "Academics and values": "green",
  "Research and innovation": "amber",
  "Students and alumni": "rose",
};

export const portalIcon = (p: Pick<Portal, "icon">): LucideIcon => ICONS[p.icon] ?? Link2;
export const portalTone = (p: Pick<Portal, "category">): Tone => CATEGORY_TONE[p.category] ?? "blue";
/** A portal is clickable once it has an address and is marked Live. */
export const portalLive = (p: Pick<Portal, "url" | "status">) => Boolean(p.url) && p.status === "Live";

export const PORTAL_CATEGORIES = ["Academics and values", "Research and innovation", "Students and alumni"];

/** Icon by key, for menu items that carry an initiative icon. */
export const iconByKey = (key?: string): LucideIcon => (key && ICONS[key]) || Link2;
/** Tone for a category name. */
export const toneForCategory = (category: string): Tone => CATEGORY_TONE[category] ?? "blue";
