import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const GLASS = {
  background: 'rgba(0,20,50,0.45)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(0,200,239,0.3)',
  boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
};

export default function MonHistoire() {
  const { t } = useLanguage();
  useSEO("histoire");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { title, subtitle, paragraphs } = t.histoire;

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
      <FloatingBubbles count={16} />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1
            className="font-serif mb-6"
            style={{
              color: '#e0f5ff',
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              textShadow: '0 0 40px rgba(0,200,239,0.4)',
            }}
          >
            {title}
          </h1>
          <div className="mx-auto mb-6" style={{ width: 80, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,200,239,0.7), transparent)' }} />
          {subtitle && (
            <p className="text-lg md:text-xl font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Titre de section */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-center mb-10"
          style={{
            color: '#00c8ef',
            fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
            textShadow: '0 0 24px rgba(0,200,239,0.3)',
            letterSpacing: '0.01em',
          }}
        >
          L'histoire hors du commun d'Aurore et de ses nageoires.
        </motion.h2>

        {/* ── DESKTOP : texte 1 | photo, puis texte 2 pleine largeur ── */}
        <div className="hidden md:block">
          <div className="flex flex-row gap-8 items-start mb-8">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="flex-1 rounded-2xl px-7 py-8 self-stretch"
              style={GLASS}
            >
              {paragraphs.slice(0, 3).map((para, i) => (
                <p
                  key={i}
                  className="leading-relaxed font-light"
                  style={{
                    color: 'rgba(210,240,255,0.92)',
                    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                    lineHeight: '1.9',
                    marginBottom: i < 2 ? '1.5rem' : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:w-96 lg:w-[480px] flex-shrink-0"
            >
              <div
                className="overflow-hidden rounded-3xl relative group cursor-zoom-in"
                style={{
                  border: '1.5px solid rgba(0,200,239,0.35)',
                  boxShadow: '0 8px 40px rgba(0,200,239,0.18)',
                }}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src="/images/mon-histoire.jpg"
                  alt="Mermaid Aquata"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(0,10,30,0.35)' }}>
                  <div className="rounded-full p-3" style={{ background: 'rgba(0,200,239,0.25)', border: '1.5px solid rgba(0,200,239,0.6)' }}>
                    <ZoomIn size={28} color="#00c8ef" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl px-7 py-8"
            style={GLASS}
          >
            {paragraphs.slice(3).map((para, i) => (
              <p
                key={i}
                className="leading-relaxed font-light"
                style={{
                  color: 'rgba(210,240,255,0.92)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  lineHeight: '1.9',
                  marginBottom: i < paragraphs.slice(3).length - 1 ? '1.5rem' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </motion.div>
        </div>

        {/* ── MOBILE : tout le texte, puis la photo en bas ── */}
        <div className="flex flex-col gap-6 md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl px-5 py-7"
            style={GLASS}
          >
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed font-light"
                style={{
                  color: 'rgba(210,240,255,0.92)',
                  fontSize: '1rem',
                  lineHeight: '1.9',
                  marginBottom: i < paragraphs.length - 1 ? '1.25rem' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="overflow-hidden rounded-3xl relative group cursor-zoom-in"
              style={{
                border: '1.5px solid rgba(0,200,239,0.35)',
                boxShadow: '0 8px 40px rgba(0,200,239,0.18)',
              }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src="/images/mon-histoire.jpg"
                alt="Mermaid Aquata"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(0,10,30,0.35)' }}>
                <div className="rounded-full p-3" style={{ background: 'rgba(0,200,239,0.25)', border: '1.5px solid rgba(0,200,239,0.6)' }}>
                  <ZoomIn size={28} color="#00c8ef" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,5,20,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-5 right-5 rounded-full p-2 transition-all hover:scale-110"
              style={{ background: 'rgba(0,200,239,0.15)', border: '1.5px solid rgba(0,200,239,0.5)', color: '#00c8ef' }}
              onClick={() => setLightboxOpen(false)}
            >
              <X size={26} />
            </button>

            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src="/images/mon-histoire.jpg"
              alt="Mermaid Aquata"
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
              style={{
                boxShadow: '0 16px 64px rgba(0,200,239,0.25)',
                border: '1.5px solid rgba(0,200,239,0.3)',
              }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
