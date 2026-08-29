import { createClient } from "../supabase/client";
import {
  can,
  canChangeRole,
  canRemoveMember,
  canReceiveOwnership,
  ROLE_RANK,
  type MemberRole,
} from "@/lib/permissions";

export type { MemberRole };

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

  const members = await attachNames((memberRows ?? []) as MemberRow[]);

  // Sort by role rank (Owner -> Admin -> Member). Array.prototype.sort is
  // stable in modern JS engines, and the underlying query above is already
  // ordered by created_at ascending, so join-date order is preserved
  // within each role tier "for free" rather than needing a secondary
  // sort key here.
  return [...members].sort((a, b) => ROLE_RANK[b.role] - ROLE_RANK[a.role]);
}

// Requires the current (pre-change) role of the target member so the
// hierarchy check has something to compare against. Direct promotion
// to "owner" is always rejected here — that can only happen through
// transferOwnership, which does an atomic swap rather than a bare
// role update.
export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: MemberRole,
  actingRole: MemberRole | null,
  actingUserId: string | null,
  currentTargetRole: MemberRole
): Promise<OrgMember> {
  const isSelf = !!actingUserId && actingUserId === userId;

  if (role === "owner") {
    throw new Error(
      "Ownership can't be assigned directly — use transfer ownership instead."
    );
  }

  if (!canChangeRole(actingRole, currentTargetRole, isSelf)) {
    throw new Error(
      isSelf
        ? "You can't change your own role. Transfer ownership instead if you want to step down."
        : "You don't have permission to change this member's role."
    );
  }

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

// Requires the target's current role for the same hierarchy check. Calls
// the remove_org_member Postgres function (security-definer) so the
// membership delete and the profiles.org_id clear happen atomically in
// one transaction — previously this did a raw .delete() on org_members
// only, which left profiles.org_id pointing at the old org after removal.
// The client-side check here is still fast-fail UX; the DB function
// re-verifies the same hierarchy rules itself as the real enforcement.
export async function removeMember(
  orgId: string,
  userId: string,
  actingRole: MemberRole | null,
  actingUserId: string | null,
  targetRole: MemberRole
): Promise<void> {
  const isSelf = !!actingUserId && actingUserId === userId;

  if (!canRemoveMember(actingRole, targetRole, isSelf)) {
    throw new Error(
      isSelf
        ? "You can't remove yourself this way."
        : "You don't have permission to remove this member."
    );
  }

  const supabase = createClient();

  const { error } = await supabase.rpc("remove_org_member", {
    p_org_id: orgId,
    p_user_id: userId,
  });

  if (error) throw error;
}

// The only way an owner can give up ownership. Calls a Postgres
// function (transfer_ownership) that flips the caller to admin and the
// target to owner in a single transaction, so the org is never briefly
// left without an owner or with two owners, even on partial failure.
// The client-side checks here are just fast-fail UX — the DB function
// re-verifies both conditions itself as the real enforcement.
export async function transferOwnership(
  orgId: string,
  newOwnerUserId: string,
  actingRole: MemberRole | null,
  newOwnerCurrentRole: MemberRole
): Promise<void> {
  if (actingRole !== "owner") {
    throw new Error("Only the current owner can transfer ownership.");
  }

  if (!canReceiveOwnership(newOwnerCurrentRole)) {
    throw new Error("Ownership can only be transferred to an existing admin.");
  }

  const supabase = createClient();

  const { error } = await supabase.rpc("transfer_ownership", {
    p_org_id: orgId,
    p_new_owner_id: newOwnerUserId,
  });

  if (error) throw error;
}

export async function fetchMemberRole(orgId: string, userId: string): Promise<MemberRole> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data.role as MemberRole;
}