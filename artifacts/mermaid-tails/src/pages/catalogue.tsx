import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    key: "monopalmes",
    label: "Monopalmes",
    sub: "Nage sportive & dynamique",
    items: [
      { id: 1, name: "Queue Aurore Boréale", desc: "Couleurs irisées inspirées des aurores boréales", price: "À partir de 180€", img: "/images/catalog-1.png" },
      { id: 2, name: "Queue Nuit Étoilée", desc: "Bleu profond avec éclats argentés", price: "À partir de 195€", img: "/images/catalog-2.png" },
      { id: 3, name: "Queue Corail Flamboyant", desc: "Tons chauds orangés et rosés", price: "À partir de 180€", img: "/images/catalog-1.png" },
    ],
  },
  {
    key: "invisibles",
    label: "Pieds Invisibles",
    sub: "Silhouette naturelle & fluide",
    items: [
      { id: 4, name: "Queue Fond des Mers", desc: "Nageoire réaliste cachant parfaitement les pieds", price: "À partir de 250€", img: "/images/catalog-2.png" },
      { id: 5, name: "Queue Écume Douce", desc: "Tons clairs et nageoire fluide en organza", price: "À partir de 265€", img: "/images/catalog-1.png" },
      { id: 6, name: "Queue Abysses", desc: "Design sombre et mystérieux", price: "À partir de 250€", img: "/images/catalog-2.png" },
    ],
  },
  {
    key: "silicone",
    label: "Silicone",
    sub: "Haut de gamme & réaliste",
    items: [
      { id: 7, name: "Modèle Empereur", desc: "Silicone grade médical, écailles sculptées main", price: "À partir de 1200€", img: "/images/catalog-1.png" },
      { id: 8, name: "Modèle Léviathan", desc: "Nageoires dorsales et latérales incluses", price: "À partir de 1500€", img: "/images/catalog-2.png" },
      { id: 9, name: "Modèle Sirène Perle", desc: "Finition nacrée et irisée exceptionnelle", price: "À partir de 1350€", img: "/images/catalog-1.png" },
    ],
  },
  {
    key: "accessoires",
    label: "Accessoires",
    sub: "Complétez votre tenue de sirène",
    items: [
      { id: 10, name: "Couronne de Coquillages", desc: "Fait main, coquillages naturels", price: "45€", img: null },
      { id: 11, name: "Soutien-gorge Sirène", desc: "Assorti à votre queue, sur mesure", price: "À partir de 65€", img: null },
      { id: 12, name: "Bijoux d'écailles", desc: "Colliers et bracelets nacrés", price: "30€", img: null },
      { id: 13, name: "Nageoires de bras", desc: "Pour un effet sirène complet", price: "80€", img: null },
    ],
  },
];

export default function Catalogue() {
  return (
    <div className="min-h-screen section-clair pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Notre Catalogue</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Découvrez nos créations artisanales. Chaque modèle peut être personnalisé selon vos envies.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          {SECTIONS.map((section, si) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* En-tête de section */}
              <div className="flex items-center gap-6 mb-10">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(0,200,239,0.6), transparent)' }} />
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-serif" style={{ color: '#0a2a4a' }}>{section.label}</h2>
                  <p className="text-sm mt-1 font-light" style={{ color: '#1a3d5c' }}>{section.sub}</p>
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, rgba(0,200,239,0.6), transparent)' }} />
              </div>

              {/* Grille */}
              <div className={`grid gap-8 ${section.items.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.45 }}
                    className="group rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.85)', border: '2px solid rgba(0,200,239,0.45)', boxShadow: '0 0 20px rgba(0,200,239,0.1)' }}
                  >
                    {item.img ? (
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.08), rgba(4,15,40,0.06))' }}>
                        <span className="font-serif text-5xl" style={{ color: 'rgba(0,200,239,0.35)' }}>✦</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors" style={{ color: '#0a2a4a' }}>{item.name}</h3>
                      <p className="text-sm font-light mb-4" style={{ color: '#1a3d5c' }}>{item.desc}</p>
                      <p className="font-serif text-base text-primary font-medium">{item.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-24">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(0,200,239,0.5)] hover:shadow-[0_0_35px_rgba(0,200,239,0.7)] transition-all hover:scale-105">
            <Link href="/commander">Commander sur mesure</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
