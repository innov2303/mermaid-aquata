const MYMEMORY = "https://api.mymemory.translated.net/get";

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  try {
    const url = `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return text;
    const data = await res.json() as { responseData?: { translatedText?: string } };
    const translated = data?.responseData?.translatedText;
    if (!translated || translated === "INVALID LANGUAGE PAIR") return text;
    return translated;
  } catch {
    return text;
  }
}

function splitIntoChunks(text: string, maxLen = 470): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let current = "";
  for (const line of text.split("\n")) {
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

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
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
      if (ci < chunks.length - 1) await delay(150);
    }
    translatedParagraphs.push(translatedChunks.join("\n"));
    if (pi < paragraphs.length - 1) await delay(100);
  }

  return translatedParagraphs.join("\n\n");
}

export async function translateToAll(text: string): Promise<{ en: string; es: string }> {
  const en = await translateText(text, "fr", "en");
  await delay(200);
  const es = await translateText(text, "fr", "es");
  return { en, es };
}
