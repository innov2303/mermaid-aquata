import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Scissors, Palette, Ruler, MessageCircle, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: <Fish size={28} />,
    title: "Choisir sa queue de sirène",
    desc: "Parcourez notre catalogue et choisissez le modèle qui vous fait rêver : monopalme, pieds invisibles ou silicone classique."
  },
  {
    icon: <Scissors size={28} />,
    title: "Choisir la forme de votre nageoire",
    desc: "Sélectionnez parmi nos formes de nageoires : classique, papillon, éventail, asymétrique ou créez la vôtre."
  },
  {
    icon: <Palette size={28} />,
    title: "Choisir les couleurs et détails",
    desc: "Exprimez votre personnalité ! Choisissez vos couleurs, dégradés, motifs d'écailles et détails décoratifs."
  },
  {
    icon: <Ruler size={28} />,
    title: "Vos mesures",
    desc: "Nous prenons vos mesures personnalisées pour une queue parfaitement adaptée à votre morphologie : tour de hanches, de taille, longueur des jambes."
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Nous contacter",
    desc: "Envoyez-nous votre commande par email ou via nos réseaux sociaux. Nous vous répondrons sous 48h pour confirmer et affiner votre projet."
  },
  {
    icon: <CreditCard size={28} />,
    title: "Paiement",
    desc: "Acompte de 30% à la commande, solde à la livraison. Délai de fabrication : 4 à 8 semaines selon le modèle."
  }
];

export default function Commander() {
  const [currentStep, setCurrentStep] = useState(0);

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
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" style={{ textShadow: '0 0 30px rgba(0,200,239,0.4)' }}>Comment Commander ?</h1>
            <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Découvrez les étapes simples pour donner vie à votre queue de sirène sur mesure.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu clair */}
      <div className="section-clair py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Stepper Navigation */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0 rounded-full" style={{ background: 'rgba(0,200,239,0.2)' }}></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              ></div>

              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  data-testid={`button-step-${i + 1}`}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-semibold ${
                    i <= currentStep
                      ? "bg-primary text-white shadow-[0_0_15px_rgba(0,200,239,0.6)] scale-110"
                      : "border-2 hover:border-primary/50"
                  }`}
                  style={i > currentStep ? { background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,200,239,0.4)', color: '#0a2a4a' } : {}}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div
              className="rounded-3xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center shadow-lg relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.85)', border: '2px solid rgba(0,200,239,0.55)', boxShadow: '0 0 25px rgba(0,200,239,0.2)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-primary" style={{ background: 'rgba(0,200,239,0.12)' }}>
                    {STEPS[currentStep].icon}
                  </div>
                  <h2 className="text-3xl font-serif mb-6" style={{ color: '#0a2a4a' }}>{STEPS[currentStep].title}</h2>
                  <p className="text-lg leading-relaxed font-light max-w-2xl" style={{ color: '#1a3d5c' }}>
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
                className="rounded-full px-8"
                style={{ borderColor: 'rgba(0,200,239,0.5)', color: '#0a2a4a' }}
              >
                <ChevronLeft className="mr-2" size={20} /> Précédent
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-8"
                >
                  Suivant <ChevronRight className="ml-2" size={20} />
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 shadow-[0_0_15px_rgba(0,200,239,0.5)]"
                >
                  Nous Contacter
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
