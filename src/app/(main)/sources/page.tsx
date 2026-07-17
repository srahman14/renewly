import React from "react";
import Link from "next/link";

interface Source {
  stat: string;
  claim: string;
  publisher: string;
  title: string;
  year: string;
  url: string;
}

const sources: Source[] = [
  {
    stat: "69%",
    claim:
      "of software contracts include an auto-renewal clause with a 30–90 day cancellation notice window.",
    publisher: "ContractSafe",
    title: "The Contract That Renewed Itself While Nobody Was Watching",
    year: "2026",
    url: "https://www.contractsafe.com/blog/auto-renewal-clause",
  },
  {
    stat: "25%",
    claim:
      "average overspend on SaaS when contracts and entitlements aren't centrally tracked.",
    publisher: "BetterCloud",
    title:
      "Gartner Magic Quadrant for SaaS Management Platforms, as quoted by BetterCloud",
    year: "2025",
    url: "https://www.bettercloud.com/monitor/gartner-magic-quadrant-leader-for-saas-management-platforms/",
  },
  {
    stat: "25",
    claim:
      "active subscriptions the typical company is juggling at once.",
    publisher: "Cledara",
    title:
      "Average SaaS Spend Per Employee in 2026",
    year: "2026",
    url: "https://www.cledara.com/blog/average-saas-spend-per-employee-2026",
  },
  {
    stat: "51%",
    claim:
      "of enterprise SaaS licenses go completely unused — the highest waste rate on record.",
    publisher: "Zylo",
    title: "175+ Unmissable SaaS Statistics for 2026",
    year: "2024",
    url: "https://zylo.com/blog/saas-statistics",
  },
];

// Extra reading
// https://www.geldards.com/insights/how-long-can-you-keep-personal-data-under-uk-gdpr/

const SourcesPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-navy uppercase">
        Sources
      </p>
      <h1 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
        Where our numbers come from
      </h1>
      <p className="mt-4 text-zinc-600 leading-relaxed max-w-xl">
        Every stat we cite on our site is pulled directly from a published
        study, survey, or regulation. Here's the full list, so you can check the
        numbers yourself.
      </p>

      <div className="mt-14 space-y-10">
        {sources.map((source, i) => (
          <div
            key={i}
            className="pb-10 border-b border-zinc-200 last:border-none"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold tracking-tight bg-navy rounded-md p-2 text-amber/90">
                {source.stat}
              </span>
              <p className="text-sm text-zinc-600">{source.claim}</p>
            </div>

            <div className="mt-3 text-sm text-zinc-500">
              <span className="text-zinc-700 font-medium">
                {source.publisher}
              </span>{" "}
              — {source.title} ({source.year})
            </div>

            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-navy underline underline-offset-4 transition-colors"
            >
              Read the source →
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-16 text-xs text-zinc-400 max-w-xl">
        Last checked July 2026. If any of these figures are updated by their
        original publisher, we'll update this page accordingly.
      </p>
    </div>
  );
};

export default SourcesPage;