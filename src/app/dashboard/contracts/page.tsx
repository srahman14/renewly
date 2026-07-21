"use client";

import { useEffect, useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import ContractForm from "@/components/ContractForm";
import ContractDetailsDialog from "@/components/ContractDetailsDialog";
import {
  Contract,
  Status,
  STORAGE_KEY,
  currency,
  formatDate,
  getNextRenewalDate,
  daysUntilDeadline,
  deadlineLabel,
  daysUntilRenewalLabel,
  isFlagged,
  isMuted,
} from "@/lib/contracts";
import {
  DeadlinePill,
  RenewalWarningBadge,
  StatusDot,
  MuteIndicator,
  MuteToast,
  CategoryBadge,
  ActionsMenu,
  DeleteConfirmDialog,
} from "@/components/ContractUI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useQueryClient } from "@tanstack/react-query";
import {
  useContractsQuery,
  useCreateContractMutation,
  contractKeys,
} from "@/lib/queries/contract.queries";

type StatusTabKey = "active" | "flagged" | "cancelled";

const STATUS_TABS: { key: StatusTabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "flagged", label: "Flagged" },
  { key: "cancelled", label: "Cancelled" },
];

type SortKey = "deadline" | "price-high" | "price-low" | "recent";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "deadline", label: "Deadline (soonest)" },
  { key: "price-high", label: "Price: High to low" },
  { key: "price-low", label: "Price: Low to high" },
  { key: "recent", label: "Most recent" },
];

export default function AllContractsPage() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: profile } = useUserProfileQuery(userId);
  const orgId = profile?.org_id ?? null;

  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading, isError } = useContractsQuery(orgId);
  const createContractMutation = useCreateContractMutation(orgId);

  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [deletingContract, setDeletingContract] = useState<Contract | null>(
    null,
  );
  const [muteToast, setMuteToast] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTabKey>("active");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("deadline");

  function saveContract(contract: Contract) {
    const exists = contracts.some((item) => item.id === contract.id);

    if (exists) {
      // TODO(tomorrow): replace with useUpdateContractMutation once the
      // update service exists. This only patches the local query cache —
      // a refetch will overwrite it with whatever's actually in Supabase.
      queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
        (old ?? []).map((item) => (item.id === contract.id ? contract : item)),
      );
    } else {
      if (!orgId) return;
      createContractMutation.mutate({
        orgId,
        company: contract.company,
        name: contract.name,
        owner: contract.owner,
        team: contract.team,
        monthlySpend: contract.monthlySpend,
        cycle: contract.cycle,
        renewsOn: contract.renewsOn,
        noticeDays: contract.noticeDays,
        url: contract.url,
        category: contract.category,
      });
    }

    setShowForm(false);
    setEditingContract(null);
  }

  function cancelContract(id: string) {
    // TODO(tomorrow): persist via useUpdateContractMutation (status patch)
    queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
      (old ?? []).map((item) =>
        item.id === id ? { ...item, status: "cancelled" as Status } : item,
      ),
    );
  }

  function deletePermanently(id: string) {
    // TODO(tomorrow): persist via useDeleteContractMutation
    queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
      (old ?? []).filter((item) => item.id !== id),
    );
  }

  function toggleMute(contract: Contract) {
    const nowMuted = !isMuted(contract);
    // TODO(tomorrow): persist via useUpdateContractMutation (muted patch)
    queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
      (old ?? []).map((item) =>
        item.id === contract.id ? { ...item, muted: nowMuted } : item,
      ),
    );
    setMuteToast(
      nowMuted
        ? `Notifications muted for ${contract.company}`
        : `Notifications unmuted for ${contract.company}`,
    );
  }

  const categories = useMemo(() => {
    const set = new Set(contracts.map((c) => c.category).filter(Boolean));
    return Array.from(set).sort();
  }, [contracts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    contracts.forEach((c) => {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    });
    return counts;
  }, [contracts]);

  const filtered = useMemo(() => {
    const result = contracts.filter((contract) => {
      const matchesStatus =
        statusTab === "cancelled"
          ? contract.status === "cancelled"
          : statusTab === "flagged"
            ? contract.status !== "cancelled" && isFlagged(contract)
            : contract.status !== "cancelled";

      const matchesCategory =
        category === "all" || contract.category === category;
      const matchesSearch =
        query.length === 0 ||
        contract.name.toLowerCase().includes(query.toLowerCase()) ||
        contract.company.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });

    const sorted = [...result].sort((a, b) => {
      switch (sort) {
        case "price-high":
          return b.monthlySpend - a.monthlySpend;
        case "price-low":
          return a.monthlySpend - b.monthlySpend;
        case "recent":
          return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
        case "deadline":
        default:
          return daysUntilDeadline(a) - daysUntilDeadline(b);
      }
    });

    return sorted;
  }, [contracts, statusTab, category, query, sort]);

  const totalMonthlySpend = useMemo(() => {
    return filtered
      .filter((c) => c.status !== "cancelled")
      .reduce((sum, c) => sum + c.monthlySpend, 0);
  }, [filtered]);

  const hasAnyContracts = !isLoading && contracts.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
              Contracts
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              All contracts
            </h1>
            <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
              {!isLoading
                ? "\u00A0"
                : hasAnyContracts
                  ? `${filtered.length} of ${contracts.length} contract${contracts.length === 1 ? "" : "s"} shown · ${currency(totalMonthlySpend)}/mo`
                  : "Every subscription you're tracking, in one place."}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-block self-start rounded-[4px] bg-amber px-5 py-2.5 font-body text-[15px] font-medium text-ink transition-colors hover:bg-amber-light"
          >
            + Add contract
          </button>
        </div>

        {isLoading ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <p className="font-mono text-sm text-ink/40">Loading contracts…</p>
          </div>
        ) : isError ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <p className="font-mono text-sm text-ink/40">
              Something went wrong loading your contracts.
            </p>
          </div>
        ) : (
          <>
            {hasAnyContracts && (
              <>
                {/* Filter bar */}
                <div className="mt-10 flex flex-col gap-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 rounded-[4px] border border-line bg-white p-1">
                      {STATUS_TABS.map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setStatusTab(t.key)}
                          className={`rounded-[3px] px-3 py-1.5 font-body text-sm transition-colors ${
                            statusTab === t.key
                              ? "bg-ink text-paper"
                              : "text-ink/60 hover:text-ink"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Select
                        value={sort}
                        onValueChange={(v) => setSort(v as SortKey)}
                      >
                        <SelectTrigger className="w-full sm:w-52">
                          <span className="flex items-center gap-2">
                            <ListFilter className="h-3.5 w-3.5 text-ink/40" />
                            <SelectValue>
                              {SORT_OPTIONS.find((o) => o.key === sort)?.label}
                            </SelectValue>
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.key} value={opt.key}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search contracts..."
                        className="rounded-[4px] border border-line bg-white px-3 py-2 text-sm sm:w-56"
                      />
                    </div>
                  </div>

                  {/* Category pills */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategory("all")}
                        className={`rounded-full px-3 py-1 font-mono text-[12px] transition-colors ${
                          category === "all"
                            ? "bg-navy text-amber-light"
                            : "bg-white text-ink/60 border border-line hover:border-ink hover:text-ink"
                        }`}
                      >
                        All categories
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`rounded-full px-3 py-1 font-mono text-[12px] transition-colors ${
                            category === c
                              ? "bg-navy text-amber-light"
                              : "bg-white text-ink/60 border border-line hover:border-ink hover:text-ink"
                          }`}
                        >
                          {c} · {categoryCounts[c]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contract list */}
                {hasFilteredResults ? (
                  <div className="mt-6 overflow-hidden rounded-md border border-line bg-white">
                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-line bg-paper-muted px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40 md:grid">
                      <span>Contract</span>
                      <span>Owner</span>
                      <span>Cost</span>
                      <span>Renews</span>
                      <span>Category</span>
                      <span>Cancel by</span>
                      <span className="sr-only">Actions</span>
                    </div>

                    <div className="divide-y divide-line">
                      {filtered.map((contract) => {
                        const cancelled = contract.status === "cancelled";
                        return (
                          <div
                            key={contract.id}
                            className={`grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] md:items-center ${
                              cancelled ? "opacity-50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <StatusDot contract={contract} />
                              <div>
                                <p
                                  className={`flex items-center gap-1.5 font-body font-medium text-ink ${cancelled ? "line-through" : ""}`}
                                >
                                  {contract.company}
                                  <MuteIndicator
                                    contract={contract}
                                    onToggle={() => toggleMute(contract)}
                                  />
                                </p>
                                <p className="text-sm text-ink/50">
                                  {contract.name}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="font-body text-sm text-ink/70">
                                {contract.owner}
                              </p>
                              {contract.team && (
                                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink/35">
                                  {contract.team}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="font-mono text-sm text-ink/60">
                                {currency(contract.monthlySpend)}/mo
                              </p>
                              <p className="font-mono text-[10px] text-ink/35">
                                {contract.cycle}
                              </p>
                            </div>

                            <p className="font-mono text-sm text-ink/60">
                              {formatDate(getNextRenewalDate(contract))}
                            </p>

                            <CategoryBadge category={contract.category} />

                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <DeadlinePill contract={contract} />
                                <RenewalWarningBadge contract={contract} />
                              </div>
                              <span className="font-mono text-[10px] text-ink/35">
                                {daysUntilRenewalLabel(contract)} ·{" "}
                                {contract.noticeDays}d notice
                              </span>
                            </div>

                            <ActionsMenu
                              isCancelled={cancelled}
                              onViewDetails={() => setViewingContract(contract)}
                              onEdit={() => {
                                setEditingContract(contract);
                                setShowForm(true);
                              }}
                              onCancel={() => cancelContract(contract.id)}
                              onDeletePermanently={() =>
                                setDeletingContract(contract)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-md border border-line bg-white px-6 py-14 text-center">
                    <p className="font-display text-lg font-medium text-ink">
                      No contracts match this filter
                    </p>
                    <p className="mt-2 font-body text-sm text-ink/60">
                      Try a different status, category, or search term.
                    </p>
                    <button
                      onClick={() => {
                        setStatusTab("active");
                        setCategory("all");
                        setQuery("");
                      }}
                      className="mt-5 rounded-[4px] border border-line bg-white px-4 py-2 font-body text-sm text-ink hover:bg-paper-muted"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}

            {!hasAnyContracts && (
              <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
                <h2 className="font-display text-2xl font-medium text-ink">
                  No contracts yet
                </h2>
                <p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">
                  Add your first subscription to start tracking renewals and
                  cancellation deadlines.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 rounded-[4px] bg-ink px-5 py-3 font-body text-sm font-medium text-paper hover:bg-navy"
                >
                  Add your first contract
                </button>
              </div>
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

        {muteToast && (
          <MuteToast message={muteToast} onDismiss={() => setMuteToast(null)} />
        )}
      </main>
    </div>
  );
}
