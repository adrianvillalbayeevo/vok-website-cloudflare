import { useState, useEffect, useRef } from "react";
import { caseStudiesData } from "@/mocks/homeData";

export default function CaseStudiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  const activeCase = caseStudiesData[activeIndex];

  return (
    <section ref={sectionRef} className="bg-[#0C1330] relative">
      <div className="container-max mx-auto px-6 md:px-12 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-16 md:pb-24 lg:pb-32">
        {/* Header */}
        <div data-animate className="opacity-0 mb-16 md:mb-24">
          <span className="vok-label">Built with VOK</span>
          <h2 className="vok-headline text-3xl md:text-4xl lg:text-[48px] mt-4 tracking-[-1.68px]">
            Built around real organizations.
          </h2>
        </div>

        {/* Case Study Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 md:mb-16" data-animate>
          {caseStudiesData.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setActiveIndex(i)}
              className={`px-5 py-2.5 font-heading text-sm uppercase tracking-[0.025em] rounded-full transition-all duration-300 whitespace-nowrap ${
                i === activeIndex
                  ? "bg-coral text-white"
                  : "bg-transparent text-[#9a9a9a] hover:text-white border border-white/10"
              }`}
            >
              {item.shortName}
            </button>
          ))}
        </div>

        {/* Active Case Study Content */}
        <div data-animate className="opacity-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Text content */}
            <div className="order-2 lg:order-1">
              <h3 className="vok-headline text-2xl md:text-3xl lg:text-[36px] tracking-[-1.68px] mb-6">
                {activeCase.name}
              </h3>
              <p className="vok-body mb-6">{activeCase.description}</p>
              <p className="vok-body mb-8">{activeCase.result}</p>

              {/* Features list */}
              <div className="flex flex-wrap gap-3 mb-8">
                {activeCase.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] border border-white/10 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <span className="vok-label text-coral">BUILT WITH VOK</span>
            </div>

            {/* Visual */}
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[24px]">
                <img
                  src={activeCase.image}
                  alt={`${activeCase.name} platform built with VOK`}
                  className="w-full h-auto object-cover"
                />
                {/* Blue/navy overlay to harmonize with VOK site colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0C1330]/40 via-[#0C1330]/25 to-transparent" />
                <div className="absolute inset-0 bg-[#0C1330]/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1330]/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}