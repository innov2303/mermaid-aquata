import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, Hammer, Globe, Leaf, Film, Heart, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0a3a5c' }}>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-[#040f28] overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Photorealistic background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/images/hero.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        {/* Brightness gradient — light at top (surface rays), fades out at bottom */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.05) 75%, transparent 100%)' }} />
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

        {/* Main Title — hero center */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 -translate-y-[140%] flex flex-col items-center z-10 px-6 text-center pointer-events-none"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <h1
            className="font-bold tracking-wide leading-tight"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
              background: "linear-gradient(135deg, #ffffff 0%, #b8f0ff 50%, #00e5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(0,200,239,0.5))",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.04em",
            }}
          >
            Bienvenue chez Mermaid Aquata
          </h1>
          <div
            className="mt-4 h-px w-64 mx-auto"
            style={{ background: "linear-gradient(90deg, transparent, #00c8ef, transparent)" }}
          />
        </motion.div>

        {/* Bubble CTA — floats at bottom center */}
        <motion.button
          onClick={scrollToNext}
          data-testid="button-scroll-down"
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 group cursor-pointer flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* The bubble */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            className="relative"
          >
            <div
              className="relative w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-108"
              style={{
                background: "radial-gradient(ellipse at 38% 32%, rgba(200,245,255,0.28) 0%, rgba(0,140,220,0.18) 50%, rgba(0,60,120,0.22) 100%)",
                border: "2px solid rgba(200,245,255,0.7)",
                boxShadow: "0 8px 40px rgba(0,150,220,0.35), 0 0 0 1px rgba(255,255,255,0.12), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,150,220,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Bubble glare — top left arc */}
              <div
                className="absolute top-2 left-3 w-12 h-7 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)",
                  transform: "rotate(-25deg)",
                }}
              />
              {/* Bubble thin inner ring */}
              <div className="absolute inset-2 rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.18)" }} />
              {/* Secondary glare — bottom right */}
              <div
                className="absolute bottom-4 right-4 w-5 h-5 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)" }}
              />

              {/* Text inside bubble */}
              <span className="text-xs md:text-sm font-light tracking-[0.18em] text-white uppercase text-center leading-relaxed relative z-10"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,200,239,0.6)" }}>
                Nous<br />découvrir
              </span>
            </div>

            {/* Tiny bubble trail below — like bubbles rising */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(200,245,255,0.45)", border: "1.5px solid rgba(255,255,255,0.5)", boxShadow: "0 0 6px rgba(0,200,239,0.4)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(200,245,255,0.3)", border: "1px solid rgba(255,255,255,0.35)" }} />
              <div className="w-1 h-1 rounded-full" style={{ background: "rgba(200,245,255,0.2)", border: "1px solid rgba(255,255,255,0.25)" }} />
            </div>
          </motion.div>
        </motion.button>
        
      </section>

      {/* Présentation Section */}
      <section id="presentation" className="py-24 relative z-10 section-clair">
        <div className="container mx-auto px-4 md:px-6">

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-center mb-16 leading-snug"
            style={{ color: '#0a2a4a' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            Plongez dans l'univers enchanté des sirènes avec{" "}
            <span style={{ background: "linear-gradient(135deg, #0070a8, #00c8ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Mermaid Aquata
            </span>{" "}!
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-primary/60 animate-[spin_10s_linear_infinite] shadow-[0_0_25px_rgba(0,200,239,0.4)]"></div>
                <div className="absolute inset-2 rounded-[50%_50%_40%_60%/50%_40%_60%_50%] border-2 border-secondary/40 animate-[spin_15s_linear_infinite_reverse]"></div>
                <img 
                  src="/images/portrait.png" 
                  alt="La Créatrice" 
                  className="absolute inset-4 object-cover w-[calc(100%-2rem)] h-[calc(100%-2rem)] rounded-full shadow-2xl"
                />
              </div>
              <div className="prose prose-lg text-foreground/80 font-light leading-relaxed">
                <p style={{ color: '#1a3d5c' }} className="mb-4">
                  Créatrice passionnée de nageoires de sirène en silicone depuis 2015, Mermaid Aquata réalise des créations uniques en France, d'un réalisme saisissant. Ses monopalmes sur mesure sont conçues pour être à la fois maniables et esthétiques, répondant aux besoins du cinéma, des sirènes professionnelles travaillant en aquarium, et des particuliers en quête de magie aquatique.
                </p>
                <p style={{ color: '#1a3d5c' }} className="mb-4">
                  Avec son savoir-faire reconnu, Mermaid Aquata propose également des prestations pour les tournages, incarnant une véritable sirène grâce à ses costumes professionnels.
                </p>
                <p className="text-sm font-medium italic" style={{ color: '#0a6a8a' }}>
                  Costume professionnel réservé uniquement aux adultes majeurs.
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
              <h3 className="text-2xl md:text-3xl font-serif" style={{ color: '#0a2a4a' }}>Reportage France 3</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <iframe
                  src="https://www.youtube.com/embed/-JsQodzWltA?start=6"
                  title="Reportage TV - Mermaid Aquata"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="text-foreground/70 italic max-w-md" style={{ color: '#1a3d5c' }}>
                Pour en savoir plus sur mon parcours, regardez le reportage qui m'a été consacré.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Travail Section */}
      <section className="py-24 section-clair-alt relative">
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Notre Travail</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Hammer size={32} className="text-primary" />}
              title="Fabrication artisanale"
              desc="Fabrication Française et Artisanale, étudiée avec un ingénieur aéronautique."
              delay={0}
            />
            <FeatureCard 
              icon={<Globe size={32} className="text-secondary" />}
              title="Savoir faire reconnu à l'international"
              desc="Mermaid Aquata est reconnue à l'international pour ses créations « longfish » uniques au monde !"
              delay={0.1}
            />
            <FeatureCard 
              icon={<Leaf size={32} className="text-accent" />}
              title="Matériaux Éthiques"
              desc="Mermaid Aquata utilise des matériaux de très haute qualité pour une tenue de plusieurs années."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Film size={32} className="text-primary" />}
              title="Tournages"
              desc="Mermaid Aquata a déjà participé à des tournages tels que clip musical (Josman XS), Handicap International, série télévisée « Panda »."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Heart size={32} className="text-secondary" />}
              title="Créatrice Dévouée"
              desc="Mermaid Aquata sera toujours présente même plusieurs années après votre commande. N'hésitez pas à lui écrire pour toutes questions. Vous êtes également tenue au courant tout au long de la création avec photos à l'appui."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Tv size={32} className="text-accent" />}
              title="Reportages TV"
              desc="Mermaid Aquata est passée plusieurs fois sur les chaînes d'informations françaises, TF1, France 3, La Dépêche du midi. Retrouvez tous ces reportages sur la chaîne YouTube de Mermaid Aquata."
              delay={0.5}
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
      <section className="py-24 relative section-clair">
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Prête à devenir sirène ?</h2>
              <p className="text-xl mb-12 font-light" style={{ color: '#1a3d5c' }}>
                Contactez-nous pour discuter de votre projet sur mesure et donner vie à vos rêves d'océan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(0,200,239,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,200,239,0.7)] hover:scale-105">
                  Nous contacter
                </Button>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/mermaid.real.aquata/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#E1306C', background: 'rgba(225,48,108,0.08)' }}>
                    <span className="sr-only">Instagram</span>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="ig-grad-home" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433"/>
                          <stop offset="25%" stopColor="#e6683c"/>
                          <stop offset="50%" stopColor="#dc2743"/>
                          <stop offset="75%" stopColor="#cc2366"/>
                          <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                      </defs>
                      <path fill="url(#ig-grad-home)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/channel/UCXeS0vlrfvEsvBBshqGFl8w" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#FF0000', background: 'rgba(255,0,0,0.08)' }}>
                    <span className="sr-only">YouTube</span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@mermaid.aquata.sirene" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: '#69C9D0', background: 'rgba(105,201,208,0.08)' }}>
                    <span className="sr-only">TikTok</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
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
      className={`feature-card-light rounded-3xl p-8 hover:shadow-[0_0_28px_rgba(0,200,239,0.45),0_6px_24px_rgba(0,100,160,0.15)] hover:border-primary/70 transition-all duration-300 group ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm" style={{ background: 'rgba(0,200,239,0.12)' }}>
          {icon}
        </div>
        <h3 className="text-xl font-serif group-hover:text-primary transition-colors leading-tight" style={{ color: '#0a2a4a' }}>{title}</h3>
      </div>
      <p className="leading-relaxed font-light" style={{ color: '#1a3d5c' }}>{desc}</p>
    </motion.div>
  );
}
