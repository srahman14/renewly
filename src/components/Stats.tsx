import Link from "next/link";

const STATS = [
  {
    value: "69%",
    label:
      "of software contracts include an auto-renewal clause with a 30–90 day cancellation notice window",
  },
  {
    value: "25%",
    label:
      "average overspend on SaaS when contracts and entitlements aren't centrally tracked",
  },
  {
    value: "25",
    label: "active subscriptions the typical company is juggling at once",
  },
  {
    value: "51%",
    label:
      "of enterprise SaaS licenses go completely unused — the highest waste rate on record",
  },
];

export default function Stats() {
  return (
    <section className="w-full bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
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
            <div key={stat.label} className="bg-navy px-6 py-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-mono text-3xl text-amber/90 tracking-tighter sm:text-[2.25rem]">
                {stat.value}
              </dd>
              <p className="mt-3 font-body text-sm leading-relaxed text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <Link href={"/sources"}>
          <p className="mt-6 w-24 text-xs cursor-pointer hover:text-ink/50 font-body text-ink/20 underline underline-offset-4 decoration-gray-300/60">
            See sources
          </p>
        </Link>
      </div>
    </section>
  );
}
