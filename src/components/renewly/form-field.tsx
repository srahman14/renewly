'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
  icon?: ReactNode
}

const inputClasses = cn(
  'h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm text-ink shadow-sm outline-none transition-colors',
  'placeholder:text-ink/40',
  'focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/30',
  'dark:border-line-dark dark:bg-navy dark:text-paper dark:placeholder:text-paper/40',
  'dark:focus-visible:border-teal-light dark:focus-visible:ring-teal-light/30',
)

const labelClasses =
  'text-sm font-medium text-ink/80 dark:text-paper/80'

export function TextField({ label, hint, icon, className, ...props }: FieldProps) {
  const generatedId = useId()
  const id = props.id ?? generatedId

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40"
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          className={cn(inputClasses, icon && 'pl-10', className)}
          {...props}
        />
      </div>
      {hint ? (
        <p className="text-xs text-ink/50 dark:text-paper/50">{hint}</p>
      ) : null}
    </div>
  )
}

export function PasswordField({ label, hint, className, ...props }: FieldProps) {
  const generatedId = useId()
  const id = props.id ?? generatedId
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn(inputClasses, 'pr-10', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-ink/50 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 dark:text-paper/50 dark:hover:text-paper"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint ? (
        <p className="text-xs text-ink/50 dark:text-paper/50">{hint}</p>
      ) : null}
    </div>
  )
}
