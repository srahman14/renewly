"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CircleCheck } from "lucide-react";
import ContractForm from "@/components/ContractForm";
import ContractDetailsDialog from "@/components/ContractDetailsDialog";
import {
  Contract,
  STORAGE_KEY,
  currency,
  formatDate,
  getNextRenewalDate,
  getDeadlineDate,
  daysUntilDeadline,
  deadlineLabel,
  daysUntilRenewalLabel,
  isFlagged,
  isSoon,
  SOON_BUFFER_DAYS,
} from "@/lib/contracts";
import { CategoryBadge, RenewalWarningBadge } from "@/components/ContractUI";

// This page is deliberately narrower in scope than /dashboard/contracts —
// it's not a full list view, it's an action queue. Only two states show
// up here: contracts already inside their notice window (Act now) and
// contracts approaching it (Coming up, within SOON_BUFFER_DAYS). Anything
// fully "clear" belongs on the contracts page, not here — mixing it in
// would bury the things that actually need a decision today.
export default function RenewalsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContracts(JSON.parse(saved));
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }, [contracts, hasHydrated]);

  function saveContract(contract: Contract) {
    setContracts((previous) => {
      const exists = previous.some((item) => item.id === contract.id);
      if (exists) {
        return previous.map((item) => (item.id === contract.id ? contract : item));
      }
      return [...previous, contract];
    });
    setShowForm(false);
    setEditingContract(null);
  }

  const activeContracts = useMemo(
    () => contracts.filter((c) => c.status !== "cancelled"),
    [contracts]
  );

  const actNow = useMemo(
    () =>
      activeContracts
        .filter((c) => isFlagged(c))
        .sort((a, b) => daysUntilDeadline(a) - daysUntilDeadline(b)),
    [activeContracts]
  );

  const comingUp = useMemo(
    () =>
      activeContracts
        .filter((c) => isSoon(c))
        .sort((a, b) => daysUntilDeadline(a) - daysUntilDeadline(b)),
    [activeContracts]
  );

  const totalQueued = actNow.length + comingUp.length;

  const queuedContracts = useMemo(() => [...actNow, ...comingUp], [actNow, comingUp]);

  const spendAtRisk = useMemo(
    () => queuedContracts.reduce((sum, c) => sum + c.monthlySpend, 0),
    [queuedContracts]
  );

  const nextDeadlineDays = useMemo(() => {
    if (queuedContracts.length === 0) return null;
    return Math.min(...queuedContracts.map((c) => daysUntilDeadline(c)));
  }, [queuedContracts]);

  // A grid of 3 fixed columns leaves an awkward stretch of empty space when
  // only one or two cards are in a tier — the eye reads that gap as
  // something missing rather than "nothing else to show." Narrowing the
  // container to match the actual count keeps a short queue looking
  // intentional instead of sparse.
  function gridClassFor(count: number): string {
    if (count === 1) return "grid grid-cols-1 max-w-sm";
    if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 max-w-2xl";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }

  function RenewalCard({ contract, tone }: { contract: Contract; tone: "critical" | "soon" }) {
    // Soon: progress toward the deadline opening (fills as it approaches).
    // Critical: progress toward the actual renewal charge firing (fills as
    // the charge gets closer), since the deadline itself has already
    // passed and the more useful signal now is "how much longer until
    // this actually charges."
    const progressPct =
      tone === "soon"
        ? Math.min(100, Math.max(0, ((SOON_BUFFER_DAYS - daysUntilDeadline(contract)) / SOON_BUFFER_DAYS) * 100))
        : Math.min(
            100,
            Math.max(
              0,
              (Math.abs(daysUntilDeadline(contract)) / Math.max(1, contract.noticeDays)) * 100
            )
          );

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setViewingContract(contract)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setViewingContract(contract);
          }
        }}
        aria-label={`View details for ${contract.company}`}
        className={`group flex cursor-pointer flex-col rounded-md border border-ink/10 border-l-[3px] bg-white shadow-[0_20px_45px_-25px_rgba(18,20,28,0.35)] outline-none transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_28px_55px_-22px_rgba(18,20,28,0.45)] focus-visible:ring-2 focus-visible:ring-navy/40 ${
          tone === "critical" ? "border-l-amber" : "border-l-amber/30"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
            {contract.owner}
            {contract.team && ` · ${contract.team}`}
          </span>
          <CategoryBadge category={contract.category} />
        </div>

        <div className="px-5 pb-4 pt-2">
          <p className="font-display text-lg font-medium text-ink">{contract.company}</p>
          <p className="mt-1 font-body text-sm text-ink/50">{contract.name}</p>
        </div>

        <div className="perforated-edge" />

        <div
          className={`mx-4 mt-4 mb-3 rounded-[4px] px-4 py-3 ${
            tone === "critical" ? "bg-navy" : "bg-paper-muted border border-line"
          }`}
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
              tone === "critical" ? "text-amber-light/80" : "text-ink/45"
            }`}
          >
            Last safe cancel date
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className={`font-mono text-base tabular-nums ${tone === "critical" ? "text-paper" : "text-ink"}`}>
              {formatDate(getDeadlineDate(contract))}
            </p>
            <p className={`font-mono text-[11px] tabular-nums ${tone === "critical" ? "text-amber-light" : "text-ink/50"}`}>
              {deadlineLabel(contract)}
            </p>
          </div>

          <div
            className={`mt-2 h-1 w-full overflow-hidden rounded-full ${
              tone === "critical" ? "bg-paper/15" : "bg-ink/10"
            }`}
          >
            <div
              className={`h-full rounded-full ${tone === "critical" ? "bg-amber" : "bg-amber/50"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-1">
          <p className="font-mono text-[12px] tabular-nums text-ink/50">{currency(contract.monthlySpend)}/mo</p>
          <p className="font-mono text-[11px] tabular-nums text-ink/35">
            {formatDate(getNextRenewalDate(contract))} · {daysUntilRenewalLabel(contract)}
          </p>
        </div>

        <div className="px-5 pb-2 pt-2">
          <RenewalWarningBadge contract={contract} />
        </div>

        <div className="mt-auto border-t border-line px-5 py-4">
          {contract.url ? (
            <a
              href={contract.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-ink px-4 py-2.5 font-body text-[14px] font-medium text-paper outline-none transition-colors hover:bg-navy focus-visible:ring-2 focus-visible:ring-navy/50"
            >
              Fast-track renewal
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-[4px] border border-dashed border-line px-3 py-2.5">
              <p className="font-body text-[13px] text-ink/45">No management link saved.</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingContract(contract);
                  setShowForm(true);
                }}
                className="whitespace-nowrap rounded-[2px] font-mono text-[11px] font-medium text-navy outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-navy/50"
              >
                Add one →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">Action center</p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Renewals
            </h1>
            <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
              {!hasHydrated
                ? "\u00A0"
                : totalQueued === 0
                ? "Nothing needs a decision right now."
                : `${totalQueued} contract${totalQueued === 1 ? "" : "s"} need${
                    totalQueued === 1 ? "s" : ""
                  } your attention.`}
            </p>
          </div>

          <Link
            href="/dashboard/contracts"
            className="inline-flex items-center gap-1.5 self-start rounded-[4px] border border-line bg-white px-4 py-2.5 font-body text-[14px] text-ink outline-none transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-navy/40"
          >
            View all contracts
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {hasHydrated && totalQueued > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:max-w-md">
            <div className="bg-paper px-5 py-4">
              <p className="font-mono text-2xl tabular-nums text-ink">{currency(spendAtRisk)}</p>
              <p className="mt-1 font-body text-[13px] text-ink/55">/mo at risk</p>
            </div>
            <div className="bg-paper px-5 py-4">
              <p className="font-mono text-2xl tabular-nums text-ink">
                {nextDeadlineDays !== null && nextDeadlineDays < 0
                  ? `${Math.abs(nextDeadlineDays)}d`
                  : `${nextDeadlineDays}d`}
              </p>
              <p className="mt-1 font-body text-[13px] text-ink/55">
                {nextDeadlineDays !== null && nextDeadlineDays < 0 ? "past nearest deadline" : "to nearest deadline"}
              </p>
            </div>
          </div>
        )}

        {!hasHydrated ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <p className="font-mono text-sm text-ink/40">Loading…</p>
          </div>
        ) : totalQueued === 0 ? (
          <div className="mt-14 flex flex-col items-center rounded-md border border-line bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
              <CircleCheck className="h-7 w-7 text-teal" strokeWidth={1.5} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-medium text-ink">All clear</h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">
              No contracts are past their notice date or approaching one. Check back as renewal
              dates get closer, or view every tracked contract in the meantime.
            </p>
            <Link
              href="/dashboard/contracts"
              className="mt-6 inline-flex items-center gap-1.5 rounded-[4px] bg-ink px-5 py-3 font-body text-sm font-medium text-paper outline-none transition-colors hover:bg-navy focus-visible:ring-2 focus-visible:ring-navy/50"
            >
              View all contracts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {actNow.length > 0 && (
              <section className="mt-14">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-xl font-medium text-ink">Act now</h2>
                  <span className="rounded-full bg-navy px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-amber-light">
                    {actNow.length}
                  </span>
                </div>
                <p className="mt-1 font-body text-sm text-ink/50">
                  Past the notice window — cancel now or the next charge is locked in.
                </p>

                <div className={`mt-6 gap-6 ${gridClassFor(actNow.length)}`}>
                  {actNow.map((contract) => (
                    <RenewalCard key={contract.id} contract={contract} tone="critical" />
                  ))}
                </div>
              </section>
            )}

            {actNow.length > 0 && comingUp.length > 0 && (
              <div className="mt-14 flex items-center gap-4">
                <div className="h-px flex-1 bg-line" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/30">
                  Next tier
                </span>
                <div className="h-px flex-1 bg-line" />
              </div>
            )}

            {comingUp.length > 0 && (
              <section className={actNow.length > 0 ? "mt-8" : "mt-14"}>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-xl font-medium text-ink">Coming up</h2>
                  <span className="rounded-full bg-amber/15 px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-amber">
                    {comingUp.length}
                  </span>
                </div>
                <p className="mt-1 font-body text-sm text-ink/50">
                  Notice window opens within {SOON_BUFFER_DAYS} days — worth deciding before it does.
                </p>

                <div className={`mt-6 gap-6 ${gridClassFor(comingUp.length)}`}>
                  {comingUp.map((contract) => (
                    <RenewalCard key={contract.id} contract={contract} tone="soon" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {showForm && (
          <ContractForm
            initialData={editingContract}
            onSave={saveContract}
            onClose={() => {
              setShowForm(false);
              setEditingContract(null);
            }}
          />
        )}

        {viewingContract && (
          <ContractDetailsDialog
            contract={viewingContract}
            onClose={() => setViewingContract(null)}
            onEdit={() => {
              setEditingContract(viewingContract);
              setViewingContract(null);
              setShowForm(true);
            }}
          />
        )}
      </main>
    </div>
  );
}