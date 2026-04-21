import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { key: "monopalmes", label: "Monopalmes", emoji: "🐠", sub: "Nage sportive" },
  { key: "invisibles",  label: "Pieds Invisibles", emoji: "✨", sub: "Look naturel" },
  { key: "silicone",   label: "Silicone", emoji: "💎", sub: "Haut de gamme" },
];

export default function Catalogue() {
  const [activeTab, setActiveTab] = useState("monopalmes");
  const tails = {
    monopalmes: [
      { id: 1, name: "Queue Aurore Boréale", desc: "Couleurs irisées inspirées des aurores boréales", price: "À partir de 180€", img: "/images/catalog-1.png" },
      { id: 2, name: "Queue Nuit Étoilée", desc: "Bleu profond avec éclats argentés", price: "À partir de 195€", img: "/images/catalog-2.png" },
      { id: 3, name: "Queue Corail Flamboyant", desc: "Tons chauds orangés et rosés", price: "À partir de 180€", img: "/images/catalog-1.png" }
    ],
    invisibles: [
      { id: 4, name: "Queue Fond des Mers", desc: "Nageoire réaliste cachant parfaitement les pieds", price: "À partir de 250€", img: "/images/catalog-2.png" },
      { id: 5, name: "Queue Écume Douce", desc: "Tons clairs et nageoire fluide en organza", price: "À partir de 265€", img: "/images/catalog-1.png" },
      { id: 6, name: "Queue Abysses", desc: "Design sombre et mystérieux", price: "À partir de 250€", img: "/images/catalog-2.png" }
    ],
    silicone: [
      { id: 7, name: "Modèle Empereur", desc: "Silicone grade médical, écailles sculptées main", price: "À partir de 1200€", img: "/images/catalog-1.png" },
      { id: 8, name: "Modèle Léviathan", desc: "Nageoires dorsales et latérales incluses", price: "À partir de 1500€", img: "/images/catalog-2.png" },
      { id: 9, name: "Modèle Sirène Perle", desc: "Finition nacrée et irisée exceptionnelle", price: "À partir de 1350€", img: "/images/catalog-1.png" }
    ]
  };

  const accessories = [
    { id: 10, name: "Couronne de Coquillages", price: "45€" },
    { id: 11, name: "Soutien-gorge Sirène", price: "À partir de 65€" },
    { id: 12, name: "Bijoux d'écailles", price: "30€" },
    { id: 13, name: "Nageoires de bras", price: "80€" }
  ];

  return (
    <div className="min-h-screen section-clair pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Notre Catalogue</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Découvrez nos créations artisanales. Chaque modèle peut être personnalisé selon vos envies.
          </p>
        </motion.div>

        {/* Menu catégories */}
        <div className="flex flex-wrap justify-center gap-5 mb-16">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.key;
            return (
              <motion.button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center gap-1 px-8 py-5 rounded-2xl transition-all duration-300 font-serif"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0,200,239,0.2), rgba(0,229,255,0.08))'
                    : 'rgba(255,255,255,0.75)',
                  border: isActive
                    ? '2px solid rgba(0,200,239,0.8)'
                    : '2px solid rgba(0,200,239,0.25)',
                  boxShadow: isActive
                    ? '0 0 24px rgba(0,200,239,0.4), inset 0 0 12px rgba(0,200,239,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  color: isActive ? '#007fa3' : '#1a3d5c',
                  minWidth: '160px',
                }}
              >
                <span className="text-3xl mb-1">{cat.emoji}</span>
                <span className="text-lg font-semibold tracking-wide">{cat.label}</span>
                <span className="text-xs font-light opacity-70">{cat.sub}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
                    style={{ background: 'rgba(0,200,239,0.9)' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Contenu */}
        <div className="mb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(tails as any)[activeTab].map((item: any, i: number) => (
                <ProductCard key={item.id} item={item} delay={i * 0.1} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl font-serif mb-10 text-center" style={{ color: '#0a2a4a' }}>Accessoires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessories.map((acc, i) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(0,200,239,0.55)', boxShadow: '0 0 20px rgba(0,200,239,0.15)' }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,200,239,0.12)' }}>
                  <span className="text-primary text-2xl font-serif">✦</span>
                </div>
                <h3 className="font-serif text-lg mb-2" style={{ color: '#0a2a4a' }}>{acc.name}</h3>
                <p className="font-medium text-primary">{acc.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-20">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(0,200,239,0.5)] hover:shadow-[0_0_35px_rgba(0,200,239,0.7)] transition-all hover:scale-105">
            <Link href="/commander">Commander sur mesure</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, delay }: { item: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300"
      style={{ border: '2px solid rgba(0,200,239,0.55)', boxShadow: '0 0 20px rgba(0,200,239,0.15)', background: 'rgba(255,255,255,0.85)' }}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-6" style={{ background: 'rgba(255,255,255,0.95)' }}>
        <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors" style={{ color: '#0a2a4a' }}>{item.name}</h3>
        <p className="text-sm mb-4 font-light" style={{ color: '#1a3d5c' }}>{item.desc}</p>
        <p className="font-serif text-lg text-primary font-medium">{item.price}</p>
      </div>
    </motion.div>
  );
}
