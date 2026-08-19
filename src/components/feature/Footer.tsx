import { Link } from "react-router-dom";
import VokLogo from "@/components/base/VokLogo";

const footerLinks = {
  explore: [
    { label: "Process", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
  ],
  start: [
    { label: "Book a Demo", href: "/book-demo" },
    { label: "Contact", href: "/book-demo" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container-max mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <VokLogo variant="dark" className="mb-6" />
            <p className="text-[#0C1330]/70 text-base font-body font-light max-w-sm mb-6 leading-relaxed">
              We build custom software platforms around the way your business actually operates. Your workflows. Your rules. Your platform.
            </p>
            <a href="mailto:contact@buildwithvok.com" className="text-[#0C1330]/70 text-sm font-body hover:text-coral transition-colors mb-6 inline-block">
              contact@buildwithvok.com
            </a>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse-soft" />
              <span className="text-[#0C1330]/50 text-xs font-heading uppercase tracking-[0.025em]">Built with VOK</span>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[#0C1330] text-xs font-heading font-semibold uppercase tracking-[0.35px] mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#0C1330]/60 text-sm font-body font-light hover:text-coral transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[#0C1330] text-xs font-heading font-semibold uppercase tracking-[0.35px] mb-6">
              Start
            </h4>
            <ul className="space-y-3">
              {footerLinks.start.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#0C1330]/60 text-sm font-body font-light hover:text-coral transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-2">
            <h4 className="text-[#0C1330] text-xs font-heading font-semibold uppercase tracking-[0.35px] mb-6">
              Ready?
            </h4>
            <Link
              to="/book-demo"
              className="inline-block text-sm font-heading font-medium text-coral hover:text-[#0C1330] transition-colors uppercase tracking-[0.025em]"
            >
              BUILD WITH VOK
              <i className="ri-arrow-right-line ml-1" />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#0C1330]/40 text-xs font-body font-light">
            &copy; {new Date().getFullYear()} VOK. Your way. Your platform.
          </p>
          <p className="text-[#0C1330]/40 text-xs font-body font-light">
            Custom software platforms for clubs, academies, and businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}