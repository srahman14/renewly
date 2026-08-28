// components/OwnerMultiSelect.tsx
"use client";

import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useOrgMembersQuery } from "@/lib/queries/org.queries";
import { initialsFromName } from "@/lib/utils/name";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface OwnerMultiSelectProps {
  value: string[]; // selected userIds
  onChange: (userIds: string[]) => void;
}

export function OwnerMultiSelect({ value, onChange }: OwnerMultiSelectProps) {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: profile } = useUserProfileQuery(userId);
  const orgId = profile?.org_id ?? null;

  const { data: members = [], isLoading } = useOrgMembersQuery(orgId);

  const selectedMembers = useMemo(
    () => members.filter((m) => value.includes(m.userId)),
    [members, value]
  );

  function toggleMember(memberId: string) {
    onChange(
      value.includes(memberId)
        ? value.filter((id) => id !== memberId)
        : [...value, memberId]
    );
  }

  const visibleSelected = selectedMembers.slice(0, 2);
  const overflowCount = selectedMembers.length - visibleSelected.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left">
          {selectedMembers.length === 0 ? (
            <span className="text-sm text-ink/40">Select owner/s *</span>
          ) : (
            <div className="flex items-center gap-2 overflow-hidden">
              {visibleSelected.map((member) => (
                <div key={member.userId} className="flex shrink-0 items-center gap-1.5">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-navy font-display text-[10px] font-semibold text-paper">
                      {initialsFromName(member.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm text-ink">{member.fullName}</span>
                </div>
              ))}
              {overflowCount > 0 && (
                <span className="shrink-0 text-sm text-ink/50">+{overflowCount}</span>
              )}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {isLoading ? (
          <div className="px-3 py-2 text-sm text-ink/40">Loading members…</div>
        ) : members.length === 0 ? (
          <div className="px-3 py-2 text-sm text-ink/40">No members found</div>
        ) : (
          members.map((member) => {
            const isSelected = value.includes(member.userId);
            return (
              <DropdownMenuCheckboxItem
                key={member.userId}
                checked={isSelected}
                onCheckedChange={() => toggleMember(member.userId)}
                className="flex items-center gap-2"
              >
                {/* <Avatar className="size-6">
                  <AvatarFallback className="bg-navy font-display text-[10px] font-semibold text-paper">
                    {initialsFromName(member.fullName)}
                  </AvatarFallback>
                </Avatar> */}
                <span className="truncate text-sm">{member.fullName}</span>
              </DropdownMenuCheckboxItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}