import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const GLASS = {
  background: "rgba(0,20,50,0.45)",
  backdropFilter: "blur(10px)",
  border: "1.5px solid rgba(0,200,239,0.3)",
  boxShadow: "0 4px 24px rgba(0,200,239,0.08)",
};

export default function PolitiqueDeRetour() {
  const { t } = useLanguage();
  const tf = t.footer;
  useSEO("home");

  const sections = [
    { title: tf.refundBody.s1Title, text: tf.refundBody.s1 },
    { title: tf.refundBody.s2Title, text: tf.refundBody.s2 },
    { title: tf.refundBody.s3Title, text: tf.refundBody.s3 },
    { title: tf.refundBody.s4Title, text: tf.refundBody.s4 },
    { title: tf.refundBody.s5Title, text: tf.refundBody.s5 },
    { title: tf.refundBody.s6Title, text: tf.refundBody.s6 },
    { title: tf.refundBody.s7Title, text: tf.refundBody.s7 },
  ] as { title: string; text: string }[];

  return (
    <div
      className="min-h-screen pt-32 pb-20 relative"
      style={{
        backgroundImage: "url(/images/ocean-bubbles-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(2,8,30,0.42) 0%, rgba(0,18,45,0.55) 100%)" }} />
      <FloatingBubbles count={10} />

      <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#e0f5ff" }}>
            {tf.refundTitle}
          </h1>
          <div className="h-px w-24 mx-auto" style={{ background: "rgba(0,200,239,0.5)" }} />
        </motion.div>

        <div className="flex flex-col gap-6">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-2xl p-6"
              style={GLASS}
            >
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#00c8ef" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(200,235,255,0.8)", whiteSpace: "pre-line" }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
