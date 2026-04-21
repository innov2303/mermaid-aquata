import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      q: "Combien de temps faut-il pour fabriquer une queue ?",
      a: "Le délai de fabrication varie entre 4 et 8 semaines selon la complexité du modèle et les matériaux choisis. Les modèles en silicone demandent plus de temps de séchage et de peinture."
    },
    {
      q: "Quelle est la différence entre monopalme et pieds invisibles ?",
      a: "Une queue monopalme intègre une palme rigide à l'intérieur pour une nage sportive. Les pieds invisibles dissimulent vos pieds dans une nageoire fluide, offrant un look plus naturel mais moins adapté à la natation rapide."
    },
    {
      q: "Est-ce que les queues sont utilisables en piscine ?",
      a: "Oui, nos queues en tissu et en silicone sont résistantes au chlore. Il est cependant recommandé de bien les rincer à l'eau claire après chaque utilisation pour prolonger leur durée de vie."
    },
    {
      q: "Comment prendre ses mesures ?",
      a: "Nous vous fournissons un guide détaillé avec un schéma. Vous aurez besoin d'un mètre ruban pour mesurer votre taille, vos hanches, la longueur de vos jambes et la pointure de vos pieds."
    },
    {
      q: "Puis-je nager avec une queue en silicone ?",
      a: "Absolument ! Le silicone que nous utilisons est de grade médical, souple et très résistant. Il offre une propulsion excellente et un mouvement incroyablement réaliste dans l'eau."
    },
    {
      q: "Quel entretien pour ma queue de sirène ?",
      a: "Rincez-la à l'eau douce froide après chaque baignade. Laissez-la sécher à plat, à l'ombre. Ne pas utiliser de machine à laver, de sèche-linge ou de produits chimiques."
    },
    {
      q: "Livrez-vous à l'étranger ?",
      a: "Oui, nous expédions nos créations dans le monde entier. Les frais et délais de livraison varient selon la destination. Des frais de douane peuvent s'appliquer hors UE."
    },
    {
      q: "Est-il possible de personnaliser entièrement ma queue ?",
      a: "Tout à fait ! C'est le cœur de notre métier. Vous pouvez choisir les couleurs, le motif des écailles, ajouter des nageoires supplémentaires (dorsale, hanches, mollets) et même des finitions nacrées ou pailletées."
    }
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
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'rgba(0,200,239,0.15)', color: '#00e5ff' }}>
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" style={{ textShadow: '0 0 30px rgba(0,200,239,0.4)' }}>Foire Aux Questions</h1>
            <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Toutes les réponses à vos questions concernant nos queues de sirène artisanales.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu clair */}
      <div className="section-clair py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="rounded-2xl px-6 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '2px solid rgba(0,200,239,0.55)',
                      boxShadow: '0 0 16px rgba(0,200,239,0.12)'
                    }}
                  >
                    <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-6" style={{ color: '#0a2a4a' }}>
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-light leading-relaxed pb-6 text-base" style={{ color: '#1a3d5c' }}>
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
