import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { fetchRemerciements } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

type Sirene = { id: number; name: string; img: string | null; instagram: string | null; review: string | null; review_en?: string | null; review_es?: string | null };

export default function Remerciements() {
  const [sirenes, setSirenes] = useState<Sirene[]>([]);
  const [selected, setSelected] = useState<Sirene | null>(null);
  const { t, lang } = useLanguage();
  useSEO("avis");

  function sireneReview(s: Sirene) {
    if (lang === "en") return s.review_en || s.review;
    if (lang === "es") return s.review_es || s.review;
    return s.review;
  }

  useEffect(() => {
    fetchRemerciements().then(setSirenes).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{
      backgroundImage: 'url(/images/ocean-bubbles-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <FloatingBubbles count={18} />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>{t.remerciements.title}</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            {t.remerciements.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {sirenes.map((sirene, i) => (
            <motion.div
              key={sirene.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-row items-center gap-8 rounded-2xl p-4"
              style={{
                background: 'rgba(0,20,50,0.45)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(0,200,239,0.3)',
                boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
              }}
            >
              {/* Photo */}
              <div
                className="group relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
                style={{ maxWidth: '45%', border: '1.5px solid rgba(0,200,239,0.4)' }}
                onClick={() => sirene.img && setSelected(sirene)}
              >
                {sirene.img ? (
                  <>
                    <img
                      src={sirene.img}
                      alt={sirene.name}
                      className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(4,15,40,0.25)' }}>
                      <ZoomIn size={32} className="text-white drop-shadow" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-6xl" style={{ color: 'rgba(0,200,239,0.3)' }}>✦</span>
                  </div>
                )}
              </div>

              {/* Nom + Avis + Instagram */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 min-w-0 py-2">
                <h3 style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
                  fontWeight: 700,
                  color: '#e0f5ff',
                  textShadow: '0 2px 16px rgba(0,200,239,0.5)',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  textAlign: 'center',
                }}>
                  {sirene.name}
                </h3>
                {sireneReview(sirene) && (
                  <p style={{
                    color: 'rgba(200,235,255,0.85)',
                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                  }}>
                    « {sireneReview(sirene)} »
                  </p>
                )}
                {sirene.instagram && (
                  <a
                    href={sirene.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(131,58,180,0.25), rgba(253,29,29,0.2), rgba(252,176,69,0.2))',
                      border: '1px solid rgba(200,100,255,0.35)',
                      color: 'rgba(220,180,255,0.95)',
                      textDecoration: 'none',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,15,40,0.92)' }}
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-5 right-5 text-white rounded-full p-2 hover:bg-white/10 transition-colors"
              onClick={() => setSelected(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.img!}
                alt={selected.name}
                className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain"
                style={{ boxShadow: '0 0 60px rgba(0,200,239,0.3)' }}
              />
              <p style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '2rem',
                fontWeight: 700,
                color: '#ffffff',
                textShadow: '0 0 12px rgba(0,200,239,0.7)',
              }}>
                {selected.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
