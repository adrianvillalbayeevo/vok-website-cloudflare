import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { ASSETS } from "@/config/assets";

const projects = [
  {
    name: "Basketball Academy",
    location: "Dallas",
    tagline: "They already knew how they wanted to operate. They didn't need software telling them how \u2014 so we built around them.",
    before: "A generic sports platform plus spreadsheets and workarounds forcing their workflows.",
    after: "Their own integrated platform \u2014 custom website, online registration, and card & ACH payments \u2014 replacing multiple disconnected tools.",
    features: ["Custom Website", "Registration", "Payments", "Admin Dashboard"],
    image: ASSETS.caseMockup,
  },
  {
    name: "Girls' Basketball Club",
    location: "Dallas",
    tagline: "A local girls' basketball club getting its own platform, built around the way they run their programs.",
    before: "Fragmented tools for teams, registration, memberships, payments and parent communication.",
    after: "One platform of their own \u2014 registration, memberships, payments, schedules and parent communication, all under their brand.",
    features: ["Custom Website", "Registration", "Memberships", "Payments", "Parent Comms"],
    image: ASSETS.caseMockup,
  },
];

export default function Work() {
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
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
            <div data-animate className="opacity-0 max-w-3xl">
              <span className="vok-label">Portfolio</span>
              <h1 className="vok-headline text-4xl md:text-5xl lg:text-[78px] mt-4 tracking-[-3.12px]">
                Built with VOK.
              </h1>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section ref={sectionRef}>
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16 section-padding">
            <div className="space-y-24 md:space-y-32">
              {projects.map((project, i) => (
                <div
                  key={project.name}
                  data-animate
                  className="opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                  {/* Image - alternating sides */}
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative overflow-hidden rounded-[24px]">
                      <img
                        src={project.image}
                        alt={`${project.name} platform`}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1330]/50 to-transparent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="vok-headline text-2xl md:text-3xl lg:text-[42px] tracking-[-1.68px] mb-2">
                      {project.name}
                    </h2>
                    {project.location && (
                      <span className="text-coral text-sm font-heading uppercase tracking-[0.025em]">
                        {project.location}
                      </span>
                    )}
                    <p className="vok-body mt-6 mb-6">{project.tagline}</p>

                    <div className="space-y-4 mb-8">
                      <div className="border-l-2 border-white/10 pl-4">
                        <span className="text-[#9a9a9a] text-xs font-heading uppercase tracking-[0.025em] block mb-1">
                          Before
                        </span>
                        <p className="text-[#bdbdbd] text-sm font-body font-light">
                          {project.before}
                        </p>
                      </div>
                      <div className="border-l-2 border-coral/40 pl-4">
                        <span className="text-coral text-xs font-heading uppercase tracking-[0.025em] block mb-1">
                          After
                        </span>
                        <p className="text-white text-sm font-body">
                          {project.after}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] border border-white/10 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div data-animate className="opacity-0 mt-24 md:mt-32 text-center">
              <h2 className="vok-headline text-2xl md:text-3xl lg:text-[36px] tracking-[-1.68px] mb-4">
                Different businesses.
                <br />
                Different workflows.
                <br />
                Different platforms.
              </h2>
              <p className="vok-label text-coral mb-8">That&apos;s the point.</p>
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