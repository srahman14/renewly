import { createClient } from "../supabase/client";

export type InviteRole = "admin" | "member";
export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invite {
  id: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface InvitePreview {
  valid: boolean;
  reason?: "not_found" | "accepted" | "revoked" | "expired";
  orgId?: string;
  orgName?: string;
  role?: InviteRole;
  inviterName?: string;
  invitedEmail?: string;
  viewerCurrentOrgName?: string | null;
  viewerCurrentOrgWillBeDeleted?: boolean | null;
}

export async function fetchInvites(orgId: string): Promise<Invite[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invites")
    .select("id, email, role, status, token, expires_at, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    token: row.token,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

export interface CreateInviteInput {
  orgId: string;
  email: string;
  role: InviteRole;
  invitedBy: string;
}

export async function createInvite(input: CreateInviteInput): Promise<Invite> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invites")
    .insert({
      org_id: input.orgId,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      invited_by: input.invitedBy,
    })
    .select("id, email, role, status, token, expires_at, created_at")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    status: data.status,
    token: data.token,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
  };
}

export async function revokeInvite(inviteId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("invites")
    .update({ status: "revoked" })
    .eq("id", inviteId);

  if (error) throw error;
}

export async function getInvitePreview(token: string): Promise<InvitePreview> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_invite_preview", {
    invite_token: token,
  });

  if (error) throw error;

  return {
    valid: data.valid,
    reason: data.reason,
    orgId: data.org_id,
    orgName: data.org_name,
    role: data.role,
    inviterName: data.inviter_name,
    invitedEmail: data.invited_email,
    viewerCurrentOrgName: data.viewer_current_org_name,
    viewerCurrentOrgWillBeDeleted: data.viewer_current_org_will_be_deleted,
  };
}

export interface AcceptInviteResult {
  orgId: string;
  oldOrgDeleted: boolean;
}

export async function acceptInvite(token: string): Promise<AcceptInviteResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("accept_invite", {
    invite_token: token,
  });

  if (error) throw error;

  return { orgId: data.org_id, oldOrgDeleted: data.old_org_deleted };
}

// For Resend
export async function sendInviteEmail(token: string): Promise<void> {
  const response = await fetch("/api/invites/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to send invite email");
  }
}