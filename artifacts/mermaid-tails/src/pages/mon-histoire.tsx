import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const GLASS = {
  background: 'rgba(0,20,50,0.45)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(0,200,239,0.3)',
  boxShadow: '0 4px 24px rgba(0,200,239,0.1)',
};

export default function MonHistoire() {
  const { t } = useLanguage();
  useSEO("histoire");

  const { title, subtitle, paragraphs } = t.histoire;

  return (
    <div
      className="min-h-screen pt-32 pb-20 relative"
      style={{
        backgroundImage: 'url(/images/ocean-bubbles-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,8,30,0.42) 0%, rgba(0,18,45,0.55) 100%)' }} />
      <FloatingBubbles count={16} />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1
            className="font-serif mb-6"
            style={{
              color: '#e0f5ff',
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              textShadow: '0 0 40px rgba(0,200,239,0.4)',
            }}
          >
            {title}
          </h1>
          <div className="mx-auto mb-6" style={{ width: 80, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,200,239,0.7), transparent)' }} />
          {subtitle && (
            <p className="text-lg md:text-xl font-light" style={{ color: 'rgba(200,235,255,0.85)' }}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex justify-center mb-14"
        >
          <div className="relative w-52 h-52 md:w-64 md:h-64">
            <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-primary/60 animate-[spin_10s_linear_infinite] shadow-[0_0_25px_rgba(0,200,239,0.4)]" />
            <div className="absolute inset-2 rounded-[50%_50%_40%_60%/50%_40%_60%_50%] border-2 border-secondary/40 animate-[spin_15s_linear_infinite_reverse]" />
            <img
              src="/images/portrait-aquata.jpg"
              alt="Mermaid Aquata"
              className="absolute inset-4 object-cover w-[calc(100%-2rem)] h-[calc(100%-2rem)] rounded-full shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Paragraphes */}
        <div className="flex flex-col gap-6">
          {paragraphs.map((para, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="rounded-2xl px-7 py-6"
              style={GLASS}
            >
              <p
                className="leading-relaxed font-light"
                style={{
                  color: 'rgba(210,240,255,0.92)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  lineHeight: '1.9',
                }}
              >
                {para}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
