export default function Hero() {
  return (
    <section id="top" className="flex py-46 bg-paper">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left: thesis */}
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60">
            Renewal management for teams
          </p>

          <h1 className="max-w-xl font-display text-xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-5xl">
            The date that matters isn&apos;t your renewal date.
          </h1>

          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-ink/70">
            It&apos;s the day before you lose the right to cancel. Renewly
            reads the fine print on every contract your team pays for and
            tells you the exact last-safe-cancel date — before the
            auto-renewal fires.
          </p>

          <div id="hero-cta" className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#how-it-works"
              className="rounded-[4px] bg-[#12141C] px-6 py-3 text-center font-body text-[15px] font-medium text-[#F2F3F1] transition-colors hover:bg-navy"
            >
              Start tracking contracts
            </a>
            <a
              href="#purpose"
              className="rounded-[4px] border border-line px-6 py-3 text-center font-body text-[15px] font-medium text-ink transition-colors hover:border-ink"
            >
              Why Renewly exists
            </a>
          </div>

          <p className="mt-5 font-mono text-[13px] text-ink/45">
            No credit card. Two minutes to your first deadline.
          </p>
        </div>

        {/* Right: signature deadline card */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 h-full w-full rounded-md border border-line bg-paper-muted"
          />
          <div className="relative rounded-md border border-ink/10 bg-white shadow-[0_20px_45px_-25px_rgba(18,20,28,0.45)]">
            <div className="flex items-center justify-between px-6 pt-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
                Contract
              </span>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 font-mono text-[11px] text-teal">
                Tracked
              </span>
            </div>

            <div className="px-6 pb-5 pt-2">
              <p className="font-display text-xl font-medium text-ink">
                Figma — Enterprise
              </p>
              <p className="mt-1 font-body text-sm text-ink/50">
                Owner: Priya · Design team
              </p>
            </div>

            <div className="perforated-edge" aria-hidden="true" />

            <div className="grid grid-cols-2 gap-px bg-line/70 px-0">
              <div className="bg-white px-6 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                  Renews
                </p>
                <p className="mt-1 font-mono text-base text-ink/80">
                  Mar 14, 2027
                </p>
              </div>
              <div className="bg-white px-6 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                  Notice window
                </p>
                <p className="mt-1 font-mono text-base text-ink/80">60 days</p>
              </div>
            </div>

            <div className="mx-4 my-4 rounded-[4px] bg-navy px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-amber-light/80">
                Last safe cancel date
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="font-mono text-xl text-paper">Jan 13, 2027</p>
                <p className="font-mono text-[12px] text-amber-light">
                  42 days left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
