import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "wouter";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";
import { ContactModal } from "./ContactModal";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="bg-background pt-16 pb-8 border-t border-border/30 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img src={logoSrc} alt="Mermaid Aquata" className="h-28 object-contain mb-4 drop-shadow-lg" />
              <p className="text-foreground/70 mb-6 max-w-sm">
                Créatrice de queues de sirène artisanales sur mesure. Plongez dans la magie de l'océan avec nos créations uniques en silicone.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mermaid.real.aquata/" target="_blank" rel="noopener noreferrer" data-testid="link-instagram" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#E1306C', background: 'rgba(225,48,108,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ig-grad-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433"/>
                        <stop offset="25%" stopColor="#e6683c"/>
                        <stop offset="50%" stopColor="#dc2743"/>
                        <stop offset="75%" stopColor="#cc2366"/>
                        <stop offset="100%" stopColor="#bc1888"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#ig-grad-footer)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UCXeS0vlrfvEsvBBshqGFl8w" target="_blank" rel="noopener noreferrer" data-testid="link-youtube" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#FF0000', background: 'rgba(255,0,0,0.1)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@mermaid.aquata.sirene" target="_blank" rel="noopener noreferrer" data-testid="link-tiktok" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#69C9D0', background: 'rgba(105,201,208,0.1)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <button
                  onClick={() => setContactOpen(true)}
                  data-testid="link-email"
                  className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors"
                >
                  <Mail size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif text-xl mb-4 text-white">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-foreground/70 hover:text-primary transition-colors">Accueil</Link></li>
                <li><Link href="/catalogue" className="text-foreground/70 hover:text-primary transition-colors">Catalogue</Link></li>
                <li><Link href="/commander" className="text-foreground/70 hover:text-primary transition-colors">Commander</Link></li>
                <li><Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/remerciements" className="text-foreground/70 hover:text-primary transition-colors">Remerciements</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif text-xl mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-foreground/70 mb-5">
                <li>sireneaurore31@hotmail.com</li>
                <li>1 Rue du Docteur Albert Schweitzer</li>
                <li>31200 Toulouse, France</li>
              </ul>
              <button
                onClick={() => setContactOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: "rgba(0,200,239,0.15)", border: "1.5px solid rgba(0,200,239,0.5)", color: "#00c8ef" }}
              >
                <Mail size={15} /> Nous contacter
              </button>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 mb-6 flex flex-col sm:flex-row gap-2 justify-center">

            {/* Mentions légales */}
            <details className="group flex-1 max-w-xs">
              <summary className="cursor-pointer text-xs text-foreground/40 hover:text-foreground/60 transition-colors text-center select-none list-none flex items-center justify-center gap-1">
                <span>Mentions légales</span>
                <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div className="mt-4 text-xs text-foreground/45 text-center leading-relaxed space-y-0.5">
                <p className="font-medium text-foreground/60">Mermaid Aquata</p>
                <p>Bardet Aurore</p>
                <p>1 rue du Docteur Albert Schweitzer, 31200 Toulouse</p>
                <p>Entrepreneur individuel — TVA non applicable</p>
                <p>N° SIRET : 802 791 222 8</p>
              </div>
            </details>

            <div className="hidden sm:block w-px bg-border/30 self-stretch" />

            {/* Politique de remboursement */}
            <details className="group flex-1 max-w-2xl">
              <summary className="cursor-pointer text-xs text-foreground/40 hover:text-foreground/60 transition-colors text-center select-none list-none flex items-center justify-center gap-1">
                <span>Politique de remboursement</span>
                <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div className="mt-4 text-xs text-foreground/45 text-left leading-relaxed space-y-3 max-w-2xl mx-auto">
                <p>Nous appliquons une politique de retour de <strong className="text-foreground/60">30 jours</strong> après réception de votre article. L'article doit être dans le même état que celui reçu, non porté ou non utilisé, avec les étiquettes et dans son emballage d'origine, accompagné du reçu ou de la preuve d'achat.</p>
                <p>Pour effectuer un retour, contactez-nous à <a href="mailto:sirenebleu31@gmail.com" className="underline hover:text-foreground/70">sirenebleu31@gmail.com</a>. Les retours sont à envoyer à : <em>Bardet Aurore, 1 rue du docteur Albert Schweitzer, 31200 Toulouse</em>. Les articles renvoyés sans demande préalable ne seront pas acceptés.</p>
                <div>
                  <p className="font-medium text-foreground/60 mb-1">Dommages et problèmes</p>
                  <p>Inspectez votre commande dès réception et contactez-nous immédiatement si l'article est défectueux ou endommagé.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/60 mb-1">Articles non retournables</p>
                  <p>Les produits sur mesure ou personnalisés ne peuvent pas être retournés. Les articles en promotion et les cartes-cadeaux sont également exclus.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/60 mb-1">Délai de réflexion UE — 14 jours</p>
                  <p>Si la marchandise est expédiée dans l'Union européenne, vous disposez de 14 jours pour annuler ou retourner votre commande, sans justification.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/60 mb-1">Remboursements</p>
                  <p>Un remboursement total est possible jusqu'à <strong className="text-foreground/60">48h après confirmation d'achat</strong>. Passé ce délai, le remboursement sera de 50 % du prix initial. Une fois la création sur mesure commencée, aucun remboursement n'est possible.</p>
                  <p className="mt-1">Une fois le retour reçu et inspecté, vous serez remboursé(e) sur votre moyen de paiement d'origine sous <strong className="text-foreground/60">10 jours ouvrables</strong>. Si plus de 15 jours ouvrables se sont écoulés, contactez-nous à <a href="mailto:sirenebleu31@gmail.com" className="underline hover:text-foreground/70">sirenebleu31@gmail.com</a>.</p>
                </div>
              </div>
            </details>

          </div>

          <div className="border-t border-border/30 pt-6 text-center text-sm text-foreground/50">
            <p>&copy; {new Date().getFullYear()} Mermaid Aquata - By Cyril Allegret - <a href="https://innov-studio.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#00c8ef' }} className="hover:opacity-80 transition-opacity">Innov Studio</a>. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
