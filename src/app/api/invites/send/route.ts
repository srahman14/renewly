import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const FROM_ADDRESS = "Renewal Radar <onboarding@resend.dev>";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: invite, error: inviteError } = await admin
    .from("invites")
    .select("id, org_id, email, role, token, status, invited_by")
    .eq("token", token)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.status !== "pending") {
    return NextResponse.json({ error: "This invite is no longer pending" }, { status: 409 });
  }

  const { data: membership } = await admin
    .from("org_members")
    .select("user_id")
    .eq("org_id", invite.org_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Not authorized to send this invite" }, { status: 403 });
  }

  const [{ data: org }, { data: inviter }] = await Promise.all([
    admin.from("orgs").select("name").eq("id", invite.org_id).single(),
    admin.from("profiles").select("full_name").eq("id", invite.invited_by).single(),
  ]);

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;
  const orgName = org?.name ?? "a workspace";
  const inviterName = inviter?.full_name ?? "A teammate";

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: invite.email,
      subject: `${inviterName} invited you to join ${orgName} on Renewal Radar`,
      html: renderInviteEmailHtml({ orgName, inviterName, role: invite.role, inviteUrl }),
    }),
  });

  if (!emailResponse.ok) {
    const body = await emailResponse.text();
    return NextResponse.json({ error: `Resend rejected the request: ${body}` }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}

function renderInviteEmailHtml({
  orgName,
  inviterName,
  role,
  inviteUrl,
}: {
  orgName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
}) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h1 style="font-size: 20px; color: #111827; margin: 0 0 12px;">You're invited to join ${orgName}</h1>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        ${inviterName} invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong> on Renewal Radar.
      </p>
      <a href="${inviteUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 22px; background: #1e293b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
        Accept invite
      </a>
      <p style="margin-top: 28px; font-size: 12px; color: #9ca3af; line-height: 1.5;">
        This invite expires in 7 days. If you weren't expecting this, you can safely ignore this email.
      </p>
    </div>
  `;
}