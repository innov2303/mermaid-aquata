import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";

export function NavBar() {
  const [location] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isScrolled = scrollY > 50;

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/commander", label: "Commander" },
    { href: "/faq", label: "FAQ" },
    { href: "/remerciements", label: "Remerciements" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled ? "rgba(220,240,252,0.80)" : "rgba(255,255,255,0.30)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,180,220,0.18)",
          boxShadow: isScrolled ? "0 2px 14px rgba(0,120,180,0.10)" : "none",
        }}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img
              src={logoSrc}
              alt="Mermaid Aquata"
              className={`object-contain transition-all duration-300 drop-shadow-lg ${
                isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
              }`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                  className="text-sm tracking-widest uppercase transition-all duration-300"
                  style={{
                    color: isActive ? "#00a8cc" : "#0a2a4a",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ color: "#0a2a4a" }}
            data-testid="button-mobile-menu"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay — outside header so z-index is independent */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{
              background: "rgba(2,10,32,0.97)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header area replica — keeps spacing consistent */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ minHeight: 72 }}>
              <img src={logoSrc} alt="Mermaid Aquata" className="h-16 object-contain drop-shadow-lg" />
              <button
                className="p-2 rounded-xl"
                style={{ color: "#e0f5ff" }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={28} />
              </button>
            </div>

            {/* Cyan separator */}
            <div className="mx-6" style={{ height: 1, background: "rgba(0,200,239,0.25)" }} />

            {/* Nav links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-6">
              {navLinks.map((link, i) => {
                const isActive = location === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`link-mobile-${link.label.toLowerCase()}`}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-2xl font-serif transition-all duration-200"
                      style={{
                        color: isActive ? "#00c8ef" : "#e0f5ff",
                        background: isActive ? "rgba(0,200,239,0.12)" : "transparent",
                        border: isActive ? "1.5px solid rgba(0,200,239,0.35)" : "1.5px solid transparent",
                        textShadow: isActive ? "0 0 16px rgba(0,200,239,0.6)" : "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom decoration */}
            <div className="flex-shrink-0 pb-10 text-center" style={{ color: "rgba(0,200,239,0.3)", fontSize: "1.5rem" }}>
              ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
