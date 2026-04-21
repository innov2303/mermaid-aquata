import { motion } from "framer-motion";

const SIRENES = [
  { id: 1, name: "Océane", img: "/images/sirene-1.png" },
  { id: 2, name: "Marina", img: "/images/sirene-2.png" },
  { id: 3, name: "Coral", img: "/images/sirene-1.png" },
  { id: 4, name: "Neptunea", img: "/images/sirene-2.png" },
  { id: 5, name: "Aquamarine", img: "/images/sirene-1.png" },
  { id: 6, name: "Luna", img: "/images/sirene-2.png" },
];

export default function Remerciements() {
  return (
    <div className="min-h-screen section-clair pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: '#0a2a4a' }}>Nos Sirènes</h1>
          <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#1a3d5c' }}>
            Merci de nous faire confiance pour réaliser vos rêves.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:gap-10">
          {SIRENES.map((sirene, i) => (
            <motion.div
              key={sirene.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden"
              style={{ border: '2px solid rgba(0,200,239,0.45)', boxShadow: '0 0 24px rgba(0,200,239,0.12)' }}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={sirene.img}
                  alt={sirene.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 py-5 px-4 text-center"
                  style={{ background: 'linear-gradient(to top, rgba(4,15,40,0.75) 0%, transparent 100%)' }}
                >
                  <h3 className="font-serif text-2xl md:text-3xl text-white drop-shadow">{sirene.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
