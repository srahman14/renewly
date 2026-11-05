import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track renewals, notice windows and spend across your team's contracts.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();
  const { 
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full min-w-0 flex-1 flex-col">
          {/* The sidebar is off-canvas below md, so phones need a way to open it. */}
          <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-paper/90 px-4 py-2.5 backdrop-blur md:hidden">
            <SidebarTrigger />
            <span className="font-display text-base font-medium tracking-tight text-ink">Renewly</span>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}