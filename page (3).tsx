import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import HeroSection from "./components/HeroSection";
import CaseStudiesSection from "./components/CaseStudiesSection";
import ProblemSection from "./components/ProblemSection";
import AiSection from "./components/AiSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0C1330]">
      <Navbar />
      <main>
        <HeroSection />
        <CaseStudiesSection />
        <ProblemSection />
        <AiSection />
      </main>
      <Footer />
    </div>
  );
}