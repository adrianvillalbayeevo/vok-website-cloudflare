import { useEffect, useRef } from "react";

const beforeSteps = [
  { icon: "ri-apps-2-line", label: "Generic Platform", desc: "One-size-fits-all" },
  { icon: "ri-arrow-right-line", label: "Forces", desc: "Rigid workflows" },
  { icon: "ri-building-4-line", label: "Your Workflow", desc: "Has to adapt" },
];

const afterSteps = [
  { icon: "ri-building-4-line", label: "Your Workflow", desc: "Mapped first" },
  { icon: "ri-arrow-right-line", label: "Becomes", desc: "Custom fit" },
  { icon: "ri-apps-2-line", label: "Your Platform", desc: "Built around you" },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Reveal on scroll
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

  // Animate divider line
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            line.classList.add("divider-active");
            observer.unobserve(line);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white relative overflow-hidden">
      {/* Soft ambient background accents */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />

      <div className="container-max mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-32">
        {/* Header — centered and bold, no label */}
        <div data-animate className="opacity-0 text-center mb-16 md:mb-20 lg:mb-24">
          <h2 className="vok-headline text-4xl md:text-5xl lg:text-[60px] tracking-[-2.56px] text-[#0C1330] leading-[1.05]">
            Your club isn&apos;t off-the-shelf.
            <br />
            <span className="text-[#9a9a9a]">Why should your software be?</span>
          </h2>
        </div>

        {/* Before / After Dramatic Visual */}
        <div data-animate className="opacity-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-0 items-stretch">
            {/* BEFORE Panel */}
            <div className="relative group/before">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[24px] p-8 md:p-12 lg:p-14 h-full border border-gray-200 transition-all duration-500 group-hover/before:border-gray-300 group-hover/before:shadow-[0_30px_60px_-30px_rgba(12,19,48,0.18)] group-hover/before:-translate-y-1">
                {/* Label */}
                <div className="flex items-center gap-3 mb-10 md:mb-14">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <span className="text-gray-500 text-xs font-heading uppercase tracking-[0.15em] font-semibold">
                    Off-the-Shelf Software
                  </span>
                </div>

                {/* Steps */}
                <div className="relative pl-2">
                  {beforeSteps.map((step, i) => (
                    <div key={step.label} className="relative group/step">
                      {/* Connector line */}
                      {i < beforeSteps.length - 1 && (
                        <div className="absolute left-[29px] top-16 w-px h-10 md:h-14 bg-gray-200 transition-colors duration-500 group-hover/step:bg-gray-300" />
                      )}

                      <div className="flex items-start gap-5 mb-0">
                        <div
                          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/step:border-gray-400 group-hover/step:-translate-y-0.5"
                          style={{ animationDelay: `${i * 0.45}s` }}
                        >
                          <i
                            className={`${step.icon} text-gray-400 text-xl md:text-2xl transition-all duration-300 group-hover/step:text-gray-600 group-hover/step:scale-110 icon-breathe`}
                            style={{ animationDelay: `${i * 0.45}s` }}
                          />
                        </div>
                        <div className="pt-1 transition-transform duration-300 group-hover/step:translate-x-1">
                          <span className="text-[#0C1330] font-heading text-lg md:text-xl tracking-tight block">
                            {step.label}
                          </span>
                          <span className="text-gray-400 text-sm font-body font-light mt-0.5 block">
                            {step.desc}
                          </span>
                        </div>
                      </div>

                      {/* Spacer for line */}
                      {i < beforeSteps.length - 1 && (
                        <div className="h-10 md:h-14" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom text */}
              <p className="mt-6 text-sm text-gray-500 font-body font-light px-2 transition-colors duration-300 group-hover/before:text-gray-600">
                Most platforms are built for thousands of clubs. Your operation has to fit their system.
              </p>
            </div>

            {/* Center Divider — animated coral line */}
            <div
              ref={lineRef}
              className="hidden lg:flex flex-col items-center justify-center px-6 relative divider-line"
            >
              <div className="relative h-full flex flex-col items-center">
                {/* Top label */}
                <div className="mb-4">
                  <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-gray-400 font-semibold">
                    VS
                  </span>
                </div>

                {/* Animated line */}
                <div className="w-px flex-1 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-coral/80 divider-fill" />
                </div>

                {/* Center icon — pulsing */}
                <div className="my-4 w-12 h-12 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center pulse-glow">
                  <i className="ri-arrow-right-line text-coral text-base" />
                </div>

                {/* Bottom line */}
                <div className="w-px flex-1 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-coral/80 divider-fill" />
                </div>

                {/* Bottom label */}
                <div className="mt-4">
                  <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-gray-400 font-semibold">
                    VS
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile divider */}
            <div className="lg:hidden flex items-center justify-center py-6">
              <div className="w-16 h-px bg-gray-300" />
              <div className="mx-4 w-8 h-8 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center pulse-glow">
                <i className="ri-arrow-down-line text-coral text-xs" />
              </div>
              <div className="w-16 h-px bg-gray-300" />
            </div>

            {/* AFTER Panel */}
            <div className="relative group/after">
              <div className="bg-white rounded-[24px] p-8 md:p-12 lg:p-14 h-full border border-coral/20 relative overflow-hidden transition-all duration-500 group-hover/after:border-coral/40 group-hover/after:shadow-[0_30px_70px_-30px_rgba(255,90,31,0.35)] group-hover/after:-translate-y-1">
                {/* Coral glow accents */}
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

                {/* Label */}
                <div className="flex items-center gap-3 mb-10 md:mb-14 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
                  <span className="text-coral text-xs font-heading uppercase tracking-[0.15em] font-semibold">
                    Built with VOK
                  </span>
                </div>

                {/* Steps */}
                <div className="relative pl-2 z-10">
                  {afterSteps.map((step, i) => (
                    <div key={step.label} className="relative group/step">
                      {/* Connector line */}
                      {i < afterSteps.length - 1 && (
                        <div className="absolute left-[29px] top-16 w-px h-10 md:h-14 bg-coral/25 transition-colors duration-500 group-hover/step:bg-coral/60" />
                      )}

                      <div className="flex items-start gap-5 mb-0">
                        <div
                          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/step:bg-coral/20 group-hover/step:border-coral/50 group-hover/step:-translate-y-0.5 group-hover/step:scale-105"
                          style={{ animationDelay: `${i * 0.45}s` }}
                        >
                          <i
                            className={`${step.icon} text-coral text-xl md:text-2xl transition-all duration-300 group-hover/step:scale-125 icon-breathe`}
                            style={{ animationDelay: `${i * 0.45}s` }}
                          />
                        </div>
                        <div className="pt-1 transition-transform duration-300 group-hover/step:translate-x-1">
                          <span className="text-[#0C1330] font-heading text-lg md:text-xl tracking-tight block">
                            {step.label}
                          </span>
                          <span className="text-gray-500 text-sm font-body font-light mt-0.5 block">
                            {step.desc}
                          </span>
                        </div>
                      </div>

                      {/* Spacer for line */}
                      {i < afterSteps.length - 1 && (
                        <div className="h-10 md:h-14" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom text */}
              <p className="mt-6 text-sm text-gray-600 font-body font-light px-2 transition-colors duration-300 group-hover/after:text-[#0C1330]">
                We start with how you already work. Then we build the software around it.
              </p>
            </div>
          </div>

          {/* Bottom CTA bar */}
          <div className="mt-16 md:mt-20 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#0C1330] rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_-20px_rgba(12,19,48,0.5)]">
              <i className="ri-check-double-line text-coral" />
              <span className="text-white text-sm font-heading tracking-tight">
                Your workflows. Your rules. Your platform.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        .divider-line .divider-fill {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .divider-line.divider-active .divider-fill {
          transform: scaleY(1);
        }
        .divider-line.divider-active .divider-fill:nth-child(2) {
          transition-delay: 0.3s;
          transform-origin: bottom;
        }

        /* Sequential breathing pulse on icons */
        @keyframes vok-breathe {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 90, 31, 0);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 0 10px rgba(255, 90, 31, 0);
          }
        }
        .icon-breathe {
          animation: vok-breathe 2.4s ease-in-out infinite;
        }
        .after-group .icon-breathe {
          color: #FF5A1F;
        }
        .pulse-glow {
          animation: vok-breathe 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}