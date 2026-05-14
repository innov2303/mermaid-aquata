const MYMEMORY = "https://api.mymemory.translated.net/get";
// Email contact → passe la limite MyMemory de 1 000 à 10 000 mots/jour
const MYMEMORY_EMAIL = "sireneaurore31@hotmail.com";
const MAX_CHARS = 450;

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateChunkMyMemory(text: string, from: string, to: string): Promise<string> {
  const url = `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=${from}|${to}&de=${encodeURIComponent(MYMEMORY_EMAIL)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json() as { responseStatus?: number; responseData?: { translatedText?: string } };
  if (data.responseStatus === 429) throw new Error("MyMemory rate limit");
  const translated = data?.responseData?.translatedText;
  if (
    !translated ||
    translated === "INVALID LANGUAGE PAIR" ||
    translated.startsWith("QUERY LENGTH LIMIT") ||
    translated.startsWith("MYMEMORY WARNING") ||
    translated.startsWith("DAILY USED LIMIT")
  ) throw new Error("MyMemory bad response");
  return translated;
}

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  return translateChunkMyMemory(text, from, to);
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
