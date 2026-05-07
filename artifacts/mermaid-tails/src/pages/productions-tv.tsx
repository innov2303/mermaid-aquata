import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { ContactModal } from "@/components/ContactModal";

const GLASS = {
  background: 'rgba(0,20,50,0.45)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(0,200,239,0.3)',
  boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
};

export default function ProductionsTv() {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  useSEO("tv");

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
          <div className="flex items-center justify-center gap-3 mb-5">
            <Film size={32} style={{ color: '#00c8ef' }} />
          </div>
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
          <p className="text-base leading-relaxed font-light" style={{ color: 'rgba(210,240,255,0.9)' }}>
            {t.tv.intro}
          </p>
        </motion.div>

        {/* Offers */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-serif text-center mb-10"
            style={{ color: '#e0f5ff' }}
          >
            {t.tv.offersTitle}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.tv.offers.map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-2xl p-6"
                style={GLASS}
              >
                <div className="text-3xl mb-3">{offer.icon}</div>
                <h3 className="text-lg font-serif mb-2" style={{ color: '#00c8ef' }}>{offer.title}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>{offer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

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
          <div className="max-w-3xl mx-auto space-y-4">
            {t.tv.refs.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-start gap-5 rounded-2xl px-6 py-5"
                style={GLASS}
              >
                <div
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-medium tracking-wide mt-0.5"
                  style={{ background: 'rgba(0,200,239,0.15)', color: '#00c8ef', border: '1px solid rgba(0,200,239,0.35)' }}
                >
                  {ref.label}
                </div>
                <div>
                  <p className="font-serif text-base mb-1" style={{ color: '#e0f5ff' }}>{ref.name}</p>
                  <p className="text-sm font-light" style={{ color: 'rgba(200,235,255,0.75)' }}>{ref.desc}</p>
                </div>
              </motion.div>
            ))}
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
