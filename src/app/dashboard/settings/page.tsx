"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAuthStore } from "@/lib/stores/auth.store"
import { useUserProfileQuery, useUpdateProfileMutation } from "@/lib/queries/user.queries"
import { useDeleteAccountMutation } from "@/lib/queries/account.queries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User2,
  ShieldCheck,
  Users,
  Bell,
  ChevronRight,
  Paintbrush,
  Moon,
  Sun,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TabId = "general" | "security" | "users" | "notifications"

const TABS: { id: TabId; label: string; icon: typeof User2; description: string }[] = [
  { id: "general", label: "General", icon: User2, description: "Profile & appearance" },
  { id: "security", label: "Security", icon: ShieldCheck, description: "Password & 2FA" },
  { id: "users", label: "Users", icon: Users, description: "Team members" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & digests" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const userId = useAuthStore((state) => state.user?.id ?? null)

  return (
    <div className="min-h-screen bg-paper-muted">
      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/45">Account</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-lg font-body text-[15px] leading-relaxed text-ink/60">
            Manage your profile, security, and workspace preferences.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          {/* Nav rail */}
          <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* Content */}
          <div className="min-w-0">
            {activeTab === "general" && <GeneralTab userId={userId} />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </main>
    </div>
  )
}

// Shared toggle switch used across Security/Notifications rows. Local
// state only — nothing here is wired to a backend yet, so refreshes
// reset every value below.
function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof User2
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-line bg-paper-muted text-ink/50">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="font-body text-sm font-medium text-ink">{title}</p>
          <p className="font-body text-xs text-ink/50">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function NotWiredNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[11px] text-ink/35">
      {children}
    </p>
  )
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const passwordsFilled = currentPassword && newPassword && confirmPassword
  const passwordsMatch = newPassword === confirmPassword

  return (
    <div className="space-y-6">
      {/* Password */}
      <section className="rounded-md border border-line bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">Password</p>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              type="password"
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 rounded-[4px]"
            />
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirm new password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 rounded-[4px]"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1.5 font-body text-xs text-red-600">Passwords don't match.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            disabled={!passwordsFilled || !passwordsMatch}
            className="rounded-[4px] bg-ink hover:bg-navy"
            title="Not wired up yet — no password change endpoint exists"
          >
            Update password
          </Button>
        </div>
        <NotWiredNote>Needs a password-change endpoint before this button does anything.</NotWiredNote>
      </section>

      {/* 2FA */}
      <section className="rounded-md border border-line bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
          Two-factor authentication
        </p>
        <ToggleRow
          icon={ShieldCheck}
          title="Require a code at sign-in"
          description="Uses an authenticator app on top of your password."
          checked={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
        />
        <NotWiredNote>Flips the switch only — needs a 2FA service wired in to actually enforce it.</NotWiredNote>
      </section>
    </div>
  )
}

type TeamMember = {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: "m1", name: "You", email: "you@company.com", role: "Owner" },
]

function UsersTab() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS)
  const [inviteEmail, setInviteEmail] = useState("")

  function handleInvite() {
    const email = inviteEmail.trim()
    if (!email) return
    setMembers((prev) => [
      ...prev,
      { id: `m_${Date.now()}`, name: email.split("@")[0], email, role: "Member" },
    ])
    setInviteEmail("")
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-line bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">Invite</p>
        <div className="mt-4 flex gap-2">
          <Input
            type="email"
            placeholder="teammate@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInvite()
            }}
            className="rounded-[4px]"
          />
          <Button
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
            className="shrink-0 rounded-[4px] bg-ink hover:bg-navy"
          >
            Send invite
          </Button>
        </div>
        <NotWiredNote>
          Adds to this list only — no invite email sends and nothing persists past a refresh.
        </NotWiredNote>
      </section>

      <section className="rounded-md border border-line bg-white">
        <p className="px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
          Members · {members.length}
        </p>
        <div className="mt-4 divide-y divide-line">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-paper">
                  {member.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-medium text-ink">{member.name}</p>
                  <p className="truncate font-body text-xs text-ink/50">{member.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em]",
                    member.role === "Owner"
                      ? "bg-navy text-amber-light"
                      : "bg-teal/10 text-teal"
                  )}
                >
                  {member.role}
                </span>
                {member.role !== "Owner" && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member.id)}
                    className="font-mono text-[11px] text-ink/40 outline-none transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-navy/40"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <NotWiredNote>
          <span className="block px-6 pb-6">
            This list lives in local state — a real version needs a team members table + queries,
            same shape as user.queries.ts.
          </span>
        </NotWiredNote>
      </section>
    </div>
  )
}

function NotificationsTab() {
  const [renewalReminders, setRenewalReminders] = useState(true)
  const [noticeDeadlineAlerts, setNoticeDeadlineAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-line bg-white px-6">
        <p className="pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">Alerts</p>
        <div className="divide-y divide-line">
          <ToggleRow
            icon={Bell}
            title="Renewal reminders"
            description="Get notified as a contract's renewal date approaches."
            checked={renewalReminders}
            onChange={setRenewalReminders}
          />
          <ToggleRow
            icon={ShieldCheck}
            title="Notice deadline alerts"
            description="Get notified when a cancellation window opens."
            checked={noticeDeadlineAlerts}
            onChange={setNoticeDeadlineAlerts}
          />
          <ToggleRow
            icon={User2}
            title="Weekly digest"
            description="A weekly summary of upcoming renewals by email."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </div>
        <NotWiredNote>
          <span className="block pb-6">
            These switches don't send anything yet — needs a notification preferences table and an
            email/push delivery mechanism behind them.
          </span>
        </NotWiredNote>
      </section>
    </div>
  )
}

const ACCENT_OPTIONS = [
  { id: "amber", label: "Amber", swatch: "#C98A3E" },
  { id: "teal", label: "Teal", swatch: "#3E8C82" },
  { id: "terracotta", label: "Terracotta", swatch: "#B4573F" },
  { id: "navy", label: "Navy", swatch: "#28324A" },
] as const

function GeneralTab({ userId }: { userId: string | null }) {
  const { data: profile, isLoading, isError } = useUserProfileQuery(userId)
  const updateProfile = useUpdateProfileMutation(userId)
  const deleteAccount = useDeleteAccountMutation()

  const [fullName, setFullName] = useState("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Appearance — UI-only for now. Dark mode needs wiring to a theme
  // provider (e.g. next-themes) and accent needs wiring to a CSS custom
  // property before these actually change anything on screen.
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [accent, setAccent] = useState<(typeof ACCENT_OPTIONS)[number]["id"]>("amber")

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name)
  }, [profile?.full_name])

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

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    // Note: preview only — actual upload/persistence needs a storage
    // endpoint (e.g. Supabase storage bucket) wired in before this sticks.
  }

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
        <p className="font-body text-sm text-red-600">Couldn't load your profile. Try refreshing.</p>
      </div>
    )
  }

  const hasChanges = fullName.trim() !== (profile?.full_name ?? "").trim()

  function handleSave() {
    const trimmed = fullName.trim()
    if (!trimmed || !hasChanges) return
    updateProfile.mutate({ fullName: trimmed })
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <section className="rounded-md border border-line bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">Profile</p>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group/avatar relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            aria-label="Change profile picture"
          >
            <Avatar className="size-16">
              {avatarPreview && <AvatarImage src={avatarPreview} alt={profile?.full_name ?? "You"} />}
              <AvatarFallback className="bg-navy font-display text-lg font-semibold text-paper">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/50 opacity-0 transition-opacity group-hover/avatar:opacity-100">
              <Paintbrush className="size-5 text-paper" strokeWidth={1.75} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarPick}
            className="hidden"
          />
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
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 rounded-[4px]"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? ""}
              disabled
              className="mt-1.5 rounded-[4px]"
            />
            <p className="mt-1.5 font-body text-xs text-ink/40">Email can't be changed here yet.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfile.isPending}
            className="rounded-[4px] bg-ink hover:bg-navy"
          >
            {updateProfile.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>

      {/* Appearance card */}
      <section className="rounded-md border border-line bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">Appearance</p>

        {/* Dark mode row */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[4px] border border-line bg-paper-muted text-ink/50">
              {isDarkMode ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </span>
            <div>
              <p className="font-body text-sm font-medium text-ink">Dark mode</p>
              <p className="font-body text-xs text-ink/50">Switch the dashboard to a dark theme.</p>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
        </div>

        <div className="mt-5 h-px bg-line" />

        {/* Accent color row */}
        <div className="mt-5">
          <p className="font-body text-sm font-medium text-ink">Accent color</p>
          <p className="mt-0.5 font-body text-xs text-ink/50">
            Changes highlights and badges. The rest of the interface stays the same.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {ACCENT_OPTIONS.map((option) => {
              const isSelected = accent === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAccent(option.id)}
                  aria-label={option.label}
                  aria-pressed={isSelected}
                  className="flex flex-col items-center gap-1.5 outline-none"
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full ring-2 ring-offset-2 transition-shadow"
                    style={{
                      backgroundColor: option.swatch,
                      // @ts-expect-error CSS custom value for ring color
                      "--tw-ring-color": isSelected ? option.swatch : "transparent",
                    }}
                  >
                    {isSelected && <Check className="size-4 text-white" strokeWidth={2.5} />}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink/45">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-md border border-red-200 bg-red-50/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body font-medium text-red-900">Delete account</p>
            <p className="mt-1 font-body text-sm text-red-700/80">
              Permanently remove your account and all associated data. This can't be undone.
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
              This will permanently delete your account and sign you out. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAccount.isPending}
              onClick={() => deleteAccount.mutate()}
            >
              {deleteAccount.isPending ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}