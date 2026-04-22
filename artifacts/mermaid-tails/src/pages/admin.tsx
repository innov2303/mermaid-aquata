import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, Save, X, LogOut, ShieldCheck, Upload, Image, Copy, Check } from "lucide-react";
import {
  checkAdminToken,
  fetchCatalogue, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem,
  fetchRemerciements, createRemerciement, updateRemerciement, deleteRemerciement,
  uploadImage, listUploads, deleteUpload,
} from "@/lib/api";

const ADMIN_TOKEN_KEY = "mermaid_admin_token";
const SECTIONS = [
  { key: "monopalmes", label: "Monopalmes" },
  { key: "invisibles", label: "Queue de sirène silicone" },
  { key: "accessoires", label: "Accessoires" },
];

type CatalogueItem = { id: number; section: string; name: string; desc: string; price: string; images: string[] };
type Remerciement = { id: number; name: string; img: string | null };
type UploadedFile = { filename: string; url: string };

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "2px solid rgba(0,200,239,0.4)",
  boxShadow: "0 0 20px rgba(0,200,239,0.1)",
};

const inputClass = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400";
const inputStyle = { borderColor: "rgba(0,200,239,0.4)", color: "#0a2a4a", background: "rgba(255,255,255,0.9)" };
const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105";

// ── Image Picker ───────────────────────────────────────────────────────────
function ImagePicker({
  token, value, onChange, label = "Image",
}: { token: string; value: string; onChange: (url: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() { listUploads(token).then(setUploads).catch(() => {}); }

  useEffect(() => { if (open) load(); }, [open]);

  async function handleFile(file: File) {
    setUploading(true);
    setErr("");
    try {
      const url = await uploadImage(file, token);
      await load();
      onChange(url);
      setOpen(false);
    } catch (e: any) {
      setErr(e.message);
    }
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>{label}</label>
      <div className="flex gap-2">
        <input className={inputClass} style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder="/api/uploads/... ou URL externe" />
        <button type="button" onClick={() => setOpen(true)} className="flex-shrink-0 px-3 py-2 rounded-xl text-sm flex items-center gap-1 hover:scale-105 transition-all" style={{ background: "rgba(0,200,239,0.12)", border: "1.5px solid rgba(0,200,239,0.4)", color: "#007fa3" }}>
          <Image size={15} />
        </button>
      </div>
      {value && <img src={value} alt="" className="mt-2 h-16 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(4,15,40,0.85)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="w-full max-w-2xl rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
              style={cardStyle}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg" style={{ color: "#0a2a4a" }}>Médiathèque</h3>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:scale-110 transition-all" style={{ color: "#0a2a4a" }}><X size={18} /></button>
              </div>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed rounded-2xl p-8 text-center mb-5 transition-colors cursor-pointer"
                style={{ borderColor: "rgba(0,200,239,0.5)", background: "rgba(0,200,239,0.04)" }}
                onDrop={onDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <Upload size={28} className="mx-auto mb-2 text-primary" />
                {uploading
                  ? <p className="text-sm" style={{ color: "#1a3d5c" }}>Envoi en cours…</p>
                  : <p className="text-sm" style={{ color: "#1a3d5c" }}>Glissez une image ici ou cliquez pour sélectionner</p>
                }
                <p className="text-xs mt-1" style={{ color: "#607d8b" }}>JPG, PNG, WebP, GIF — max 10 Mo</p>
                {err && <p className="text-sm text-red-500 mt-2">{err}</p>}
              </div>

              {/* Gallery */}
              {uploads.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploads.map(f => (
                    <button key={f.filename} type="button"
                      onClick={() => { onChange(f.url); setOpen(false); }}
                      className="group relative rounded-xl overflow-hidden aspect-square hover:scale-105 transition-all"
                      style={{ border: value === f.url ? "2.5px solid #00c8ef" : "2px solid rgba(0,200,239,0.25)" }}
                    >
                      <img src={f.url} alt="" className="w-full h-full object-cover" />
                      {value === f.url && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,200,239,0.35)" }}>
                          <Check size={22} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {uploads.length === 0 && !uploading && (
                <p className="text-center text-sm" style={{ color: "#607d8b" }}>Aucune image uploadée pour l'instant.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Multi Image Picker ─────────────────────────────────────────────────────
function MultiImagePicker({ token, values, onChange }: { token: string; values: string[]; onChange: (urls: string[]) => void }) {
  function update(i: number, url: string) {
    const next = [...values];
    next[i] = url;
    onChange(next.filter(Boolean));
  }
  function remove(i: number) { onChange(values.filter((_, idx) => idx !== i)); }
  function add() { onChange([...values, ""]); }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium" style={{ color: "#1a3d5c" }}>Images (carousel)</label>
        <button type="button" onClick={add} className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:scale-105 transition-all" style={{ color: "#007fa3", background: "rgba(0,200,239,0.1)" }}>
          <Plus size={12} /> Ajouter
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <ImagePicker token={token} value={v} onChange={url => update(i, url)} label="" />
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-1 p-2 rounded-xl hover:scale-110 transition-all flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
              <X size={14} />
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <button type="button" onClick={add} className="text-sm py-2 rounded-xl border-dashed border-2 w-full transition-colors" style={{ borderColor: "rgba(0,200,239,0.3)", color: "#007fa3" }}>
            + Ajouter une image
          </button>
        )}
      </div>
    </div>
  );
}

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
    if (!ok) { setError("Mot de passe incorrect."); } else { onLogin(pw); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen section-clair flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-3xl p-10" style={cardStyle}>
        <div className="flex justify-center mb-6"><ShieldCheck size={44} className="text-primary" /></div>
        <h1 className="text-2xl font-serif text-center mb-1" style={{ color: "#0a2a4a" }}>Administration</h1>
        <p className="text-sm text-center mb-8" style={{ color: "#1a3d5c" }}>Entrez le mot de passe admin</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="password" placeholder="Mot de passe" value={pw} onChange={e => setPw(e.target.value)} className={inputClass} style={inputStyle} autoFocus />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading} className={btnPrimary + " justify-center"} style={{ background: "#00c8ef" }}>
            {loading ? "Vérification…" : "Connexion"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Médiathèque ────────────────────────────────────────────────────────────
function MediaAdmin({ token }: { token: string }) {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() { listUploads(token).then(setUploads).catch(() => {}); }
  useEffect(() => { load(); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  async function handleFile(file: File) {
    setUploading(true); setErr("");
    try { await uploadImage(file, token); await load(); notify("✓ Image uploadée"); }
    catch (e: any) { setErr(e.message); }
    setUploading(false);
  }

  async function handleDelete(f: UploadedFile) {
    if (!confirm("Supprimer cette image ?")) return;
    await deleteUpload(f.filename, token);
    await load();
    notify("✓ Image supprimée");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(f => handleFile(f));
  }

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6" style={{ color: "#0a2a4a" }}>Médiathèque</h2>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {/* Drop zone */}
      <div
        className="border-2 border-dashed rounded-2xl p-10 text-center mb-8 cursor-pointer transition-all hover:border-cyan-400"
        style={{ borderColor: "rgba(0,200,239,0.45)", background: "rgba(0,200,239,0.03)" }}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => Array.from(e.target.files || []).forEach(handleFile)} />
        <Upload size={36} className="mx-auto mb-3 text-primary" />
        {uploading
          ? <p className="font-medium" style={{ color: "#0a2a4a" }}>Envoi en cours…</p>
          : <p className="font-medium" style={{ color: "#0a2a4a" }}>Glissez vos images ici ou cliquez pour sélectionner</p>
        }
        <p className="text-sm mt-1" style={{ color: "#607d8b" }}>JPG, PNG, WebP, GIF — max 10 Mo par fichier</p>
        {err && <p className="text-sm text-red-500 mt-2">{err}</p>}
      </div>

      {/* Gallery */}
      {uploads.length === 0
        ? <p className="text-center py-12" style={{ color: "#607d8b" }}>Aucune image uploadée pour l'instant.</p>
        : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploads.map(f => (
              <div key={f.filename} className="group relative rounded-2xl overflow-hidden" style={{ border: "2px solid rgba(0,200,239,0.3)" }}>
                <div className="aspect-square">
                  <img src={f.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(4,15,40,0.7)" }}>
                  <button onClick={() => copyUrl(f.url)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white transition-all hover:scale-105" style={{ background: "rgba(0,200,239,0.8)" }}>
                    {copied === f.url ? <><Check size={13} /> Copié !</> : <><Copy size={13} /> Copier l'URL</>}
                  </button>
                  <button onClick={() => handleDelete(f)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white transition-all hover:scale-105" style={{ background: "rgba(239,68,68,0.8)" }}>
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
                <p className="px-2 py-1 text-xs truncate" style={{ color: "#607d8b" }}>{f.filename}</p>
              </div>
            ))}
          </div>
        )
      }
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
    setEditId(null); notify("✓ Article mis à jour");
  }
  async function removeItem(id: number) {
    if (!confirm("Supprimer cet article ?")) return;
    await deleteCatalogueItem(id, token);
    setItems(items.filter(i => i.id !== id)); notify("✓ Article supprimé");
  }
  async function addItem() {
    const newItem = await createCatalogueItem(addForm, token);
    setItems([...items, newItem]);
    setAdding(false);
    setAddForm({ section: "monopalmes", images: [] });
    notify("✓ Article ajouté");
  }

  const ItemForm = ({ f, setF, onSave, onCancel }: { f: Partial<CatalogueItem>; setF: (v: Partial<CatalogueItem>) => void; onSave: () => void; onCancel: () => void }) => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
          <input className={inputClass} style={inputStyle} value={f.name || ""} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Nom de l'article" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Prix</label>
          <input className={inputClass} style={inputStyle} value={f.price || ""} onChange={e => setF({ ...f, price: e.target.value })} placeholder="À partir de 1999€" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Catégorie</label>
          <select className={inputClass} style={inputStyle} value={f.section || "monopalmes"} onChange={e => setF({ ...f, section: e.target.value })}>
            {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Description</label>
          <textarea className={inputClass} style={inputStyle} rows={3} value={f.desc || ""} onChange={e => setF({ ...f, desc: e.target.value })} placeholder="Description de l'article…" />
        </div>
        <div className="md:col-span-2">
          <MultiImagePicker token={token} values={f.images || []} onChange={imgs => setF({ ...f, images: imgs })} />
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={onSave} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
        <button onClick={onCancel} className={btnPrimary} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={15} /> Annuler</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#0a2a4a" }}>Catalogue</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}><Plus size={16} /> Ajouter</button>
      </div>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {adding && (
        <div className="mb-6 rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ color: "#0a2a4a" }}>Nouvel article</h3>
          <ItemForm f={addForm} setF={setAddForm} onSave={addItem} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl p-5" style={cardStyle}>
            {editId === item.id
              ? <ItemForm f={form} setF={setForm} onSave={saveEdit} onCancel={() => setEditId(null)} />
              : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {item.images[0] && <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,200,239,0.15)", color: "#007fa3" }}>{SECTIONS.find(s => s.key === item.section)?.label ?? item.section}</span>
                        <h3 className="font-serif text-base truncate" style={{ color: "#0a2a4a" }}>{item.name}</h3>
                      </div>
                      <p className="text-sm mb-1 line-clamp-2" style={{ color: "#1a3d5c" }}>{item.desc}</p>
                      <p className="text-sm font-medium text-primary">{item.price}</p>
                      {item.images.length > 0 && <p className="text-xs mt-0.5" style={{ color: "#607d8b" }}>{item.images.length} image{item.images.length > 1 ? "s" : ""}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#007fa3" }}><Pencil size={16} /></button>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            }
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
    setEditId(null); notify("✓ Sirène mise à jour");
  }
  async function removeItem(id: number) {
    if (!confirm("Supprimer cette sirène ?")) return;
    await deleteRemerciement(id, token);
    setItems(items.filter(i => i.id !== id)); notify("✓ Sirène supprimée");
  }
  async function addItem() {
    const newItem = await createRemerciement(addForm, token);
    setItems([...items, newItem]);
    setAdding(false); setAddForm({}); notify("✓ Sirène ajoutée");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#0a2a4a" }}>Remerciements</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}><Plus size={16} /> Ajouter</button>
      </div>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {adding && (
        <div className="mb-6 rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ color: "#0a2a4a" }}>Nouvelle sirène</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
              <input className={inputClass} style={inputStyle} value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nom de la sirène" />
            </div>
            <ImagePicker token={token} value={addForm.img || ""} onChange={url => setAddForm({ ...addForm, img: url || null })} label="Photo" />
          </div>
          <div className="flex gap-3">
            <button onClick={addItem} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
            <button onClick={() => setAdding(false)} className={btnPrimary} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={15} /> Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(0,200,239,0.1)" }}>
              {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl" style={{ color: "rgba(0,200,239,0.4)" }}>✦</div>}
            </div>

            {editId === item.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#1a3d5c" }}>Nom</label>
                  <input className={inputClass} style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <ImagePicker token={token} value={form.img || ""} onChange={url => setForm({ ...form, img: url || null })} label="Photo" />
                <div className="flex gap-2 mt-1">
                  <button onClick={saveEdit} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "#00c8ef" }}><Save size={13} /> Enregistrer</button>
                  <button onClick={() => setEditId(null)} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "rgba(0,0,0,0.1)", color: "#0a2a4a" }}><X size={13} /> Annuler</button>
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
const TABS = [
  { id: "catalogue", label: "Catalogue" },
  { id: "remerciements", label: "Remerciements" },
  { id: "media", label: "Médiathèque" },
] as const;

type Tab = typeof TABS[number]["id"];

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [tab, setTab] = useState<Tab>("catalogue");

  function handleLogin(t: string) { sessionStorage.setItem(ADMIN_TOKEN_KEY, t); setToken(t); }
  function handleLogout() { sessionStorage.removeItem(ADMIN_TOKEN_KEY); setToken(""); }

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen section-clair pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

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
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-6 py-2 rounded-xl text-sm font-medium transition-all"
              style={tab === t.id ? { background: "#00c8ef", color: "white" } : { color: "#1a3d5c" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
            {tab === "catalogue" && <CatalogueAdmin token={token} />}
            {tab === "remerciements" && <RemerciementsAdmin token={token} />}
            {tab === "media" && <MediaAdmin token={token} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
