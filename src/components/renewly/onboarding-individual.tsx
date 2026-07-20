'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, ShieldCheck, Smartphone } from 'lucide-react'
import { TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface OnboardingIndividualProps {
  orgId: string
  initialOrgName: string
}

export function OnboardingIndividual({ orgId, initialOrgName }: OnboardingIndividualProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const workspaceName = String(formData.get('workspaceName') ?? '').trim() || initialOrgName
    // Phone, recovery email, and 2FA are placeholders only for now — not
    // persisted anywhere yet. Wire them up once those features exist.

    const supabase = createClient()

    const { error: orgError } = await supabase
      .from('orgs')
      .update({ name: workspaceName })
      .eq('id', orgId)

    if (orgError) {
      setSubmitting(false)
      setError(orgError.message)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true, onboarding_step: 'done' })
      .eq('id', user?.id ?? '')

    setSubmitting(false)

    if (profileError) {
      setError(profileError.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-6 py-10 text-ink dark:bg-ink dark:text-paper">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal dark:text-teal-light">
          Almost there
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
          Set up your workspace
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
          A few details to personalize things. Everything below except the
          name is optional and can be finished later.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <TextField
            label="Workspace name"
            type="text"
            name="workspaceName"
            defaultValue={initialOrgName}
            placeholder="My renewals"
            icon={<Building2 className="size-4" />}
          />

          <TextField
            label="Phone number"
            type="tel"
            name="phone"
            placeholder="+1 (555) 000-0000"
            icon={<Smartphone className="size-4" />}
            hint="For SMS renewal alerts — coming soon."
            disabled
          />

          <TextField
            label="Recovery email"
            type="email"
            name="recoveryEmail"
            placeholder="backup@email.com"
            icon={<Mail className="size-4" />}
            hint="Coming soon."
            disabled
          />

          <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3 dark:border-line-dark">
            <div className="flex items-center gap-2.5 text-sm">
              <ShieldCheck className="size-4 text-ink/40 dark:text-paper/40" />
              <span>Two-factor authentication</span>
            </div>
            <Button type="button" variant="outline" size="sm" disabled>
              Coming soon
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full bg-navy text-paper hover:bg-navy-light disabled:opacity-70 dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
          >
            {submitting ? 'Saving…' : 'Go to dashboard'}
          </Button>
        </form>
      </div>
    </main>
  )
}