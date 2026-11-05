"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  LayoutDashboard,
  FileText,
  CalendarClock,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUserProfileQuery } from "@/lib/queries/user.queries";
import { useContractsQuery } from "@/lib/queries/contract.queries";
import { useOrgQuery } from "@/lib/queries/org.queries";
import { isFlagged, isSoon, isMuted } from "@/lib/contracts";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Every link here points at a page that exists. Alerts, Integrations and
// the Help pages were never built, so they're left out rather than 404ing.
const appNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Contracts", url: "/dashboard/contracts", icon: FileText },
  { title: "Renewals", url: "/dashboard/renewals", icon: CalendarClock },
  { title: "Spend Analytics", url: "/dashboard/spend-analytics", icon: BarChart3 },
] as const;

const orgNav = [
  { title: "Members", url: "/dashboard/org/members", icon: Users },
  { title: "Roles & Permissions", url: "/dashboard/org/roles", icon: ShieldCheck },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // User related
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile, isLoading } = useUserProfileQuery(userId);

  const orgId = profile?.org_id ?? null

  // Same query the contracts/renewals pages use — react-query caches this
  // by [ "contracts", orgId ], so this doesn't fire a second network
  // request in the common case where a contracts page is also mounted;
  // it just reads the shared cache and re-renders when it invalidates
  // (e.g. right after a create/update/delete mutation settles). That
  // replaces the old focus/storage-event polling entirely — the count is
  // now live within the tab, not just on refocus.
  const { data: contracts = [] } = useContractsQuery(orgId);
  const activeContractCount = contracts.filter(
    (c) => c.status !== "cancelled",
  ).length;
  // Same rule as the Renewals page: inside the notice window or within
  // SOON_BUFFER_DAYS of it. Muted contracts don't count, they asked us
  // to stop nagging.
  const renewalsDueCount = contracts.filter(
    (c) => !isMuted(c) && (isFlagged(c) || isSoon(c)),
  ).length;

  const { data: org } = useOrgQuery(orgId);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  const badgeFor = (url: string) =>
    url === "/dashboard/contracts"
      ? activeContractCount
      : url === "/dashboard/renewals"
        ? renewalsDueCount
        : 0;

  const initials = useMemo(() => {
    const source = profile?.full_name || "";
    return (
      source
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "?"
    );
  }, [profile?.full_name]);

  return (
    <Sidebar className="max-w-content" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-navy">
                <Building2 className="size-4 text-paper" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-display text-sm font-medium text-ink">
                  {org?.name ?? (isLoading ? "\u00A0" : "Renewly")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                  Workspace
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appNav.map((item) => {
                const badge = badgeFor(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {badge > 0 && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Organization, collapsible */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel className="p-0">
              <CollapsibleTrigger className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Organization
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {orgNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        render={<Link href={item.url} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton />}>
                <Avatar className="size-8">
                  <AvatarFallback className="bg-navy font-display text-lg font-semibold text-paper">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="truncate font-body font-medium text-ink">
                    {profile?.full_name}
                  </p>
                  <p className="truncate font-body text-xs text-ink/50">
                    {profile?.email}
                  </p>
                </div>
                <ChevronDown className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                  <Settings className="mr-2 size-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}
