'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Plus, X } from 'lucide-react'
import { TextField } from '@/components/renewly/form-field'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface OnboardingTeamProps {
  orgId: string
  initialOrgName: string
}

type Step = 'org' | 'invite'

export function OnboardingTeam({ orgId, initialOrgName }: OnboardingTeamProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('org')
  const [orgName, setOrgName] = useState(initialOrgName)
  const [inviteEmails, setInviteEmails] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOrgSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('orgName') ?? '').trim()

    if (!name) {
      setError('Give your workspace a name.')
      return
    }

    setError(null)
    setOrgName(name)
    setStep('invite')
  }

  async function finishOnboarding() {
    setError(null)
    setSubmitting(true)
    const supabase = createClient()

    const { error: orgError } = await supabase
      .from('orgs')
      .update({ name: orgName })
      .eq('id', orgId)

    if (orgError) {
      setSubmitting(false)
      setError(orgError.message)
      return
    }

    // Invite emails are placeholder-only for now — nothing is sent.
    // Wire this up to a real invites table + email flow when ready.

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
        <div className="mb-6 flex gap-1.5">
          <span className={`h-1 flex-1 rounded-full ${step === 'org' ? 'bg-teal' : 'bg-teal/40'}`} />
          <span
            className={`h-1 flex-1 rounded-full ${
              step === 'invite' ? 'bg-teal' : 'bg-line dark:bg-line-dark'
            }`}
          />
        </div>

        {step === 'org' ? (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal dark:text-teal-light">
              Step 1 of 2
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              Name your workspace
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              This is what your team will see. You can rename it anytime.
            </p>

            <form onSubmit={handleOrgSubmit} className="mt-8 space-y-5">
              <TextField
                label="Workspace name"
                type="text"
                name="orgName"
                defaultValue={initialOrgName}
                placeholder="Acme Inc."
                required
                icon={<Building2 className="size-4" />}
              />

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-navy text-paper hover:bg-navy-light dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
              >
                Continue
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal dark:text-teal-light">
              Step 2 of 2
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight">
              Invite your team
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              Optional — you can always invite people later from settings.
            </p>

            <div className="mt-8 space-y-3">
              {inviteEmails.map((email, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextField
                      label={index === 0 ? 'Teammate email' : ''}
                      type="email"
                      name={`invite-${index}`}
                      value={email}
                      onChange={(event) => {
                        const next = [...inviteEmails]
                        next[index] = event.target.value
                        setInviteEmails(next)
                      }}
                      placeholder="teammate@company.com"
                      icon={<Mail className="size-4" />}
                    />
                  </div>
                  {inviteEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setInviteEmails(inviteEmails.filter((_, i) => i !== index))}
                      className="mb-2.5 text-ink/40 hover:text-ink/70 dark:text-paper/40 dark:hover:text-paper/70"
                      aria-label="Remove teammate email"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setInviteEmails([...inviteEmails, ''])}
                className="flex items-center gap-1.5 text-sm font-medium text-teal hover:underline dark:text-teal-light"
              >
                <Plus className="size-3.5" />
                Add another
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={finishOnboarding}
                className="h-11 flex-1"
              >
                Skip for now
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={finishOnboarding}
                className="h-11 flex-1 bg-navy text-paper hover:bg-navy-light dark:bg-teal dark:text-ink dark:hover:bg-teal-light"
              >
                {submitting ? 'Finishing…' : 'Finish setup'}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}