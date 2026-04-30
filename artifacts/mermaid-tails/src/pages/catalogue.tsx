import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCatalogue } from "@/lib/api";

type Item = {
  id: number;
  name: string;
  desc: string;
  price: string;
  images: string[];
  section: string;
};

const SECTION_META: Record<string, { label: string; sub: string }> = {
  monopalmes: { label: "Monopalmes", sub: "Nage sportive & dynamique" },
  invisibles:  { label: "Queue de sirène silicone", sub: "Silhouette naturelle & fluide" },
  accessoires: { label: "Accessoires", sub: "Complétez votre tenue de sirène" },
};

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.1), rgba(4,15,40,0.06))' }}>
        <span className="font-serif text-8xl" style={{ color: 'rgba(0,200,239,0.25)' }}>✦</span>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(4,15,40,0.6)', color: 'white', border: '1px solid rgba(0,200,239,0.4)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIdx(i => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(4,15,40,0.6)', color: 'white', border: '1px solid rgba(0,200,239,0.4)' }}
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === idx ? '#00c8ef' : 'rgba(255,255,255,0.5)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Catalogue() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    fetchCatalogue().then(setAllItems).catch(() => {});
  }, []);

  // Group items by section in the defined order
  const sections = Object.entries(SECTION_META).map(([key, meta]) => ({
    key,
    ...meta,
    items: allItems.filter(i => i.section === key),
  })).filter(s => s.items.length > 0);

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>Notre Catalogue</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            Découvrez nos créations artisanales. Chaque modèle peut être personnalisé selon vos envies.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          {sections.map((section) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(0,200,239,0.6), transparent)' }} />
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-serif" style={{ color: '#e0f5ff' }}>{section.label}</h2>
                  <p className="text-sm mt-1 font-light" style={{ color: 'rgba(200,235,255,0.8)' }}>{section.sub}</p>
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, rgba(0,200,239,0.6), transparent)' }} />
              </div>

              <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.45 }}
                    className="group relative rounded-3xl hover:scale-[1.02] transition-all duration-300"
                    style={{ background: 'rgba(0,20,50,0.45)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(0,200,239,0.3)', boxShadow: '0 4px 24px rgba(0,200,239,0.1)' }}
                  >
                    <div className="w-full overflow-hidden cursor-pointer rounded-2xl mx-auto mt-3 px-3" style={{ aspectRatio: '4/3' }} onClick={() => setSelected(item)}>
                      {item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.08), rgba(4,15,40,0.06))' }}>
                          <span className="font-serif text-5xl" style={{ color: 'rgba(0,200,239,0.35)' }}>✦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-4 group-hover:text-primary transition-colors" style={{ color: '#e0f5ff', fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem' }}>{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-base text-primary font-medium">{item.price}</p>
                        <button
                          onClick={() => setSelected(item)}
                          className="text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                          style={{ background: 'rgba(0,200,239,0.12)', border: '1.5px solid rgba(0,200,239,0.5)', color: '#007fa3' }}
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Popup détails */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,15,40,0.88)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative rounded-3xl overflow-hidden w-full flex flex-col md:flex-row"
              style={{ background: 'rgba(0,20,50,0.85)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(0,200,239,0.3)', boxShadow: '0 0 60px rgba(0,200,239,0.2)', maxHeight: '82vh', maxWidth: '82vw' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Gauche : infos */}
              <div className="flex flex-col p-6 md:p-10 md:w-1/2 flex-shrink-0 overflow-y-auto">
                <h2 className="text-xl md:text-2xl leading-tight text-center mb-5" style={{ color: '#e0f5ff', fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem' }}>
                  {selected.name}
                </h2>
                <div className="flex-1 overflow-y-auto mb-6 pr-1" style={{ minHeight: 0 }}>
                  <p className="font-light leading-relaxed text-xs md:text-sm whitespace-pre-line" style={{ color: 'rgba(200,235,255,0.85)' }}>
                    {selected.desc}
                  </p>
                </div>
                <p className="font-serif text-2xl text-primary font-semibold mb-8 flex-shrink-0">{selected.price}</p>
                <Button asChild size="default" className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 shadow-[0_0_16px_rgba(0,200,239,0.4)] mx-auto">
                  <Link href="/commander" onClick={() => setSelected(null)}>Commander</Link>
                </Button>
              </div>

              {/* Droite : carousel */}
              <div className="flex-1 flex flex-col min-h-[260px] md:min-h-0">
                <div className="flex justify-end p-3 flex-shrink-0">
                  <button
                    onClick={() => setSelected(null)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                    style={{ background: 'rgba(0,200,239,0.1)', color: '#e0f5ff' }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 px-4 pb-4 min-h-[220px]">
                  <Carousel images={selected.images} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
