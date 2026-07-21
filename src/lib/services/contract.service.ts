// lib/services/contract.service.ts
import { createClient } from "@/lib/supabase/client";
import type { Contract, Cycle, Status } from "@/types/index";

interface ContractRow {
  id: string;
  org_id: string;
  company: string;
  name: string;
  owner: string;
  team: string | null;
  monthly_spend: number;
  cycle: Cycle;
  renews_on: string;
  notice_days: number;
  url: string | null;
  category: string | null;
  status: Status;
  muted: boolean;
  created_at: string;
}

function toContract(row: ContractRow): Contract {
  return {
    id: row.id,
    company: row.company,
    name: row.name,
    owner: row.owner,
    team: row.team ?? "",
    monthlySpend: row.monthly_spend,
    cycle: row.cycle,
    renewsOn: row.renews_on,
    noticeDays: row.notice_days,
    url: row.url ?? undefined,
    category: row.category ?? "",
    status: row.status,
    muted: row.muted,
    createdAt: row.created_at,
    // legacy fields — computed client-side, never persisted
    deadline: "",
    daysLeft: 0,
  };
}

export async function fetchContracts(orgId: string): Promise<Contract[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("org_id", orgId)
    .order("renews_on", { ascending: true });

  if (error) throw error;
  return (data as ContractRow[]).map(toContract);
}

export interface CreateContractInput {
  orgId: string;
  company: string;
  name: string;
  owner: string;
  team?: string;
  monthlySpend: number;
  cycle: Cycle;
  renewsOn: string;
  noticeDays: number;
  url?: string;
  category?: string;
}

export async function createContract(input: CreateContractInput): Promise<Contract> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      org_id: input.orgId,
      company: input.company,
      name: input.name,
      owner: input.owner,
      team: input.team ?? null,
      monthly_spend: input.monthlySpend,
      cycle: input.cycle,
      renews_on: input.renewsOn,
      notice_days: input.noticeDays,
      url: input.url ?? null,
      category: input.category ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return toContract(data as ContractRow);
}