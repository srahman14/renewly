import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "renewly",
  description: "personal renewal radar - never forget an auto-renewal again.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full min-w-0 flex-1 flex-col">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}