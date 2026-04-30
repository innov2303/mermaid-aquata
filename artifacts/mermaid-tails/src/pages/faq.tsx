import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

const FAQS = [
  {
    q: "Combien coûtent vos queues ?",
    a: "Nos queues commencent à 1 999 euros. Livraison non incluse."
  },
  {
    q: "Qu'acceptez-vous comme moyen de paiement ?",
    a: "Nous acceptons les paiements par PayPal ou virement bancaire (via formulaire de contact)."
  },
  {
    q: "Comment commander une queue ?",
    a: "Vous pouvez soumettre une demande de création de nageoire sur mesure directement sur le site web via le formulaire de contact ou par messages Instagram."
  },
  {
    q: "Acceptez-vous les plans de paiement ?",
    a: "Nous n'offrons pas de plans de paiement pour les nouveaux clients. Nous proposons désormais des paiements moitié-moitié pour les clients fidèles."
  },
  {
    q: "Quel est le délai de production ?",
    a: "Le délai de livraison est d'environ 4 mois à partir de la réception du paiement. Vous êtes tenue informée tout au long de la création. Nous travaillons très dur pour que les commandes soient traitées le plus rapidement possible, mais c'est de l'art et nous sommes plus soucieux de nous assurer que vous recevez le MEILLEUR produit possible, même si cela prend un peu plus de temps."
  },
  {
    q: "Existe-t-il une option d'urgence ?",
    a: "Oui, pour 800 euros supplémentaires, nous pouvons expédier votre commande en urgence si vous devez passer en tête de la file d'attente et réduire votre temps d'attente. Des frais d'urgence seront appliqués à toute commande avec une date limite. (Sous réserve de disponibilité)."
  },
  {
    q: "Combien coûte la livraison ?",
    a: "Le prix de livraison varie en fonction du poids et de la destination. Il est d'environ 50 euros pour la France jusqu'à 140 euros à l'international. Il vous est communiqué avec le devis gratuit."
  },
  {
    q: "Expédiez-vous à l'international ?",
    a: "Oui, nous expédions partout dans le monde."
  },
  {
    q: "Je vous ai envoyé plusieurs e-mails sans réponse, quel est le problème ?",
    a: "Mermaid Aquata répond en général rapidement sous 24h à 48h."
  },
  {
    q: "Vos queues permettent-elles de nager ?",
    a: "Nos queues sont faites pour nager en eau douce, en eau salée et en eau chlorée, grâce à nos monopalmes faites sur mesure pour chaque nageoire."
  },
  {
    q: "Si j'abîme ma queue, est-ce que cela peut être réparé ?",
    a: "Nous envoyons avec la nageoire un manuel d'utilisation et d'entretien pour éviter tout souci. Cependant, nous restons à votre disposition même des années après votre commande si vous rencontrez le moindre souci. Attention, les réparations sont payantes."
  },
  {
    q: "Faites-vous des nageoires personnalisées ?",
    a: "Absolument ! Le design est travaillé en collaboration avec vous, cependant vous pouvez également choisir un modèle déjà créé sur nos réseaux."
  },
  {
    q: "Quel est le système de drainage ?",
    a: "Il n'y a pas de système de drainage sur nos nageoires car cela n'est pas nécessaire. L'eau ne s'infiltre pas dans la monopalme, uniquement dans vos jambes légèrement."
  },
  {
    q: "Des paillettes !?",
    a: "OUI ! Le top coat pailleté est tout à fait possible et est à demander lors de votre commande."
  },
  {
    q: "Faites-vous des queues pour enfants ?",
    a: "Non, pas pour le moment."
  },
  {
    q: "Louez-vous des queues pour adultes ?",
    a: "Non, pas pour le moment."
  },
  {
    q: "Avez-vous des queues d'occasion à vendre ?",
    a: "Parfois, nous avons des queues d'occasion à vendre. Nous les publions sur la page Instagram lorsque nous les avons."
  },
  {
    q: "Avez-vous besoin de modèles de sirènes ?",
    a: "Actuellement, nous aimons utiliser nos clients pour faire la publicité de nos nageoires."
  },
  {
    q: "J'ai perdu ou pris du poids pendant la création ?",
    a: "Il arrive parfois que des personnes perdent du poids, en prennent, ou se rendent compte qu'elles ont mal pris leurs mesures. Malheureusement, si la nageoire est déjà créée, plus aucune solution n'est possible à part refaire entièrement la partie écailles, ce qui entraîne des frais supplémentaires. Cependant, notre silicone est élastique et peut couvrir 3 à 4 cm de différence."
  },
  {
    q: "Y a-t-il des frais de douane ?",
    a: "Si vous êtes un client international, veuillez prendre en compte les délais d'attente à la douane. Les douanes sont légalement autorisées à conserver votre queue jusqu'à 6 semaines. Elles le font très rarement, mais Aquata n'est en aucun cas responsable des douanes ou de celles de votre pays. Des frais de douane associés peuvent également vous être facturés pour l'importation d'un produit."
  },
  {
    q: "Peut-il y avoir la couleur qui s'effrite ?",
    a: "Nos nageoires ne sont pas peintes en surface. Les pigments sont directement mélangés au silicone lors du coulage, il ne peut donc pas y avoir de couleur qui s'effrite."
  },
];

export default function Faq() {
  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ backgroundImage: 'url(/images/ocean-bubbles-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)' }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#e0f5ff' }}>Foire Aux Questions</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
            Toutes les réponses à vos questions concernant nos queues de sirène artisanales.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((faq, i) => (
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
