const BASE = "/api";

export async function checkAdminToken(token: string): Promise<boolean> {
  const r = await fetch(`${BASE}/auth/check`, { headers: { "x-admin-token": token } });
  return r.ok;
}

function headers(token?: string) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["x-admin-token"] = token;
  return h;
}

// Catalogue
export async function fetchCatalogue() {
  const r = await fetch(`${BASE}/catalogue`);
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

// Remerciements
export async function fetchRemerciements() {
  const r = await fetch(`${BASE}/remerciements`);
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
