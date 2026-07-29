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

export interface UpdateContractInput {
  id: string;
  orgId: string;
  company?: string;
  name?: string;
  owner?: string;
  team?: string;
  monthlySpend?: number;
  cycle?: Cycle;
  renewsOn?: string;
  noticeDays?: number;
  url?: string;
  category?: string;
  status?: Status;
  muted?: boolean;
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

export async function updateContract(input: UpdateContractInput): Promise<Contract> {
  const supabase = createClient();
  const { id, orgId, ...rest } = input;

  // Only include fields that were actually passed, so a partial update
  // (e.g. just { muted: true }) doesn't overwrite other columns with undefined.
  const payload: Record<string, unknown> = {};
  if (rest.company !== undefined) payload.company = rest.company;
  if (rest.name !== undefined) payload.name = rest.name;
  if (rest.owner !== undefined) payload.owner = rest.owner;
  if (rest.team !== undefined) payload.team = rest.team;
  if (rest.monthlySpend !== undefined) payload.monthly_spend = rest.monthlySpend;
  if (rest.cycle !== undefined) payload.cycle = rest.cycle;
  if (rest.renewsOn !== undefined) payload.renews_on = rest.renewsOn;
  if (rest.noticeDays !== undefined) payload.notice_days = rest.noticeDays;
  if (rest.url !== undefined) payload.url = rest.url;
  if (rest.category !== undefined) payload.category = rest.category;
  if (rest.status !== undefined) payload.status = rest.status;
  if (rest.muted !== undefined) payload.muted = rest.muted;

  const { data, error } = await supabase
    .from("contracts")
    .update(payload)
    .eq("id", id)
    .eq("org_id", orgId) // defense in depth alongside RLS — not load-bearing, but cheap
    .select()
    .single();

  if (error) throw error;
  return toContract(data as ContractRow);
}

export async function deleteContract(id: string, orgId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id)
    .eq("org_id", orgId);

  if (error) throw error;
}