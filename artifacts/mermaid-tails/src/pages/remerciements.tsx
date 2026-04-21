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
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 text-cyan-shimmer">Nos Sirènes</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto font-light">
            Merci de nous faire confiance pour réaliser vos rêves. Découvrez nos créations en action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sirenes.map((sirene, i) => (
            <motion.div
              key={sirene.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-3xl p-8 border border-border/50 relative group hover:border-accent/50 transition-colors"
            >
              <Quote className="absolute top-6 right-6 text-accent/20 w-12 h-12 rotate-180 group-hover:text-accent/40 transition-colors" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-background border-2 border-primary/50 overflow-hidden flex-shrink-0">
                  {sirene.img ? (
                    <img src={sirene.img} alt={sirene.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="font-serif text-2xl text-white">{sirene.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white">{sirene.name}</h3>
                  <p className="text-sm text-accent">{sirene.model}</p>
                </div>
              </div>
              
              <p className="text-foreground/80 italic font-light leading-relaxed">
                "{sirene.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
