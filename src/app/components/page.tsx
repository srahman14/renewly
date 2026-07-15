import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Hook from "@/components/Hook";
import Stats from "@/components/Stats";
import Purpose from "@/components/Purpose";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-paper font-body">
      <Navbar />
      <Hero />
      <Hook />
      <Stats />
      <Purpose />
      <HowItWorks />
      <FAQ />
      <Footer />
    </main>
  );
}
