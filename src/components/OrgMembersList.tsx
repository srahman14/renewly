// components/OrgMembersList.tsx
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
} from "@/lib/queries/org.queries";
import { MemberRole } from "@/lib/services/org.service";

interface OrgMembersListProps {
  orgId: string | null;
  currentUserId: string | null;
  currentUserRole: MemberRole | null;
}

export function OrgMembersList({ orgId, currentUserId, currentUserRole }: OrgMembersListProps) {
  const { data: members = [], isLoading, isError } = useOrgMembersQuery(orgId);
  const updateRoleMutation = useUpdateMemberRoleMutation(orgId);
  const removeMemberMutation = useRemoveMemberMutation(orgId);

  const isOwner = currentUserRole === "owner";

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
                className={
                  member.role === "owner"
                    ? "rounded-full bg-navy/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-navy"
                    : "rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-teal"
                }
              >
                {member.role}
              </span>

              {isOwner && !isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-md p-1.5 text-ink/40 transition hover:bg-paper hover:text-ink">
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        updateRoleMutation.mutate({
                          userId: member.userId,
                          role: member.role === "owner" ? "member" : "owner",
                        })
                      }
                    >
                      Make {member.role === "owner" ? "member" : "owner"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => removeMemberMutation.mutate(member.userId)}
                      className="text-red-600"
                    >
                      Remove from workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}