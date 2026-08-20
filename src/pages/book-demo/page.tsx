import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { supabase } from "@/lib/supabase";

export default function BookDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypot = formData.get("company_alt")?.toString().trim();
    if (honeypot) {
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    const val = (k: string) => formData.get(k)?.toString().trim() || null;
    const name = val("name");
    const email = val("email");
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter your name and a valid email.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase.from("leads").insert({
        name,
        organization: val("organization"),
        email,
        phone: val("phone"),
        website: val("website"),
        sport: val("industry"),
        athletes_count: val("members_count"),
        current_software: val("current_software"),
        pain_points: val("pain_points"),
        dream_platform: val("dream_platform"),
        source: "buildwithvok.com",
      });
      if (error) throw error;
      setSubmitted(true);
      form.reset();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1330]">
      <Navbar />
      <main>
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
            <div data-animate className="opacity-0 max-w-3xl mb-16 md:mb-24">
              <span className="vok-label">Book a Demo</span>
              <h1 className="vok-headline text-4xl md:text-5xl lg:text-[78px] mt-4 tracking-[-3.12px]">
                Tell us how you work.
              </h1>
              <p className="vok-body mt-6">
                We&apos;ll show you what your platform could look like.
              </p>
            </div>

            <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Form */}
              <div data-animate className="opacity-0 lg:col-span-7">
                {submitted ? (
                  <div className="border border-coral/30 rounded-[24px] p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-6">
                      <i className="ri-check-line text-coral text-2xl" />
                    </div>
                    <h2 className="vok-headline text-2xl md:text-3xl tracking-[-1.68px] mb-4">
                      Let&apos;s build around the way you work.
                    </h2>
                    <p className="vok-body">
                      We&apos;ve received your message and will be in touch within 24 hours.
                    </p>
                    <Link to="/" className="btn-primary mt-8 inline-flex">
                      BACK TO HOME
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >

                    {/* Honeypot */}
                    <input
                      type="text"
                      name="company_alt"
                      className="honeypot-field"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      readOnly
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Organization
                        </label>
                        <input
                          type="text"
                          name="organization"
                          required
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                          placeholder="Club or business name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                          placeholder="yourclub.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                        placeholder="(469) 555-0123"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Industry
                        </label>
                        <select
                          name="industry"
                          required
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="sports-club">Sports Club / Academy</option>
                          <option value="youth-sports">Youth Sports</option>
                          <option value="business">Business / Enterprise</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                          Approx. Members / Users
                        </label>
                        <select
                          name="members_count"
                          required
                          className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="50-200">50 - 200</option>
                          <option value="200-500">200 - 500</option>
                          <option value="500-1000">500 - 1,000</option>
                          <option value="1000+">1,000+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                        What software do you currently use?
                      </label>
                      <input
                        type="text"
                        name="current_software"
                        className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors"
                        placeholder="TeamSnap, Excel, custom solution, etc."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                        What doesn&apos;t work about it?
                      </label>
                      <textarea
                        name="pain_points"
                        rows={3}
                        maxLength={500}
                        className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors resize-none"
                        placeholder="Describe your biggest frustrations..."
                      />
                      <p className="text-[#9a9a9a] text-xs mt-1">Max 500 characters</p>
                    </div>

                    <div>
                      <label className="text-xs font-heading uppercase tracking-[0.025em] text-[#9a9a9a] block mb-2">
                        What would you build if you could?
                      </label>
                      <textarea
                        name="dream_platform"
                        rows={3}
                        maxLength={500}
                        className="w-full bg-[#1a2342] border border-white/10 rounded-[12px] px-4 py-3 text-white font-body font-light text-sm focus:outline-none focus:border-coral/50 transition-colors resize-none"
                        placeholder="Your ideal platform..."
                      />
                      <p className="text-[#9a9a9a] text-xs mt-1">Max 500 characters</p>
                    </div>

                    {formError && (
                      <div className="text-coral text-sm font-body">{formError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full sm:w-auto disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <i className="ri-loader-4-line animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          BUILD WITH VOK
                          <i className="ri-arrow-right-line ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Side info */}
              <div data-animate className="opacity-0 lg:col-span-5 lg:pt-8">
                <div className="border border-white/10 rounded-[24px] p-8 md:p-10">
                  <h3 className="vok-headline text-xl md:text-2xl tracking-[-0.48px] mb-6">
                    What happens next?
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-coral font-heading text-xs">1</span>
                      </div>
                      <div>
                        <span className="text-white font-heading text-sm block">We review your submission</span>
                        <span className="text-[#9a9a9a] text-sm font-body font-light">Within 24 hours</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-coral font-heading text-xs">2</span>
                      </div>
                      <div>
                        <span className="text-white font-heading text-sm block">Discovery call</span>
                        <span className="text-[#9a9a9a] text-sm font-body font-light">We learn how you work</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-coral font-heading text-xs">3</span>
                      </div>
                      <div>
                        <span className="text-white font-heading text-sm block">Platform preview</span>
                        <span className="text-[#9a9a9a] text-sm font-body font-light">See what your platform could look like</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border border-white/10 rounded-[24px] p-8 md:p-10">
                  <p className="vok-body text-sm">
                    &ldquo;The future of custom software should not require a giant development team or a giant budget.&rdquo;
                  </p>
                  <span className="text-coral text-xs font-heading uppercase tracking-[0.025em] mt-4 block">
                    — The VOK Team
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
