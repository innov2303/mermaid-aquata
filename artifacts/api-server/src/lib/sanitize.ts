export function sanitizeString(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
}

export function sanitizeCatalogueItem(body: Record<string, unknown>) {
  return {
    section: sanitizeString(body["section"], 100),
    name: sanitizeString(body["name"], 200),
    desc: sanitizeString(body["desc"], 5000),
    price: sanitizeString(body["price"], 100),
    images: Array.isArray(body["images"])
      ? (body["images"] as unknown[])
          .filter((u): u is string => typeof u === "string")
          .slice(0, 20)
          .map(u => sanitizeString(u, 500))
      : [],
  };
}

export function sanitizeRemerciement(body: Record<string, unknown>) {
  return {
    name: sanitizeString(body["name"], 200),
    img: typeof body["img"] === "string" ? sanitizeString(body["img"], 500) : null,
    instagram: typeof body["instagram"] === "string" ? sanitizeString(body["instagram"], 300) : null,
    review: typeof body["review"] === "string" ? sanitizeString(body["review"], 2000) : null,
  };
}
