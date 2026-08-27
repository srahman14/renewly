import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvites,
  createInvite,
  revokeInvite,
  getInvitePreview,
  acceptInvite,
  type CreateInviteInput,
} from "@/lib/services/invite.service";

export const inviteKeys = {
  all: (orgId: string | null) => ["invites", orgId] as const,
  preview: (token: string | null) => ["invite-preview", token] as const,
};

export function useInvitesQuery(orgId: string | null) {
  return useQuery({
    queryKey: inviteKeys.all(orgId),
    queryFn: () => {
      if (!orgId) throw new Error("Org ID is required");
      return fetchInvites(orgId);
    },
    enabled: !!orgId,
    staleTime: 1000 * 60,
  });
}

export function useCreateInviteMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateInviteInput, "orgId">) => {
      if (!orgId) throw new Error("Org ID is required");
      return createInvite({ ...input, orgId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.all(orgId) });
    },
  });
}

export function useRevokeInviteMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => revokeInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.all(orgId) });
    },
  });
}

export function useInvitePreviewQuery(token: string | null) {
  return useQuery({
    queryKey: inviteKeys.preview(token),
    queryFn: () => {
      if (!token) throw new Error("Token is required");
      return getInvitePreview(token);
    },
    enabled: !!token,
    retry: false, // an invalid/expired token isn't a transient failure — don't retry it
  });
}

export function useAcceptInviteMutation() {
  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    // No cache invalidation here on purpose — org_id just changed entirely,
    // so the caller should redirect + let every query naturally refetch
    // against the new orgId, rather than trying to invalidate the old one.
  });
}