import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PlatformDnaRibbon from "@/pages/platform/components/PlatformDnaRibbon";

const steps = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Show us how you work.",
    description:
      "We begin with a focused operational brief. We learn what you sell, who uses the system, how customers register, how money moves, what your team does manually, existing software, spreadsheets, exceptions, workarounds, frustrations, and the things your current system cannot do.",
    icon: "ri-search-line",
  },
  {
    number: "02",
    title: "Map",
    subtitle: "We map the real operation.",
    description:
      "VOK maps workflows, bottlenecks, user roles, decision points, repeated admin work, payments, integrations, rules, and edge cases. The messy real world becomes a clear operating model.",
    icon: "ri-map-pin-line",
  },
  {
    number: "03",
    title: "Design",
    subtitle: "We design the right system — not the biggest one.",
    description:
      "VOK proposes the architecture that best fits the business. Payment stack, database, authentication, dashboards, customer interfaces, communications, integrations, reporting, automation, and AI capabilities where useful. Exactly what your operation needs. Nothing it doesn't.",
    icon: "ri-pencil-ruler-2-line",
  },
  {
    number: "04",
    title: "Build",
    subtitle: "Then we build. Fast.",
    description:
      "Our team works in short agile development cycles with AI-assisted and agentic development workflows. We prototype quickly, test with real users, iterate continuously, and prioritize the workflows that create immediate value.",
    icon: "ri-code-box-line",
  },
  {
    number: "05",
    title: "Your Platform",
    subtitle: "Your own software. Live in weeks.",
    description:
      "Your brand. Your workflows. Your users. Your platform. For clubs, the first phase can include website, registrations, payments, programs, and dashboards. Then VOK can continue building around the operation over time.",
    icon: "ri-rocket-line",
  },
];

export default function Platform() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Illuminate the big icon squares as they scroll into view
  useEffect(() => {
    const cells = sectionRef.current?.querySelectorAll(".icon-cell");
    if (!cells || cells.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("lit", entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );
    cells.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-background-50 overflow-hidden">
      <Navbar />
      <main className="relative z-10">
        {/* Full-page DNA ribbon — flows top to bottom, left to right, around the content */}
        <PlatformDnaRibbon />

        {/* Title + steps — no hero, straight to the process */}
        <section className="relative pt-28 md:pt-36 pb-2">
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
            <div data-animate className="opacity-0">
              <span className="vok-label">The VOK Process</span>
              <h1 className="vok-headline text-5xl md:text-6xl lg:text-[78px] leading-[1.1] tracking-[-3.12px] mt-2 text-white">
                Our process
              </h1>
              <p className="vok-body mt-4 max-w-xl">
                From your first brief to a live platform in weeks — a clear, repeatable path built around how you actually operate.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section ref={sectionRef} className="pt-6 md:pt-8 pb-16 md:pb-24">
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
            <div className="space-y-16 md:space-y-20">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  data-animate
                  className="opacity-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
                >
                  {/* Number */}
                  <div className="lg:col-span-2 flex items-start gap-4 lg:flex-col lg:gap-2">
                    <span className="text-coral font-heading text-sm uppercase tracking-[0.025em]">
                      STEP {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-5">
                    <h2 className="vok-headline text-2xl md:text-3xl lg:text-[36px] tracking-[-1.68px] mb-2">
                      {step.title}
                    </h2>
                    <h3 className="text-white font-heading text-lg md:text-xl tracking-tight mb-6">
                      {step.subtitle}
                    </h3>
                    <p className="vok-body">{step.description}</p>
                  </div>

                  {/* Big interactive visual */}
                  <div className={`lg:col-span-5 hidden lg:flex items-center justify-center ${i % 2 === 0 ? "lg:order-first" : ""}`}>
                    <div className="icon-cell icon-cell-lg relative w-full aspect-square max-w-[300px] rounded-[24px] border border-white/10 bg-[#1a2342] overflow-hidden flex items-center justify-center">
                      <div className="icon-halo absolute inset-0 rounded-[24px] pointer-events-none" />
                      <div className="absolute inset-4 border border-coral/20 rounded-[20px] pointer-events-none transition-colors duration-500 group-hover:border-coral/50" />
                      <i className={`icon-glyph relative ${step.icon} text-coral/40 text-6xl`} />
                      {/* Decorative particles */}
                      {[...Array(6)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute w-2 h-2 bg-coral/30 rounded-full animate-glow-pulse"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${j * 200}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div data-animate className="opacity-0 mt-24 md:mt-32 text-center">
              <h2 className="vok-headline text-3xl md:text-4xl tracking-[-1.68px] mb-8">
                Your own software. Live in weeks.
              </h2>
              <Link to="/book-demo" className="btn-primary inline-flex">
                BUILD WITH VOK
                <i className="ri-arrow-right-line ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
