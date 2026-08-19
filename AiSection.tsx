import { useEffect, useRef } from "react";
import AiParticleRibbon from "./AiParticleRibbon";

const aiUseCases = [
  "Customer support",
  "Operational questions",
  "Payment follow-ups",
  "Program recommendations",
  "Internal reporting",
  "Summaries",
  "Communications",
  "Workflow automation",
  "Admin assistance",
];

export default function AiSection() {
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

    const elements = sectionRef.current?.querySelectorAll("[data-animate]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0C1330] relative overflow-hidden">
      {/* Particle ribbon background — lazo from top-left to bottom-right */}
      <AiParticleRibbon />

      <div className="container-max mx-auto px-6 md:px-12 lg:px-16 section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Text */}
          <div data-animate className="opacity-0">
            <span className="vok-label">VOK AI</span>
            <h2 className="vok-headline text-3xl md:text-4xl lg:text-[48px] mt-4 tracking-[-1.68px]">
              AI that fits your operation too.
            </h2>
            <p className="vok-body mt-6 max-w-md">
              VOK can add AI where it actually improves the business — because your software is already built around your workflows and data.
            </p>
            <p className="vok-body mt-4 max-w-md text-white/80">
              Your software. Your data. Your AI capabilities.
            </p>
          </div>

          {/* Right: Use cases */}
          <div data-animate className="opacity-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiUseCases.map((useCase, i) => (
                <div
                  key={useCase}
                  className="flex items-center gap-3 py-3 px-4 border border-white/10 rounded-[12px] hover:border-coral/30 transition-colors duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-coral/60 flex-shrink-0" />
                  <span className="text-[#bdbdbd] text-sm font-body font-light">
                    {useCase}
                  </span>
                </div>
              ))}
            </div>

            {/* Agentic visual hint */}
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center animate-glow-pulse">
                <i className="ri-brain-line text-coral text-sm" />
              </div>
              <span className="text-[#9a9a9a] text-xs font-heading uppercase tracking-[0.025em]">
                Agentic workflows built into your platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}