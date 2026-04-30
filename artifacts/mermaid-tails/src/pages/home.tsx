import { motion } from "framer-motion";
import { Hammer, Globe, Leaf, Film, Heart, Tv } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import logoSrc from "@assets/mermaid_aquata_logo_transparent.png";
import { ContactModal } from "@/components/ContactModal";
import { useLanguage } from "@/context/LanguageContext";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const BUBBLE_COUNT = 8;

const BUBBLE_ICONS = [
  <Hammer size={24} />,
  <Globe size={26} />,
  <Leaf size={22} />,
  <Film size={25} />,
  <Heart size={23} />,
  <Tv size={24} />,
];

export default function Home() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);
  const [contactOpen, setContactOpen] = useState(false);
  const bubbleZoneRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

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
      <section className="relative bg-[#040f28] overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* ── DESKTOP: full-screen background image ── */}
        <img
          src="/images/hero.jpg"
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute inset-0 z-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />
        <div className="hidden md:block absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.05) 75%, transparent 100%)' }} />

        {/* ── MOBILE: image contenue (sirène entière), fond océan ── */}
        <div className="md:hidden absolute inset-0 z-0 flex items-center justify-center" style={{ backgroundColor: '#040f28' }}>
          <img
            src="/images/hero.jpg"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center top' }}
          />
          {/* Léger fondu haut et bas pour intégrer avec le fond */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(4,15,40,0.35) 0%, transparent 20%, transparent 75%, rgba(4,15,40,0.9) 100%)' }} />
        </div>

        {/* Titre mobile : en haut de la section */}
        <motion.div
          className="md:hidden absolute top-[18%] left-0 right-0 flex flex-col items-center z-10 px-6 text-center pointer-events-none"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <h1
            className="font-bold tracking-wide leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 8vw, 2.6rem)",
              background: "linear-gradient(135deg, #ffffff 0%, #b8f0ff 50%, #00e5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 14px rgba(0,0,0,0.8)) drop-shadow(0 0 24px rgba(0,200,239,0.5))",
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.02em",
            }}
          >
            {t.home.heroTitle}
          </h1>
          <div className="mt-3 h-px w-48 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #00c8ef, transparent)" }} />
        </motion.div>

        {/* Bubbles (both) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{ left: bubble.left, width: `${bubble.size}px`, height: `${bubble.size}px`, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, opacity: 0.5 }}
            />
          ))}
        </div>

        {/* ── DESKTOP title ── */}
        <motion.div
          className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-[140%] flex-col items-center z-10 px-6 text-center pointer-events-none"
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
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.02em",
            }}
          >
            {t.home.heroTitle}
          </h1>
          <div className="mt-4 h-px w-64 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #00c8ef, transparent)" }} />
        </motion.div>

        <motion.button
          onClick={scrollToNext}
          data-testid="button-scroll-down"
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 group cursor-pointer flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            className="relative"
          >
            <div className="relative w-36 h-36 md:w-40 md:h-40 transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                background: 'conic-gradient(from 0deg, rgba(180,240,255,0.0) 0%, rgba(200,230,255,0.38) 18%, rgba(220,200,255,0.28) 32%, rgba(180,255,240,0.32) 50%, rgba(255,255,255,0.42) 62%, rgba(180,220,255,0.22) 78%, rgba(180,240,255,0.0) 100%)',
                WebkitMask: 'radial-gradient(transparent 83%, black 86%, black 100%)',
                mask: 'radial-gradient(transparent 83%, black 86%, black 100%)',
                animation: 'spinConic 8s linear infinite',
                zIndex: 2,
              }} />
              <div className="absolute inset-0 rounded-full" style={{
                background: `
                  radial-gradient(circle at 30% 24%, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.04) 22%, transparent 40%),
                  radial-gradient(circle at 68% 72%, rgba(140,220,255,0.08) 0%, transparent 30%),
                  radial-gradient(circle at 50% 50%, rgba(180,230,255,0.03) 0%, rgba(0,60,120,0.08) 100%)
                `,
                border: '1.2px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(2px)',
                zIndex: 1,
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-white text-center leading-tight"
                  style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)", textShadow: "0 1px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,200,239,0.6)" }}>
                  {t.home.heroCta}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(200,245,255,0.45)", border: "1.5px solid rgba(255,255,255,0.5)", boxShadow: "0 0 6px rgba(0,200,239,0.4)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(200,245,255,0.3)", border: "1px solid rgba(255,255,255,0.35)" }} />
              <div className="w-1 h-1 rounded-full" style={{ background: "rgba(200,245,255,0.2)", border: "1px solid rgba(255,255,255,0.25)" }} />
            </div>
          </motion.div>
        </motion.button>
      </section>

      <SectionDivider />

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
            {t.home.presentationTitle}{" "}
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
                <p style={{ color: '#1a3d5c' }} className="mb-4">{t.home.bio1}</p>
                <p style={{ color: '#1a3d5c' }} className="mb-4">{t.home.bio2}</p>
                <p className="text-sm font-medium italic" style={{ color: '#0a6a8a' }}>{t.home.bio3}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <h3 className="text-2xl md:text-3xl font-serif" style={{ color: '#0a2a4a' }}>{t.home.reportageTitle}</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <iframe
                  src="https://www.youtube.com/embed/-JsQodzWltA?start=6"
                  title="Reportage TV - Mermaid Aquata"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="text-foreground/70 italic max-w-md" style={{ color: '#1a3d5c' }}>{t.home.reportageCaption}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider flip />

      {/* Notre Activité Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#010a18', backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(1,10,24,0.55)' }} />
        <div className="absolute pointer-events-none" style={{ top: '5%', left: '10%', width: '45%', height: '55%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,200,239,0.22) 0%, rgba(0,150,200,0.06) 50%, transparent 70%)', filter: 'blur(24px)', animation: 'caustic 9s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ top: '10%', right: '5%', width: '40%', height: '50%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(30,160,255,0.18) 0%, rgba(0,100,180,0.05) 50%, transparent 70%)', filter: 'blur(30px)', animation: 'caustic2 12s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '0%', left: '30%', width: '50%', height: '40%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,180,220,0.14) 0%, transparent 65%)', filter: 'blur(20px)', animation: 'caustic 14s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(175deg, rgba(0,200,239,0.10) 0%, transparent 40%), linear-gradient(185deg, rgba(30,160,255,0.07) 0%, transparent 35%)' }} />

        {[
          { left:'8%', size:5, dur:'11s', delay:'0s' }, { left:'18%', size:3, dur:'14s', delay:'2s' },
          { left:'32%', size:6, dur:'9s', delay:'5s' }, { left:'47%', size:4, dur:'13s', delay:'1s' },
          { left:'55%', size:3, dur:'16s', delay:'3.5s'}, { left:'68%', size:7, dur:'10s', delay:'7s' },
          { left:'78%', size:4, dur:'12s', delay:'0.5s'}, { left:'88%', size:5, dur:'15s', delay:'4s' },
          { left:'24%', size:3, dur:'18s', delay:'9s' }, { left:'62%', size:4, dur:'11s', delay:'6s' },
        ].map((b, i) => (
          <div key={i} className="absolute bottom-0 pointer-events-none rounded-full" style={{
            left: b.left, width: b.size, height: b.size,
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(180,230,255,0.3))',
            border: '0.5px solid rgba(255,255,255,0.4)',
            animation: `riseBubble ${b.dur} ease-in infinite`,
            animationDelay: b.delay,
          }} />
        ))}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6" style={{ color: '#d0f0ff', textShadow: '0 0 40px rgba(0,200,239,0.5)' }}>{t.home.activityTitle}</h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #00c8ef, transparent)' }}></div>
          </motion.div>

          {isMobile ? (
            /* Mobile: 2-column grid of smaller bubbles */
            <div ref={bubbleZoneRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '0 8px 32px' }}>
              {t.home.bubbles.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                  <BubbleCard icon={BUBBLE_ICONS[i]} title={b.title} desc={b.desc} delay={i * 0.08} floatOffset={i} size={155} constraintsRef={bubbleZoneRef} draggable={false} />
                </div>
              ))}
            </div>
          ) : (
            /* Desktop: two staggered rows */
            <div ref={bubbleZoneRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px', paddingBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '90px', flexWrap: 'wrap' }}>
                {t.home.bubbles.slice(0, 3).map((b, i) => (
                  <div key={i} style={{ transform: i % 2 === 0 ? 'translateY(10px)' : 'translateY(-10px)' }}>
                    <BubbleCard icon={BUBBLE_ICONS[i]} title={b.title} desc={b.desc} delay={i * 0.12} floatOffset={i} size={i === 1 ? 250 : 235} constraintsRef={bubbleZoneRef} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '90px', flexWrap: 'wrap' }}>
                {t.home.bubbles.slice(3).map((b, i) => (
                  <div key={i} style={{ transform: i % 2 === 0 ? 'translateY(-10px)' : 'translateY(8px)' }}>
                    <BubbleCard icon={BUBBLE_ICONS[i + 3]} title={b.title} desc={b.desc} delay={0.3 + i * 0.1} floatOffset={i + 3} size={i === 1 ? 255 : 240} constraintsRef={bubbleZoneRef} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Contact Section */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundImage: 'url(/images/ocean-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,15,40,0.82) 0%, rgba(0,60,100,0.75) 100%)' }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6" style={{ textShadow: '0 0 30px rgba(0,200,239,0.5)' }}>
                {t.home.contactTitle}
              </h2>
              <p className="text-xl mb-12 font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {t.home.contactSubtitle}
              </p>
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={() => setContactOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    position: 'relative',
                    padding: '16px 48px',
                    borderRadius: '999px',
                    border: '1px solid rgba(0,200,239,0.55)',
                    background: 'linear-gradient(135deg, rgba(0,200,239,0.18) 0%, rgba(0,100,180,0.12) 100%)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    fontFamily: 'serif',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(0,200,239,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(0,200,239,0.5), inset 0 1px 0 rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(0,200,239,0.25), inset 0 1px 0 rgba(255,255,255,0.1)')}
                >
                  {t.home.contactBtn}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ width: '100%', position: 'relative', height: '2px' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,200,239,0.5) 25%, rgba(0,200,239,0.7) 50%, rgba(0,200,239,0.5) 75%, transparent 100%)',
        boxShadow: '0 0 8px rgba(0,200,239,0.3)',
      }} />
    </div>
  );
}

const FLOAT_PARAMS = [
  { y: [-7, 7], duration: 4.8, x: [-3, 3] },
  { y: [-9, 5], duration: 5.6, x: [2, -2] },
  { y: [-5, 9], duration: 4.2, x: [-2, 4] },
  { y: [-8, 6], duration: 6.1, x: [3, -3] },
  { y: [-6, 8], duration: 4.5, x: [-4, 2] },
  { y: [-7, 7], duration: 5.3, x: [2, -4] },
];

function BubbleCard({ icon, title, desc, delay, floatOffset, size = 260, constraintsRef, draggable = true }: { icon: React.ReactNode, title: string, desc: string, delay: number, floatOffset: number, size?: number, constraintsRef?: React.RefObject<HTMLDivElement>, draggable?: boolean }) {
  const fp = FLOAT_PARAMS[floatOffset % FLOAT_PARAMS.length];
  const spinDur = `${9 + floatOffset * 1.2}s`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, delay, type: 'spring', stiffness: 70, damping: 14 }}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <motion.div
        animate={{ y: fp.y, x: fp.x }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: fp.duration, ease: "easeInOut", delay: floatOffset * 0.6 }}
        drag={draggable}
        dragConstraints={draggable ? constraintsRef : false}
        dragElastic={draggable ? 0.12 : 0}
        dragMomentum={draggable}
        dragTransition={draggable ? { bounceStiffness: 80, bounceDamping: 18, power: 0.3, timeConstant: 300 } : undefined}
        whileHover={{ scale: 1.05 }}
        whileDrag={draggable ? { scale: 1.10, zIndex: 50 } : undefined}
        style={{ cursor: draggable ? 'grab' : 'default', position: 'relative', width: size, height: size, zIndex: 1 }}
      >
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%', zIndex: 2, pointerEvents: 'none',
          background: 'conic-gradient(from 0deg, rgba(180,240,255,0.0) 0%, rgba(200,230,255,0.35) 18%, rgba(220,200,255,0.25) 32%, rgba(180,255,240,0.30) 50%, rgba(255,255,255,0.40) 62%, rgba(180,220,255,0.20) 78%, rgba(180,240,255,0.0) 100%)',
          WebkitMask: 'radial-gradient(transparent 83%, black 86%, black 100%)',
          mask: 'radial-gradient(transparent 83%, black 86%, black 100%)',
          animation: `spinConic ${spinDur} linear infinite`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%', zIndex: 1,
          background: `
            radial-gradient(circle at 30% 24%, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.06) 22%, transparent 40%),
            radial-gradient(circle at 68% 72%, rgba(140,220,255,0.10) 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(180,230,255,0.04) 0%, rgba(0,60,120,0.10) 100%)
          `,
          border: '1.2px solid rgba(255,255,255,0.38)',
          boxShadow: `
            inset 0 -${Math.round(size*0.04)}px ${Math.round(size*0.12)}px rgba(0,150,220,0.12),
            inset 0 ${Math.round(size*0.02)}px ${Math.round(size*0.06)}px rgba(255,255,255,0.08),
            0 ${Math.round(size*0.02)}px ${Math.round(size*0.14)}px rgba(0,60,120,0.18)
          `,
          backdropFilter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: `0 ${Math.round(size * 0.13)}px`,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, color: 'rgba(210,245,255,0.9)' }}>
            {icon}
          </div>
          <h3 style={{ color: 'rgba(235,250,255,0.95)', textShadow: '0 1px 12px rgba(0,0,0,0.55)', fontSize: `${Math.round(size * 0.056)}px`, fontFamily: 'serif', lineHeight: 1.25, marginBottom: 5 }}>{title}</h3>
          <p style={{ color: 'rgba(210,245,255,0.80)', textShadow: '0 1px 8px rgba(0,0,0,0.5)', fontSize: `${Math.round(size * 0.045)}px`, lineHeight: 1.4, fontWeight: 300 }}>{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
