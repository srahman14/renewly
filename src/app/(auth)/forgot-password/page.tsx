'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthBrandPanel } from '@/components/renewly/auth-brand-panel'
import { Logo } from '@/components/renewly/logo'
import { TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim()
    if (!email) {
      setFormError('Enter the email you signed up with.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    // The link lands on /auth/confirm, which swaps the code for a session
    // and then sends the user to /reset-password to choose a new one.
    // /auth/confirm must be in Supabase → Auth → URL Configuration →
    // Redirect URLs (it already is for sign-up confirmation).
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    })
    setSubmitting(false)

    // Supabase doesn't error for unknown emails, and the success copy
    // below says "if an account exists", so this can't be used to find
    // out who has an account. Errors here are rate limits or bad input.
    if (error) {
      setFormError(
        error.status === 429
          ? 'Too many attempts. Wait a minute and try again.'
          : 'Something went wrong. Check the email and try again.',
      )
      return
    }
    setSentTo(email)
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
              {sentTo ? 'Check your inbox' : 'Reset password'}
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              {sentTo ? 'Reset link sent' : 'Forgot your password?'}
            </h1>

            {sentTo ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                  If an account exists for <strong>{sentTo}</strong>, we&apos;ve emailed a link to
                  choose a new password. It expires in an hour.
                </p>
                <p className="mt-6 text-sm text-ink/60 dark:text-paper/60">
                  Wrong email?{' '}
                  <button
                    type="button"
                    onClick={() => setSentTo(null)}
                    className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
                  >
                    Try again
                  </button>
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                  Enter your email and we&apos;ll send you a link to set a new one.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                    icon={<Mail className="size-4" />}
                  />
                  {formError && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {formError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-11 w-full bg-navy text-paper hover:bg-navy-light disabled:opacity-70 dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
                  >
                    {submitting ? 'Sending…' : 'Send reset link'}
                  </Button>
                </form>
              </>
            )}

            <p className="mt-8 text-center text-sm text-ink/60 dark:text-paper/60">
              Remembered it?{' '}
              <Link
                href="/login"
                className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-ink/40 dark:text-paper/40 lg:text-left">
          {'©'} {new Date().getFullYear()} Renewly. All rights reserved.
        </p>
      </section>

      <AuthBrandPanel />
    </main>
  )
}
