import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import VokLogo from "@/components/base/VokLogo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Process", href: "/platform" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0C1330]/90 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-max mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <VokLogo light />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 transition-colors duration-200 whitespace-nowrap font-heading text-sm uppercase tracking-[0.025em] ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-[#9a9a9a] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/book-demo"
              className="btn-primary"
            >
              BUILD WITH VOK
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ri-${mobileOpen ? "close" : "menu"}-line text-xl`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0C1330]/98 backdrop-blur-md border-t border-white/5">
          <div className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 font-heading text-sm uppercase tracking-[0.025em] transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-[#9a9a9a] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link to="/book-demo" className="btn-primary w-full text-center">
                BUILD WITH VOK
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}