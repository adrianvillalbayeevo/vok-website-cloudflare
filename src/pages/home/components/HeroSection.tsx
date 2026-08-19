import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ParticleConstellation from "@/components/ParticleConstellation";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

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

    const elements = heroRef.current?.querySelectorAll("[data-animate]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-background-50"
    >
      {/* Full-screen particle laptop constellation */}
      <div className="absolute inset-0 z-0">
        <ParticleConstellation />
      </div>

      {/* Left gradient for text readability */}
      <div className="absolute inset-y-0 left-0 w-1/2 z-[1] bg-gradient-to-r from-background-50 via-background-50/50 to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 container-max mx-auto px-6 md:px-12 lg:px-16 pt-28 md:pt-36 lg:pt-44 pb-4 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <div data-animate className="opacity-0">
              <h1 className="vok-headline text-5xl md:text-6xl lg:text-[78px] leading-[1.1] tracking-[-3.12px]">
                Your club.
              </h1>
              <h1 className="vok-headline text-5xl md:text-6xl lg:text-[78px] leading-[1.1] tracking-[-3.12px] mt-1">
                Your platform.
              </h1>
            </div>

            <p
              data-animate
              className="mt-8 vok-body max-w-md opacity-0"
            >
              Stop adapting your club to someone else&apos;s software.
              We build your own platform around the way you actually operate.
            </p>

            <p
              data-animate
              className="mt-4 text-sm text-[#9a9a9a] font-body font-light opacity-0"
            >
              Registrations. Payments. Programs. Teams. Communication. Your workflows. Your rules. Your brand.
            </p>

            <div data-animate className="mt-10 flex flex-wrap gap-4 opacity-0">
              <Link to="/book-demo" className="btn-primary">
                BUILD WITH VOK
                <i className="ri-arrow-right-line ml-2" />
              </Link>
              <Link to="/process" className="btn-ghost">
                SEE HOW IT WORKS
                <i className="ri-arrow-right-line ml-2" />
              </Link>
            </div>
          </div>

          {/* Right side: empty, particles fill the space */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}