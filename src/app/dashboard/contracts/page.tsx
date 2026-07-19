"use client";

import { useEffect, useMemo, useState } from "react";
import ContractForm from "@/components/ContractForm";
import { Contract, Status, STORAGE_KEY, currency } from "@/lib/contracts";
import { DeadlinePill, StatusDot, CategoryBadge, ActionsMenu } from "@/components/ContractUI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
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

// See the matching comment in dashboard/page.tsx — reading here, during
// state initialization, avoids the load-effect/save-effect race that was
// wiping contracts on mount (a save effect firing with stale empty state
// a moment before the load effect's data lands).
function loadContracts(): Contract[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function AllContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(loadContracts);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [statusTab, setStatusTab] = useState<(typeof STATUS_TABS)[number]["key"]>("all");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("deadline");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }, [contracts]);

  function saveContract(contract: Contract) {
    setContracts((previous) => {
      const exists = previous.some((item) => item.id === contract.id);
      if (exists) {
        return previous.map((item) => (item.id === contract.id ? contract : item));
      }
      return [...previous, { ...contract, createdAt: contract.createdAt ?? new Date().toISOString() }];
    });
    setShowForm(false);
    setEditingContract(null);
  }

  // Soft: marks a contract cancelled but keeps it in your data
  function cancelContract(id: string) {
    setContracts((previous) =>
      previous.map((item) => (item.id === id ? { ...item, status: "cancelled" as Status } : item))
    );
  }

  // Hard: permanently removes the contract
  function deletePermanently(id: string) {
    setContracts((previous) => previous.filter((item) => item.id !== id));
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
      const matchesStatus = statusTab === "all" || contract.status === statusTab;
      const matchesCategory = category === "all" || contract.category === category;
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
          return a.daysLeft - b.daysLeft;
      }
    });

    return sorted;
  }, [contracts, statusTab, category, query, sort]);

  const totalMonthlySpend = useMemo(() => {
    return filtered.filter((c) => c.status !== "cancelled").reduce((sum, c) => sum + c.monthlySpend, 0);
  }, [filtered]);

  const hasAnyContracts = contracts.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">Contracts</p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              All contracts
            </h1>
            <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
              {hasAnyContracts
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
                        statusTab === t.key ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {/*
                    shadcn's default SelectTrigger border (border-input) is nearly
                    invisible against bg-paper-muted/white until it's focused or
                    open. Force the same border-line + bg-white + hover/focus
                    treatment every other control on this page already uses, so
                    it reads as clickable at rest, not just once it's active.
                  */}
                  <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                    <SelectTrigger
                      className="w-[190px] border border-line bg-white text-ink shadow-none transition-colors hover:border-ink focus:border-ink focus:ring-0 data-[state=open]:border-ink"
                    >
                      <SelectValue placeholder="Sort" />
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
                <div className="divide-y divide-line">
                  {filtered.map((contract) => (
                    <div
                      key={contract.id}
                      className="grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <StatusDot status={contract.status} />
                        <div>
                          <p className="font-body font-medium text-ink">{contract.company}</p>
                          <p className="text-sm text-ink/50">{contract.name}</p>
                        </div>
                      </div>

                      <p className="font-mono text-sm text-ink/60">£{contract.monthlySpend}/mo</p>

                      <p className="font-mono text-sm text-ink/60">{contract.renewsOn}</p>

                      <CategoryBadge category={contract.category} />

                      <DeadlinePill daysLeft={contract.daysLeft} />

                      <ActionsMenu
                        isCancelled={contract.status === "cancelled"}
                        onEdit={() => {
                          setEditingContract(contract);
                          setShowForm(true);
                        }}
                        onCancel={() => cancelContract(contract.id)}
                        onDeletePermanently={() => deletePermanently(contract.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-line bg-white px-6 py-14 text-center">
                <p className="font-display text-lg font-medium text-ink">No contracts match this filter</p>
                <p className="mt-2 font-body text-sm text-ink/60">
                  Try a different status, category, or search term.
                </p>
                <button
                  onClick={() => {
                    setStatusTab("all");
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
            <h2 className="font-display text-2xl font-medium text-ink">No contracts yet</h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">
              Add your first subscription to start tracking renewals and cancellation deadlines.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-[4px] bg-ink px-5 py-3 font-body text-sm font-medium text-paper hover:bg-navy"
            >
              Add your first contract
            </button>
          </div>
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
      </main>
    </div>
  );
}