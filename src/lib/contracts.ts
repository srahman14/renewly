import {
  Clapperboard,
  AppWindow,
  Cloud,
  Zap,
  UtensilsCrossed,
  Dumbbell,
  Gamepad2,
  Newspaper,
  Plane,
  Landmark,
  GraduationCap,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export type Status = "active" | "flagged" | "cancelled";
export type Cycle = "Monthly" | "Quarterly" | "Annual";

export interface Contract {
  id: string;
  company: string;
  name: string;
  owner: string;
  team: string;
  monthlySpend: number;
  cycle: Cycle;
  renewsOn: string;
  noticeDays: number;
  deadline: string;
  daysLeft: number;
  status: Status;
  category: string;
  createdAt?: string; // ISO date string — set this when a contract is created, used for "Most recent" sort
}

export const STATUS_LABEL: Record<Status, string> = {
  active: "Tracked",
  flagged: "Flagged",
  cancelled: "Cancelled",
};

export const STORAGE_KEY = "renewal-contracts";

// Single source of truth for categories — used by ContractForm's Select
// and by the contracts page filter/badges. Each has an icon + a muted
// colour class for the badge (kept subtle: tinted bg, solid text, same
// /10-opacity treatment as DeadlinePill).
export const CATEGORIES: {
  value: string;
  label: string;
  icon: LucideIcon;
  badgeClass: string;
}[] = [
  { value: "Streaming & Entertainment", label: "Streaming & Entertainment", icon: Clapperboard, badgeClass: "bg-violet-500/10 text-violet-600" },
  { value: "Software & SaaS", label: "Software & SaaS", icon: AppWindow, badgeClass: "bg-blue-500/10 text-blue-600" },
  { value: "Cloud Storage", label: "Cloud Storage", icon: Cloud, badgeClass: "bg-sky-500/10 text-sky-600" },
  { value: "Utilities", label: "Utilities", icon: Zap, badgeClass: "bg-yellow-500/10 text-yellow-700" },
  { value: "Food & Delivery", label: "Food & Delivery", icon: UtensilsCrossed, badgeClass: "bg-orange-500/10 text-orange-600" },
  { value: "Fitness & Health", label: "Fitness & Health", icon: Dumbbell, badgeClass: "bg-rose-500/10 text-rose-600" },
  { value: "Gaming", label: "Gaming", icon: Gamepad2, badgeClass: "bg-indigo-500/10 text-indigo-600" },
  { value: "News & Publications", label: "News & Publications", icon: Newspaper, badgeClass: "bg-slate-500/10 text-slate-600" },
  { value: "Travel", label: "Travel", icon: Plane, badgeClass: "bg-cyan-500/10 text-cyan-600" },
  { value: "Finance & Insurance", label: "Finance & Insurance", icon: Landmark, badgeClass: "bg-emerald-500/10 text-emerald-600" },
  { value: "Education", label: "Education", icon: GraduationCap, badgeClass: "bg-purple-500/10 text-purple-600" },
  { value: "Other", label: "Other", icon: MoreHorizontal, badgeClass: "bg-ink/10 text-ink/60" },
];

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORIES.find((c) => c.value === category)?.icon ?? MoreHorizontal;
}

export function getCategoryBadgeClass(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.badgeClass ?? "bg-ink/10 text-ink/60";
}

export function urgency(daysLeft: number): "critical" | "soon" | "clear" {
  if (daysLeft <= 21) return "critical";
  if (daysLeft <= 60) return "soon";
  return "clear";
}

export function currency(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

export function calculateDaysLeft(date: string) {
  const today = new Date();
  const renewal = new Date(date);
  const difference = renewal.getTime() - today.getTime();
  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}