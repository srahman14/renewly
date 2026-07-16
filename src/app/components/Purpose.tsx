export default function Purpose() {
  return (
    <section id="purpose" className="w-full bg-paper-muted py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            Why Renewly exists
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Renewal dates lie. They tell you when the charge lands, not when
            you could still have stopped it.
          </h2>
        </div>

        <div className="flex flex-col gap-8 font-body text-[17px] leading-relaxed text-ink/70">
          <p>
            A spreadsheet can hold a renewal date. It can&apos;t hold a
            60-day notice window that only counts business days, or a
            contract that switches to a 30-day window after its first
            renewal, or a rolling monthly term where notice can only be
            given on the 1st. That&apos;s not a calendar problem — it&apos;s
            a rules problem.
          </p>
          <p>
            Renewly exists to be the system that actually does that math:
            reading the notice terms on every contract your team pays for
            and computing the one date that controls whether you keep
            paying or not — the last day you could still say no.
          </p>
          <p className="border-l-2 border-amber pl-5 text-ink">
            Everything else — the dashboard, the alerts, the spend view —
            exists to get that one date in front of the right person before
            it passes.
          </p>
        </div>
      </div>
    </section>
  );
}
