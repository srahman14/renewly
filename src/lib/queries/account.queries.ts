import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../services/account.service";
import { createClient } from "../supabase/client";

export function useDeleteAccountMutation() {
    const router = useRouter(); 

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/");
        },
    });
}