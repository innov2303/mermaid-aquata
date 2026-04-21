import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, Droplet, Fish, Sparkles, Gem, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveSeparator } from "@/components/WaveSeparator";
import { useEffect, useState } from "react";

const BUBBLE_COUNT = 30;

export default function Home() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: BUBBLE_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setBubbles(generated);
  }, []);

  const scrollToNext = () => {
    document.getElementById("presentation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-ocean-gradient">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('/images/hero.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Bubbles */}
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
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-6 text-white drop-shadow-lg tracking-wider">
              La Sirène
            </h1>
            <p className="text-xl md:text-3xl font-light text-primary-foreground/90 tracking-wide">
              Créatrice de Queues de Sirène Artisanales
            </p>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToNext}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={48} strokeWidth={1} />
        </motion.button>
        
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
                <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-accent/50 animate-[spin_10s_linear_infinite] shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
                <div className="absolute inset-2 rounded-[50%_50%_40%_60%/50%_40%_60%_50%] border-2 border-primary/40 animate-[spin_15s_linear_infinite_reverse]"></div>
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
                  <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] group-hover:scale-110 transition-transform duration-300">
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
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 text-gold-shimmer">Notre Travail</h2>
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
            <Button asChild size="lg" className="bg-accent text-background hover:bg-accent/90 text-lg px-8 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105">
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
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background w-full sm:w-auto px-8 py-6 text-lg rounded-full">
                  contact@lasirene.fr
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
