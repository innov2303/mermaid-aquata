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
    video: typeof body["video"] === "string" ? sanitizeString(body["video"], 500) : "",
    etsyUrl: typeof body["etsyUrl"] === "string" ? sanitizeString(body["etsyUrl"], 500) : "",
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

export function sanitizeContact(body: Record<string, unknown>) {
  return {
    email: sanitizeString(body["email"], 200),
    address: sanitizeString(body["address"], 300),
    city: sanitizeString(body["city"], 200),
    phone: sanitizeString(body["phone"], 50),
  };
}

export function sanitizeTvRef(body: Record<string, unknown>) {
  return {
    label: sanitizeString(body["label"], 100),
    name: sanitizeString(body["name"], 200),
    desc: sanitizeString(body["desc"], 1000),
    youtube: typeof body["youtube"] === "string" ? sanitizeString(body["youtube"], 500) : "",
    image: typeof body["image"] === "string" ? sanitizeString(body["image"], 500) : "",
  };
}
