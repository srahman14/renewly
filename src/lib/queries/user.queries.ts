import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/types";
import { fetchUserProfile, UpdateProfileInput, updateUserProfile } from "../services/user.service";

export function useUserProfileQuery(userId: string | null) {
  return useQuery<UserProfile>({
    queryKey: ["user-profile", userId],

    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required")
      }

      return fetchUserProfile(userId)
    },

    enabled: !!userId,

    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProfileMutation(userId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<UpdateProfileInput, "userId">) => {
      if (!userId) throw new Error("User ID is required");
      return updateUserProfile({ ...input, userId });
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["user-profile", userId], updatedProfile);
    },
  });
}