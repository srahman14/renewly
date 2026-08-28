"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useInvitePreviewQuery, useAcceptInviteMutation } from "@/lib/queries/invite.queries";

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const { token } = use(params);

  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: currentProfile } = useUserProfileQuery(userId);

  const { data: preview, isLoading, isError } = useInvitePreviewQuery(token);
  const acceptMutation = useAcceptInviteMutation();

  const [confirmLeave, setConfirmLeave] = useState(false);

  if (isLoading) {
    return <p>Loading invite…</p>;
  }

  if (isError || !preview?.valid) {
    return (
      <div>
        <h1>This invite isn't valid</h1>
        <p>
          {preview?.reason === "expired" && "This invite has expired."}
          {preview?.reason === "accepted" && "This invite has already been used."}
          {preview?.reason === "revoked" && "This invite was revoked."}
          {(!preview || preview.reason === "not_found") && "This invite link doesn't exist."}
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div>
        <h1>You've been invited to join {preview.orgName}</h1>
        <p>Invited by {preview.inviterName} as {preview.role}.</p>
        {/* Redirect through your existing sign-up/sign-in, carrying ?redirect=/invite/{token}
            so the person lands back here once authenticated. */}
        <a href={`/signup?redirect=/invite/${token}`}>Sign up to accept</a>
        <a href={`/login?redirect=/invite/${token}`}>Already have an account? Sign in</a>
      </div>
    );
  }

  const isSwitchingOrgs = currentProfile?.org_id && currentProfile.org_id !== preview.orgId;

  function handleAccept() {
    acceptMutation.mutate(token, {
      onSuccess: () => {
        router.push("/dashboard");
        router.refresh();
      },
    });
  }

  return (
    <div>
      <h1>Join {preview.orgName}</h1>
      <p>Invited by {preview.inviterName} as {preview.role}.</p>

      {isSwitchingOrgs && !confirmLeave && (
        <div className="rounded-md border border-amber/40 bg-amber/10 p-4">
          <p className="font-medium">You're currently part of another workspace.</p>
          <p className="text-sm">
            Joining {preview.orgName} will remove you from your current workspace.
            This can't be undone — if you're the only member there, that workspace
            and all its contracts will be permanently deleted.
          </p>
          <button onClick={() => setConfirmLeave(true)}>I understand, continue</button>
        </div>
      )}

      {(!isSwitchingOrgs || confirmLeave) && (
        <button onClick={handleAccept} disabled={acceptMutation.isPending}>
          {acceptMutation.isPending ? "Joining…" : `Accept and join ${preview.orgName}`}
        </button>
      )}

      {acceptMutation.isError && (
        <p className="text-sm text-red-600">{(acceptMutation.error as Error).message}</p>
      )}
    </div>
  );
}