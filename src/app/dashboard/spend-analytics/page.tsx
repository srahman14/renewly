"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Contract,
  STORAGE_KEY,
  currency,
  CATEGORIES,
} from "@/lib/contracts";
import { CategoryBadge } from "@/components/ContractUI";

// Real hex behind the Tailwind palette names already assigned to each
// category in CATEGORIES (violet-500, blue-500, sky-500, ...). Recharts
// needs literal color strings for fills — it can't consume a Tailwind
// class — so this is the one place those names get translated to hex.
// Keep this in sync with the badgeClass/dotClass colors in contracts.ts;
// if a category's Tailwind shade changes there, update the matching hex
// here too, or the chart and the badge will silently drift apart.
const CATEGORY_HEX: Record<string, string> = {
  "Streaming & Entertainment": "#8b5cf6",
  "Software & SaaS": "#3b82f6",
  "Cloud Storage": "#0ea5e9",
  "Utilities": "#eab308",
  "Food & Delivery": "#f97316",
  "Fitness & Health": "#f43f5e",
  "Gaming": "#6366f1",
  "News & Publications": "#64748b",
  "Travel": "#06b6d4",
  "Finance & Insurance": "#10b981",
  "Education": "#a855f7",
  "Other": "#9a9aa0",
};

function getCategoryHex(category: string): string {
  return CATEGORY_HEX[category] ?? CATEGORY_HEX["Other"];
}

// Custom tooltip in the site's own voice (mono, ink-on-paper, hairline
// border) rather than Recharts' default white box + drop shadow, which
// reads as a generic chart-library default against this palette.
function ChartTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-[4px] border border-ink/15 bg-white px-3 py-2 shadow-[0_12px_30px_-15px_rgba(18,20,28,0.4)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45">
        {entry.name ?? entry.payload?.label}
      </p>
      <p className="mt-0.5 font-mono text-sm text-ink">{currency(entry.value)}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">{eyebrow}</p>
      <h2 className="mt-1.5 font-display text-xl font-medium text-ink">{title}</h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  footnote,
  tone,
}: {
  label: string;
  value: string;
  footnote?: string;
  tone?: "default" | "positive";
}) {
  return (
    <div className="bg-paper px-6 py-8">
      <dt className="sr-only">{label}</dt>
      <dd
        className={`font-mono text-3xl sm:text-[2.25rem] ${
          tone === "positive" ? "text-teal" : "text-ink"
        }`}
      >
        {value}
      </dd>
      <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">{label}</p>
      {footnote && <p className="mt-1 font-mono text-[11px] text-ink/35">{footnote}</p>}
    </div>
  );
}

export default function SpendAnalyticsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContracts(JSON.parse(saved));
    } finally {
      setHasHydrated(true);
    }
  }, []);

  const active = useMemo(
    () => contracts.filter((c) => c.status !== "cancelled"),
    [contracts]
  );
  const cancelled = useMemo(
    () => contracts.filter((c) => c.status === "cancelled"),
    [contracts]
  );

  const totals = useMemo(() => {
    const monthlySpend = active.reduce((sum, c) => sum + c.monthlySpend, 0);
    const savedMonthly = cancelled.reduce((sum, c) => sum + c.monthlySpend, 0);
    return {
      monthlySpend,
      projectedAnnual: monthlySpend * 12,
      savedMonthly,
      savedAnnual: savedMonthly * 12,
    };
  }, [active, cancelled]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of active) {
      map.set(c.category || "Other", (map.get(c.category || "Other") ?? 0) + c.monthlySpend);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value, fill: getCategoryHex(label) }))
      .sort((a, b) => b.value - a.value);
  }, [active]);

  const byOwner = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of active) {
      map.set(c.owner || "Unassigned", (map.get(c.owner || "Unassigned") ?? 0) + c.monthlySpend);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [active]);

  const topFive = useMemo(
    () => [...active].sort((a, b) => b.monthlySpend - a.monthlySpend).slice(0, 5),
    [active]
  );

  const byCycle = useMemo(() => {
    const cycles: Contract["cycle"][] = ["Monthly", "Quarterly", "Annual"];
    return cycles.map((cycle) => {
      const inCycle = active.filter((c) => c.cycle === cycle);
      return {
        cycle,
        count: inCycle.length,
        spend: inCycle.reduce((sum, c) => sum + c.monthlySpend, 0),
      };
    });
  }, [active]);

  const hasSpendData = active.length > 0;

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            Spend analytics
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Where the money goes.
          </h1>
          <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
            {!hasHydrated
              ? "\u00A0"
              : hasSpendData
              ? "A breakdown of active spend by category, owner, and cost — plus what you've already saved by cancelling."
              : "Add a few contracts to see a spend breakdown here."}
          </p>
        </div>

        {!hasHydrated ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <p className="font-mono text-sm text-ink/40">Loading…</p>
          </div>
        ) : !hasSpendData ? (
          <div className="mt-14 rounded-md border border-line bg-white px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-medium text-ink">Nothing to analyse yet</h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-ink/60">
              Once you've added a contract or two, this page will break down spend by category,
              owner, and cost automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Monthly recurring spend"
                value={currency(totals.monthlySpend)}
                footnote="across active contracts"
              />
              <StatCard
                label="Projected annual spend"
                value={currency(totals.projectedAnnual)}
                footnote="monthly × 12"
              />
              <StatCard
                label="Saved by cancelling"
                value={currency(totals.savedAnnual)}
                footnote={`${cancelled.length} cancelled · per year`}
                tone="positive"
              />
              <StatCard label="Categories tracked" value={String(byCategory.length)} />
            </dl>

            {/* Category + Owner */}
            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Spend by category — donut */}
              <section className="rounded-md border border-line bg-white p-6 lg:col-span-3">
                <SectionHeading eyebrow="Breakdown" title="Spend by category" />

                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                  <div className="h-[220px] w-[220px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={byCategory}
                          dataKey="value"
                          nameKey="label"
                          innerRadius={62}
                          outerRadius={92}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {byCategory.map((entry) => (
                            <Cell key={entry.label} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex w-full flex-col gap-2.5">
                    {byCategory.map((entry) => {
                      const pct = Math.round((entry.value / totals.monthlySpend) * 100);
                      return (
                        <div key={entry.label} className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: entry.fill }}
                              aria-hidden="true"
                            />
                            <span className="truncate font-body text-sm text-ink/75">
                              {entry.label}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-baseline gap-2">
                            <span className="font-mono text-[11px] text-ink/35">{pct}%</span>
                            <span className="font-mono text-sm text-ink">
                              {currency(entry.value)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Spend by owner — bar */}
              <section className="rounded-md border border-line bg-white p-6 lg:col-span-2">
                <SectionHeading eyebrow="Breakdown" title="Spend by owner" />

                <div className="mt-6 h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byOwner} layout="vertical" margin={{ left: 0, right: 12 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={90}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#12141C99" }}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "#12141C0A" }} />
                      <Bar dataKey="value" fill="#1E2A45" radius={[0, 3, 3, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* Top 5 + Billing cycle mix */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Top 5 most expensive */}
              <section className="rounded-md border border-line bg-white p-6 lg:col-span-3">
                <SectionHeading eyebrow="Ranked" title="Most expensive contracts" />

                <div className="mt-5 divide-y divide-line">
                  {topFive.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-4 py-3.5">
                      <span className="w-4 shrink-0 font-mono text-[11px] text-ink/30">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm font-medium text-ink">
                          {c.company}
                        </p>
                        <p className="truncate font-body text-[13px] text-ink/50">{c.name}</p>
                      </div>
                      <CategoryBadge category={c.category} />
                      <span className="shrink-0 font-mono text-sm text-ink">
                        {currency(c.monthlySpend)}/mo
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Billing cycle mix + money saved callout */}
              <div className="flex flex-col gap-8 lg:col-span-2">
                <section className="rounded-md border border-line bg-white p-6">
                  <SectionHeading eyebrow="Mix" title="Billing cycle" />
                  <div className="mt-5 space-y-4">
                    {byCycle.map(({ cycle, count, spend }) => (
                      <div key={cycle}>
                        <div className="flex items-baseline justify-between">
                          <span className="font-body text-sm text-ink/70">{cycle}</span>
                          <span className="font-mono text-[11px] text-ink/40">
                            {count} contract{count === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-muted">
                          <div
                            className="h-full rounded-full bg-navy"
                            style={{
                              width:
                                totals.monthlySpend > 0
                                  ? `${Math.max(4, (spend / totals.monthlySpend) * 100)}%`
                                  : "0%",
                            }}
                          />
                        </div>
                        <p className="mt-1 font-mono text-[11px] text-ink/35">
                          {currency(spend)}/mo
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Money saved — the one positive number in the app */}
                <section className="rounded-[4px] bg-navy px-6 py-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80">
                    Saved by cancelling
                  </p>
                  <p className="mt-2 font-mono text-2xl text-paper">
                    {currency(totals.savedMonthly)}
                    <span className="ml-1.5 text-sm text-paper/50">/mo</span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-teal-light">
                    {currency(totals.savedAnnual)} a year across {cancelled.length} cancelled
                  </p>
                </section>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}