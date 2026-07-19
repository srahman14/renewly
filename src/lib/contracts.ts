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
  // Optional management/cancellation link — where the person can actually
  // go to action a renewal (provider account page, cancellation form,
  // etc). Set by ContractForm; read by ContractDetailsDialog and the
  // Renewals page's fast-track action. Not every provider has a self-serve
  // link, so this stays optional rather than required.
  url?: string;
  // Legacy fields — no longer read anywhere in this file or the pages
  // built on top of it. Kept here only so nothing already writing them
  // (e.g. ContractForm) breaks a type check. Real values are always
  // computed live from renewsOn/noticeDays/cycle — see the date-math
  // section below. Safe to remove once ContractForm stops setting them.
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
  dotClass: string;
}[] = [
  { value: "Streaming & Entertainment", label: "Streaming & Entertainment", icon: Clapperboard, badgeClass: "bg-violet-500/10 text-violet-600", dotClass: "bg-violet-500" },
  { value: "Software & SaaS", label: "Software & SaaS", icon: AppWindow, badgeClass: "bg-blue-500/10 text-blue-600", dotClass: "bg-blue-500" },
  { value: "Cloud Storage", label: "Cloud Storage", icon: Cloud, badgeClass: "bg-sky-500/10 text-sky-600", dotClass: "bg-sky-500" },
  { value: "Utilities", label: "Utilities", icon: Zap, badgeClass: "bg-yellow-500/10 text-yellow-700", dotClass: "bg-yellow-500" },
  { value: "Food & Delivery", label: "Food & Delivery", icon: UtensilsCrossed, badgeClass: "bg-orange-500/10 text-orange-600", dotClass: "bg-orange-500" },
  { value: "Fitness & Health", label: "Fitness & Health", icon: Dumbbell, badgeClass: "bg-rose-500/10 text-rose-600", dotClass: "bg-rose-500" },
  { value: "Gaming", label: "Gaming", icon: Gamepad2, badgeClass: "bg-indigo-500/10 text-indigo-600", dotClass: "bg-indigo-500" },
  { value: "News & Publications", label: "News & Publications", icon: Newspaper, badgeClass: "bg-slate-500/10 text-slate-600", dotClass: "bg-slate-500" },
  { value: "Travel", label: "Travel", icon: Plane, badgeClass: "bg-cyan-500/10 text-cyan-600", dotClass: "bg-cyan-500" },
  { value: "Finance & Insurance", label: "Finance & Insurance", icon: Landmark, badgeClass: "bg-emerald-500/10 text-emerald-600", dotClass: "bg-emerald-500" },
  { value: "Education", label: "Education", icon: GraduationCap, badgeClass: "bg-purple-500/10 text-purple-600", dotClass: "bg-purple-500" },
  { value: "Other", label: "Other", icon: MoreHorizontal, badgeClass: "bg-ink/10 text-ink/60", dotClass: "bg-ink/40" },
];

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORIES.find((c) => c.value === category)?.icon ?? MoreHorizontal;
}

export function getCategoryBadgeClass(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.badgeClass ?? "bg-ink/10 text-ink/60";
}

export function getCategoryDotClass(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.dotClass ?? "bg-ink/40";
}

export function currency(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

/* ------------------------------------------------------------------ */
/* Notice-period validation                                            */
/*                                                                     */
/* A notice period longer than the billing cycle itself is impossible  */
/* to satisfy — there's no point in the cycle where enough runway is   */
/* left to give that much notice, so the deadline for every cycle ends */
/* up in the past relative to that cycle's renewal, permanently. This  */
/* isn't a display bug to patch around; it's invalid input. Caps below */
/* leave some headroom under each cycle's actual day count, since real */
/* contracts always require notice to be given comfortably before the  */
/* renewal, never right up against it.                                */
/* ------------------------------------------------------------------ */

export const MAX_NOTICE_DAYS: Record<Cycle, number> = {
  Monthly: 27,
  Quarterly: 80,
  Annual: 330,
};

export function isNoticeDaysReasonable(noticeDays: number, cycle: Cycle): boolean {
  return noticeDays >= 0 && noticeDays <= MAX_NOTICE_DAYS[cycle];
}

/* ------------------------------------------------------------------ */
/* Date math — the single source of truth for "renews on" vs           */
/* "cancel by." Every page should read dates through these functions,  */
/* never by reading contract.renewsOn/deadline/daysLeft directly.      */
/*                                                                     */
/* Two concepts, kept deliberately separate:                           */
/*   - Renewal date  = the day the next charge actually lands.         */
/*   - Deadline      = renewal date minus noticeDays — the last day    */
/*                     you can still cancel before that charge fires.  */
/*                                                                     */
/* "Flagged" means you're now inside the notice window and haven't     */
/* cancelled — i.e. today is on/after the deadline. "Soon" is an        */
/* advance-warning tier before that, so you get a heads-up rather than */
/* only finding out once it's already too late.                       */
/* ------------------------------------------------------------------ */

// Parses a "YYYY-MM-DD" string as a *local* calendar date. `new
// Date("2026-09-04")` parses that same string as UTC midnight instead —
// harmless on its own, but the moment it's re-serialised with
// toISOString() (which converts through UTC) or read back with local
// getters after a timezone offset, it can silently land on the wrong
// day. Every date-only string in this file should be parsed through
// here, never through the bare `new Date(string)` constructor.
export function parseDateOnly(value: string): Date {
  // Accepts a plain "YYYY-MM-DD" string, but also tolerates a full ISO
  // timestamp ("YYYY-MM-DDTHH:mm:ss.sssZ") by taking just the date part —
  // splitting the whole timestamp on "-" would otherwise pull the time
  // portion into the day segment (e.g. "04T23:00:00.000Z"), which parses
  // to NaN and silently turns every date downstream into an Invalid Date.
  const datePart = value.split("T")[0];
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d || Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
    // Last resort — better to get a real (if UTC-shifted) date than NaN.
    return new Date(value);
  }
  return new Date(y, m - 1, d);
}

// The inverse of parseDateOnly. Always reads local calendar components —
// never use `date.toISOString().split("T")[0]` for this. toISOString()
// converts through UTC, so a local midnight in any positive-offset
// timezone (British Summer Time, right now, is UTC+1) gets shifted back
// to the previous day the moment it's serialised. That round-trip is
// the actual cause of both "the calendar always picks a day behind" and
// dates quietly creeping backward every time a contract is re-saved.
export function toDateOnlyString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addCycle(date: Date, cycle: Cycle): Date {
  const next = new Date(date);
  if (cycle === "Monthly") next.setMonth(next.getMonth() + 1);
  else if (cycle === "Quarterly") next.setMonth(next.getMonth() + 3);
  else next.setFullYear(next.getFullYear() + 1);
  return next;
}

// The next upcoming charge date — the literal, true date the next
// payment fires, never skipped ahead early. Rolls the stored anchor
// date (renewsOn) forward one cycle at a time once that date itself has
// passed, so a monthly contract from three months ago still shows next
// month's actual charge date without anyone having to bump it manually.
//
// Deliberately does NOT roll forward just because the notice deadline
// for this cycle has already passed — a contract can sit "past cutoff"
// for as long as that's genuinely true, right up until the renewal
// itself fires. That's real, useful information (this charge is now
// locked in, here's exactly when it lands), not noise to hide. Once the
// renewal date passes, this rolls to the next cycle automatically and
// the deadline resets with it — no manual reset needed anywhere.
export function getNextRenewalDate(contract: Contract): Date {
  const today = startOfDay(new Date());
  let renewal = startOfDay(parseDateOnly(contract.renewsOn));

  let guard = 0;
  while (renewal.getTime() < today.getTime() && guard < 1000) {
    renewal = addCycle(renewal, contract.cycle);
    guard += 1;
  }
  return renewal;
}

// The last day you can still cancel before the next renewal charge fires.
export function getDeadlineDate(contract: Contract): Date {
  const renewal = getNextRenewalDate(contract);
  const deadline = new Date(renewal);
  deadline.setDate(deadline.getDate() - contract.noticeDays);
  return deadline;
}

export function daysUntilRenewal(contract: Contract): number {
  const today = startOfDay(new Date());
  const renewal = getNextRenewalDate(contract);
  return Math.round((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Negative once you're past the point where you could still give notice
// for this cycle.
export function daysUntilDeadline(contract: Contract): number {
  const today = startOfDay(new Date());
  const deadline = getDeadlineDate(contract);
  return Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Single source of truth for the deadline-pill label, used by
// DeadlinePill, the dashboard's DeadlineCard, and ContractDetailsDialog.
// Previously this exact ternary was copy-pasted in all three places —
// any future wording change (like this one) meant hunting down three
// call sites instead of editing one function.
//
// "past notice date" (not "overdue" or "past cutoff") deliberately
// avoids implying either that a payment is late (nothing's overdue) or
// that cancellation is now impossible (some providers still allow it on
// request past this point — see isFlagged's doc comment). It just states
// that the self-service notice window has closed.
export function deadlineLabel(contract: Contract): string {
  const days = daysUntilDeadline(contract);
  return days < 0 ? `${Math.abs(days)}d past notice date` : `${days}d left`;
}

// A second, separate label — plain-text countdown to the actual renewal
// charge itself, independent of the notice/deadline countdown above. Not
// styled as an urgent pill anywhere it's used; it's context (how far away
// is the actual charge) that sits quietly next to DeadlinePill, so a
// contract that's "5d past notice date" doesn't leave someone guessing
// whether the real charge is tomorrow or five weeks out.
export function daysUntilRenewalLabel(contract: Contract): string {
  const days = daysUntilRenewal(contract);
  if (days === 0) return "renews today";
  if (days === 1) return "renews tomorrow";
  return `renews in ${days}d`;
}

// How many days of advance warning before the hard deadline counts as
// "soon." One place to tune this, rather than a magic number copy-pasted
// around the app.
export const SOON_BUFFER_DAYS = 14;

// The hard "act now" state — inside the notice window, not yet cancelled.
export function isFlagged(contract: Contract): boolean {
  if (contract.status === "cancelled") return false;
  return daysUntilDeadline(contract) <= 0;
}

// The advance-warning state — approaching the window, not there yet.
export function isSoon(contract: Contract): boolean {
  if (contract.status === "cancelled") return false;
  const d = daysUntilDeadline(contract);
  return d > 0 && d <= SOON_BUFFER_DAYS;
}

export function urgencyFromContract(contract: Contract): "critical" | "soon" | "clear" {
  if (isFlagged(contract)) return "critical";
  if (isSoon(contract)) return "soon";
  return "clear";
}

// --- Legacy — superseded by the functions above, kept only in case
// ContractForm.tsx still imports these. Nothing in this codebase's pages
// calls them anymore; don't build new logic on top of these two.
export function urgency(daysLeft: number): "critical" | "soon" | "clear" {
  if (daysLeft <= 21) return "critical";
  if (daysLeft <= 60) return "soon";
  return "clear";
}

export function calculateDaysLeft(date: string) {
  const today = new Date();
  const renewal = new Date(date);
  const difference = renewal.getTime() - today.getTime();
  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}