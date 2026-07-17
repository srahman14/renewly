"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What's the difference between a renewal date and a notice deadline?",
    a: "The renewal date is when the contract auto-renews and the charge lands. The notice deadline is the last day you're allowed to cancel before that happens — often 30, 60, or 90 days earlier. Renewly tracks both and calculates the second one for you.",
  },
  {
    q: "Does Renewly handle rolling or monthly contracts, not just annual ones?",
    a: "Yes. Rolling monthly terms, quarterly billing, and annual contracts are all normalized so you can compare them on one spend view, and each gets its own deadline logic — including terms that only accept notice on the 1st of the month.",
  },
  {
    q: "What happens if I change a renewal date after a reminder is already scheduled?",
    a: "Renewly recalculates the deadline immediately and reschedules the alert. Every reminder is logged against the contract, so nothing gets sent twice and nothing silently falls off the calendar.",
  },
  {
    q: "Can I control who sees or edits what inside my organization?",
    a: "Yes. Owners can add, edit, and delete contracts. Members can view and flag them. You can also scope someone to only see the contracts they own — enforced at both the interface and the database level.",
  },
  {
    q: "Is our contract data isolated from other teams on Renewly?",
    a: "Every organization's data is separated with row-level security at the database layer, not just filtered in application code. One team's contracts are never reachable from another team's account, even in the event of an application bug.",
  },
  {
    q: "Do I have to enter every contract manually?",
    a: "In v1, yes — it takes about two minutes per contract. Invoice and contract parsing to auto-extract renewal terms is on the roadmap.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full flex items-center py-20 mb-40 md:py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            Questions
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-ink">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-sm text-ink/60 transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-all duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                  }`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl font-body text-[15px] leading-relaxed text-ink/65">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
