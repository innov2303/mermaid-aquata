import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Faq() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>{t.faq.title}</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            {t.faq.subtitle}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {t.faq.items.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="rounded-2xl px-6 transition-all"
                  style={{
                    background: 'rgba(0,20,50,0.45)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(0,200,239,0.3)',
                    boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
                  }}
                >
                  <AccordionTrigger
                    className="text-left font-serif text-base hover:no-underline py-5"
                    style={{ color: '#e0f5ff' }}
                  >
                    <span className="flex items-start gap-3">
                      <Sparkles size={16} className="text-primary shrink-0 mt-1" />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    className="font-light leading-relaxed pb-5 text-sm"
                    style={{ color: 'rgba(200,235,255,0.85)' }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
