import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, Radar } from 'lucide-react'
import { Logo } from '@/components/renewly/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-paper text-ink dark:bg-ink dark:text-paper">
      {/* Decorative radar rings echoing the brand mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line dark:border-line-dark/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line dark:border-line-dark/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line dark:border-line-dark/40"
      />

      <header className="relative px-6 py-8 sm:px-10">
        <Logo wordmarkClassName="text-ink dark:text-paper" />
      </header>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-20">
        <div className="max-w-md text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-muted px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-navy dark:border-line-dark dark:bg-navy dark:text-amber-light">
            <Radar className="size-3.5" aria-hidden="true" />
            Error 404
          </span>

          <p className="mt-6 font-display text-7xl font-semibold tracking-tight text-navy dark:text-paper">
            404
          </p>

          <h1 className="mt-2 text-balance font-display text-2xl font-semibold tracking-tight">
            This page slipped off the radar
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-ink/60 dark:text-paper/60">
            The page you&apos;re looking for may have been moved, renamed, or
            never renewed. Let&apos;s get you back to tracking what matters.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className={cn(
                buttonVariants(),
                'h-11 gap-2 px-5 bg-navy text-paper hover:bg-navy-light dark:bg-teal dark:text-ink dark:hover:bg-teal-light',
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-11 gap-2 px-5 border-line bg-transparent text-ink hover:bg-paper-muted dark:border-line-dark dark:text-paper dark:hover:bg-navy',
              )}
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
