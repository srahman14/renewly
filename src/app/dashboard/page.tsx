"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ContractForm from "@/components/ContractForm";
import ContractDetailsDialog from "@/components/ContractDetailsDialog";
import {
  Contract,
  Status,
  STORAGE_KEY,
  currency,
  formatDate,
  getNextRenewalDate,
  getDeadlineDate,
  daysUntilRenewal,
  daysUntilDeadline,
  deadlineLabel,
  daysUntilRenewalLabel,
  isFlagged,
} from "@/lib/contracts";
import { DeadlinePill, RenewalWarningBadge, StatusDot, CategoryBadge, ActionsMenu, DeleteConfirmDialog } from "@/components/ContractUI";

// How many rows show on the overview before sending people to /dashboard/contracts.
// Full search/filter/sort now lives only on that page — this is a glance, not a workspace.
const PREVIEW_COUNT = 4;

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [deletingContract, setDeletingContract] = useState<Contract | null>(null);

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

  function cancelContract(id: string) {
    setContracts((previous) =>
      previous.map((item) => (item.id === id ? { ...item, status: "cancelled" as Status } : item))
    );
  }

  function deletePermanently(id: string) {
    setContracts((previous) => previous.filter((item) => item.id !== id));
  }

  const totals = useMemo(() => {
    const active = contracts.filter((c) => c.status !== "cancelled");
    return {
      count: active.length,
      monthlySpend: active.reduce((sum, c) => sum + c.monthlySpend, 0),
      upcoming: active.filter((c) => daysUntilRenewal(c) <= 30).length,
      flagged: active.filter((c) => isFlagged(c)).length,
    };
  }, [contracts]);

  const sortedByDeadline = useMemo(
    () =>
      [...contracts]
        .filter((c) => c.status !== "cancelled")
        .sort((a, b) => daysUntilDeadline(a) - daysUntilDeadline(b)),
    [contracts]
  );

  const previewContracts = sortedByDeadline.slice(0, PREVIEW_COUNT);
  const remainingCount = Math.max(0, contracts.length - previewContracts.length);

  function StatCard({
    label,
    value,
    footnote,
  }: {
    label: string;
    value: string;
    footnote?: string;
  }) {
    return (
      <div className="bg-paper px-6 py-8">
        <dt className="sr-only">{label}</dt>
        <dd className="font-mono text-3xl text-ink sm:text-[2.25rem]">{value}</dd>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">{label}</p>
        {footnote && <p className="mt-1 font-mono text-[11px] text-ink/35">{footnote}</p>}
      </div>
    );
  }

  function DeadlineCard({ contract }: { contract: Contract }) {
    return (
      <div className="rounded-md border border-ink/10 bg-white shadow-[0_20px_45px_-25px_rgba(18,20,28,0.35)]">
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
            {contract.team}
          </span>
          <CategoryBadge category={contract.category} />
        </div>

        <div className="px-5 pb-4 pt-2">
          <p className="font-display text-lg font-medium text-ink">{contract.company}</p>
          <p className="mt-1 font-body text-sm text-ink/50">{contract.name}</p>
          <p className="mt-1 font-body text-sm text-ink/50">Owner: {contract.owner}</p>
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

        <div className="px-5 pb-4">
          <RenewalWarningBadge contract={contract} />
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
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">Overview</p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Good morning.
            </h1>
            <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
              {!hasHydrated
                ? "\u00A0"
                : contracts.length === 0
                ? "Start tracking your subscriptions and avoid unexpected renewals."
                : `${totals.upcoming} contract${totals.upcoming === 1 ? "" : "s"} need a decision in the next 30 days.`}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-block self-start rounded-[4px] bg-amber px-5 py-2.5 font-body text-[15px] font-medium text-ink transition-colors hover:bg-amber-light"
          >
            + Add contract
          </button>
        </div>

        {/* Stat cards */}
        <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tracked contracts" value={String(totals.count)} />
          <StatCard
            label="Monthly recurring spend"
            value={currency(totals.monthlySpend)}
            footnote="normalised monthly cost"
          />
          <StatCard label="Deadlines in 30 days" value={String(totals.upcoming)} />
          <StatCard label="Flagged for review" value={String(totals.flagged)} />
        </dl>

        {!hasHydrated ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <p className="font-mono text-sm text-ink/40">Loading contracts…</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-medium text-ink">Welcome to Renewal Radar</h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">
              You don&apos;t have any contracts yet. Add your first subscription to start tracking
              renewals.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-[4px] bg-ink px-5 py-3 font-body text-sm font-medium text-paper hover:bg-navy"
            >
              Add your first contract
            </button>
          </div>
        ) : (
          <>
            {/* Closest deadlines */}
            <section className="mt-14">
              <h2 className="font-display text-xl font-medium text-ink">Closest deadlines</h2>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedByDeadline.slice(0, 3).map((contract) => (
                  <DeadlineCard key={contract.id} contract={contract} />
                ))}
              </div>
            </section>

            {/* Contracts preview */}
            <section className="mt-14">
              <div className="flex items-center justify-between">
                <Link
                  href="/dashboard/contracts"
                  className="group flex items-center gap-2 font-display text-xl font-medium text-ink transition-colors hover:text-navy"
                >
                  All contracts
                  <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-0.5 group-hover:text-navy" />
                </Link>

                <Link
                  href="/dashboard/contracts"
                  className="font-mono text-[12px] text-ink/50 transition-colors hover:text-ink"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-md border border-line bg-white">
                <div className="divide-y divide-line">
                  {previewContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <StatusDot contract={contract} />
                        <div>
                          <p className="font-body font-medium text-ink">{contract.company}</p>
                          <p className="text-sm text-ink/50">{contract.name}</p>
                        </div>
                      </div>

                      <p className="font-mono text-sm text-ink/60">{currency(contract.monthlySpend)}/mo</p>

                      <p className="font-mono text-sm text-ink/60">{formatDate(getNextRenewalDate(contract))}</p>

                      <CategoryBadge category={contract.category} />

                      <div className="flex flex-wrap items-center gap-2">
                        <DeadlinePill contract={contract} />
                        <RenewalWarningBadge contract={contract} />
                        <span className="font-mono text-[11px] text-ink/35">
                          {daysUntilRenewalLabel(contract)}
                        </span>
                      </div>

                      <ActionsMenu
                        isCancelled={contract.status === "cancelled"}
                        onViewDetails={() => setViewingContract(contract)}
                        onEdit={() => {
                          setEditingContract(contract);
                          setShowForm(true);
                        }}
                        onCancel={() => cancelContract(contract.id)}
                        onDeletePermanently={() => setDeletingContract(contract)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/dashboard/contracts"
                className="mt-4 inline-flex items-center gap-1.5 rounded-[4px] border border-line bg-white px-4 py-2 font-body text-sm text-ink transition-colors hover:border-ink"
              >
                {remainingCount > 0
                  ? `View all contracts (${remainingCount} more)`
                  : "View all contracts"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
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

        {deletingContract && (
          <DeleteConfirmDialog
            contractName={`${deletingContract.company} — ${deletingContract.name}`}
            onCancel={() => setDeletingContract(null)}
            onConfirm={() => {
              deletePermanently(deletingContract.id);
              setDeletingContract(null);
            }}
          />
        )}
      </main>
    </div>
  );
}