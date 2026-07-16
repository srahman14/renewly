import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** Tailwind text color class for the wordmark. Defaults to inherit. */
  wordmarkClassName?: string
}

/**
 * Renewly wordmark: a small radar-style mark paired with the brand name.
 * The mark is a simple concentric-ring "radar" that ties into the
 * "Renewal Radar" product concept.
 */
export function Logo({ className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-lg bg-teal text-paper"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" opacity="0.35" />
          <circle cx="12" cy="12" r="5" opacity="0.65" />
          <path d="M12 12 20 5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-xl font-semibold tracking-tight',
          wordmarkClassName,
        )}
      >
        Renewly
      </span>
    </span>
  )
}
