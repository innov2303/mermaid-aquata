import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCatalogue } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

type Item = {
  id: number;
  name: string;
  name_en?: string;
  name_es?: string;
  desc: string;
  desc_en?: string;
  desc_es?: string;
  price: string;
  video: string;
  etsyUrl: string;
  images: string[];
  section: string;
};

function toEmbedUrl(raw: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    let id: string | null = null;
    if (url.hostname === "youtu.be") {
      id = url.pathname.slice(1).split("?")[0];
    } else if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return raw;
      id = url.searchParams.get("v");
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

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
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(4,15,40,0.35)' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-contain"
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { t, lang } = useLanguage();
  const selected = selectedId !== null ? (allItems.find(i => i.id === selectedId) ?? null) : null;
  useSEO("catalogue");

  function itemName(item: Item) {
    if (lang === "en") return item.name_en || item.name;
    if (lang === "es") return item.name_es || item.name;
    return item.name;
  }
  function itemDesc(item: Item) {
    if (lang === "en") return item.desc_en || item.desc;
    if (lang === "es") return item.desc_es || item.desc;
    return item.desc;
  }

  const retryRef = useRef(0);

  useEffect(() => {
    retryRef.current = 0;
    let timer: ReturnType<typeof setTimeout>;

    function load(isRetry = false) {
      fetchCatalogue(lang).then(items => {
        setAllItems(items);
        if (!isRetry) {
          const params = new URLSearchParams(window.location.search);
          const open = params.get('open');
          if (open) {
            const needle = open.trim().toLowerCase();
            const exact = items.find(item => item.name.trim().toLowerCase() === needle);
            const partial = exact ? null : items.reduce<Item | null>((best, item) => {
              const n = item.name.trim().toLowerCase();
              if (n === needle) return item;
              if (needle.includes(n) && (!best || n.length > best.name.trim().toLowerCase().length)) return item;
              return best;
            }, null);
            const match = exact ?? partial;
            if (match) setSelectedId(match.id);
          }
        }
        if (lang !== 'fr') {
          const missingT = items.some(i => !(lang === 'en' ? i.name_en : i.name_es));
          if (missingT && retryRef.current < 6) {
            retryRef.current++;
            timer = setTimeout(() => load(true), 5000);
          }
        }
      }).catch(() => {});
    }

    load();
    return () => clearTimeout(timer);
  }, [lang]);

  const sectionOrder = ['invisibles', 'monopalmes', 'accessoires'] as const;
  const sections = sectionOrder.map(key => ({
    key,
    ...t.catalogue.sections[key],
    items: allItems.filter(i => i.section === key),
  })).filter(s => s.items.length > 0);

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <FloatingBubbles count={18} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>{t.catalogue.title}</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            {t.catalogue.subtitle}
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
                    <div className="w-full overflow-hidden cursor-pointer rounded-2xl mx-auto mt-3 px-3" style={{ aspectRatio: '4/3' }} onClick={() => setSelectedId(item.id)}>
                      {item.images[0] ? (
                        <img src={item.images[0]} alt={itemName(item)} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.08), rgba(4,15,40,0.06))' }}>
                          <span className="font-serif text-5xl" style={{ color: 'rgba(0,200,239,0.35)' }}>✦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-4 group-hover:text-primary transition-colors" style={{ color: '#e0f5ff', fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem' }}>{itemName(item)}</h3>
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-base text-primary font-medium">{item.price}</p>
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                          style={{ background: 'rgba(0,200,239,0.12)', border: '1.5px solid rgba(0,200,239,0.5)', color: '#007fa3' }}
                        >
                          {t.catalogue.details}
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
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4"
            style={{ background: 'rgba(4,15,40,0.88)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full md:max-w-[96vw] rounded-t-3xl md:rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(0,20,50,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(0,200,239,0.3)',
                boxShadow: '0 0 80px rgba(0,200,239,0.25)',
                maxHeight: '94vh',
                display: 'flex',
                flexDirection: 'column',
              } as React.CSSProperties}
              onClick={e => e.stopPropagation()}
            >
              {/* Bouton fermer — haut droite global */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: 'rgba(0,200,239,0.15)', color: '#e0f5ff', border: '1px solid rgba(0,200,239,0.3)', backdropFilter: 'blur(8px)' }}
              >
                <X size={20} />
              </button>

              {/* ── MOBILE : défilement global ── */}
              <div className="flex flex-col md:hidden overflow-y-auto" style={{ maxHeight: '94vh' }}>
                <div style={{ height: 56, flexShrink: 0 }} />
                <div className="px-4 pb-4" style={{ height: 220, flexShrink: 0 }}>
                  <Carousel images={selected.images} />
                </div>
                {toEmbedUrl(selected.video) && (
                  <div className="px-4 pb-4" style={{ flexShrink: 0 }}>
                    <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', border: '1.5px solid rgba(0,200,239,0.3)' }}>
                      <iframe
                        src={toEmbedUrl(selected.video)!}
                        title={`Vidéo ${itemName(selected)}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col px-6 pb-10 gap-5">
                  <h2 className="text-center leading-tight" style={{ color: '#e0f5ff', fontFamily: "'Dancing Script', cursive", fontSize: '1.9rem' }}>{itemName(selected)}</h2>
                  <div className="h-px w-24 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,239,0.6), transparent)' }} />
                  <p className="font-light leading-relaxed whitespace-pre-line" style={{ color: 'rgba(200,235,255,0.88)', fontSize: '0.95rem', lineHeight: '1.8' }}>{itemDesc(selected)}</p>
                  <p className="font-serif text-3xl text-primary font-semibold text-center">{selected.price}</p>
                  {selected.etsyUrl ? (
                    <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 shadow-[0_0_16px_rgba(0,200,239,0.4)] mx-auto">
                      <a href={selected.etsyUrl} target="_blank" rel="noopener noreferrer">🛒 {t.catalogue.order} sur Etsy</a>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 shadow-[0_0_16px_rgba(0,200,239,0.4)] mx-auto">
                      <Link href="/commander" onClick={() => setSelectedId(null)}>{t.catalogue.order}</Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* ── DESKTOP : texte | vidéo (si dispo) | carousel ── */}
              <div className="hidden md:flex flex-row" style={{ height: '90vh' }}>

                {/* Gauche : titre + description défilants, prix + bouton fixés en bas */}
                <div className="flex flex-col" style={{ flex: '1 1 0', minWidth: 0 }}>
                  <div className="flex-1 overflow-y-auto px-10 pt-8 pb-4 flex flex-col gap-6">
                    <h2 className="leading-tight pr-10" style={{ color: '#e0f5ff', fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
                      {itemName(selected)}
                    </h2>
                    <div className="h-px w-32" style={{ background: 'linear-gradient(90deg, rgba(0,200,239,0.7), transparent)' }} />
                    <p className="font-light leading-relaxed whitespace-pre-line" style={{ color: 'rgba(200,235,255,0.88)', fontSize: '1rem', lineHeight: '1.85' }}>
                      {itemDesc(selected)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 px-10 py-5 flex items-center justify-between gap-6" style={{ borderTop: '1px solid rgba(0,200,239,0.18)', background: 'rgba(0,10,35,0.7)', backdropFilter: 'blur(8px)' }}>
                    <p className="font-serif text-4xl text-primary font-semibold">{selected.price}</p>
                    {selected.etsyUrl ? (
                      <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 shadow-[0_0_20px_rgba(0,200,239,0.5)]">
                        <a href={selected.etsyUrl} target="_blank" rel="noopener noreferrer">🛒 {t.catalogue.order} sur Etsy</a>
                      </Button>
                    ) : (
                      <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 shadow-[0_0_20px_rgba(0,200,239,0.5)]">
                        <Link href="/commander" onClick={() => setSelectedId(null)}>{t.catalogue.order}</Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Colonne vidéo — visible seulement si une URL est définie */}
                {toEmbedUrl(selected.video) && (
                  <>
                    <div className="w-px self-stretch my-8 flex-shrink-0" style={{ background: 'rgba(0,200,239,0.2)' }} />
                    <div className="flex-shrink-0 flex flex-col justify-center p-6 gap-4" style={{ width: '36%' }}>
                      <p className="text-xs font-light text-center mb-1" style={{ color: 'rgba(200,235,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vidéo de présentation</p>
                      <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', border: '1.5px solid rgba(0,200,239,0.3)', boxShadow: '0 0 24px rgba(0,200,239,0.15)' }}>
                        <iframe
                          src={toEmbedUrl(selected.video)!}
                          title={`Vidéo ${itemName(selected)}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Séparateur */}
                <div className="w-px self-stretch my-8 flex-shrink-0" style={{ background: 'rgba(0,200,239,0.2)' }} />

                {/* Droite : carousel */}
                <div className="flex-shrink-0 p-6" style={{ width: toEmbedUrl(selected.video) ? '32%' : '52%' }}>
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
