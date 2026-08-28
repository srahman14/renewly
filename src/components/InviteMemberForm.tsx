// components/InviteMemberForm.tsx
"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import {
  useCreateInviteMutation,
  useSendInviteEmailMutation,
} from "@/lib/queries/invite.queries";
import type { InviteRole } from "@/lib/services/invite.service";

const ROLE_LABELS: Record<InviteRole, string> = {
  member: "Member",
  owner: "Owner",
};

export function InviteMemberForm() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { data: profile } = useUserProfileQuery(userId);
  const orgId = profile?.org_id ?? null;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("member");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const createInviteMutation = useCreateInviteMutation(orgId);

  // For Resend
  const sendEmailMutation = useSendInviteEmailMutation();
  const [emailStatus, setEmailStatus] = useState<"idle" | "sent" | "failed">(
    "idle",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !userId) return;

    setCopiedLink(null);
    setEmailStatus("idle");

    createInviteMutation.mutate(
      { email, role, invitedBy: userId },
      {
        onSuccess: (invite) => {
          const link = `${window.location.origin}/invite/${invite.token}`;
          setCopiedLink(link);
          navigator.clipboard?.writeText(link);
          setEmail("");

          sendEmailMutation.mutate(invite.token, {
            onSuccess: () => setEmailStatus("sent"),
            onError: () => setEmailStatus("failed"),
          });
        },
      },
    );
  }

  const errorMessage = (createInviteMutation.error as Error)?.message ?? "";
  const isDuplicatePending = /duplicate key|unique/i.test(errorMessage);
  const isAlreadyMember = errorMessage.includes("ALREADY_MEMBER");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          className="font-body text-sm font-medium text-ink"
          htmlFor="invite-email"
        >
          Email
        </label>
        <Input
          id="invite-email"
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-medium text-ink">Role</label>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between font-normal"
              />
            }
          >
            {ROLE_LABELS[role]}
            <ChevronDown className="size-4 text-ink/40" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            {(Object.keys(ROLE_LABELS) as InviteRole[]).map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                <span className="flex-1">{ROLE_LABELS[r]}</span>
                {r === role && <Check className="size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        type="submit"
        disabled={createInviteMutation.isPending}
        className="w-full"
      >
        {createInviteMutation.isPending ? "Sending…" : "Send invite"}
      </Button>

      {createInviteMutation.isError && (
        <p className="font-body text-xs text-red-600">
          {isAlreadyMember
            ? "This person is already a member of this workspace."
            : isDuplicatePending
              ? "There's already a pending invite for this email."
              : errorMessage}
        </p>
      )}

      {copiedLink && (
        <div className="rounded-md border border-teal/30 bg-teal/5 px-3 py-2.5">
          <p className="font-body text-xs text-ink/70">
            {emailStatus === "sent" && "Invite email sent. "}
            {emailStatus === "failed" && "Couldn't send the email — "}
            {emailStatus === "idle" && "Sending email… "}
            Link copied to your clipboard either way:
          </p>
          <p className="mt-1 truncate font-mono text-xs text-teal">
            {copiedLink}
          </p>
        </div>
      )}
    </form>
  );
}
