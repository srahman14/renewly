"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import {
  useInvitePreviewQuery,
  useAcceptInviteMutation,
} from "@/lib/queries/invite.queries";
import { initialsFromName } from "@/lib/utils/name";
import Link from "next/link";

const REASON_COPY: Record<string, string> = {
  expired:
    "This invite has expired. Ask whoever invited you to send a new one.",
  accepted: "This invite has already been used.",
  revoked: "This invite was revoked by the organization.",
  not_found:
    "This invite link doesn't exist. Double-check the link and try again.",
};

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
    return (
      <InviteShell>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="size-8 animate-spin rounded-full border-2 border-line border-t-navy" />
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/40">
            Checking invite…
          </p>
        </div>
      </InviteShell>
    );
  }

  if (isError || !preview?.valid) {
    const reason = preview?.reason ?? "not_found";

    return (
      <InviteShell>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-line bg-paper">
            <span className="font-display text-2xl text-ink/30">!</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
              Invite not available
            </h1>
            <p className="mt-2 max-w-sm font-body text-[15px] leading-relaxed text-ink/60">
              {REASON_COPY[reason] ?? REASON_COPY.not_found}
            </p>
          </div>
        </div>
      </InviteShell>
    );
  }

  const orgInitials = initialsFromName(preview.orgName ?? "?");

  if (!userId) {
    return (
      <InviteShell>
        <InviteHeader orgInitials={orgInitials} preview={preview} />
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/register?redirect=/invite/${token}`}
            className="w-full rounded-md bg-navy px-4 py-2.5 text-center font-body text-sm font-medium text-paper transition hover:bg-navy/90"
          >
            Create an account to accept
          </Link>

          <Link
            href={`/login?redirect=/invite/${token}`}
            className="w-full rounded-md border border-line px-4 py-2.5 text-center font-body text-sm text-ink transition hover:bg-paper"
          >
            I already have an account
          </Link>
        </div>
        <p className="mt-4 text-center font-body text-xs text-ink/40">
          This invite was sent to {preview.invitedEmail}. Sign in with that
          email to accept.
        </p>
      </InviteShell>
    );
  }

  const isSwitchingOrgs = !!(
    currentProfile?.org_id && currentProfile.org_id !== preview.orgId
  );
  const readyToAccept = !isSwitchingOrgs || confirmLeave;

  function handleAccept() {
    acceptMutation.mutate(token, {
      onSuccess: () => {
        router.push("/dashboard");
        router.refresh();
      },
    });
  }

  return (
    <InviteShell>
      <InviteHeader orgInitials={orgInitials} preview={preview} />

      {isSwitchingOrgs && !confirmLeave && (
        <div className="mt-6 rounded-md border border-amber/40 bg-amber/10 px-4 py-3">
          <p className="font-body text-sm font-medium text-ink">
            You're currently part of another workspace.
          </p>
          <p className="mt-1 font-body text-sm leading-relaxed text-ink/60">
            Joining {preview.orgName} will remove you from{" "}
            {preview.viewerCurrentOrgName ?? "your current workspace"}. This
            can't be undone —{" "}
            {preview.viewerCurrentOrgWillBeDeleted
              ? "since you're its only member, that workspace and all its contracts will be permanently deleted."
              : "the workspace will remain for its other members, but you'll lose access to it."}
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => setConfirmLeave(true)}
              className="mt-3 font-body text-sm font-medium text-navy hover:opacity-70 cursor-pointer underline underline-offset-2"
            >
              I understand, continue
            </button>
          </div>
        </div>
      )}

      {readyToAccept && (
        <button
          onClick={handleAccept}
          disabled={acceptMutation.isPending}
          className="cursor-pointer mt-6 w-full rounded-md bg-navy px-4 py-2.5 font-body text-sm font-medium text-paper transition hover:bg-navy/90 disabled:opacity-60"
        >
          {acceptMutation.isPending
            ? "Joining…"
            : `Accept and join ${preview.orgName}`}
        </button>
      )}

      {acceptMutation.isError && (
        <p className="mt-3 text-center font-body text-sm text-red-600">
          {(acceptMutation.error as Error).message}
        </p>
      )}
    </InviteShell>
  );
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function InviteHeader({
  orgInitials,
  preview,
}: {
  orgInitials: string;
  preview: { orgName?: string; inviterName?: string; role?: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-lg bg-navy">
        <span className="font-display text-xl font-semibold text-paper">
          {orgInitials}
        </span>
      </div>
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">
          You're invited
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
          Join {preview.orgName}
        </h1>
        <p className="mt-2 font-body text-[15px] leading-relaxed text-ink/60">
          {preview.inviterName} invited you as{" "}
          <span className="font-medium text-ink">{preview.role}</span>.
        </p>
      </div>
    </div>
  );
}
