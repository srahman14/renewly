export type MemberRole = "owner" | "admin" | "member";

export type Capability =
  | "viewContracts"
  | "manageContracts"
  | "inviteMembers"
  | "manageOrgSettings"
  | "deleteOrg";

const ROLE_RANK: Record<MemberRole, number> = {
  member: 0,
  admin: 1,
  owner: 2,
};

const CAPABILITY_ROLES: Record<Capability, MemberRole[]> = {
  viewContracts: ["owner", "admin", "member"],
  manageContracts: ["owner", "admin"],
  inviteMembers: ["owner", "admin"],
  manageOrgSettings: ["owner"],
  deleteOrg: ["owner"],
};

export function can(role: MemberRole | null | undefined, capability: Capability): boolean {
  if (!role) return false;
  return CAPABILITY_ROLES[capability].includes(role);
}

// Whether `actingRole` can change the role of a member currently at
// `targetRole`. Nobody can change their own role (owners must go
// through transferOwnership instead) — and neither role can act on a
// peer or above: admins can only touch members, owners can touch
// anyone except another owner (there's only ever one).
export function canChangeRole(
  actingRole: MemberRole | null | undefined,
  targetRole: MemberRole,
  isSelf: boolean
): boolean {
  if (!actingRole || isSelf) return false;
  if (actingRole === "owner") return targetRole !== "owner";
  if (actingRole === "admin") return targetRole === "member";
  return false;
}

// Same "never yourself, never at-or-above your rank" shape as
// canChangeRole, for removals.
export function canRemoveMember(
  actingRole: MemberRole | null | undefined,
  targetRole: MemberRole,
  isSelf: boolean
): boolean {
  if (!actingRole || isSelf) return false;
  if (actingRole === "owner") return targetRole !== "owner";
  if (actingRole === "admin") return targetRole === "member";
  return false;
}

// Ownership can only transfer to an existing admin — forces some
// vetting rather than handing the org to a brand-new member, and keeps
// the promotion path linear: member -> admin -> owner.
export function canReceiveOwnership(candidateRole: MemberRole): boolean {
  return candidateRole === "admin";
}

export const CAPABILITY_LABELS: Record<Capability, string> = {
  viewContracts: "View contracts",
  manageContracts: "Create, edit, delete & mute contracts",
  inviteMembers: "Invite new members",
  manageOrgSettings: "Manage organization settings",
  deleteOrg: "Delete the organization",
};

export const ALL_CAPABILITIES: Capability[] = [
  "viewContracts",
  "manageContracts",
  "inviteMembers",
  "manageOrgSettings",
  "deleteOrg",
];

export const ALL_ROLES: MemberRole[] = ["owner", "admin", "member"];

export { ROLE_RANK };