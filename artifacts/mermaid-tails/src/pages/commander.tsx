import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Palette, Ruler, MessageCircle, CreditCard, ChevronRight, ChevronLeft, X, ZoomIn, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const FIN_SCHEMA_IMAGES: Record<string, string> = {
  SIREN:    '/images/schema-siren.jpg',
  LAGOON:   '/images/schema-lagoon.jpg',
  SPLASH:   '/images/schema-splash.jpg',
  H2O:      '/images/schema-h2o.jpg',
  GOLDFISH: '/images/schema-goldfish.jpg',
  ARIEL:    '/images/schema-ariel.jpg',
};

const STEP_ICONS = [
  <span style={{ fontSize: 36, lineHeight: 1 }}>🧜‍♀️</span>,
  <Scissors size={28} />,
  <Palette size={28} />,
  <Ruler size={28} />,
  <MessageCircle size={28} />,
  <CreditCard size={28} />,
];
const STEP_IMAGES = [null, null, null, "/images/mes-mesures.webp", null, null];

type SchemaPopup = { label: string; src: string } | null;

export default function Commander() {
  const [currentStep, setCurrentStep] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [schemaPopup, setSchemaPopup] = useState<SchemaPopup>(null);
  const [schemaImgError, setSchemaImgError] = useState(false);
  const { t } = useLanguage();
  useSEO("commander");

  const steps = t.commander.steps;

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <FloatingBubbles count={18} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>{t.commander.title}</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            {t.commander.subtitle}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0 rounded-full" style={{ background: 'rgba(0,200,239,0.2)' }}></div>
            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                data-testid={`button-step-${i + 1}`}
                className={`relative z-10 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-sm md:text-base ${i <= currentStep ? "bg-primary text-white shadow-[0_0_15px_rgba(0,200,239,0.6)] scale-110" : "border-2 hover:border-primary/50"}`}
                style={i > currentStep ? { background: 'rgba(0,20,50,0.5)', borderColor: 'rgba(0,200,239,0.4)', color: '#e0f5ff' } : {}}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="rounded-3xl p-6 md:p-12 flex flex-col justify-center shadow-lg relative" style={{ minHeight: '420px', background: 'rgba(0,20,50,0.45)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(0,200,239,0.3)', boxShadow: '0 4px 24px rgba(0,200,239,0.1)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className={`flex w-full overflow-y-auto ${STEP_IMAGES[currentStep] ? 'flex-col md:flex-row md:items-center md:gap-8 text-left gap-6' : 'flex-col items-center text-center'}`}
              >
                {/* Left / main content */}
                <div className={`flex flex-col ${STEP_IMAGES[currentStep] ? 'items-start flex-1' : 'items-center w-full'}`}>
                  <div className={`flex items-center gap-3 mb-5 ${STEP_IMAGES[currentStep] ? '' : 'justify-center'}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-primary" style={{ background: 'rgba(0,200,239,0.12)' }}>
                      {STEP_ICONS[currentStep]}
                    </div>
                    <h2 className="text-xl md:text-3xl font-serif" style={{ color: '#e0f5ff' }}>{steps[currentStep].title}</h2>
                  </div>
                  {'choices' in steps[currentStep] && (steps[currentStep] as { choices: string[] }).choices ? (
                    <div className="w-full max-w-md flex flex-col gap-3">
                      {'note' in steps[currentStep] && (steps[currentStep] as { note?: string }).note && (
                        <div className="text-sm leading-relaxed font-light whitespace-pre-line" style={{ color: 'rgba(200,235,255,0.85)' }}>
                          {(steps[currentStep] as { note?: string }).note}
                        </div>
                      )}
                      <ul className="flex flex-col gap-2">
                        {(steps[currentStep] as { choices: string[] }).choices.map((choice, idx) => {
                          const hasSchema = choice.toUpperCase() in FIN_SCHEMA_IMAGES;

                          if (hasSchema) {
                            return (
                              <li key={idx}>
                                <button
                                  onClick={() => { setSchemaImgError(false); setSchemaPopup({ label: choice, src: FIN_SCHEMA_IMAGES[choice.toUpperCase()] }); }}
                                  className="group w-full flex items-center gap-2 rounded-lg px-4 py-2 font-light text-sm transition-all duration-200 hover:scale-[1.02]"
                                  style={{ background: 'rgba(0,200,239,0.1)', border: '1px solid rgba(0,200,239,0.35)', color: '#e0f5ff', cursor: 'pointer' }}
                                >
                                  <span className="text-primary font-semibold text-xs">✦</span>
                                  <span className="flex-1 text-left">{choice}</span>
                                  <ZoomIn size={14} className="opacity-40 group-hover:opacity-100 transition-opacity text-primary" />
                                </button>
                              </li>
                            );
                          }

                          // Choice → navigate to catalogue with item pre-opened
                          return (
                            <li key={idx}>
                              <button
                                onClick={() => window.open(`/queue-de-sirene?open=${encodeURIComponent(choice)}`, '_blank')}
                                className="group w-full flex items-center gap-2 rounded-lg px-4 py-2 font-light text-sm transition-all duration-200 hover:scale-[1.02]"
                                style={{ background: 'rgba(0,200,239,0.1)', border: '1px solid rgba(0,200,239,0.35)', color: '#e0f5ff', cursor: 'pointer' }}
                              >
                                <span className="text-primary font-semibold text-xs">✦</span>
                                <span className="flex-1 text-left">{choice}</span>
                                <ExternalLink size={13} className="opacity-40 group-hover:opacity-100 transition-opacity text-primary" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed font-light whitespace-pre-line" style={{ color: 'rgba(200,235,255,0.85)' }}>
                      {'desc' in steps[currentStep] ? (steps[currentStep] as { desc?: string }).desc : ''}
                    </p>
                  )}
                </div>
                {/* Right: image if present */}
                {STEP_IMAGES[currentStep] && (
                  <div className="flex-shrink-0 w-full md:w-[400px] flex items-center justify-center">
                    <div
                      className="relative group cursor-zoom-in w-full max-w-xs md:max-w-none rounded-2xl overflow-hidden"
                      onClick={() => setLightbox(true)}
                    >
                      <img
                        src={STEP_IMAGES[currentStep]!}
                        alt="Schéma des mesures"
                        className="w-full rounded-2xl object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        style={{ border: '1.5px solid rgba(0,200,239,0.35)', boxShadow: '0 0 16px rgba(0,200,239,0.15)' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(4,15,40,0.35)' }}>
                        <ZoomIn size={40} className="text-white drop-shadow" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-10">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="rounded-full px-8" style={{ borderColor: 'rgba(0,200,239,0.5)', color: '#e0f5ff', background: 'rgba(0,20,50,0.4)' }}>
              <ChevronLeft className="mr-2" size={20} /> {t.commander.prev}
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button size="lg" onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))} className="bg-primary text-white hover:bg-primary/90 rounded-full px-8">
                {t.commander.next} <ChevronRight className="ml-2" size={20} />
              </Button>
            ) : (
              <Button size="lg" onClick={() => setContactOpen(true)} className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 shadow-[0_0_15px_rgba(0,200,239,0.5)]">
                {t.commander.contact}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,15,40,0.92)' }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-5 right-5 text-white rounded-full p-2 hover:bg-white/10 transition-colors"
              onClick={() => setLightbox(false)}
            >
              <X size={32} />
            </button>
            <motion.img
              src="/images/mes-mesures.webp"
              alt="Schéma des mesures agrandi"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              style={{ boxShadow: '0 0 60px rgba(0,200,239,0.3)' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schema Popup */}
      <AnimatePresence>
        {schemaPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,15,40,0.92)' }}
            onClick={() => setSchemaPopup(null)}
          >
            <button
              className="absolute top-5 right-5 text-white rounded-full p-2 hover:bg-white/10 transition-colors"
              onClick={() => setSchemaPopup(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {schemaImgError ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl p-10" style={{ background: 'rgba(0,20,50,0.6)', border: '1.5px dashed rgba(0,200,239,0.35)' }}>
                  <ImageIcon size={48} style={{ color: 'rgba(0,200,239,0.4)' }} />
                  <p className="text-sm text-center" style={{ color: 'rgba(200,235,255,0.6)' }}>
                    Schéma à venir — image non encore disponible
                  </p>
                </div>
              ) : (
                <img
                  src={schemaPopup.src}
                  alt={`Schéma ${schemaPopup.label}`}
                  onError={() => setSchemaImgError(true)}
                  className="max-h-[75vh] max-w-[85vw] rounded-2xl object-contain"
                  style={{ boxShadow: '0 0 60px rgba(0,200,239,0.25)', border: '1.5px solid rgba(0,200,239,0.3)' }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
