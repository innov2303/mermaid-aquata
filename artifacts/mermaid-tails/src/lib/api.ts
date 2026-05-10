const BASE = "/api";

export async function checkAdminToken(token: string): Promise<boolean> {
  const r = await fetch(`${BASE}/auth/check`, { headers: { "x-admin-token": token } });
  return r.ok;
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BASE}/upload`, { method: "POST", headers: { "x-admin-token": token }, body: fd });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: "Erreur upload" }));
    throw new Error(err.error || "Erreur upload");
  }
  const { url } = await r.json();
  return url;
}

export async function listUploads(token: string): Promise<{ filename: string; url: string }[]> {
  const r = await fetch(`${BASE}/uploads`, { headers: { "x-admin-token": token } });
  if (!r.ok) throw new Error("Erreur chargement images");
  return r.json();
}

export async function deleteUpload(filename: string, token: string): Promise<void> {
  const r = await fetch(`${BASE}/uploads/${filename}`, { method: "DELETE", headers: { "x-admin-token": token } });
  if (!r.ok) throw new Error("Erreur suppression");
}

function headers(token?: string) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["x-admin-token"] = token;
  return h;
}

// Catalogue
export async function fetchCatalogue(lang?: string) {
  const params = new URLSearchParams({ _t: Date.now().toString() });
  if (lang && lang !== 'fr') params.set('lang', lang);
  const r = await fetch(`${BASE}/catalogue?${params}`, { cache: 'no-store' });
  if (!r.ok) throw new Error("Erreur chargement catalogue");
  return r.json();
}

export async function createCatalogueItem(item: object, token: string) {
  const r = await fetch(`${BASE}/catalogue`, { method: "POST", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur création article");
  return r.json();
}

export async function updateCatalogueItem(id: number, item: object, token: string) {
  const r = await fetch(`${BASE}/catalogue/${id}`, { method: "PUT", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur mise à jour article");
  return r.json();
}

export async function deleteCatalogueItem(id: number, token: string) {
  const r = await fetch(`${BASE}/catalogue/${id}`, { method: "DELETE", headers: headers(token) });
  if (!r.ok) throw new Error("Erreur suppression article");
  return r.json();
}

// Présentation photos (galerie accueil)
export async function fetchPresentation() {
  const r = await fetch(`${BASE}/presentation`);
  if (!r.ok) throw new Error("Erreur chargement présentation");
  return r.json();
}

export async function createPresentationPhoto(item: object, token: string) {
  const r = await fetch(`${BASE}/presentation`, { method: "POST", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur création photo");
  return r.json();
}

export async function updatePresentationPhoto(id: number, item: object, token: string) {
  const r = await fetch(`${BASE}/presentation/${id}`, { method: "PUT", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur mise à jour photo");
  return r.json();
}

export async function deletePresentationPhoto(id: number, token: string) {
  const r = await fetch(`${BASE}/presentation/${id}`, { method: "DELETE", headers: headers(token) });
  if (!r.ok) throw new Error("Erreur suppression photo");
  return r.json();
}

// Remerciements
export async function fetchRemerciements(lang?: string) {
  const params = new URLSearchParams({ _t: Date.now().toString() });
  if (lang && lang !== 'fr') params.set('lang', lang);
  const r = await fetch(`${BASE}/remerciements?${params}`, { cache: 'no-store' });
  if (!r.ok) throw new Error("Erreur chargement remerciements");
  return r.json();
}

export async function createRemerciement(item: object, token: string) {
  const r = await fetch(`${BASE}/remerciements`, { method: "POST", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur création sirène");
  return r.json();
}

export async function updateRemerciement(id: number, item: object, token: string) {
  const r = await fetch(`${BASE}/remerciements/${id}`, { method: "PUT", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur mise à jour sirène");
  return r.json();
}

export async function deleteRemerciement(id: number, token: string) {
  const r = await fetch(`${BASE}/remerciements/${id}`, { method: "DELETE", headers: headers(token) });
  if (!r.ok) throw new Error("Erreur suppression sirène");
  return r.json();
}

// TV Refs
export async function fetchTvRefs() {
  const r = await fetch(`${BASE}/tv-refs`);
  if (!r.ok) throw new Error("Erreur chargement références TV");
  return r.json();
}

export async function createTvRef(item: object, token: string) {
  const r = await fetch(`${BASE}/tv-refs`, { method: "POST", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur création référence");
  return r.json();
}

export async function updateTvRef(id: number, item: object, token: string) {
  const r = await fetch(`${BASE}/tv-refs/${id}`, { method: "PUT", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur mise à jour référence");
  return r.json();
}

export async function deleteTvRef(id: number, token: string) {
  const r = await fetch(`${BASE}/tv-refs/${id}`, { method: "DELETE", headers: headers(token) });
  if (!r.ok) throw new Error("Erreur suppression référence");
  return r.json();
}

// Contact info
export async function fetchContactInfo(): Promise<{ email: string; address: string; city: string; phone: string }> {
  const r = await fetch(`${BASE}/contact-info`);
  if (!r.ok) throw new Error("Erreur chargement contact");
  return r.json();
}

export async function updateContactInfo(item: object, token: string) {
  const r = await fetch(`${BASE}/contact-info`, { method: "PUT", headers: headers(token), body: JSON.stringify(item) });
  if (!r.ok) throw new Error("Erreur mise à jour contact");
  return r.json();
}

export async function translateAll(token: string): Promise<{ message: string; catalogue: number; remerciements: number; errors: string[] }> {
  const r = await fetch(`${BASE}/admin/translate-all`, { method: "POST", headers: headers(token) });
  if (!r.ok) throw new Error("Erreur traduction");
  return r.json();
}

// Legal pages
export async function fetchLegal(page: "politique-de-retour" | "mentions-legales") {
  const r = await fetch(`${BASE}/legal/${page}?_t=${Date.now()}`);
  if (!r.ok) throw new Error("Erreur chargement legal");
  return r.json();
}

export async function updateLegal(page: "politique-de-retour" | "mentions-legales", data: object, token: string) {
  const r = await fetch(`${BASE}/admin/legal/${page}`, { method: "PUT", headers: headers(token), body: JSON.stringify(data) });
  if (!r.ok) throw new Error("Erreur mise à jour legal");
  return r.json();
}
