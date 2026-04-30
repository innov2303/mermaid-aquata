import { Link, useLocation } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/translations";

export function NavBar() {
  const [location] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isScrolled = scrollY > 50;

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/catalogue", label: t.nav.catalogue },
    { href: "/commander", label: t.nav.commander },
    { href: "/faq", label: t.nav.faq },
    { href: "/remerciements", label: t.nav.remerciements },
  ];

  const currentLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled
            ? "rgba(220,240,252,0.80)"
            : isMobile ? "transparent" : "rgba(255,255,255,0.30)",
          backdropFilter: isMobile && !isScrolled ? "none" : "blur(14px)",
          borderBottom: isMobile && !isScrolled ? "none" : "1px solid rgba(0,180,220,0.18)",
          boxShadow: isScrolled ? "0 2px 14px rgba(0,120,180,0.10)" : "none",
        }}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img
              src={logoSrc}
              alt="Mermaid Aquata"
              className={`object-contain transition-all duration-300 drop-shadow-lg ${
                isScrolled ? "h-9 md:h-16" : "h-10 md:h-20"
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
                  data-testid={`link-nav-${link.href.replace('/', '') || 'home'}`}
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

          {/* Right controls: lang switcher + hamburger */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ color: "#0a2a4a", background: langOpen ? "rgba(0,200,239,0.12)" : "transparent", border: "1px solid rgba(0,180,220,0.25)" }}
                aria-label="Choisir la langue"
              >
                <Globe size={15} />
                <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
                <span className="sm:hidden">{currentLang.flag}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden min-w-[140px]"
                    style={{ background: "rgba(2,14,40,0.95)", backdropFilter: "blur(16px)", border: "1.5px solid rgba(0,200,239,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                  >
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left transition-colors hover:bg-white/5"
                        style={{ color: l.code === lang ? "#00c8ef" : "#e0f5ff", fontWeight: l.code === lang ? "600" : "400" }}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ background: "rgba(2,10,32,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Header area */}
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
                      data-testid={`link-mobile-${link.href.replace('/', '') || 'home'}`}
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

            {/* Mobile language selector */}
            <div className="flex-shrink-0 pb-8 px-6">
              <div className="mx-0 mb-5" style={{ height: 1, background: "rgba(0,200,239,0.2)" }} />
              <div className="flex justify-center gap-3">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs transition-all"
                    style={{
                      background: l.code === lang ? "rgba(0,200,239,0.15)" : "transparent",
                      border: l.code === lang ? "1.5px solid rgba(0,200,239,0.4)" : "1.5px solid rgba(255,255,255,0.08)",
                      color: l.code === lang ? "#00c8ef" : "rgba(224,245,255,0.6)",
                    }}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
