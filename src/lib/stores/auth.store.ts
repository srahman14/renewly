import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export type AccountType = 'individual' | 'team'

interface SignUpParams {
  email: string
  password: string
  fullName: string
  accountType: AccountType
  companyName?: string
  // Where to send the user after they click the email confirmation link —
  // e.g. "/invite/abc123" when they signed up from an invite. Falls back
  // to "/onboarding" for a normal signup.
  redirectTo?: string | null
}

interface AuthResult {
  success: boolean
  error?: string
  // True when signUp() succeeded but Supabase requires email confirmation
  // before a session exists. The caller must NOT treat this as "logged in".
  needsEmailConfirmation?: boolean
}

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  signUp: (params: SignUpParams) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  signUp: async ({ email, password, fullName, accountType, companyName, redirectTo }) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()

    const next = redirectTo ?? '/onboarding'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType,
          // Only relevant for team accounts — keep null for individuals
          // rather than an empty string, so it's easy to check downstream.
          company_name: accountType === 'team' ? companyName ?? null : null,
        },
        // Tells the confirmation email where to send the user back to.
        // Must be added to Supabase → Auth → URL Configuration → Redirect
        // URLs, or Supabase silently ignores it and falls back to Site URL.
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    })

    if (error) {
      set({ isLoading: false, error: error.message })
      return { success: false, error: error.message }
    }

    // When "Confirm email" is enabled, signUp() returns a user but
    // data.session is null — nobody is actually authenticated yet, no
    // cookies get set. Previously this code set `user` in the store
    // anyway, which made the UI believe someone was signed in when any
    // follow-up request (e.g. accepting an invite) would actually run
    // unauthenticated.
    if (!data.session) {
      set({ isLoading: false })
      return { success: true, needsEmailConfirmation: true }
    }

    set({ user: data.user, session: data.session, isLoading: false })
    return { success: true }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      set({ isLoading: false, error: error.message })
      return { success: false, error: error.message }
    }

    set({ user: data.user, session: data.session, isLoading: false })
    return { success: true }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()

    set({
      user: error ? null : data.session?.user ?? null,
      session: error ? null : data.session,
      isLoading: false,
      isInitialized: true,
    })
  },

  clearError: () => set({ error: null }),
}))