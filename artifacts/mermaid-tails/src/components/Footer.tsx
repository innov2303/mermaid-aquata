import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "wouter";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";

export function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img src={logoSrc} alt="Mermaid Aquata" className="h-16 object-contain mb-4 drop-shadow-lg" />
            <p className="text-foreground/70 mb-6 max-w-sm">
              Créatrice de queues de sirène artisanales sur mesure. Plongez dans la magie de l'océan avec nos créations uniques en silicone et tissu.
            </p>
            <div className="flex gap-4">
              <a href="#" data-testid="link-instagram" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" data-testid="link-facebook" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" data-testid="link-email" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-4 text-white">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-foreground/70 hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/catalogue" className="text-foreground/70 hover:text-primary transition-colors">Catalogue</Link></li>
              <li><Link href="/commander" className="text-foreground/70 hover:text-primary transition-colors">Commander</Link></li>
              <li><Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-foreground/70">
              <li>contact@mermaidaquata.fr</li>
              <li>Atelier en Bretagne, France</li>
              <li>Sur rendez-vous uniquement</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/50">
          <p>&copy; {new Date().getFullYear()} Mermaid Aquata. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">Mentions légales</a>
            <a href="#" className="hover:text-foreground">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
