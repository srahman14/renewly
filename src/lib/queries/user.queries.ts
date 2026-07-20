import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@/types";
import { fetchUserProfile } from "../services/user.service";

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