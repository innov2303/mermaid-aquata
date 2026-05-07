import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { ContactModal } from "@/components/ContactModal";
import { fetchTvRefs } from "@/lib/api";

type TvRef = { id: number; label: string; name: string; desc: string; youtube: string };

const GLASS = {
  background: 'rgba(0,20,50,0.45)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(0,200,239,0.3)',
  boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
};

export default function ProductionsTv() {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const [refs, setRefs] = useState<TvRef[]>([]);
  useSEO("tv");

  useEffect(() => { fetchTvRefs().then(setRefs).catch(() => {}); }, []);

  return (
    <div
      className="min-h-screen pt-32 pb-20 relative"
      style={{
        backgroundImage: 'url(/images/ocean-bubbles-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.42) 0%, rgba(0,18,45,0.55) 100%)' }} />
      <FloatingBubbles count={14} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>
            {t.tv.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            {t.tv.subtitle}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-20 rounded-3xl p-8 text-center"
          style={GLASS}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-3xl">🎬</span>
            <h2 className="text-xl md:text-2xl font-serif" style={{ color: '#00c8ef' }}>{t.tv.introTitle}</h2>
          </div>
          <p className="text-base leading-relaxed font-light" style={{ color: 'rgba(210,240,255,0.9)' }}>
            {t.tv.intro}
          </p>
        </motion.div>

        {/* References */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-serif text-center mb-10"
            style={{ color: '#e0f5ff' }}
          >
            {t.tv.refsTitle}
          </motion.h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {refs.map((ref, i) => {
              const ytId = ref.youtube ? ref.youtube.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1] : null;
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
              return (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="flex flex-row items-center gap-6 rounded-2xl p-4"
                  style={GLASS}
                >
                  {/* Thumbnail / placeholder */}
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ width: 160, minHeight: 100, border: '1.5px solid rgba(0,200,239,0.4)', background: 'rgba(0,10,30,0.6)' }}
                  >
                    {thumb ? (
                      <img src={thumb} alt={ref.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-5xl" style={{ color: 'rgba(0,200,239,0.3)' }}>✦</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col items-start gap-2 py-1">
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-medium tracking-wide"
                      style={{ background: 'rgba(0,200,239,0.15)', color: '#00c8ef', border: '1px solid rgba(0,200,239,0.35)' }}
                    >
                      {ref.label}
                    </span>
                    <h3 style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
                      fontWeight: 700,
                      color: '#e0f5ff',
                      textShadow: '0 2px 16px rgba(0,200,239,0.4)',
                      lineHeight: 1.2,
                    }}>
                      {ref.name}
                    </h3>
                    <p className="text-sm font-light" style={{ color: 'rgba(200,235,255,0.8)', fontStyle: 'italic' }}>{ref.desc}</p>
                    {ref.youtube && (
                      <a
                        href={ref.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 mt-1"
                        style={{ background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,80,80,0.4)', color: '#ff8080', textDecoration: 'none' }}
                      >
                        <Youtube size={14} />
                        Voir sur YouTube
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center rounded-3xl py-14 px-8 max-w-2xl mx-auto"
          style={GLASS}
        >
          <h2 className="text-2xl md:text-3xl font-serif mb-4" style={{ color: '#e0f5ff' }}>{t.tv.ctaTitle}</h2>
          <p className="text-base font-light mb-8" style={{ color: 'rgba(200,235,255,0.85)' }}>{t.tv.ctaDesc}</p>
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all"
            style={{ background: 'linear-gradient(135deg, #00c8ef 0%, #0080b0 100%)', color: '#fff', boxShadow: '0 4px 20px rgba(0,200,239,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(0,200,239,0.55)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,200,239,0.35)'; }}
          >
            <Mail size={16} />
            {t.tv.ctaBtn}
          </button>
          <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
        </motion.div>

      </div>
    </div>
  );
}
