import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrgMembers,
  updateMemberRole,
  removeMember,
  type MemberRole,
  type OrgMember,
  fetchOrg,
  fetchMemberRole,
} from "@/lib/services/org.service";

export const orgKeys = {
  members: (orgId: string | null) => ["org-members", orgId] as const,
  detail: (orgId: string | null) => ["org", orgId] as const,
  memberRole: (orgId: string | null, userId: string | null) =>
    ["org-member-role", orgId, userId] as const,
};

export function useOrgQuery(orgId: string | null) {
  return useQuery({
    queryKey: orgKeys.detail(orgId),
    queryFn: () => {
      if (!orgId) throw new Error("Org ID is required");
      return fetchOrg(orgId);
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrgMembersQuery(orgId: string | null) {
  return useQuery({
    queryKey: orgKeys.members(orgId),

    queryFn: () => {
      if (!orgId) throw new Error("Org ID is required");
      return fetchOrgMembers(orgId);
    },

    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}

// Current user's role in their org — used to gate write actions
// client-side (RLS enforces the real boundary server-side).
export function useCurrentMemberRoleQuery(orgId: string | null, userId: string | null) {
  return useQuery({
    queryKey: orgKeys.memberRole(orgId, userId),

    queryFn: () => {
      if (!orgId || !userId) throw new Error("Org ID and user ID are required");
      return fetchMemberRole(orgId, userId);
    },

    enabled: !!orgId && !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateMemberRoleMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) => {
      if (!orgId) throw new Error("Org ID is required");
      return updateMemberRole(orgId, userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
    },
  });
}

export function useRemoveMemberMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!orgId) throw new Error("Org ID is required");
      return removeMember(orgId, userId);
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: orgKeys.members(orgId) });
      const previous = queryClient.getQueryData<OrgMember[]>(orgKeys.members(orgId));

      queryClient.setQueryData<OrgMember[]>(orgKeys.members(orgId), (old) =>
        (old ?? []).filter((m) => m.userId !== userId)
      );

      return { previous };
    },

    onError: (_err, _userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orgKeys.members(orgId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
    },
  });
}