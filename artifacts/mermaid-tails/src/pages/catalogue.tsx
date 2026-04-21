import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Catalogue() {
  const tails = {
    monopalmes: [
      { id: 1, name: "Queue Aurore Boréale", desc: "Couleurs irisées inspirées des aurores boréales", price: "À partir de 180€", img: "/images/catalog-1.png" },
      { id: 2, name: "Queue Nuit Étoilée", desc: "Bleu profond avec éclats argentés", price: "À partir de 195€", img: "/images/catalog-2.png" },
      { id: 3, name: "Queue Corail Flamboyant", desc: "Tons chauds orangés et rosés", price: "À partir de 180€", img: "/images/catalog-1.png" }
    ],
    invisibles: [
      { id: 4, name: "Queue Fond des Mers", desc: "Nageoire réaliste cachant parfaitement les pieds", price: "À partir de 250€", img: "/images/catalog-2.png" },
      { id: 5, name: "Queue Écume Douce", desc: "Tons clairs et nageoire fluide en organza", price: "À partir de 265€", img: "/images/catalog-1.png" },
      { id: 6, name: "Queue Abysses", desc: "Design sombre et mystérieux", price: "À partir de 250€", img: "/images/catalog-2.png" }
    ],
    silicone: [
      { id: 7, name: "Modèle Empereur", desc: "Silicone grade médical, écailles sculptées main", price: "À partir de 1200€", img: "/images/catalog-1.png" },
      { id: 8, name: "Modèle Léviathan", desc: "Nageoires dorsales et latérales incluses", price: "À partir de 1500€", img: "/images/catalog-2.png" },
      { id: 9, name: "Modèle Sirène Perle", desc: "Finition nacrée et irisée exceptionnelle", price: "À partir de 1350€", img: "/images/catalog-1.png" }
    ]
  };

  const accessories = [
    { id: 10, name: "Couronne de Coquillages", price: "45€" },
    { id: 11, name: "Soutien-gorge Sirène", price: "À partir de 65€" },
    { id: 12, name: "Bijoux d'écailles", price: "30€" },
    { id: 13, name: "Nageoires de bras", price: "80€" }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 text-cyan-shimmer">Notre Catalogue</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto font-light">
            Découvrez nos créations artisanales. Chaque modèle peut être personnalisé selon vos envies.
          </p>
        </motion.div>

        <Tabs defaultValue="monopalmes" className="w-full mb-24">
          <TabsList className="w-full flex flex-wrap justify-center bg-card p-2 rounded-2xl h-auto gap-2 mb-12 border border-border/50">
            <TabsTrigger value="monopalmes" className="rounded-xl px-6 py-3 text-lg data-[state=active]:bg-primary data-[state=active]:text-background">Monopalmes</TabsTrigger>
            <TabsTrigger value="invisibles" className="rounded-xl px-6 py-3 text-lg data-[state=active]:bg-primary data-[state=active]:text-background">Pieds Invisibles</TabsTrigger>
            <TabsTrigger value="silicone" className="rounded-xl px-6 py-3 text-lg data-[state=active]:bg-primary data-[state=active]:text-background">Silicone</TabsTrigger>
          </TabsList>

          {Object.entries(tails).map(([key, items]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, i) => (
                  <ProductCard key={item.id} item={item} delay={i * 0.1} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-white mb-10 text-center">Accessoires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessories.map((acc, i) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border text-center hover:border-accent transition-colors group"
              >
                <div className="w-full aspect-square bg-background rounded-xl mb-4 flex items-center justify-center border border-border group-hover:border-accent/50 transition-colors overflow-hidden">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-2xl font-serif">✦</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-white mb-2">{acc.name}</h3>
                <p className="text-accent font-medium">{acc.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-20">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-full font-serif shadow-[0_0_20px_rgba(0,200,239,0.5)] hover:shadow-[0_0_35px_rgba(0,200,239,0.7)] transition-all hover:scale-105">
            <Link href="/commander">Commander sur mesure</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, delay }: { item: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <Card className="bg-card border-border overflow-hidden h-full flex flex-col hover:border-primary/50 transition-all duration-300">
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          <img 
            src={item.img} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <CardContent className="p-6 flex-grow flex flex-col justify-between z-20 bg-card/95 backdrop-blur-md -mt-4 border-t border-border/50 rounded-t-2xl relative">
          <div>
            <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
            <p className="text-foreground/70 text-sm mb-4 font-light">{item.desc}</p>
          </div>
          <p className="text-accent font-serif text-lg">{item.price}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
