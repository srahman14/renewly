const STATS = [
  {
    value: "1 in 3",
    label: "team subscriptions renew without anyone reviewing the terms first",
  },
  {
    value: "60 days",
    label: "the typical notice window buried in a standard SaaS contract",
  },
  {
    value: "37%",
    label: "of recurring tool spend goes to contracts nobody remembers signing",
  },
  {
    value: "$18.4K",
    label: "recovered per year, on average, by teams who catch the window in time",
  },
];

export default function Stats() {
  return (
    <section className="w-full bg-paper py-20 md:py-24">
      <div className="mx-auto  px-6 md:px-10">
        <div className="max-w-xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            Why this is worth solving
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            The gap between renewal and deadline is where money leaks out.
          </h2>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-paper px-6 py-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-mono text-3xl text-ink sm:text-[2.25rem]">
                {stat.value}
              </dd>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-body text-xs text-ink/35">
          Illustrative figures based on typical SaaS renewal patterns.
        </p>
      </div>
    </section>
  );
}
