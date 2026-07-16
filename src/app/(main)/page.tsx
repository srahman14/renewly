import Hero from "@/components/Hero";
import Hook from "@/components/Hook";
import Stats from "@/components/Stats";
import Purpose from "@/components/Purpose";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="flex flex-col items-center mx-auto justify-center bg-paper font-body">
      <Hero />
      <Hook />
      <Stats />
      <Purpose />
      <HowItWorks />
      <FAQ />
    </main>
  );
}
