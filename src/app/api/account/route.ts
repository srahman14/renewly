// app/api/account/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // your existing SSR client
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const admin = createAdminClient();

  const { data: members, error: membersError } = await admin
    .from("org_members")
    .select("user_id, role")
    .eq("org_id", profile.org_id);

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  const isOwner = members?.some((m) => m.user_id === user.id && m.role === "owner");
  const isSoleMember = (members?.length ?? 0) <= 1;

  if (isOwner && isSoleMember) {
    // Cascade: deleting the org takes org_members + contracts with it,
    // via the ON DELETE CASCADE foreign keys already on those tables.
    const { error: orgDeleteError } = await admin
      .from("orgs")
      .delete()
      .eq("id", profile.org_id);

    if (orgDeleteError) {
      return NextResponse.json({ error: orgDeleteError.message }, { status: 500 });
    }
  } else if (isOwner && !isSoleMember) {
    // Owner of a multi-person org — ownership transfer isn't designed yet.
    // Block rather than silently orphaning or nuking a team's org.
    return NextResponse.json(
      { error: "Transfer ownership to another member before deleting your account." },
      { status: 409 }
    );
  } else {
    // Regular member — remove their membership, org stays intact.
    const { error: membershipError } = await admin
      .from("org_members")
      .delete()
      .eq("org_id", profile.org_id)
      .eq("user_id", user.id);

    if (membershipError) {
      return NextResponse.json({ error: membershipError.message }, { status: 500 });
    }
  }

  // Deleting the auth user cascades to `profiles` (assumes profiles.id
  // references auth.users(id) on delete cascade — flagged below).
  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}