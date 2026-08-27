// lib/queries/contract.queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContracts,
  createContract,
  type CreateContractInput,
  UpdateContractInput,
  updateContract,
  deleteContract,
} from "@/lib/services/contract.service";
import type { Contract } from "@/types/index";

export const contractKeys = {
  all: (orgId: string | null) => ["contracts", orgId] as const,
};

export function useContractsQuery(orgId: string | null) {
  return useQuery({
    queryKey: contractKeys.all(orgId),

    queryFn: () => {
      if (!orgId) {
        throw new Error("Org ID is required");
      }
      return fetchContracts(orgId);
    },

    enabled: !!orgId,

    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateContractMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContractInput) => createContract(input),

    // Optimistic update — new contract shows up instantly, before the round trip
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: contractKeys.all(orgId) });

      const previous = queryClient.getQueryData<Contract[]>(
        contractKeys.all(orgId)
      );

      const optimisticContract: Contract = {
        id: `optimistic-${Date.now()}`,
        company: input.company,
        name: input.name,
        ownerIds: input.ownerIds,
        team: input.team ?? "",
        monthlySpend: input.monthlySpend,
        cycle: input.cycle,
        renewsOn: input.renewsOn,
        noticeDays: input.noticeDays,
        url: input.url,
        category: input.category ?? "",
        status: "active",
        muted: false,
        createdAt: new Date().toISOString(),
        deadline: "",
        daysLeft: 0,
      };

      queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) => [
        ...(old ?? []),
        optimisticContract,
      ]);

      return { previous };
    },

    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(contractKeys.all(orgId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all(orgId) });
    },
  });
}

export function useUpdateContractMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<UpdateContractInput, "orgId">) => {
      if (!orgId) throw new Error("Org ID is required");
      return updateContract({ ...input, orgId });
    },

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: contractKeys.all(orgId) });
      const previous = queryClient.getQueryData<Contract[]>(contractKeys.all(orgId));

      queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
        (old ?? []).map((c) => (c.id === input.id ? { ...c, ...input } : c))
      );

      return { previous };
    },

    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(contractKeys.all(orgId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all(orgId) });
    },
  });
}

export function useDeleteContractMutation(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!orgId) throw new Error("Org ID is required");
      return deleteContract(id, orgId);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: contractKeys.all(orgId) });
      const previous = queryClient.getQueryData<Contract[]>(contractKeys.all(orgId));

      queryClient.setQueryData<Contract[]>(contractKeys.all(orgId), (old) =>
        (old ?? []).filter((c) => c.id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(contractKeys.all(orgId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all(orgId) });
    },
  });
}