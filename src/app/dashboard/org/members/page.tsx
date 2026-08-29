"use client";

import { UserPlus, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useOrgQuery, useOrgMembersQuery } from "@/lib/queries/org.queries";
import { useInvitesQuery } from "@/lib/queries/invite.queries";
import { OrgMembersList } from "@/components/OrgMembersList";
import { InviteMemberForm } from "@/components/InviteMemberForm";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { formatRelativeTime } from "@/lib/utils/time";
import { can } from "@/lib/permissions";

export default function OrgMembersPage() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: profile } = useUserProfileQuery(userId);
  const orgId = profile?.org_id ?? null;

  const { data: org } = useOrgQuery(orgId);
  const { data: members = [] } = useOrgMembersQuery(orgId);
  const { data: invites = [] } = useInvitesQuery(orgId);

  const currentMember = members.find((m) => m.userId === userId);
  // inviteMembers is an owner+admin capability (see permissions.ts) — this
  // used to be a literal `=== "owner"` check, which hid the invite form
  // from admins even though they're allowed to invite. can() is the same
  // helper the rest of the app uses for this capability, so this page
  // stays consistent with contracts/renewals/dashboard.
  const canInvite = can(currentMember?.role ?? null, "inviteMembers");

  const owners = members.filter((m) => m.role === "owner").length;
  const admins = members.filter((m) => m.role === "admin").length;
  const pendingInvites = invites.filter((i) => i.status === "pending");

  // Real events, not mocked — every member join and invite sent, merged
  // and sorted. There's no dedicated activity_log table yet, so this is
  // a preview of what a proper feed would look like (role changes and
  // removals would join this list once there's somewhere to record them).
  const activity = [
    ...members.map((m) => ({
      type: "joined" as const,
      label: `${m.fullName} joined`,
      timestamp: m.joinedAt,
    })),
    ...invites.map((i) => ({
      type: "invited" as const,
      label: `Invited ${i.email} as ${i.role}`,
      timestamp: i.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="w-full px-8 py-10 lg:px-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
            Organization
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {org?.name ?? "Members"}
          </h1>
          <p className="mt-2 font-body text-[15px] leading-relaxed text-ink/60">
            {members.length} member{members.length === 1 ? "" : "s"}
            {pendingInvites.length > 0 &&
              ` · ${pendingInvites.length} pending invite${pendingInvites.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Members" value={members.length} />
        <StatCard label="Owners" value={owners} />
        <StatCard label="Admins" value={admins} />
        <StatCard label="Pending invites" value={pendingInvites.length} />
        <StatCard
          label="Created"
          value={
            org
              ? new Date(org.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-8">
          <SectionCard
            title="Members"
            description="Everyone with access to this workspace."
          >
            {/* OrgMembersList now renders pending invites itself (sorted
                Owner -> Admin -> Member -> Pending, revoke gated on
                inviteMembers), so they're no longer duplicated in the
                sidebar below. */}
            <OrgMembersList
              orgId={orgId}
              currentUserId={userId}
              currentUserRole={currentMember?.role ?? null}
            />
          </SectionCard>

          <SectionCard
            title="Recent activity"
            description="A preview — full activity history is coming later."
          >
            {activity.length === 0 ? (
              <p className="py-4 text-center font-mono text-sm text-ink/40">
                Nothing to show yet.
              </p>
            ) : (
              <ul className="-mx-5 divide-y divide-line">
                {activity.map((event, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-paper">
                      {event.type === "joined" ? (
                        <UserPlus className="size-4 text-navy" />
                      ) : (
                        <Mail className="size-4 text-teal" />
                      )}
                    </div>
                    <p className="flex-1 font-body text-sm text-ink">
                      {event.label}
                    </p>
                    <p className="font-mono text-xs text-ink/40">
                      {formatRelativeTime(event.timestamp)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="flex flex-col gap-8">
          {canInvite && (
            <SectionCard
              title="Invite someone"
              description="They'll get a link to join."
            >
              <InviteMemberForm />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}