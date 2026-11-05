'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthBrandPanel } from '@/components/renewly/auth-brand-panel'
import { Logo } from '@/components/renewly/logo'
import { PasswordField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

// Reached from the reset email via /auth/confirm, which has already
// signed the user in with a short-lived recovery session. Without that
// session there's nothing to update, so show a "link expired" state.
export default function ResetPasswordPage() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setHasSession(!!data.user))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirm') ?? '')

    if (password.length < 8) {
      setFormError('Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setFormError("Passwords don't match.")
      return
    }

    setSubmitting(true)
    const { error } = await createClient().auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setFormError(error.message)
      return
    }
    router.push('/dashboard')
    router.refresh()
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
              Reset password
            </p>

            {hasSession === false ? (
              <>
                <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
                  This link has expired
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                  Reset links only work once and only for an hour. Request a new one.
                </p>
                <Link
                  href="/forgot-password"
                  className="mt-8 flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-paper hover:bg-navy-light dark:bg-teal dark:text-ink"
                >
                  Send a new link
                </Link>
              </>
            ) : (
              <>
                <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
                  Choose a new password
                </h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                  <PasswordField
                    label="New password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                  />
                  <PasswordField
                    label="Confirm new password"
                    name="confirm"
                    autoComplete="new-password"
                    placeholder="Same again"
                    required
                  />
                  {formError && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {formError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting || hasSession === null}
                    className="h-11 w-full bg-navy text-paper hover:bg-navy-light disabled:opacity-70 dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
                  >
                    {submitting ? 'Saving…' : 'Save new password'}
                  </Button>
                </form>
              </>
            )}
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
