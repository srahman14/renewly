"use client";

import { ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useOrgMembersQuery } from "@/lib/queries/org.queries";
import { SectionCard } from "@/components/SectionCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initialsFromName } from "@/lib/utils/name";
import {
  ALL_CAPABILITIES,
  ALL_ROLES,
  CAPABILITY_LABELS,
  can,
  type MemberRole,
} from "@/lib/permissions";

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const ROLE_DESCRIPTIONS: Record<MemberRole, string> = {
  owner:
    "Full control, including managing admins and org settings. Can't demote themselves — must transfer ownership to an admin instead.",
  admin:
    "Day-to-day management: contracts, invites, and members — but can't touch other admins or the owner.",
  member: "Can view contracts and org info, but can't change them.",
};

export default function RolesPermissionsPage() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: profile } = useUserProfileQuery(userId);
  const orgId = profile?.org_id ?? null;

  const { data: members = [] } = useOrgMembersQuery(orgId);

  const membersByRole: Record<MemberRole, typeof members> = {
    owner: members.filter((m) => m.role === "owner"),
    admin: members.filter((m) => m.role === "admin"),
    member: members.filter((m) => m.role === "member"),
  };

  return (
    <div className="w-full px-8 py-10 lg:px-12">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
          Organization
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Roles &amp; Permissions
        </h1>
        <p className="mt-2 max-w-2xl font-body text-[15px] leading-relaxed text-ink/60">
          To change someone&apos;s role or remove them, use the{" "}
          <a href="/dashboard/org/members" className="underline hover:text-ink">
            Members
          </a>{" "}
          page.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {ALL_ROLES.map((role, i) => (
          <div key={role} className="flex items-center gap-3">
            <span className="rounded-full border border-line bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] text-ink">
              {ROLE_LABELS[role]}
            </span>
            {i < ALL_ROLES.length - 1 && <ArrowRight className="size-4 text-ink/30" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {ALL_ROLES.map((role) => {
          const roleMembers = membersByRole[role];

          return (
            <SectionCard
              key={role}
              title={ROLE_LABELS[role]}
              description={`${roleMembers.length} member${roleMembers.length === 1 ? "" : "s"}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-navy/10">
                  <ShieldCheck className="size-4 text-navy" />
                </div>
                <p className="font-body text-sm leading-relaxed text-ink/70">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>

              {roleMembers.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
                  {roleMembers.map((member) => (
                    <li key={member.userId} className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-navy font-display text-xs font-semibold text-paper">
                          {initialsFromName(member.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-body text-sm text-ink">
                        {member.fullName}
                        {member.userId === userId && (
                          <span className="ml-1.5 font-body text-xs text-ink/40">(you)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          );
        })}
      </div>

      <div className="mt-8">
        <SectionCard title="Capabilities" description="What each role can do, at a glance.">
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-5 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.05em] text-ink/45">
                    Capability
                  </th>
                  {ALL_ROLES.map((role) => (
                    <th
                      key={role}
                      className="px-5 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.05em] text-ink/45"
                    >
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ALL_CAPABILITIES.map((capability) => (
                  <tr key={capability}>
                    <td className="px-5 py-3 font-body text-sm text-ink">
                      {CAPABILITY_LABELS[capability]}
                    </td>
                    {ALL_ROLES.map((role) => (
                      <td key={role} className="px-5 py-3 text-center">
                        {can(role, capability) ? (
                          <Check className="mx-auto size-4 text-teal" />
                        ) : (
                          <X className="mx-auto size-4 text-ink/20" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-body text-xs leading-relaxed text-ink/45">
            Changing roles and removing members follow a hierarchy rather than a flat
            per-role rule: admins can only act on members, owners can act on anyone
            except another owner, and nobody can change their own role — see the
            Members page for who can do what to whom.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}