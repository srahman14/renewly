/**user.store.ts -> this is related to user-related application data */

import { create } from "zustand"
import { useAuthStore } from "./auth.store"

type UserProfile = {
    id: string
    org_id: string
    full_name: string
    account_type: string   
}

type UserState = {
    profile: UserProfile | null
    isLoading: boolean

    fetchProfile: (userId: string) => Promise<void>
    updateProfile: (userId: string, profile: UserProfile) => Promise<void>
    deleteProfile: (userId: string) => Promise<void>
}

const useUserStore = create<UserState>((set) => ({
    profile: null,
    isLoading: false,

    fetchProfile: async (userId) => {
        const user = useAuthStore((state) => state.checkAuth)

        // User is not authenticated
        if (!user) {
            return
        }

        // Call fetchProfile service
    },

    updateProfile: async (userId, newProfile) => {
        console.log("Fetching new profile")
    },

    deleteProfile: async (userId) => {
        console.log("Deleting profile")
    }
}))


