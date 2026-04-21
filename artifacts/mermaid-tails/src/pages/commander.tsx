import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Scissors, Palette, Ruler, MessageCircle, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: <Fish size={28} />, title: "Choisir sa queue de sirène", desc: null, choices: ["Classique silicone", "Pieds invisible", "Longfish", "Monopalme", "Monopalme à extension"] },
  { icon: <Scissors size={28} />, title: "Choisir la forme de votre nageoire", desc: null, choices: ["SIREN", "LAGOON", "SPLASH", "H2O", "GOLDFISH", "ARIEL"], note: "Choisissez la forme de votre nageoire parmi les designs proposés, ils sont affichés sur chaque rubrique de description : « Classique silicone », « Pieds invisible » et « Longfish ».\n\nLe tarif est le même pour chaque forme.\n\nTaille : 75 cm largeur / 75 cm longueur pour toutes les formes." },
  { icon: <Palette size={28} />, title: "Choisir les couleurs et détails", desc: "Choisissez vos couleurs et l'ajout de petites nageoires et/ou dorsales, spécifiez-le nous lors de votre message, nous vous enverrons plusieurs teintes possibles.\n\nN'hésitez pas à nous envoyer également le plus de photos de référence possible afin de visualiser au mieux votre demande." },
  { icon: <Ruler size={28} />, title: "Vos mesures", desc: "La prise de vos mesures est indispensable pour un ajustement parfait !\n\nElles sont à prendre debout, les jambes serrées ensemble comme si vous étiez dans la nageoire.\n\nGrâce à ce tableau, prenez en centimètres les tours à droite et les longueurs à gauche.\n\nLa mesure de la taille doit être au niveau du nombril, la mesure cheville au niveau de l'os de votre cheville.\n\nLa longueur doit partir du nombril à la hanche, du nombril aux fesses, du nombril au milieu des cuisses, etc. Jusqu'à la cheville et non le sol !", image: "/images/mes-mesures.webp" },
  { icon: <MessageCircle size={28} />, title: "Nous contacter", desc: "Envoyez-nous votre commande par email ou via nos réseaux sociaux. Nous vous répondrons sous 48h pour confirmer et affiner votre projet." },
  { icon: <CreditCard size={28} />, title: "Paiement", desc: "Acompte de 30% à la commande, solde à la livraison. Délai de fabrication : 4 à 8 semaines selon le modèle." }
];

export default function Commander() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen section-clair pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Comment Commander ?</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Découvrez les étapes simples pour donner vie à votre queue de sirène sur mesure.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0 rounded-full" style={{ background: 'rgba(0,200,239,0.2)' }}></div>
            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                data-testid={`button-step-${i + 1}`}
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-semibold ${i <= currentStep ? "bg-primary text-white shadow-[0_0_15px_rgba(0,200,239,0.6)] scale-110" : "border-2 hover:border-primary/50"}`}
                style={i > currentStep ? { background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,200,239,0.4)', color: '#0a2a4a' } : {}}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="rounded-3xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center shadow-lg relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)', border: '2px solid rgba(0,200,239,0.55)', boxShadow: '0 0 25px rgba(0,200,239,0.2)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className={`flex w-full ${STEPS[currentStep].image ? 'flex-row items-start gap-8 text-left' : 'flex-col items-center text-center'}`}
              >
                {/* Left / main content */}
                <div className={`flex flex-col ${STEPS[currentStep].image ? 'items-start flex-1' : 'items-center w-full'}`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-primary" style={{ background: 'rgba(0,200,239,0.12)' }}>
                    {STEPS[currentStep].icon}
                  </div>
                  <h2 className="text-3xl font-serif mb-6" style={{ color: '#0a2a4a' }}>{STEPS[currentStep].title}</h2>
                  {STEPS[currentStep].choices ? (
                    <div className="w-full max-w-md flex flex-col gap-4">
                      {STEPS[currentStep].note && (
                        <div className="text-sm leading-relaxed font-light whitespace-pre-line" style={{ color: '#1a3d5c' }}>
                          {STEPS[currentStep].note}
                        </div>
                      )}
                      <ul className="flex flex-col gap-3">
                        {STEPS[currentStep].choices.map((choice, idx) => (
                          <li key={idx} className="flex items-center gap-3 rounded-xl px-5 py-3 font-light text-lg" style={{ background: 'rgba(0,200,239,0.08)', border: '1.5px solid rgba(0,200,239,0.35)', color: '#0a2a4a' }}>
                            <span className="text-primary font-semibold">✦</span>
                            {choice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed font-light whitespace-pre-line" style={{ color: '#1a3d5c' }}>{STEPS[currentStep].desc}</p>
                  )}
                </div>
                {/* Right: image if present */}
                {STEPS[currentStep].image && (
                  <div className="flex-shrink-0 w-72 md:w-96 flex items-center justify-center">
                    <img
                      src={STEPS[currentStep].image}
                      alt="Schéma des mesures"
                      className="w-full rounded-2xl object-contain"
                      style={{ border: '1.5px solid rgba(0,200,239,0.35)', boxShadow: '0 0 16px rgba(0,200,239,0.15)' }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-10">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="rounded-full px-8" style={{ borderColor: 'rgba(0,200,239,0.5)', color: '#0a2a4a' }}>
              <ChevronLeft className="mr-2" size={20} /> Précédent
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button size="lg" onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))} className="bg-primary text-white hover:bg-primary/90 rounded-full px-8">
                Suivant <ChevronRight className="ml-2" size={20} />
              </Button>
            ) : (
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 shadow-[0_0_15px_rgba(0,200,239,0.5)]">
                Nous Contacter
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
