import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { fetchLegal } from "@/lib/api";

const GLASS = {
  background: "rgba(0,20,50,0.45)",
  backdropFilter: "blur(10px)",
  border: "1.5px solid rgba(0,200,239,0.3)",
  boxShadow: "0 4px 24px rgba(0,200,239,0.08)",
};

export default function MentionsLegales() {
  const { t } = useLanguage();
  const [content, setContent] = useState<string>("");
  useSEO("home");

  useEffect(() => {
    fetchLegal("mentions-legales").then((d: { content: string }) => setContent(d.content)).catch(() => {});
  }, []);

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
            {t.footer.legalTitle}
          </h1>
          <div className="h-px w-24 mx-auto" style={{ background: "rgba(0,200,239,0.5)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6"
          style={GLASS}
        >
          <p className="text-sm leading-relaxed" style={{ color: "rgba(200,235,255,0.85)", whiteSpace: "pre-line" }}>
            {content}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
