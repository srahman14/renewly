import { createClient } from "../supabase/client"
import type { UserProfile } from "@/types"

export async function fetchUserProfile(
    userId: string
): Promise<UserProfile> {
    const supabase = createClient() 

    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id, 
            org_id,
            full_name,
            account_type`)
        .eq("id", userId)
        .single()
    
    if (error) {
        throw error
    }

    return {
        id: data.id,
        org_id: data.org_id,
        full_name: data.full_name,
        account_type: data.account_type
    }
}