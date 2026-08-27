import { createClient } from "../supabase/client"
import type { UserProfile } from "@/types"

export interface UpdateProfileInput {
  userId: string;
  fullName?: string;
  accountType?: "individual" | "team";
}

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
      account_type,
      email`)
    .eq("id", userId)
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    org_id: data.org_id,
    full_name: data.full_name,
    account_type: data.account_type,
    email: data.email,
  }
}

export async function updateUserProfile(input: UpdateProfileInput): Promise<UserProfile> {
  const supabase = createClient();
  const { userId, ...rest } = input;

  const payload: Record<string, unknown> = {};
  if (rest.fullName !== undefined) payload.full_name = rest.fullName;
  if (rest.accountType !== undefined) payload.account_type = rest.accountType;

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("id, org_id, full_name, account_type, email")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    org_id: data.org_id,
    full_name: data.full_name,
    account_type: data.account_type,
    email: data.email,
  };
}