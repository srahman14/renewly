import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Receives the click from Supabase's confirmation email and finishes
// signing the user in, then sends them to wherever signUp()'s
// emailRedirectTo said they were trying to go (e.g. an invite link).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  // @supabase/ssr defaults to the PKCE flow, so the confirmation link
  // will normally carry `code`. `token_hash`/`type` is kept as a fallback
  // in case the Supabase email template is still on the legacy OTP format.
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // `next` is always a path this app generated itself in emailRedirectTo —
  // never taken from an untrusted external source — so redirecting to it
  // directly is safe.
  const next = searchParams.get('next') ?? '/onboarding'

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}