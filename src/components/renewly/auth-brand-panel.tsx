import { CalendarClock, ShieldCheck, TrendingUp } from 'lucide-react'
import { Logo } from './logo'

const highlights = [
  {
    icon: CalendarClock,
    title: 'Notice-window math, handled',
    description:
      'We compute the last safe cancellation date from every renewal rule — month-ends, leap years and timezones included.',
  },
  {
    icon: TrendingUp,
    title: 'Spend you can forecast',
    description:
      'Normalize monthly, quarterly and annual contracts into one number, then see what is coming due next quarter.',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated by default',
    description:
      'Multi-tenant from day one, with per-organization access enforced at the database, not just the UI.',
  },
]

/**
 * Marketing panel shown alongside the auth forms on larger screens.
 * Deep navy in both themes so the brand feels consistent regardless of mode.
 */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-navy dark:bg-navy-light lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Decorative radar rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-line-dark/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full border border-line-dark/40"
      />

      <div className="relative">
        <Logo wordmarkClassName="text-paper" />
      </div>

      <div className="relative max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-light">
          Renewal Radar
        </p>
        <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-paper">
          Never get caught by an auto-renewal again.
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-paper/70">
          Renewly gives small teams one shared view of every tool and contract
          they pay for — with alerts that fire before the cancellation window
          closes.
        </p>

        <ul className="mt-10 space-y-6">
          {highlights.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-light text-amber-light dark:bg-navy">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-paper">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-paper/60">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex items-center gap-3 text-sm text-paper/60">
        <div className="flex -space-x-2" aria-hidden="true">
          {['bg-amber', 'bg-teal', 'bg-amber-light'].map((c) => (
            <span
              key={c}
              className={`size-7 rounded-full border-2 border-navy ${c} dark:border-navy-light`}
            />
          ))}
        </div>
        <p>Trusted by lean teams tracking 2,000+ contracts.</p>
      </div>
    </aside>
  )
}
