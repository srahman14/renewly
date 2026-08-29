import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";
import { AuthListener } from "@/components/renewly/auth-listener";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "renewly",
  description: "Track every contract's real cancellation deadline, not just its renewal date.",

  appleWebApp: {
    title: "renewly | know your cancellation deadlines",
  },

  openGraph: {
    title: "renewly | stop missing cancellation windows",
    description: "Renewly tracks the real deadline behind every contract's notice period, so auto-renewals never catch your team off guard.",
    url: "https://therenewly.vercel.app/",
    siteName: "renewly",
    locale: "en_GB",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthListener />
          {children}
        </Providers>
      </body>
    </html>
  );
}
