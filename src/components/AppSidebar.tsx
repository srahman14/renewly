"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Contract, STORAGE_KEY } from "@/lib/contracts"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronsUpDown,
  Plus,
  Check,
  User2,
  LayoutDashboard,
  FileText,
  CalendarClock,
  BarChart3,
  Bell,
  Users,
  Settings,
  ShieldCheck,
  Building2,
  Plug,
  LifeBuoy,
  BookOpen,
  MessageCircle,
} from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth.store"
import { useUserProfileQuery } from "@/lib/queries/user.queries"

type Workspace = {
  id: string
  name: string
}

type NavItem = {
  title: string
  url: string
  icon: typeof CalendarClock
  badge?: string
}

// Hardcoded default workspace — UI-only state for now
const initialWorkspaces: Workspace[] = [{ id: "ws_acme", name: "Acme Inc" }]

const renewalsNav: NavItem = { title: "Renewals", url: "/dashboard/renewals", icon: CalendarClock, badge: "3" }
const analyticsNav: NavItem = { title: "Spend Analytics", url: "/dashboard/spend-analytics", icon: BarChart3 }
const alertsNav: NavItem = { title: "Alerts", url: "/dashboard/alerts", icon: Bell, badge: "5" }

const orgNav = [
  { title: "Members", url: "/org/members", icon: Users },
  { title: "Roles & Permissions", url: "/org/roles", icon: ShieldCheck },
  { title: "Organization Settings", url: "/org/settings", icon: Building2 },
  { title: "Integrations", url: "/org/integrations", icon: Plug },
]

const helpNav = [
  { title: "Documentation", url: "/help/docs", icon: BookOpen },
  { title: "Contact Support", url: "/help/support", icon: MessageCircle },
]

export function AppSidebar() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    initialWorkspaces[0]?.id ?? null
  )
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [activeContractCount, setActiveContractCount] = useState<number | null>(null)
  
  // User related 
  const userId = useAuthStore((state) => state.user?.id)
  const signOut = useAuthStore((state) => state.signOut)
  
  if (!userId) {
    return
  }

  const { 
    data: profile,
    isLoading,
    isError,
    error,
  } = useUserProfileQuery(userId)


  // Best-effort: reads on mount, then re-reads whenever this tab regains
  // focus (covers "added a contract, tabbed away and back"). There's no
  // shared store yet (each page independently owns its own localStorage
  // read), so an add/delete happening in the same tab right now won't be
  // reflected here until the next focus/mount — a real gap, not a
  // rounding error. Worth a shared ContractsContext if this needs to be
  // truly live.
  useEffect(() => {
    function readCount() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const contracts: Contract[] = saved ? JSON.parse(saved) : [];
        setActiveContractCount(contracts.filter((c) => c.status !== "cancelled").length);
      } catch {
        setActiveContractCount(0);
      }
    }
    readCount();
    window.addEventListener("focus", readCount);
    window.addEventListener("storage", readCount);
    return () => {
      window.removeEventListener("focus", readCount);
      window.removeEventListener("storage", readCount);
    };
  }, [])

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId)

  function handleCreateWorkspace() {
    const name = newWorkspaceName.trim()
    if (!name) return
    const workspace: Workspace = { id: `ws_${Date.now()}`, name }
    setWorkspaces((prev) => [...prev, workspace])
    setActiveWorkspaceId(workspace.id)
    setNewWorkspaceName("")
    setIsCreateOpen(false)
  }

  return (
    <Sidebar className="max-w-content" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton />}>
                <Building2 />
                <span>{activeWorkspace ? activeWorkspace.name : "No workspace"}</span>
                <ChevronsUpDown className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {workspaces.length > 0 ? (
                  workspaces.map((ws) => (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => setActiveWorkspaceId(ws.id)}
                    >
                      <span className="flex-1">{ws.name}</span>
                      {ws.id === activeWorkspaceId && <Check className="size-4" />}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <span>No workspaces yet</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
                  <Plus className="size-4" />
                  <span>Create Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary application nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Contract</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard" />}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Contracts */}
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard/contracts" />}>
                  <FileText />
                  <span>Contracts</span>
                </SidebarMenuButton>
                {activeContractCount !== null && activeContractCount > 0 && (
                  <SidebarMenuBadge>{activeContractCount}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>

              {/* Remaining flat items */}
              {[renewalsNav, analyticsNav, alertsNav].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {"badge" in item && item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
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
                      <SidebarMenuButton render={<Link href={item.url} />}>
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

        {/* Help, collapsible, collapsed by default */}
        <Collapsible className="group/collapsible mt-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="p-0">
              <CollapsibleTrigger className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LifeBuoy className="size-3.5" />
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {helpNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton render={<Link href={item.url} />}>
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
                <User2 />
                {profile?.full_name}
                <ChevronDown className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Give your workspace a name. You can invite teammates and add contracts after.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. Acme Inc"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateWorkspace()
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}