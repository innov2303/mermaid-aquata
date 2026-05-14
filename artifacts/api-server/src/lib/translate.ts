const GOOGLE_TRANSLATE = "https://translate.googleapis.com/translate_a/single";
const MAX_CHARS = 450;

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  const url = `${GOOGLE_TRANSLATE}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(6_000),
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
  const data = await res.json() as unknown[][];
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Google Translate bad format");
  const parts = (data[0] as unknown[][])
    .map((chunk: unknown[]) => (typeof chunk[0] === "string" ? chunk[0] : ""))
    .join("");
  if (!parts) throw new Error("Google Translate empty result");
  return parts;
}

function splitByWords(text: string, maxLen: number): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (candidate.length > maxLen && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function splitIntoChunks(text: string, maxLen = MAX_CHARS): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let current = "";
  for (const line of text.split("\n")) {
    if (line.length > maxLen) {
      if (current) { chunks.push(current); current = ""; }
      chunks.push(...splitByWords(line, maxLen));
      continue;
    }
    const candidate = current ? current + "\n" + line : line;
    if (candidate.length > maxLen && current) {
      chunks.push(current);
      current = line;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text) return text;
  const paragraphs = text.split("\n\n");
  const translatedParagraphs: string[] = [];

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi];
    if (!para.trim()) { translatedParagraphs.push(para); continue; }
    const chunks = splitIntoChunks(para);
    const translatedChunks: string[] = [];
    for (let ci = 0; ci < chunks.length; ci++) {
      translatedChunks.push(await translateChunk(chunks[ci], from, to));
      if (ci < chunks.length - 1) await delay(200);
    }
    translatedParagraphs.push(translatedChunks.join(" "));
    if (pi < paragraphs.length - 1) await delay(200);
  }

  return translatedParagraphs.join("\n\n");
}

export async function translateToAll(text: string): Promise<{ en: string; es: string }> {
  const en = await translateText(text, "fr", "en");
  await delay(300);
  const es = await translateText(text, "fr", "es");
  return { en, es };
}
