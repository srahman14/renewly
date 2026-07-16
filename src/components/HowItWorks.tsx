const STEPS = [
  {
    n: "01",
    title: "Add a contract",
    body: "Enter the renewal date, the notice terms, and who owns it. Rolling monthly, annual, or quarterly — Renewly handles the billing cycle.",
  },
  {
    n: "02",
    title: "Renewly computes the deadline",
    body: "The engine works out the last safe cancellation date from the notice rule — handling month-end dates, leap years, and timezone boundaries correctly.",
  },
  {
    n: "03",
    title: "Your team gets alerted",
    body: "A reminder reaches the contract owner before the window closes — once, reliably, even if a job reruns or a server restarts mid-batch.",
  },
  {
    n: "04",
    title: "See what's coming",
    body: "One dashboard shows total recurring spend, what renews next quarter, and where two tools are quietly doing the same job.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl bg-paper py-20 mt-60 mb-60 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <div className="max-w-xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Four steps from contract to deadline you can trust.
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-0 border-t border-line md:grid-cols-2">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className={`flex flex-col gap-3 border-b border-line px-0 py-8 md:px-8 ${
                i % 2 === 0 ? "md:border-r" : ""
              }`}
            >
              <span className="font-mono text-sm text-amber">{step.n}</span>
              <h3 className="font-display text-xl font-medium text-ink">
                {step.title}
              </h3>
              <p className="font-body text-[15px] leading-relaxed text-ink/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
