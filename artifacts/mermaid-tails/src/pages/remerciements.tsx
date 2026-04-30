import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchRemerciements } from "@/lib/api";

type Sirene = { id: number; name: string; img: string | null };

export default function Remerciements() {
  const [sirenes, setSirenes] = useState<Sirene[]>([]);

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
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,248,235,0.72) 0%, rgba(224,242,255,0.65) 100%)' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Nos Sirènes</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Merci de nous faire confiance pour réaliser vos rêves.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:gap-10 items-start">
          {sirenes.map((sirene, i) => (
            <motion.div
              key={sirene.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden"
              style={{ border: '2px solid rgba(0,200,239,0.45)', boxShadow: '0 0 24px rgba(0,200,239,0.12)' }}
            >
              <div className="relative w-full overflow-hidden">
                {sirene.img ? (
                  <img
                    src={sirene.img}
                    alt={sirene.name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.1), rgba(4,15,40,0.06))' }}>
                    <span className="font-serif text-7xl" style={{ color: 'rgba(0,200,239,0.3)' }}>✦</span>
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 py-4 px-4 text-center"
                  style={{ background: 'linear-gradient(to top, rgba(4,15,40,0.85) 0%, transparent 100%)' }}
                >
                  <h3
                    className="font-serif text-xl md:text-2xl font-semibold tracking-wide"
                    style={{ color: '#ffffff', textShadow: '0 0 12px rgba(0,200,239,0.7), 0 2px 6px rgba(0,0,0,0.8)' }}
                  >
                    {sirene.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
