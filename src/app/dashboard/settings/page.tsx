"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth.store"
import { useUserProfileQuery, useUpdateProfileMutation } from "@/lib/queries/user.queries"
import { useDeleteAccountMutation } from "@/lib/queries/account.queries"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User2, ShieldCheck, Users, Bell, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type TabId = "general" | "security" | "team" | "notifications"

// Only settings that are actually wired to something live here. The old
// mock tabs (local-only team list, 2FA/notification/appearance switches
// that saved nothing) were removed rather than left as dead UI.
const TABS: { id: TabId; label: string; icon: typeof User2; description: string }[] = [
  { id: "general", label: "General", icon: User2, description: "Profile & account" },
  { id: "security", label: "Security", icon: ShieldCheck, description: "Password" },
  { id: "team", label: "Team", icon: Users, description: "Members & invites" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Reminder emails" },
]

const primaryLink = cn(buttonVariants(), "rounded-[4px] bg-ink text-paper hover:bg-navy")
const outlineLink = cn(buttonVariants({ variant: "outline" }), "rounded-[4px]")

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const userId = useAuthStore((state) => state.user?.id ?? null)

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">Account</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
            Manage your profile, password and how Renewly reminds you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          <nav
            aria-label="Settings sections"
            className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible"
          >
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-md border px-3 py-2.5 text-left outline-none transition-colors md:shrink",
                    isActive
                      ? "border-line bg-white shadow-[0_8px_20px_-14px_rgba(18,20,28,0.4)]"
                      : "border-transparent hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-navy/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                      isActive
                        ? "border-amber/30 bg-amber/15 text-amber"
                        : "border-line bg-transparent text-ink/40 group-hover:text-ink/60"
                    )}
                  >
                    <tab.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate font-body text-[14px] font-medium",
                        isActive ? "text-ink" : "text-ink/70"
                      )}
                    >
                      {tab.label}
                    </span>
                    <span className="hidden truncate font-mono text-[11px] text-ink/40 md:block">
                      {tab.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="min-w-0">
            {activeTab === "general" && <GeneralTab userId={userId} />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "team" && <TeamTab />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </main>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">{children}</p>
  )
}

function SecurityTab() {
  const email = useAuthStore((state) => state.user?.email ?? null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [error, setError] = useState<string | null>(null)

  const passwordsFilled = currentPassword && newPassword && confirmPassword
  const passwordsMatch = newPassword === confirmPassword
  const longEnough = newPassword.length >= 8

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !passwordsFilled || !passwordsMatch || !longEnough) return
    setError(null)
    setStatus("saving")

    const supabase = createClient()
    // Re-check the current password first, so a session left open on a
    // shared machine can't be used to quietly change it.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })
    if (reauthError) {
      setStatus("idle")
      setError("Current password is wrong.")
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      setStatus("idle")
      setError(updateError.message)
      return
    }

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setStatus("saved")
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-line bg-white p-6">
      <SectionLabel>Password</SectionLabel>

      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="current_password">Current password</Label>
          <Input
            id="current_password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1.5 rounded-[4px]"
          />
        </div>
        <div>
          <Label htmlFor="new_password">New password</Label>
          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setStatus("idle")
            }}
            className="mt-1.5 rounded-[4px]"
          />
          {newPassword && !longEnough && (
            <p className="mt-1.5 font-body text-xs text-ink/50">At least 8 characters.</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm new password</Label>
          <Input
            id="confirm_password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 rounded-[4px]"
          />
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1.5 font-body text-xs text-red-600">Passwords don&apos;t match.</p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 font-body text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {status === "saved" && (
        <p className="mt-4 font-body text-sm text-teal" role="status">
          Password updated.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/forgot-password"
          className="font-body text-sm text-ink/50 underline-offset-4 hover:text-ink hover:underline"
        >
          Forgot your current password?
        </Link>
        <Button
          type="submit"
          disabled={!passwordsFilled || !passwordsMatch || !longEnough || status === "saving"}
          className="rounded-[4px] bg-ink hover:bg-navy"
        >
          {status === "saving" ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  )
}

function TeamTab() {
  return (
    <section className="rounded-md border border-line bg-white p-6">
      <SectionLabel>Team</SectionLabel>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ink/60">
        Invite teammates, change roles and remove people from the Members page. Owners and admins
        can manage the team. Members can see who&apos;s in it.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/dashboard/org/members" className={primaryLink}>
          Go to Members
          <ArrowRight className="size-4" />
        </Link>
        <Link href="/dashboard/org/roles" className={outlineLink}>
          Roles &amp; permissions
        </Link>
      </div>
    </section>
  )
}

function NotificationsTab() {
  return (
    <section className="rounded-md border border-line bg-white p-6">
      <SectionLabel>Reminder emails</SectionLabel>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ink/60">
        Renewly checks your contracts once a day and emails each contract&apos;s owners when its
        notice deadline is coming up, so there&apos;s still time to cancel or renegotiate.
      </p>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ink/60">
        To silence one contract, mute it from the Contracts page.
      </p>
      <div className="mt-5">
        <Link href="/dashboard/contracts" className={outlineLink}>
          Open Contracts
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

function GeneralTab({ userId }: { userId: string | null }) {
  const { data: profile, isLoading, isError } = useUserProfileQuery(userId)
  const updateProfile = useUpdateProfileMutation(userId)
  const deleteAccount = useDeleteAccountMutation()

  // null = untouched, so the field shows the saved name without copying
  // it into state from an effect.
  const [draftName, setDraftName] = useState<string | null>(null)
  const fullName = draftName ?? profile?.full_name ?? ""
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const initials = useMemo(() => {
    const source = fullName || profile?.full_name || ""
    return (
      source
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "?"
    )
  }, [fullName, profile?.full_name])

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-md border border-line bg-white p-6">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border border-line bg-white p-6">
        <p className="font-body text-sm text-red-600">Couldn&apos;t load your profile. Try refreshing.</p>
      </div>
    )
  }

  const hasChanges = fullName.trim() !== (profile?.full_name ?? "").trim()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed || !hasChanges) return
    updateProfile.mutate({ fullName: trimmed }, { onSuccess: () => setDraftName(null) })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="rounded-md border border-line bg-white p-6">
        <SectionLabel>Profile</SectionLabel>

        <div className="mt-4 flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-navy font-display text-lg font-semibold text-paper">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-body font-medium text-ink">
              {profile?.full_name || "Add your name"}
            </p>
            <p className="truncate font-body text-sm text-ink/50">{profile?.email}</p>
          </div>
        </div>

        <div className="mt-6 h-px bg-line" />

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={fullName}
              autoComplete="name"
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 rounded-[4px]"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? ""}
              readOnly
              className="mt-1.5 rounded-[4px] bg-paper-muted text-ink/60"
            />
          </div>
        </div>

        {updateProfile.isError && (
          <p className="mt-4 font-body text-sm text-red-600" role="alert">
            Couldn&apos;t save. Try again.
          </p>
        )}
        {updateProfile.isSuccess && !hasChanges && (
          <p className="mt-4 font-body text-sm text-teal" role="status">
            Saved.
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={!hasChanges || !fullName.trim() || updateProfile.isPending}
            className="rounded-[4px] bg-ink hover:bg-navy"
          >
            {updateProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      <section className="rounded-md border border-red-200 bg-red-50/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body font-medium text-red-900">Delete account</p>
            <p className="mt-1 font-body text-sm text-red-700/80">
              Permanently remove your account. If you&apos;re the only member of your workspace, its
              contracts go too. This can&apos;t be undone.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 rounded-[4px] border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </section>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and sign you out. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteAccount.isError && (
            <p className="font-body text-sm text-red-600" role="alert">
              {(deleteAccount.error as Error).message}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAccount.isPending}
              onClick={() => deleteAccount.mutate()}
            >
              {deleteAccount.isPending ? "Deleting…" : "Yes, delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
