import { createClient } from "../supabase/client";

export type MemberRole = "owner" | "member";

export interface OrgMember {
  userId: string;
  fullName: string;
  role: MemberRole;
  joinedAt: string;
}

interface MemberRow {
  user_id: string;
  role: MemberRole;
  created_at: string;
}

// org.service.ts — add to existing file
export interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export async function fetchOrg(orgId: string): Promise<Org> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orgs")
    .select("id, name, created_at")
    .eq("id", orgId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

// Two queries, merged client-side — org_members and profiles both
// reference auth.users, but not each other, so PostgREST can't embed
// one inside the other. See fetchOrgMembers for the full explanation.
async function attachNames(memberRows: MemberRow[]): Promise<OrgMember[]> {
  if (memberRows.length === 0) return [];

  const supabase = createClient();
  const userIds = memberRows.map((m) => m.user_id);

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  if (profileError) throw profileError;

  const nameByUserId = new Map(
    (profileRows ?? []).map((p) => [p.id, p.full_name])
  );

  return memberRows.map((m) => ({
    userId: m.user_id,
    fullName: nameByUserId.get(m.user_id) ?? "Unknown",
    role: m.role,
    joinedAt: m.created_at,
  }));
}

export async function fetchOrgMembers(orgId: string): Promise<OrgMember[]> {
  const supabase = createClient();

  const { data: memberRows, error: memberError } = await supabase
    .from("org_members")
    .select("user_id, role, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  if (memberError) throw memberError;

  return attachNames((memberRows ?? []) as MemberRow[]);
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: MemberRole
): Promise<OrgMember> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("org_members")
    .update({ role })
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .select("user_id, role, created_at")
    .single();

  if (error) throw error;

  const [updated] = await attachNames([data as MemberRow]);
  return updated;
}

// Permission check for who can remove a member currently lives entirely
// in the RLS policy (owner-only). That's fine while roles are just
// owner/member. Once real roles & permissions land, this needs an
// explicit capability check here too (e.g. "can_remove_members"), not
// just a hardcoded owner assumption baked into one RLS policy — update
// both together, not just the policy, or the client and DB can disagree
// about who's allowed to do this.
export async function removeMember(orgId: string, userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("org_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) throw error;
}