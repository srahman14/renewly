import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";
import { AuthListener } from "@/components/renewly/auth-listener";

export const metadata: Metadata = {
  title: "renewly",
  description: "personal renewal radar - never forget an auto-renewal again.",
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
        <AuthListener />
        {children}
      </body>
    </html>
  );
}
