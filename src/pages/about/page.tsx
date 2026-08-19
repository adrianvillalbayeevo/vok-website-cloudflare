import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";

const teamRoles = [
  { role: "Developers", description: "Full-stack engineers building your platform" },
  { role: "Product Thinkers", description: "Mapping your operation to technology" },
  { role: "Designers", description: "Crafting interfaces that fit your users" },
  { role: "Operators", description: "Understanding how your business actually works" },
  { role: "AI-Native Builders", description: "Integrating intelligence where it creates value" },
];

const methodologySteps = [
  { label: "CLIENT", desc: "Your operation, workflows, and goals" },
  { label: "VOK PRODUCT TEAM", desc: "Human product thinking at the center" },
  { label: "AI AGENTS", desc: "Specialized agents accelerating every phase" },
];

export default function About() {
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

  return (
    <div className="min-h-screen bg-[#0C1330]">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-12 md:pt-16 pb-6 md:pb-8">
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
            <div data-animate className="opacity-0 max-w-4xl">
              <span className="vok-label">About VOK</span>
              <h1 className="vok-headline text-4xl md:text-5xl lg:text-[78px] mt-3 tracking-[-3.12px]">
                A different kind of software team.
              </h1>
              <p className="vok-body mt-4 max-w-xl">
                Small by design. Agentic by default. Built to move fast.
              </p>
            </div>
          </div>
        </section>

        {/* Team composition */}
        <section ref={sectionRef}>
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16 pt-4 md:pt-6 pb-16 md:pb-24">
            <div data-animate className="opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left: Team */}
              <div>
                <h2 className="vok-headline text-2xl md:text-3xl lg:text-[42px] tracking-[-1.68px] mb-8">
                  Who we are
                </h2>
                <p className="vok-body mb-8">
                  VOK is a focused group of builders who believe custom software should be accessible, not exclusive.
                </p>

                <div className="space-y-4">
                  {teamRoles.map((member) => (
                    <div
                      key={member.role}
                      className="flex items-start gap-4 py-3 border-b border-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-coral/60 mt-2 flex-shrink-0" />
                      <div>
                        <span className="text-white font-heading text-base tracking-tight block">
                          {member.role}
                        </span>
                        <span className="text-[#9a9a9a] text-sm font-body font-light">
                          {member.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Methodology */}
              <div>
                <h2 className="vok-headline text-2xl md:text-3xl lg:text-[42px] tracking-[-1.68px] mb-8">
                  Agile + Agentic
                </h2>
                <p className="vok-body mb-8">
                  The team works in an agentic development model, using AI tools and specialized agents throughout the development process to research, map workflows, prototype, develop, test, document, and iterate faster.
                </p>

                <div className="border border-white/10 rounded-[24px] p-8 md:p-10 mb-8">
                  <div className="space-y-4">
                    {methodologySteps.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[#1a2342] flex items-center justify-center flex-shrink-0">
                          <span className="text-coral font-heading text-xs">{i + 1}</span>
                        </div>
                        <div>
                          <span className="text-white font-heading text-sm uppercase tracking-[0.025em] block">
                            {step.label}
                          </span>
                          <span className="text-[#9a9a9a] text-xs font-body font-light">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <span className="text-coral font-heading text-sm uppercase tracking-[0.025em]">
                      = Faster Custom Software
                    </span>
                  </div>
                </div>

                <p className="text-white/80 text-lg font-body font-light mb-4">
                  We use AI to reduce the cost and time of custom development — not to remove the thinking that makes custom software valuable.
                </p>
                <p className="vok-body">
                  The future of custom software should not require a giant development team or a giant budget.
                </p>
              </div>
            </div>

            {/* Focus areas */}
            <div data-animate className="opacity-0 mt-16 md:mt-20">
              <h2 className="vok-headline text-2xl md:text-3xl lg:text-[36px] tracking-[-1.68px] mb-12">
                What we focus on
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Compact teams",
                  "Rapid iteration",
                  "Reusable infrastructure",
                  "Agentic workflows",
                  "Modern cloud architecture",
                  "Client partnerships",
                  "Operational deep-dives",
                  "Long-term platform evolution",
                ].map((focus) => (
                  <div
                    key={focus}
                    className="flex items-center gap-3 py-3 px-4 border border-white/10 rounded-[12px] hover:border-coral/30 transition-colors duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-coral/60 flex-shrink-0" />
                    <span className="text-[#bdbdbd] text-sm font-body font-light">
                      {focus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div data-animate className="opacity-0 mt-16 md:mt-20 text-center">
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