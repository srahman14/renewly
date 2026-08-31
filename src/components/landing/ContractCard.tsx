// components/landing/ContractCard.tsx

export function ContractCard() {
  return (
    <div className="relative w-full">
      {/* Offset shadow/paper layer */}
      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-3
          -right-3
          h-full
          w-full
          rounded-lg
          border
          border-line
          bg-paper-muted
        "
      />

      <div
        className="
          relative
          overflow-hidden
          rounded-lg
          border
          border-ink/10
          bg-white
          shadow-[0_30px_70px_-30px_rgba(18,20,28,0.45)]
        "
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40 sm:text-[11px]">
            Contract
          </span>

          <span className="rounded-full bg-teal/10 px-2 py-0.5 font-mono text-[10px] text-teal sm:text-[11px]">
            Tracked
          </span>
        </div>

        {/* Company */}
        <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6">
          <p className="font-display text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
            Figma — Enterprise
          </p>

          <p className="mt-1 font-body text-xs text-ink/50 sm:text-sm">
            Owner: Priya · Design team
          </p>
        </div>

        {/* Perforation */}
        <div className="perforated-edge" aria-hidden="true" />

        {/* Contract details */}
        <div className="grid grid-cols-2 gap-px bg-line/70">
          <div className="bg-white px-5 py-4 sm:px-6 sm:py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40 sm:text-[11px]">
              Renews
            </p>

            <p
              data-contract="renewal"
              className="mt-1 font-mono text-sm text-ink/80 sm:text-base"
            >
              Mar 14, 2027
            </p>
          </div>

          <div className="bg-white px-5 py-4 sm:px-6 sm:py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40 sm:text-[11px]">
              Notice window
            </p>

            <p
              data-contract="notice"
              className="mt-1 font-mono text-sm text-ink/80 sm:text-base"
            >
              60 days
            </p>
          </div>
        </div>

        {/* Important date */}
        <div className="mx-3 my-3 rounded-md bg-navy px-4 py-4 sm:mx-4 sm:my-4 sm:px-5 sm:py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80 sm:text-[11px]">
            Last safe cancel date
          </p>

          <div className="mt-1 flex items-baseline justify-between gap-3">
            <p
              data-contract="safe-date"
              className="font-mono text-lg text-paper sm:text-xl"
            >
              Jan 13, 2027
            </p>

            <p className="whitespace-nowrap font-mono text-[10px] text-amber-light sm:text-[12px]">
              42 days left
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line/70 px-5 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/30 sm:text-[10px]">
              Renewly calculation
            </span>

            <span className="font-mono text-[10px] text-teal sm:text-[11px]">
              ✓ Calculated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
