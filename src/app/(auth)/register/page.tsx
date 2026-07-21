'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Mail, User, Users } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthBrandPanel } from '@/components/renewly/auth-brand-panel'
import { Logo } from '@/components/renewly/logo'
import { PasswordField, TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { useAuthStore, type AccountType } from '@/lib/stores/auth.store'

const COPY: Record<AccountType, { eyebrow: string; heading: string; subtext: string; cta: string }> = {
  individual: {
    eyebrow: 'Start free',
    heading: 'Create your account',
    subtext: 'Track your own renewals and never miss a cancellation window. No card required.',
    cta: 'Create account',
  },
  team: {
    eyebrow: 'Start free',
    heading: 'Create your workspace',
    subtext: "Set up your team's renewal radar in under two minutes. No card required.",
    cta: 'Create workspace',
  },
}

export default function RegisterPage() {
  const router = useRouter()
  const signUp = useAuthStore((state) => state.signUp)

  const [accountType, setAccountType] = useState<AccountType>('individual')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const copy = COPY[accountType]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const companyName = String(formData.get('company') ?? '').trim()

    if (accountType === 'team' && !companyName) {
      setFormError('Company name is required for a team workspace.')
      return
    }

    setSubmitting(true)
    const result = await signUp({
      email,
      password,
      fullName,
      accountType,
      companyName: accountType === 'team' ? companyName : undefined,
    })
    setSubmitting(false)

    if (!result.success) {
      setFormError(result.error ?? 'Something went wrong. Please try again.')
      return
    }

   router.push('/onboarding')
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
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              {copy.heading}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              {copy.subtext}
            </p>

            {/* Account type toggle */}
            <div
              role="radiogroup"
              aria-label="Account type"
              className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-line bg-line/10 p-1 dark:border-line-dark dark:bg-line-dark/10"
            >
              <button
                type="button"
                role="radio"
                aria-checked={accountType === 'individual'}
                onClick={() => setAccountType('individual')}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  accountType === 'individual'
                    ? 'bg-paper text-ink shadow-sm dark:bg-ink dark:text-paper'
                    : 'text-ink/50 hover:text-ink/80 dark:text-paper/50 dark:hover:text-paper/80'
                }`}
              >
                <User className="size-4" />
                Individual
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={accountType === 'team'}
                onClick={() => setAccountType('team')}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  accountType === 'team'
                    ? 'bg-paper text-ink shadow-sm dark:bg-ink dark:text-paper'
                    : 'text-ink/50 hover:text-ink/80 dark:text-paper/50 dark:hover:text-paper/80'
                }`}
              >
                <Users className="size-4" />
                Team
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
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

              {accountType === 'team' && (
                <TextField
                  label="Company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  placeholder="Acme Inc."
                  required
                  icon={<Building2 className="size-4" />}
                />
              )}

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
                {submitting ? 'Creating…' : copy.cta}
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