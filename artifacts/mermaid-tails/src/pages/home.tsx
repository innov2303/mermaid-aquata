import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, Droplet, Fish, Sparkles, Gem, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveSeparator } from "@/components/WaveSeparator";
import { useEffect, useState } from "react";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";

const BUBBLE_COUNT = 8;

export default function Home() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: BUBBLE_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 8 + 3,
      duration: Math.random() * 14 + 12,
      delay: Math.random() * 12,
    }));
    setBubbles(generated);
  }, []);

  const scrollToNext = () => {
    document.getElementById("presentation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Photorealistic background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/images/hero.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        {/* Dark gradient overlay for readability — heavier at top (nav) and bottom */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/70 via-background/30 to-background/75" />
        {/* Subtle side vignette */}
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,18,40,0.55) 100%)' }} />

        {/* Very subtle realistic bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                left: bubble.left,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animationDuration: `${bubble.duration}s`,
                animationDelay: `${bubble.delay}s`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>

        {/* Artistic medallion: logo + arrow unified */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Shell-shaped frame (scallop / coquille Saint-Jacques) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative flex items-center justify-center"
              style={{ width: 380, height: 340 }}
            >
              {/* Real shell photo — background removed, transparent PNG */}
              <img
                src="/images/shell-frame.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                style={{
                  filter: "drop-shadow(0 0 18px rgba(0,200,239,0.35)) drop-shadow(0 8px 24px rgba(0,0,0,0.5)) brightness(1.08) saturate(0.75) hue-rotate(160deg)",
                  opacity: 0.88,
                }}
              />

              {/* Logo and tagline centred inside the shell's open cup */}
              <div className="relative z-10 flex flex-col items-center" style={{ marginTop: "-14%" }}>
                <img
                  src={logoSrc}
                  alt="Mermaid Aquata"
                  className="w-44 md:w-56 object-contain drop-shadow-[0_4px_22px_rgba(0,0,0,0.75)]"
                />
                <p className="mt-2 text-[10px] md:text-xs font-light tracking-[0.28em] text-white/70 uppercase text-center drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                  Créatrice de Queues Artisanales
                </p>
              </div>
            </motion.div>

            {/* Connector stem */}
            <div className="flex flex-col items-center gap-0">
              <div className="w-px h-5 bg-gradient-to-b from-cyan-400/60 to-transparent" />
              {/* Diamond gem */}
              <div className="w-2.5 h-2.5 rotate-45 bg-cyan-300/70 border border-cyan-200/50 shadow-[0_0_8px_rgba(0,200,239,0.7)]" />
              <div className="w-px h-4 bg-gradient-to-b from-cyan-400/40 to-transparent" />

              {/* Arrow integrated at the bottom of the medallion */}
              <motion.button
                onClick={scrollToNext}
                data-testid="button-scroll-down"
                className="flex flex-col items-center group cursor-pointer mt-1"
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <svg width="38" height="28" viewBox="0 0 38 28" fill="none" className="group-hover:opacity-100 opacity-75 transition-opacity drop-shadow-[0_0_6px_rgba(0,200,239,0.6)]">
                  <path d="M4 6 L19 22 L34 6" stroke="rgba(0,200,239,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 2 L19 12 L28 2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        <WaveSeparator className="absolute bottom-0 left-0 text-background z-10" />
      </section>

      {/* Présentation Section */}
      <section id="presentation" className="py-24 relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-8"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto lg:mx-0">
                <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-primary/60 animate-[spin_10s_linear_infinite] shadow-[0_0_25px_rgba(0,200,239,0.4)]"></div>
                <div className="absolute inset-2 rounded-[50%_50%_40%_60%/50%_40%_60%_50%] border-2 border-secondary/40 animate-[spin_15s_linear_infinite_reverse]"></div>
                <img 
                  src="/images/portrait.png" 
                  alt="La Créatrice" 
                  className="absolute inset-4 object-cover w-[calc(100%-2rem)] h-[calc(100%-2rem)] rounded-full shadow-2xl"
                />
              </div>
              <div className="prose prose-lg prose-invert text-foreground/80 font-light leading-relaxed">
                <p className="text-xl md:text-2xl font-serif text-white mb-6">
                  "Passionnée par l'océan depuis mon enfance, je crée des queues de sirène sur mesure alliant beauté artistique et qualité artisanale."
                </p>
                <p>
                  Chaque création est unique, façonnée avec amour dans mon atelier pour vous permettre de vivre votre rêve de sirène. De la première esquisse à la dernière écaille posée à la main, je mets tout mon cœur pour donner vie à votre vision.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50 group cursor-pointer">
                <div className="absolute inset-0 bg-card/40 backdrop-blur-sm transition-all duration-500 group-hover:bg-card/20"></div>
                <img src="/images/tail-work.png" alt="Atelier" className="w-full h-full object-cover mix-blend-luminosity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,200,239,0.7)] group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-background fill-current ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0">
                  <span className="font-serif text-xl text-white tracking-widest uppercase">Reportage TV - Notre Histoire</span>
                </div>
              </div>
              <p className="text-foreground/70 italic max-w-md">
                Pour en savoir plus sur mon parcours, regardez le reportage qui m'a été consacré.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Travail Section */}
      <section className="py-24 bg-card relative">
        <WaveSeparator className="absolute top-0 left-0 text-background -translate-y-full" />
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 text-cyan-shimmer">Notre Travail</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Fish size={32} className="text-primary" />}
              title="Queues Monopalmes"
              desc="Pour la natation sportive et artistique, nos queues monopalmes allient performance et beauté."
              delay={0}
            />
            <FeatureCard 
              icon={<Droplet size={32} className="text-secondary" />}
              title="Sirènes Pieds Invisibles"
              desc="La magie d'une vraie sirène avec vos pieds dissimulés dans une nageoire réaliste."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Gem size={32} className="text-accent" />}
              title="Modèles Silicone"
              desc="La précision du silicone pour un rendu ultra-réaliste, chaque écaille sculptée à la main."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Paintbrush size={32} className="text-primary" />}
              title="Créations Sur Mesure"
              desc="Chaque queue est unique, créée selon vos souhaits de couleurs, motifs et mesures."
              delay={0.3}
              className="lg:col-start-1 lg:col-end-2 lg:ml-auto"
            />
            <FeatureCard 
              icon={<Sparkles size={32} className="text-secondary" />}
              title="Accessoires"
              desc="Bijoux de sirène, soutiens-gorge coquillage, couronnes et accessoires assortis."
              delay={0.4}
              className="lg:col-start-2 lg:col-end-3"
            />
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(0,200,239,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,200,239,0.7)] hover:scale-105">
              <Link href="/catalogue">Voir Notre Catalogue</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative bg-background">
        <WaveSeparator className="absolute top-0 left-0 text-card -translate-y-full" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Prête à devenir sirène ?</h2>
              <p className="text-xl text-foreground/80 mb-12 font-light">
                Contactez-nous pour discuter de votre projet sur mesure et donner vie à vos rêves d'océan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-[0_0_15px_rgba(0,200,239,0.3)] hover:shadow-[0_0_25px_rgba(0,200,239,0.6)]">
                  contact@mermaidaquata.fr
                </Button>
                <div className="flex gap-4">
                  {['Instagram', 'Facebook', 'TikTok'].map((social, i) => (
                    <a key={social} href="#" className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110">
                      <span className="sr-only">{social}</span>
                      <div className="w-6 h-6 bg-current" style={{ maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>')`, maskSize: 'cover', WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>')`, WebkitMaskSize: 'cover' }}></div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay, className = "" }: { icon: React.ReactNode, title: string, desc: string, delay: number, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bg-background rounded-3xl p-8 border border-border/50 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(13,110,138,0.3)] transition-all duration-300 group ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-foreground/70 leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
}
