'use client'

import Link from 'next/link'
import { Building2, Mail, User } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthBrandPanel } from '@/components/renewly/auth-brand-panel'
import { Logo } from '@/components/renewly/logo'
import { PasswordField, TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    // Wire this up to your auth backend.
    setTimeout(() => setSubmitting(false), 1200)
  }

  return (
    <main className="grid min-h-dvh grid-cols-1 bg-paper text-ink lg:grid-cols-2 dark:bg-ink dark:text-paper">
      <section className="flex flex-col px-6 py-10 sm:px-10 lg:px-16">
        <div className="lg:hidden">
          <Logo wordmarkClassName="text-ink dark:text-paper" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm py-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal dark:text-teal-light">
              Start free
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              Create your workspace
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              Set up your team&apos;s renewal radar in under two minutes. No card
              required.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <TextField
                label="Full name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Jordan Rivera"
                required
                icon={<User className="size-4" />}
              />

              <TextField
                label="Work email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                icon={<Mail className="size-4" />}
              />

              <TextField
                label="Company"
                type="text"
                name="company"
                autoComplete="organization"
                placeholder="Acme Inc."
                required
                icon={<Building2 className="size-4" />}
              />

              <PasswordField
                label="Password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                hint="Use 8+ characters with a mix of letters and numbers."
              />

              <label className="flex items-start gap-2.5 text-sm text-ink/70 dark:text-paper/70">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="mt-0.5 size-4 rounded border-line text-teal accent-teal focus-visible:ring-2 focus-visible:ring-teal/40 dark:border-line-dark dark:accent-teal-light"
                />
                <span>
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
                  >
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full bg-navy text-paper hover:bg-navy-light disabled:opacity-70 dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
              >
                {submitting ? 'Creating workspace…' : 'Create workspace'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-ink/60 dark:text-paper/60">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-ink/40 dark:text-paper/40 lg:text-left">
          {'\u00A9'} {new Date().getFullYear()} Renewly. All rights reserved.
        </p>
      </section>

      <AuthBrandPanel />
    </main>
  )
}
