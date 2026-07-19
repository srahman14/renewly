"use client";

import { useEffect } from "react";
import {
  Contract,
  currency,
  formatDate,
  getNextRenewalDate,
  getDeadlineDate,
  deadlineLabel,
} from "@/lib/contracts";
import { CategoryBadge, DeadlinePill, RenewalWarningBadge } from "@/components/ContractUI";

// Self-contained overlay (no shadcn Dialog dependency assumed) — same
// fixed-inset + backdrop pattern used elsewhere in the app. Reuses the
// "Last safe cancel date" navy panel from the dashboard's DeadlineCard so
// the same visual instrument shows up here too, just with the full set of
// fields underneath instead of the trimmed preview version.
export default function ContractDetailsDialog({
  contract,
  onClose,
  onEdit,
}: {
  contract: Contract;
  onClose: () => void;
  onEdit: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const cancelled = contract.status === "cancelled";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${contract.company} details`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md border border-ink/10 bg-white shadow-[0_30px_60px_-25px_rgba(18,20,28,0.55)]">
        <div className="flex items-center justify-end px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-ink/50 transition-colors hover:bg-paper-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-4 pt-2">
          <p className={`font-display text-xl font-medium text-ink ${cancelled ? "line-through opacity-60" : ""}`}>
            {contract.company}
          </p>
          <p className="mt-1 font-body text-sm text-ink/50">{contract.name}</p>
          <p className="mt-1 font-body text-sm text-ink/50">
            Owner: {contract.owner}
            {contract.team && <> · Team: {contract.team}</>}
          </p>
        </div>

        <div className="perforated-edge" />

        <div className="mx-4 my-4 rounded-[4px] bg-navy px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80">
            Last safe cancel date
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="font-mono text-base text-paper">{formatDate(getDeadlineDate(contract))}</p>
            <p className="font-mono text-[11px] text-amber-light">{deadlineLabel(contract)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-5">
          <CategoryBadge category={contract.category} />
          <DeadlinePill contract={contract} />
          <RenewalWarningBadge contract={contract} />
        </div>

        <dl className="mt-4 divide-y divide-line border-t border-line px-5">
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">Cost</dt>
            <dd className="font-mono text-[13px] text-ink">{currency(contract.monthlySpend)}/mo</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">Billing cycle</dt>
            <dd className="font-mono text-[13px] text-ink">{contract.cycle}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">Next renewal</dt>
            <dd className="font-mono text-[13px] text-ink">{formatDate(getNextRenewalDate(contract))}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">Notice period</dt>
            <dd className="font-mono text-[13px] text-ink">{contract.noticeDays} days</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">Status</dt>
            <dd className="font-mono text-[13px] text-ink">{cancelled ? "Cancelled" : "Active"}</dd>
          </div>
        </dl>

        <div className="flex justify-end gap-3 border-t border-line px-5 py-4">
          {contract.url && (
            <a
              href={contract.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-auto rounded-[4px] border border-line px-4 py-2 font-body text-[14px] text-ink transition-colors hover:border-ink"
            >
              Manage ↗
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-[4px] border border-line px-4 py-2 font-body text-[14px] text-ink transition-colors hover:border-ink"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-[4px] bg-ink px-4 py-2 font-body text-[14px] font-medium text-paper transition-colors hover:bg-navy"
          >
            Edit contract
          </button>
        </div>
      </div>
    </div>
  );
}