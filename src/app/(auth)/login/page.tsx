'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthBrandPanel } from '@/components/renewly/auth-brand-panel'
import { Logo } from '@/components/renewly/logo'
import { PasswordField, TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const signIn = useAuthStore((state) => state.signIn)

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)

    if (!result.success) {
      setFormError(result.error ?? 'Invalid email or password.')
      return
    }

    router.push('/dashboard')
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
              Welcome back
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              Sign in to Renewly
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              Pick up where you left off — check what's renewing soon.
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

              <PasswordField
                label="Password"
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                required
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
                >
                  Forgot password?
                </Link>
              </div>

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
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-ink/60 dark:text-paper/60">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-teal underline-offset-4 hover:underline dark:text-teal-light"
              >
                Sign up
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