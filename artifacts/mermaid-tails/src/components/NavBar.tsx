import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";

export function NavBar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/commander", label: "Commander" },
    { href: "/faq", label: "FAQ" },
    { href: "/remerciements", label: "Remerciements" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "rgba(220, 240, 252, 0.55)"
          : "rgba(225, 243, 255, 0.35)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,180,220,0.20)",
        boxShadow: "0 2px 14px rgba(0,120,180,0.08)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2 z-50" data-testid="link-logo">
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
              className="text-sm tracking-widest uppercase transition-colors"
              style={{
                color: location === link.href ? "#00a8cc" : "#0a2a4a",
                fontWeight: location === link.href ? "600" : "400",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50"
          style={{ color: "#0a2a4a" }}
          data-testid="button-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={logoSrc} alt="Mermaid Aquata" className="h-20 object-contain mb-4 drop-shadow-lg" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`link-mobile-${link.label.toLowerCase()}`}
              className={`text-2xl font-serif transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
