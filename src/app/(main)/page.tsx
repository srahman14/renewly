import Hero from "@/components/Hero";
import Hook from "@/components/Hook";
import Stats from "@/components/Stats";
import Purpose from "@/components/Purpose";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import DateScene from "@/components/landing/DateScene";
import HowItWorksScene from "@/components/landing/HowItWorksScene";
import StatsScene from "@/components/landing/StatsScene";
import PurposeScene from "@/components/landing/PurposeScene";
import TeamWorkspaceScene from "@/components/landing/TeamWorkspaceScene";
import FinalCTA from "@/components/landing/FinalCTAScene";

export default function Home() {
  return (
    <main className="bg-paper font-body">
      <Hero />
      <DateScene />
      <HowItWorksScene />
      <StatsScene />
      <PurposeScene />
      <TeamWorkspaceScene />
      <FinalCTA />
      <FAQ />
    </main>
  );
}
