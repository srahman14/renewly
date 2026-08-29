"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initialsFromName } from "@/lib/utils/name";
import {
  useOrgMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useTransferOwnershipMutation,
} from "@/lib/queries/org.queries";
import { useInvitesQuery, useRevokeInviteMutation } from "@/lib/queries/invite.queries";
import {
  can,
  canChangeRole,
  canRemoveMember,
  canReceiveOwnership,
  type MemberRole,
} from "@/lib/permissions";

interface OrgMembersListProps {
  orgId: string | null;
  currentUserId: string | null;
  currentUserRole: MemberRole | null;
}

const ROLE_BADGE_CLASS: Record<MemberRole, string> = {
  owner: "bg-navy/10 text-navy",
  admin: "bg-amber/20 text-amber-dark",
  member: "bg-teal/10 text-teal",
};

export function OrgMembersList({ orgId, currentUserId, currentUserRole }: OrgMembersListProps) {
  const { data: members = [], isLoading, isError } = useOrgMembersQuery(orgId);
  const updateRoleMutation = useUpdateMemberRoleMutation(orgId);
  const removeMemberMutation = useRemoveMemberMutation(orgId);
  const transferOwnershipMutation = useTransferOwnershipMutation(orgId);

  const { data: invites = [] } = useInvitesQuery(orgId);
  const revokeInviteMutation = useRevokeInviteMutation(orgId);
  const pendingInvites = invites.filter((invite) => invite.status === "pending");
  const canManageInvites = can(currentUserRole, "inviteMembers");

  if (isLoading) {
    return <p className="py-6 text-center font-mono text-sm text-ink/40">Loading members…</p>;
  }

  if (isError) {
    return <p className="py-6 text-center font-mono text-sm text-ink/40">Couldn't load members.</p>;
  }

  return (
    <ul className="-mx-5 divide-y divide-line">
      {members.map((member) => {
        const isSelf = member.userId === currentUserId;
        const canChangeThisRole = canChangeRole(currentUserRole, member.role, isSelf);
        const canRemoveThis = canRemoveMember(currentUserRole, member.role, isSelf);
        const canTransferToThis =
          currentUserRole === "owner" && !isSelf && canReceiveOwnership(member.role);
        const showMenu = canChangeThisRole || canRemoveThis || canTransferToThis;

        return (
          <li
            key={member.userId}
            className="flex items-center justify-between px-5 py-3.5 transition hover:bg-paper/60"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-navy font-display text-sm font-semibold text-paper">
                  {initialsFromName(member.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-body text-sm font-medium text-ink">
                  {member.fullName}
                  {isSelf && <span className="ml-1.5 font-body text-xs text-ink/40">(you)</span>}
                </p>
                <p className="mt-0.5 font-mono text-xs text-ink/40">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.05em] ${ROLE_BADGE_CLASS[member.role]}`}
              >
                {member.role}
              </span>

              {showMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-md p-1.5 text-ink/40 transition hover:bg-paper hover:text-ink">
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canChangeThisRole && member.role === "member" && (
                      <DropdownMenuItem
                        onClick={() =>
                          updateRoleMutation.mutate({
                            userId: member.userId,
                            role: "admin",
                            actingRole: currentUserRole,
                            actingUserId: currentUserId,
                            currentTargetRole: member.role,
                          })
                        }
                      >
                        Make admin
                      </DropdownMenuItem>
                    )}
                    {canChangeThisRole && member.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() =>
                          updateRoleMutation.mutate({
                            userId: member.userId,
                            role: "member",
                            actingRole: currentUserRole,
                            actingUserId: currentUserId,
                            currentTargetRole: member.role,
                          })
                        }
                      >
                        Make member
                      </DropdownMenuItem>
                    )}
                    {canTransferToThis && (
                      <DropdownMenuItem
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Transfer ownership to ${member.fullName}? You'll become an admin and can't undo this yourself — the new owner would need to transfer it back.`
                          );
                          if (!confirmed) return;
                          transferOwnershipMutation.mutate({
                            newOwnerUserId: member.userId,
                            actingRole: currentUserRole,
                            newOwnerCurrentRole: member.role,
                          });
                        }}
                      >
                        Transfer ownership to {member.fullName.split(" ")[0]}
                      </DropdownMenuItem>
                    )}
                    {canRemoveThis && (
                      <DropdownMenuItem
                        onClick={() =>
                          removeMemberMutation.mutate({
                            userId: member.userId,
                            actingRole: currentUserRole,
                            actingUserId: currentUserId,
                            targetRole: member.role,
                          })
                        }
                        className="text-red-600"
                      >
                        Remove from workspace
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </li>
        );
      })}

      {pendingInvites.map((invite) => (
        <li
          key={invite.id}
          className="flex items-center justify-between px-5 py-3.5 opacity-70 transition hover:bg-paper/60 hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-ink/10 font-display text-sm font-semibold text-ink/50">
                {initialsFromName(invite.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-body text-sm font-medium text-ink">{invite.email}</p>
              <p className="mt-0.5 font-mono text-xs text-ink/40">
                Invited {new Date(invite.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink/50">
              Pending · {invite.role}
            </span>

            {canManageInvites && (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-md p-1.5 text-ink/40 transition hover:bg-paper hover:text-ink">
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => revokeInviteMutation.mutate(invite.id)}
                    className="text-red-600"
                  >
                    Revoke invite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}