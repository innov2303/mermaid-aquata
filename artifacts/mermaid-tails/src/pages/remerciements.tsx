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
      backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed',
    }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,248,235,0.72) 0%, rgba(224,242,255,0.65) 100%)' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Nos Sirènes</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Merci de nous faire confiance pour réaliser vos rêves.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:gap-8">
          {sirenes.map((sirene, i) => (
            <motion.div
              key={sirene.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: '2px solid rgba(0,200,239,0.45)',
                boxShadow: '0 0 24px rgba(0,200,239,0.12)',
                aspectRatio: '4 / 3',
              }}
              onClick={() => sirene.img && setSelected(sirene)}
            >
              {sirene.img ? (
                <>
                  <img
                    src={sirene.img}
                    alt={sirene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Zoom hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(4,15,40,0.3)' }}>
                    <ZoomIn size={36} className="text-white drop-shadow" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.1), rgba(4,15,40,0.06))' }}>
                  <span className="font-serif text-7xl" style={{ color: 'rgba(0,200,239,0.3)' }}>✦</span>
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 py-3 px-4 text-center"
                style={{ background: 'linear-gradient(to top, rgba(4,15,40,0.85) 0%, transparent 100%)' }}
              >
                <h3
                  className="font-serif text-xl md:text-2xl font-semibold tracking-wide"
                  style={{ color: '#ffffff', textShadow: '0 0 12px rgba(0,200,239,0.7), 0 2px 6px rgba(0,0,0,0.8)' }}
                >
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
              <p className="font-serif text-2xl text-white" style={{ textShadow: '0 0 12px rgba(0,200,239,0.7)' }}>
                {selected.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
