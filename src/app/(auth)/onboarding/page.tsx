import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingIndividual } from '@/components/renewly/onboarding-individual'
import { OnboardingTeam } from '@/components/renewly/onboarding-team'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('account_type, onboarding_completed, org_id')
    .eq('id', user.id)
    .single()

  // Defensive: the trigger should always have created this row, but if it
  // somehow hasn't, send them back rather than rendering a broken form.
  if (!profile) {
    redirect('/')
  }

  if (profile.onboarding_completed) {
    redirect('/dashboard')
  }

  const { data: org } = await supabase
    .from('orgs')
    .select('name')
    .eq('id', profile.org_id)
    .single()

  if (profile.account_type === 'team') {
    return <OnboardingTeam orgId={profile.org_id} initialOrgName={org?.name ?? ''} />
  }

  return <OnboardingIndividual orgId={profile.org_id} initialOrgName={org?.name ?? ''} />
}