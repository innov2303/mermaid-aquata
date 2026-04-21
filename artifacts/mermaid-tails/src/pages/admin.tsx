import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, Save, X, LogOut, ShieldCheck } from "lucide-react";
import {
  checkAdminToken,
  fetchCatalogue, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem,
  fetchRemerciements, createRemerciement, updateRemerciement, deleteRemerciement,
} from "@/lib/api";

const ADMIN_TOKEN_KEY = "mermaid_admin_token";
const SECTIONS = ["monopalmes", "invisibles", "accessoires"];

type CatalogueItem = { id: number; section: string; name: string; desc: string; price: string; images: string[] };
type Remerciement = { id: number; name: string; img: string | null };

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "2px solid rgba(0,200,239,0.4)",
  boxShadow: "0 0 20px rgba(0,200,239,0.1)",
};

const inputClass = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400";
const inputStyle = { borderColor: "rgba(0,200,239,0.4)", color: "#0a2a4a", background: "rgba(255,255,255,0.9)" };
const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105";

// ── Login ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await checkAdminToken(pw);
    if (!ok) {
      setError("Mot de passe incorrect.");
    } else {
      onLogin(pw);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen section-clair flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl p-10"
        style={cardStyle}
      >
        <div className="flex justify-center mb-6">
          <ShieldCheck size={44} className="text-primary" />
        </div>
        <h1 className="text-2xl font-serif text-center mb-1" style={{ color: "#0a2a4a" }}>Administration</h1>
        <p className="text-sm text-center mb-8" style={{ color: "#1a3d5c" }}>Entrez le mot de passe admin</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className={inputClass}
            style={inputStyle}
            autoFocus
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={btnPrimary + " justify-center"}
            style={{ background: "#00c8ef" }}
          >
            {loading ? "Vérification…" : "Connexion"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Catalogue Editor ───────────────────────────────────────────────────────
function CatalogueAdmin({ token }: { token: string }) {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<CatalogueItem>>({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<CatalogueItem>>({ section: "monopalmes", images: [] });
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchCatalogue().then(setItems); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  function startEdit(item: CatalogueItem) { setEditId(item.id); setForm({ ...item }); }

  async function saveEdit() {
    await updateCatalogueItem(editId!, form, token);
    setItems(items.map(i => i.id === editId ? { ...i, ...form } as CatalogueItem : i));
    setEditId(null);
    notify("✓ Article mis à jour");
  }

  async function removeItem(id: number) {
    if (!confirm("Supprimer cet article ?")) return;
    await deleteCatalogueItem(id, token);
    setItems(items.filter(i => i.id !== id));
    notify("✓ Article supprimé");
  }

  async function addItem() {
    const newItem = await createCatalogueItem(addForm, token);
    setItems([...items, newItem]);
    setAdding(false);
    setAddForm({ section: "monopalmes", images: [] });
    notify("✓ Article ajouté");
  }

  function imagesFromStr(s: string): string[] {
    return s.split("\n").map(l => l.trim()).filter(Boolean);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#0a2a4a" }}>Catalogue</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-2xl p-6 overflow-hidden"
            style={cardStyle}
          >
            <h3 className="font-serif mb-4" style={{ color: "#0a2a4a" }}>Nouvel article</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
                <input className={inputClass} style={inputStyle} value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nom de l'article" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Prix</label>
                <input className={inputClass} style={inputStyle} value={addForm.price || ""} onChange={e => setAddForm({ ...addForm, price: e.target.value })} placeholder="ex: À partir de 1999€" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Catégorie</label>
                <select className={inputClass} style={inputStyle} value={addForm.section || "monopalmes"} onChange={e => setAddForm({ ...addForm, section: e.target.value })}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Images (une URL par ligne)</label>
                <textarea className={inputClass} style={inputStyle} rows={3} value={(addForm.images || []).join("\n")} onChange={e => setAddForm({ ...addForm, images: imagesFromStr(e.target.value) })} placeholder="/images/photo.jpg" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Description</label>
                <textarea className={inputClass} style={inputStyle} rows={3} value={addForm.desc || ""} onChange={e => setAddForm({ ...addForm, desc: e.target.value })} placeholder="Description de l'article…" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addItem} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
              <button onClick={() => setAdding(false)} className={btnPrimary} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={15} /> Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items list */}
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            className="rounded-2xl p-5"
            style={cardStyle}
          >
            {editId === item.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
                    <input className={inputClass} style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Prix</label>
                    <input className={inputClass} style={inputStyle} value={form.price || ""} onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Catégorie</label>
                    <select className={inputClass} style={inputStyle} value={form.section || ""} onChange={e => setForm({ ...form, section: e.target.value })}>
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Images (une URL par ligne)</label>
                    <textarea className={inputClass} style={inputStyle} rows={3} value={(form.images || []).join("\n")} onChange={e => setForm({ ...form, images: imagesFromStr(e.target.value) })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Description</label>
                    <textarea className={inputClass} style={inputStyle} rows={3} value={form.desc || ""} onChange={e => setForm({ ...form, desc: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
                  <button onClick={() => setEditId(null)} className={btnPrimary} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={15} /> Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,200,239,0.15)", color: "#007fa3" }}>{item.section}</span>
                    <h3 className="font-serif text-base truncate" style={{ color: "#0a2a4a" }}>{item.name}</h3>
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#1a3d5c" }}>{item.desc}</p>
                  <p className="text-sm font-medium text-primary">{item.price}</p>
                  {item.images.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: "#607d8b" }}>{item.images.length} image{item.images.length > 1 ? "s" : ""}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#007fa3" }}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Remerciements Editor ───────────────────────────────────────────────────
function RemerciementsAdmin({ token }: { token: string }) {
  const [items, setItems] = useState<Remerciement[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Remerciement>>({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Remerciement>>({});
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchRemerciements().then(setItems); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  function startEdit(item: Remerciement) { setEditId(item.id); setForm({ ...item }); }

  async function saveEdit() {
    await updateRemerciement(editId!, form, token);
    setItems(items.map(i => i.id === editId ? { ...i, ...form } as Remerciement : i));
    setEditId(null);
    notify("✓ Sirène mise à jour");
  }

  async function removeItem(id: number) {
    if (!confirm("Supprimer cette sirène ?")) return;
    await deleteRemerciement(id, token);
    setItems(items.filter(i => i.id !== id));
    notify("✓ Sirène supprimée");
  }

  async function addItem() {
    const newItem = await createRemerciement(addForm, token);
    setItems([...items, newItem]);
    setAdding(false);
    setAddForm({});
    notify("✓ Sirène ajoutée");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#0a2a4a" }}>Remerciements</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-2xl p-6 overflow-hidden"
            style={cardStyle}
          >
            <h3 className="font-serif mb-4" style={{ color: "#0a2a4a" }}>Nouvelle sirène</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
                <input className={inputClass} style={inputStyle} value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nom de la sirène" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>URL de l'image</label>
                <input className={inputClass} style={inputStyle} value={addForm.img || ""} onChange={e => setAddForm({ ...addForm, img: e.target.value || null })} placeholder="/images/photo.jpg" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addItem} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
              <button onClick={() => setAdding(false)} className={btnPrimary} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={15} /> Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(0,200,239,0.1)" }}>
              {item.img
                ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl" style={{ color: "rgba(0,200,239,0.4)" }}>✦</div>
              }
            </div>

            {editId === item.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input className={inputClass} style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom" />
                <input className={inputClass} style={inputStyle} value={form.img || ""} onChange={e => setForm({ ...form, img: e.target.value || null })} placeholder="URL image" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className={btnPrimary + " text-xs px-3 py-1"} style={{ background: "#00c8ef" }}><Save size={13} /> Enreg.</button>
                  <button onClick={() => setEditId(null)} className={btnPrimary + " text-xs px-3 py-1"} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={13} /> Ann.</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="font-serif" style={{ color: "#0a2a4a" }}>{item.name}</p>
                {item.img && <p className="text-xs truncate mt-0.5" style={{ color: "#607d8b" }}>{item.img}</p>}
              </div>
            )}

            {editId !== item.id && (
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#007fa3" }}><Pencil size={15} /></button>
                <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}><Trash2 size={15} /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [tab, setTab] = useState<"catalogue" | "remerciements">("catalogue");

  function handleLogin(t: string) {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen section-clair pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif" style={{ color: "#0a2a4a" }}>Administration</h1>
            <p className="text-sm mt-1" style={{ color: "#1a3d5c" }}>Gérez le contenu du site</p>
          </div>
          <button onClick={handleLogout} className={btnPrimary} style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit" style={{ background: "rgba(255,255,255,0.6)", border: "2px solid rgba(0,200,239,0.25)" }}>
          {(["catalogue", "remerciements"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={tab === t ? { background: "#00c8ef", color: "white" } : { color: "#1a3d5c" }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "catalogue"
              ? <CatalogueAdmin token={token} />
              : <RemerciementsAdmin token={token} />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
