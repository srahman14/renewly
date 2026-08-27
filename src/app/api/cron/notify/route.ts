// app/api/cron/notify/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

type DueContract = {
  contract_id: string
  org_id: string
  contract_name: string
  company: string
  notify_on: string
  owner_ids: string[]
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // service-role key: this needs to read across every org, which RLS would
  // otherwise block — justified per the API-route boundary rule
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data: due, error } = await supabase.rpc('get_contracts_due_for_notification')
  if (error) {
    console.error('cron query failed', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const dueContracts = (due ?? []) as DueContract[]
  console.log('DEBUG dueContracts:', JSON.stringify(dueContracts, null, 2))
  if (dueContracts.length === 0) {
    return NextResponse.json({ sent: 0, contractsNotified: 0 })
  }

  // group contracts by owner — a contract can have multiple owners (owner_ids is uuid[])
  const byUser = new Map<string, DueContract[]>()
  for (const contract of dueContracts) {
    for (const userId of contract.owner_ids ?? []) {
      byUser.set(userId, [...(byUser.get(userId) ?? []), contract])
    }
  }

  // resolve emails — reuse whatever your user/account queries layer already does;
  // this is the direct Supabase equivalent for a server context
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', Array.from(byUser.keys()))
  const emailByUserId = new Map(profiles?.map(p => [p.id, p.email]) ?? [])

  const logRows: { contract_id: string; org_id: string; notify_on: string }[] = []
  let emailsSent = 0

  for (const [userId, contracts] of byUser) {
    const email = emailByUserId.get(userId)
    if (!email) {
      console.warn(`no email found for user ${userId}, skipping`)
      continue
    }

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `${contracts.length} contract${contracts.length > 1 ? 's' : ''} need attention`,
        text: contracts
          .map(c => `${c.company} — ${c.contract_name} — cancel by ${c.notify_on}`)
          .join('\n'), // placeholder body, real template comes later
      })
      emailsSent++
      contracts.forEach(c =>
        logRows.push({ contract_id: c.contract_id, org_id: c.org_id, notify_on: c.notify_on })
      )
    } catch (err) {
      console.error(`failed sending to ${userId}`, err)
    }
  }

  if (logRows.length > 0) {
    const { error: logError } = await supabase
      .from('notifications_log')
      .upsert(logRows, { onConflict: 'contract_id,notify_on' })

    if (logError) {
      console.error('failed writing notifications_log', logError)
    }
  }

  return NextResponse.json({ sent: emailsSent, contractsNotified: logRows.length })
}