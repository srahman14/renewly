import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  description: "Track every contract's real cancellation deadline, not just its renewal date.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}