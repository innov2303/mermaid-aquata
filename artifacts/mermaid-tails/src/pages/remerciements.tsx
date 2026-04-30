import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { fetchRemerciements } from "@/lib/api";

type Sirene = { id: number; name: string; img: string | null };

export default function Remerciements() {
  const [sirenes, setSirenes] = useState<Sirene[]>([]);
  const [selected, setSelected] = useState<Sirene | null>(null);

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

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>Nos Sirènes</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            Merci de nous faire confiance pour réaliser vos rêves.
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

              {/* Nom */}
              <div className="flex-1 flex items-center justify-center min-w-0">
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
