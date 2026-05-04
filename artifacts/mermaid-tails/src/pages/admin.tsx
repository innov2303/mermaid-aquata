import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, Save, X, LogOut, ShieldCheck, Upload, Image, Copy, Check } from "lucide-react";
import {
  checkAdminToken,
  fetchCatalogue, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem,
  fetchRemerciements, createRemerciement, updateRemerciement, deleteRemerciement,
  fetchPresentation, createPresentationPhoto, updatePresentationPhoto, deletePresentationPhoto,
  uploadImage, listUploads, deleteUpload,
} from "@/lib/api";

const ADMIN_TOKEN_KEY = "mermaid_admin_token";
const SECTIONS = [
  { key: "monopalmes", label: "Monopalmes" },
  { key: "invisibles", label: "Queue de sirène silicone" },
  { key: "accessoires", label: "Accessoires" },
];

type CatalogueItem = { id: number; section: string; name: string; desc: string; price: string; images: string[] };
type Remerciement = { id: number; name: string; img: string | null; instagram: string | null; review: string | null };
type PresentationPhoto = { id: number; url: string; alt: string };
type UploadedFile = { filename: string; url: string };

const cardStyle = {
  background: "rgba(0,20,50,0.55)",
  backdropFilter: "blur(10px)",
  border: "1.5px solid rgba(0,200,239,0.3)",
  boxShadow: "0 4px 24px rgba(0,200,239,0.1)",
};

const inputClass = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400";
const inputStyle = { borderColor: "rgba(0,200,239,0.3)", color: "#e0f5ff", background: "rgba(0,20,50,0.6)", backdropFilter: "blur(4px)" } as React.CSSProperties;
const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105";

function useConfirm() {
  const [state, setState] = useState({ open: false, msg: "", resolve: null as ((v: boolean) => void) | null });
  function askConfirm(msg: string) {
    return new Promise<boolean>(resolve => setState({ open: true, msg, resolve }));
  }
  function handleOk() { state.resolve?.(true); setState({ open: false, msg: "", resolve: null }); }
  function handleCancel() { state.resolve?.(false); setState({ open: false, msg: "", resolve: null }); }
  return { askConfirm, confirmProps: { open: state.open, msg: state.msg, onOk: handleOk, onCancel: handleCancel } };
}

function ConfirmDialog({ open, msg, onOk, onCancel }: { open: boolean; msg: string; onOk: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(4,15,40,0.85)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl p-8 max-w-sm w-full text-center"
            style={cardStyle}
          >
            <Trash2 size={32} className="mx-auto mb-4" style={{ color: "#f87171" }} />
            <p className="text-base mb-8 font-medium" style={{ color: "#e0f5ff" }}>{msg}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={onCancel} className={btnPrimary} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}>
                <X size={15} /> Annuler
              </button>
              <button onClick={onOk} className={btnPrimary} style={{ background: "rgba(239,68,68,0.75)" }}>
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const bgPage: React.CSSProperties = {
  backgroundImage: "url(/images/ocean-bubbles-bg.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};
const bgOverlay: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(2,8,30,0.38) 0%, rgba(0,20,50,0.45) 100%)",
};

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
    setUploading(true); setErr("");
    try { const url = await uploadImage(file, token); await load(); onChange(url); setOpen(false); }
    catch (e: any) { setErr(e.message); }
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }

  return (
    <div>
      {label && <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(200,235,255,0.75)" }}>{label}</label>}
      <div className="flex gap-2">
        <input className={inputClass} style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder="/api/uploads/... ou URL externe" />
        <button type="button" onClick={() => setOpen(true)} className="flex-shrink-0 px-3 py-2 rounded-xl text-sm flex items-center gap-1 hover:scale-105 transition-all" style={{ background: "rgba(0,200,239,0.12)", border: "1.5px solid rgba(0,200,239,0.4)", color: "#00c8ef" }}>
          <Image size={15} />
        </button>
      </div>
      {value && <img src={value} alt="" className="mt-2 h-16 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(4,15,40,0.88)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="w-full max-w-2xl rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
              style={cardStyle}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg" style={{ color: "#e0f5ff" }}>Médiathèque</h3>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:scale-110 transition-all" style={{ color: "#e0f5ff", background: "rgba(0,200,239,0.1)" }}><X size={18} /></button>
              </div>
              <div
                className="border-2 border-dashed rounded-2xl p-8 text-center mb-5 transition-colors cursor-pointer hover:border-cyan-400"
                style={{ borderColor: "rgba(0,200,239,0.4)", background: "rgba(0,200,239,0.05)" }}
                onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <Upload size={28} className="mx-auto mb-2 text-primary" />
                <p className="text-sm" style={{ color: "rgba(200,235,255,0.85)" }}>{uploading ? "Envoi en cours…" : "Glissez une image ici ou cliquez pour sélectionner"}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(200,235,255,0.5)" }}>JPG, PNG, WebP, GIF — max 10 Mo</p>
                {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
              </div>
              {uploads.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploads.map(f => (
                    <button key={f.filename} type="button" onClick={() => { onChange(f.url); setOpen(false); }}
                      className="group relative rounded-xl overflow-hidden aspect-square hover:scale-105 transition-all"
                      style={{ border: value === f.url ? "2.5px solid #00c8ef" : "1.5px solid rgba(0,200,239,0.25)" }}
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
              ) : !uploading && (
                <p className="text-center text-sm" style={{ color: "rgba(200,235,255,0.5)" }}>Aucune image uploadée pour l'instant.</p>
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
  function update(i: number, url: string) { const next = [...values]; next[i] = url; onChange(next.filter(Boolean)); }
  function remove(i: number) { onChange(values.filter((_, idx) => idx !== i)); }
  function add() { onChange([...values, ""]); }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium" style={{ color: "rgba(200,235,255,0.75)" }}>Images (carousel)</label>
        <button type="button" onClick={add} className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:scale-105 transition-all" style={{ color: "#00c8ef", background: "rgba(0,200,239,0.1)" }}>
          <Plus size={12} /> Ajouter
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1"><ImagePicker token={token} value={v} onChange={url => update(i, url)} label="" /></div>
            <button type="button" onClick={() => remove(i)} className="mt-1 p-2 rounded-xl hover:scale-110 transition-all flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
              <X size={14} />
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <button type="button" onClick={add} className="text-sm py-2 rounded-xl border-dashed border-2 w-full transition-colors" style={{ borderColor: "rgba(0,200,239,0.3)", color: "#00c8ef" }}>
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
    e.preventDefault(); setLoading(true); setError("");
    const ok = await checkAdminToken(pw);
    if (!ok) { setError("Mot de passe incorrect."); } else { onLogin(pw); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={bgPage}>
      <div className="absolute inset-0" style={bgOverlay} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-10"
        style={cardStyle}
      >
        <div className="flex justify-center mb-6"><ShieldCheck size={44} className="text-primary" /></div>
        <h1 className="text-2xl font-serif text-center mb-1" style={{ color: "#e0f5ff" }}>Administration</h1>
        <p className="text-sm text-center mb-8" style={{ color: "rgba(200,235,255,0.7)" }}>Entrez le mot de passe admin</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="password" placeholder="Mot de passe" value={pw} onChange={e => setPw(e.target.value)} className={inputClass} style={inputStyle} autoFocus />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
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
  const { askConfirm, confirmProps } = useConfirm();

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
    if (!await askConfirm("Supprimer cette image définitivement ?")) return;
    await deleteUpload(f.filename, token); await load(); notify("✓ Image supprimée");
  }

  function copyUrl(url: string) { navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(null), 2000); }
  function onDrop(e: React.DragEvent) { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(f => handleFile(f)); }

  return (
    <div>
      <ConfirmDialog {...confirmProps} />
      <h2 className="text-2xl font-serif mb-6" style={{ color: "#e0f5ff" }}>Médiathèque</h2>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}
      <div
        className="border-2 border-dashed rounded-2xl p-10 text-center mb-8 cursor-pointer transition-all hover:border-cyan-400"
        style={{ borderColor: "rgba(0,200,239,0.4)", background: "rgba(0,200,239,0.04)" }}
        onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => Array.from(e.target.files || []).forEach(handleFile)} />
        <Upload size={36} className="mx-auto mb-3 text-primary" />
        <p className="font-medium" style={{ color: "rgba(200,235,255,0.85)" }}>{uploading ? "Envoi en cours…" : "Glissez vos images ici ou cliquez pour sélectionner"}</p>
        <p className="text-sm mt-1" style={{ color: "rgba(200,235,255,0.5)" }}>JPG, PNG, WebP, GIF — max 10 Mo par fichier</p>
        {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
      </div>
      {uploads.length === 0
        ? <p className="text-center py-12" style={{ color: "rgba(200,235,255,0.5)" }}>Aucune image uploadée pour l'instant.</p>
        : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploads.map(f => (
              <div key={f.filename} className="group relative rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,200,239,0.25)" }}>
                <div className="aspect-square"><img src={f.url} alt="" className="w-full h-full object-cover" /></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(4,15,40,0.75)" }}>
                  <button onClick={() => copyUrl(f.url)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white transition-all hover:scale-105" style={{ background: "rgba(0,200,239,0.8)" }}>
                    {copied === f.url ? <><Check size={13} /> Copié !</> : <><Copy size={13} /> Copier l'URL</>}
                  </button>
                  <button onClick={() => handleDelete(f)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white transition-all hover:scale-105" style={{ background: "rgba(239,68,68,0.8)" }}>
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
                <p className="px-2 py-1 text-xs truncate" style={{ color: "rgba(200,235,255,0.5)" }}>{f.filename}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Price Input ────────────────────────────────────────────────────────────
function PriceInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const raw = value.replace(/€$/, "");
  return (
    <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,200,239,0.3)", background: "rgba(0,20,50,0.6)" }}>
      <input
        className="flex-1 px-3 py-2 text-sm outline-none bg-transparent focus:ring-0"
        style={{ color: "#e0f5ff" }}
        value={raw}
        onChange={e => onChange(e.target.value ? e.target.value + "€" : "")}
        placeholder="1999"
      />
      <span className="px-3 py-2 text-sm font-medium select-none" style={{ color: "#00c8ef", borderLeft: "1px solid rgba(0,200,239,0.2)" }}>€</span>
    </div>
  );
}

// ── Item Form ──────────────────────────────────────────────────────────────
const itemLabelStyle = { color: "rgba(200,235,255,0.75)" };

function ItemForm({ token, f, setF, onSave, onCancel }: { token: string; f: Partial<CatalogueItem>; setF: (v: Partial<CatalogueItem>) => void; onSave: () => void; onCancel: () => void }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium mb-1 block" style={itemLabelStyle}>Nom</label>
          <input className={inputClass} style={inputStyle} value={f.name || ""} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Nom de l'article" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={itemLabelStyle}>Prix</label>
          <PriceInput value={f.price || ""} onChange={v => setF({ ...f, price: v })} />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={itemLabelStyle}>Catégorie</label>
          <select className={inputClass} style={inputStyle} value={f.section || "monopalmes"} onChange={e => setF({ ...f, section: e.target.value })}>
            {SECTIONS.map(s => <option key={s.key} value={s.key} style={{ background: "#021830", color: "#e0f5ff" }}>{s.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium mb-1 block" style={itemLabelStyle}>Description</label>
          <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties} rows={3} value={f.desc || ""} onChange={e => setF({ ...f, desc: e.target.value })} placeholder="Description de l'article…" />
        </div>
        <div className="md:col-span-2">
          <MultiImagePicker token={token} values={f.images || []} onChange={imgs => setF({ ...f, images: imgs })} />
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={onSave} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
        <button onClick={onCancel} className={btnPrimary} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}><X size={15} /> Annuler</button>
      </div>
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
  const { askConfirm, confirmProps } = useConfirm();

  useEffect(() => { fetchCatalogue().then(setItems); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  function startEdit(item: CatalogueItem) { setEditId(item.id); setForm({ ...item }); }

  async function saveEdit() {
    await updateCatalogueItem(editId!, form, token);
    setItems(items.map(i => i.id === editId ? { ...i, ...form } as CatalogueItem : i));
    setEditId(null); notify("✓ Article mis à jour");
  }
  async function removeItem(id: number) {
    if (!await askConfirm("Supprimer cet article du catalogue ?")) return;
    await deleteCatalogueItem(id, token); setItems(items.filter(i => i.id !== id)); notify("✓ Article supprimé");
  }
  async function addItem() {
    const newItem = await createCatalogueItem(addForm, token);
    setItems([...items, newItem]); setAdding(false); setAddForm({ section: "monopalmes", images: [] }); notify("✓ Article ajouté");
  }

  return (
    <div>
      <ConfirmDialog {...confirmProps} />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#e0f5ff" }}>Catalogue</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}><Plus size={16} /> Ajouter</button>
      </div>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {adding && (
        <div className="mb-6 rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ color: "#e0f5ff" }}>Nouvel article</h3>
          <ItemForm token={token} f={addForm} setF={setAddForm} onSave={addItem} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl p-5" style={cardStyle}>
            {editId === item.id
              ? <ItemForm token={token} f={form} setF={setForm} onSave={saveEdit} onCancel={() => setEditId(null)} />
              : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {item.images[0] && <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,200,239,0.15)", color: "#00c8ef" }}>{SECTIONS.find(s => s.key === item.section)?.label ?? item.section}</span>
                        <h3 className="font-serif text-base truncate" style={{ color: "#e0f5ff" }}>{item.name}</h3>
                      </div>
                      <p className="text-sm mb-1 line-clamp-2" style={{ color: "rgba(200,235,255,0.7)" }}>{item.desc}</p>
                      <p className="text-sm font-medium text-primary">{item.price}</p>
                      {item.images.length > 0 && <p className="text-xs mt-0.5" style={{ color: "rgba(200,235,255,0.45)" }}>{item.images.length} image{item.images.length > 1 ? "s" : ""}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#00c8ef" }}><Pencil size={16} /></button>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}><Trash2 size={16} /></button>
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
  const { askConfirm, confirmProps } = useConfirm();

  useEffect(() => { fetchRemerciements().then(setItems); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  function startEdit(item: Remerciement) { setEditId(item.id); setForm({ ...item }); }

  async function saveEdit() {
    await updateRemerciement(editId!, form, token);
    setItems(items.map(i => i.id === editId ? { ...i, ...form } as Remerciement : i));
    setEditId(null); notify("✓ Sirène mise à jour");
  }
  async function removeItem(id: number) {
    if (!await askConfirm("Supprimer cet avis ?")) return;
    await deleteRemerciement(id, token); setItems(items.filter(i => i.id !== id)); notify("✓ Sirène supprimée");
  }
  async function addItem() {
    const newItem = await createRemerciement(addForm, token);
    setItems([...items, newItem]); setAdding(false); setAddForm({}); notify("✓ Sirène ajoutée");
  }

  const labelStyle = { color: "rgba(200,235,255,0.75)" };

  return (
    <div>
      <ConfirmDialog {...confirmProps} />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif" style={{ color: "#e0f5ff" }}>Avis</h2>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}><Plus size={16} /> Ajouter</button>
      </div>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {adding && (
        <div className="mb-6 rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ color: "#e0f5ff" }}>Nouvelle sirène</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={labelStyle}>Nom</label>
              <input className={inputClass} style={inputStyle} value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nom de la sirène" />
            </div>
            <div>
              <ImagePicker token={token} value={addForm.img || ""} onChange={url => setAddForm({ ...addForm, img: url || null })} label="Photo" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block" style={labelStyle}>Lien Instagram (optionnel)</label>
              <input className={inputClass} style={inputStyle} value={addForm.instagram || ""} onChange={e => setAddForm({ ...addForm, instagram: e.target.value || null })} placeholder="https://instagram.com/nom_du_compte" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block" style={labelStyle}>Avis du client (optionnel)</label>
              <textarea
                className={inputClass}
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                value={addForm.review || ""}
                onChange={e => setAddForm({ ...addForm, review: e.target.value || null })}
                placeholder="Ce que le client a écrit sur sa queue de sirène…"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addItem} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
            <button onClick={() => setAdding(false)} className={btnPrimary} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}><X size={15} /> Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(0,200,239,0.08)" }}>
              {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl" style={{ color: "rgba(0,200,239,0.4)" }}>✦</div>}
            </div>
            {editId === item.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={labelStyle}>Nom</label>
                  <input className={inputClass} style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <ImagePicker token={token} value={form.img || ""} onChange={url => setForm({ ...form, img: url || null })} label="Photo" />
                <div>
                  <label className="text-xs font-medium mb-1 block" style={labelStyle}>Lien Instagram</label>
                  <input className={inputClass} style={inputStyle} value={form.instagram || ""} onChange={e => setForm({ ...form, instagram: e.target.value || null })} placeholder="https://instagram.com/nom_du_compte" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={labelStyle}>Avis du client</label>
                  <textarea
                    className={inputClass}
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                    value={form.review || ""}
                    onChange={e => setForm({ ...form, review: e.target.value || null })}
                    placeholder="Ce que le client a écrit sur sa queue de sirène…"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={saveEdit} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "#00c8ef" }}><Save size={13} /> Enregistrer</button>
                  <button onClick={() => setEditId(null)} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}><X size={13} /> Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="font-serif" style={{ color: "#e0f5ff" }}>{item.name}</p>
                {item.instagram && (
                  <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="text-xs truncate mt-0.5 flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: "#00c8ef" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                  </a>
                )}
                {item.img && !item.instagram && <p className="text-xs truncate mt-0.5" style={{ color: "rgba(200,235,255,0.45)" }}>{item.img}</p>}
              </div>
            )}
            {editId !== item.id && (
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#00c8ef" }}><Pencil size={15} /></button>
                <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}><Trash2 size={15} /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Présentation Photos Editor ─────────────────────────────────────────────
function PresentationAdmin({ token }: { token: string }) {
  const [items, setItems] = useState<PresentationPhoto[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<PresentationPhoto>>({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<PresentationPhoto>>({});
  const [msg, setMsg] = useState("");
  const { askConfirm, confirmProps } = useConfirm();

  useEffect(() => { fetchPresentation().then(setItems).catch(() => {}); }, []);

  function notify(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  function startEdit(item: PresentationPhoto) { setEditId(item.id); setForm({ ...item }); }

  async function saveEdit() {
    await updatePresentationPhoto(editId!, form, token);
    setItems(items.map(i => i.id === editId ? { ...i, ...form } as PresentationPhoto : i));
    setEditId(null); notify("✓ Photo mise à jour");
  }
  async function removeItem(id: number) {
    if (!await askConfirm("Supprimer cette photo de la galerie ?")) return;
    await deletePresentationPhoto(id, token); setItems(items.filter(i => i.id !== id)); notify("✓ Photo supprimée");
  }
  async function addItem() {
    if (!addForm.url) return;
    const newItem = await createPresentationPhoto(addForm, token);
    setItems([...items, newItem]); setAdding(false); setAddForm({}); notify("✓ Photo ajoutée");
  }

  const labelStyle = { color: "rgba(200,235,255,0.75)" };

  return (
    <div>
      <ConfirmDialog {...confirmProps} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif" style={{ color: "#e0f5ff" }}>Galerie Présentation</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(200,235,255,0.5)" }}>Photos affichées dans la section vidéo de la page d'accueil</p>
        </div>
        <button onClick={() => setAdding(true)} className={btnPrimary} style={{ background: "#00c8ef" }}><Plus size={16} /> Ajouter</button>
      </div>
      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm text-white" style={{ background: "#00c8ef" }}>{msg}</div>}

      {adding && (
        <div className="mb-6 rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ color: "#e0f5ff" }}>Nouvelle photo</h3>
          <div className="flex flex-col gap-3 mb-4">
            <ImagePicker token={token} value={addForm.url || ""} onChange={url => setAddForm({ ...addForm, url })} label="Image" />
            <div>
              <label className="text-xs font-medium mb-1 block" style={labelStyle}>Légende (optionnel)</label>
              <input className={inputClass} style={inputStyle} value={addForm.alt || ""} onChange={e => setAddForm({ ...addForm, alt: e.target.value })} placeholder="Description de la photo" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addItem} className={btnPrimary} style={{ background: "#00c8ef" }}><Save size={15} /> Enregistrer</button>
            <button onClick={() => setAdding(false)} className={btnPrimary} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}><X size={15} /> Annuler</button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding && (
        <p className="text-center py-12" style={{ color: "rgba(200,235,255,0.4)" }}>Aucune photo pour l'instant. Ajoutez-en une !</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <motion.div key={item.id} layout className="rounded-2xl overflow-hidden" style={cardStyle}>
            {item.url && (
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              {editId === item.id ? (
                <div className="flex flex-col gap-3">
                  <ImagePicker token={token} value={form.url || ""} onChange={url => setForm({ ...form, url })} label="Image" />
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={labelStyle}>Légende</label>
                    <input className={inputClass} style={inputStyle} value={form.alt || ""} onChange={e => setForm({ ...form, alt: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "#00c8ef" }}><Save size={13} /> Enregistrer</button>
                    <button onClick={() => setEditId(null)} className={btnPrimary + " text-xs px-3 py-1.5"} style={{ background: "rgba(0,200,239,0.1)", color: "#e0f5ff", border: "1px solid rgba(0,200,239,0.3)" }}><X size={13} /> Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-light truncate" style={{ color: "rgba(200,235,255,0.7)" }}>{item.alt || <span style={{ color: "rgba(200,235,255,0.35)" }}>Sans légende</span>}</p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(0,200,239,0.1)", color: "#00c8ef" }}><Pencil size={15} /></button>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:scale-110 transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}><Trash2 size={15} /></button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────
const TABS = [
  { id: "catalogue", label: "Catalogue" },
  { id: "remerciements", label: "Avis" },
  { id: "presentation", label: "Galerie accueil" },
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
    <div className="min-h-screen pt-28 pb-20 relative" style={bgPage}>
      <div className="absolute inset-0" style={bgOverlay} />
      <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-4xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif" style={{ color: "#e0f5ff" }}>Administration</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(200,235,255,0.65)" }}>Gérez le contenu du site</p>
          </div>
          <button onClick={handleLogout} className={btnPrimary} style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit" style={{ background: "rgba(0,20,50,0.5)", border: "1.5px solid rgba(0,200,239,0.25)", backdropFilter: "blur(8px)" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-6 py-2 rounded-xl text-sm font-medium transition-all"
              style={tab === t.id ? { background: "#00c8ef", color: "white" } : { color: "rgba(200,235,255,0.7)" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
            {tab === "catalogue" && <CatalogueAdmin token={token} />}
            {tab === "remerciements" && <RemerciementsAdmin token={token} />}
            {tab === "presentation" && <PresentationAdmin token={token} />}
            {tab === "media" && <MediaAdmin token={token} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
