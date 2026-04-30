import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Props = { open: boolean; onClose: () => void };

const inputClass = "w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all";
const inputStyle = { borderColor: "rgba(0,200,239,0.3)", color: "#e0f5ff", background: "rgba(0,20,50,0.6)", backdropFilter: "blur(4px)" };

export function ContactModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", message: "" });
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const tc = t.contact;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(tc.emailSubject(form.prenom, form.nom));
    const body = encodeURIComponent(tc.emailBody(form));
    window.location.href = `mailto:sireneaurore31@hotmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); setForm({ nom: "", prenom: "", email: "", telephone: "", message: "" }); }, 2500);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(4,15,40,0.88)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-3xl rounded-3xl overflow-y-auto"
            style={{ maxHeight: "90vh", background: "rgba(0,20,50,0.85)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(0,200,239,0.3)", boxShadow: "0 0 60px rgba(0,200,239,0.2)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <h2 className="text-2xl font-serif" style={{ color: "#e0f5ff" }}>{tc.title}</h2>
              <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff" }}>
                <X size={18} />
              </button>
            </div>

            <div className="px-8 pb-8">
              {sent ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle size={52} className="text-primary" />
                  <p className="font-serif text-xl" style={{ color: "#e0f5ff" }}>{tc.successTitle}</p>
                  <p className="text-sm" style={{ color: "rgba(200,235,255,0.85)" }}>{tc.successMsg}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(200,235,255,0.75)" }}>{tc.nom} *</label>
                      <input name="nom" required value={form.nom} onChange={handleChange} className={inputClass} style={inputStyle} placeholder={tc.placeholderNom} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(200,235,255,0.75)" }}>{tc.prenom} *</label>
                      <input name="prenom" required value={form.prenom} onChange={handleChange} className={inputClass} style={inputStyle} placeholder={tc.placeholderPrenom} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(200,235,255,0.75)" }}>{tc.email} *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} style={inputStyle} placeholder={tc.placeholderEmail} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(200,235,255,0.75)" }}>{tc.telephone}</label>
                    <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} className={inputClass} style={inputStyle} placeholder={tc.placeholderPhone} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(200,235,255,0.75)" }}>{tc.message} *</label>
                    <textarea name="message" required rows={4} value={form.message} onChange={handleChange} className={inputClass} style={{ ...inputStyle, resize: "vertical" }} placeholder={tc.placeholderMessage} />
                  </div>
                  <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02] mt-1" style={{ background: "linear-gradient(135deg, #00c8ef, #0099cc)", boxShadow: "0 0 20px rgba(0,200,239,0.4)" }}>
                    <Send size={16} /> {tc.send}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
