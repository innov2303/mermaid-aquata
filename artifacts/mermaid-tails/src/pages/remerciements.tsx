import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Remerciements() {
  const sirenes = [
    { id: 1, name: "Océane", model: "Queue Aurore Boréale", quote: "Un rêve d'enfant devenu réalité. La qualité est incroyable et l'effet dans l'eau est magique.", img: "/images/sirene-1.png" },
    { id: 2, name: "Marina", model: "Modèle Léviathan Silicone", quote: "La propulsion est exceptionnelle. On a vraiment l'impression que la queue fait partie de nous.", img: "/images/sirene-2.png" },
    { id: 3, name: "Coral", model: "Queue Corail Flamboyant", quote: "Les couleurs sont encore plus belles en vrai. Merci pour votre patience lors de la création !", img: "/images/sirene-1.png" },
    { id: 4, name: "Neptunea", model: "Queue Abysses", quote: "Idéale pour mes shootings photos sous-marins. Le rendu est hyper professionnel.", img: null },
    { id: 5, name: "Aquamarine", model: "Sirène Pieds Invisibles", quote: "Enfin une queue qui cache vraiment les pieds tout en restant fluide. J'adore !", img: null },
    { id: 6, name: "Luna", model: "Création Sur Mesure", quote: "Vous avez su comprendre exactement ce que je voulais. La couronne assortie est le petit plus parfait.", img: null }
  ];

  return (
    <div className="min-h-screen">
      {/* Header sombre */}
      <div className="pt-32 pb-16" style={{ background: 'linear-gradient(180deg, #040f28 0%, #0a3a5c 100%)' }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" style={{ textShadow: '0 0 30px rgba(0,200,239,0.4)' }}>Nos Sirènes</h1>
            <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Merci de nous faire confiance pour réaliser vos rêves. Découvrez nos créations en action.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu clair */}
      <div className="section-clair py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sirenes.map((sirene, i) => (
              <motion.div
                key={sirene.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '2px solid rgba(0,200,239,0.55)',
                  boxShadow: '0 0 20px rgba(0,200,239,0.15)'
                }}
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 rotate-180 transition-colors" style={{ color: 'rgba(0,200,239,0.2)' }} />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full border-2 overflow-hidden flex-shrink-0" style={{ borderColor: 'rgba(0,200,239,0.5)', background: 'rgba(0,200,239,0.08)' }}>
                    {sirene.img ? (
                      <img src={sirene.img} alt={sirene.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,200,239,0.2), rgba(0,229,255,0.15))' }}>
                        <span className="font-serif text-2xl text-primary">{sirene.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl" style={{ color: '#0a2a4a' }}>{sirene.name}</h3>
                    <p className="text-sm text-primary font-medium">{sirene.model}</p>
                  </div>
                </div>

                <p className="italic font-light leading-relaxed" style={{ color: '#1a3d5c' }}>
                  "{sirene.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
