import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Scissors, Palette, Ruler, MessageCircle, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: <Fish size={24} />,
    title: "Choisir sa queue de sirène",
    desc: "Parcourez notre catalogue et choisissez le modèle qui vous fait rêver : monopalme, pieds invisibles ou silicone classique."
  },
  {
    icon: <Scissors size={24} />,
    title: "Choisir la forme de votre nageoire",
    desc: "Sélectionnez parmi nos formes de nageoires : classique, papillon, éventail, asymétrique ou créez la vôtre."
  },
  {
    icon: <Palette size={24} />,
    title: "Choisir les couleurs et détails",
    desc: "Exprimez votre personnalité ! Choisissez vos couleurs, dégradés, motifs d'écailles et détails décoratifs."
  },
  {
    icon: <Ruler size={24} />,
    title: "Vos mesures",
    desc: "Nous prenons vos mesures personnalisées pour une queue parfaitement adaptée à votre morphologie : tour de hanches, de taille, longueur des jambes."
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Nous contacter",
    desc: "Envoyez-nous votre commande par email ou via nos réseaux sociaux. Nous vous répondrons sous 48h pour confirmer et affiner votre projet."
  },
  {
    icon: <CreditCard size={24} />,
    title: "Paiement",
    desc: "Acompte de 30% à la commande, solde à la livraison. Délai de fabrication : 4 à 8 semaines selon le modèle."
  }
];

export default function Commander() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Comment Commander ?</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto font-light">
            Découvrez les étapes simples pour donner vie à votre queue de sirène sur mesure.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Stepper Navigation */}
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-card -translate-y-1/2 z-0 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            ></div>
            
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  i <= currentStep 
                    ? "bg-accent text-background shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-110" 
                    : "bg-card border-2 border-border text-foreground/50 hover:border-accent/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
                  {STEPS[currentStep].icon}
                </div>
                <h2 className="text-3xl font-serif text-white mb-6">{STEPS[currentStep].title}</h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-light max-w-2xl">
                  {STEPS[currentStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-between mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="border-border text-foreground hover:bg-card rounded-full px-8"
            >
              <ChevronLeft className="mr-2" size={20} /> Précédent
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button
                size="lg"
                onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className="bg-primary text-background hover:bg-primary/90 rounded-full px-8"
              >
                Suivant <ChevronRight className="ml-2" size={20} />
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-accent text-background hover:bg-accent/90 rounded-full px-8 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                Nous Contacter
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
