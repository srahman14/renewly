export type UserProfile = {
    id: string
    org_id: string
    full_name: string
    account_type: string   
}

// Contracts
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
  // Per-contract notification silencing — "I know, stop reminding me."
  // Independent of status: a muted contract is still active/flagged, it
  // just won't trigger alerts. Optional so existing stored contracts
  // (saved before this field existed) parse as unmuted rather than
  // undefined/broken — always read through isMuted() below, never this
  // field directly.
  muted?: boolean;

}