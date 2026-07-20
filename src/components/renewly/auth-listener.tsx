'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth-store'

// Mount once in RootLayout. Keeps the Zustand store in sync with Supabase's
// auth events and reacts immediately to sign-out, rather than waiting for
// the next navigation to let middleware catch it.
export function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Hydrate the store with the current session on first mount.
    useAuthStore.getState().checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        session,
        isInitialized: true,
      })

      if (event === 'SIGNED_OUT') {
        router.replace('/')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}