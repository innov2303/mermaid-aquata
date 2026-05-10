import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";
import type { Lang } from "@/lib/translations";

type SeoPage = "home" | "catalogue" | "commander" | "faq" | "avis" | "tv" | "histoire";

const LANG_CODES: Record<Lang, string> = {
  fr: "fr-FR",
  en: "en-GB",
  es: "es-ES",
};

const PAGE_KEYWORDS: Record<Lang, Record<SeoPage, string>> = {
  fr: {
    home:          "queue de sirène, queue de sirène silicone, queue de sirène sur mesure, fabrication queue de sirène, nageoire sirène, monopalme sirène, costume sirène, sirène professionnelle, queue de sirène artisanale, queue de sirène France, mermaid tail France, mermaid tail international, livraison internationale sirène",
    catalogue:     "catalogue queue de sirène, modèles queue de sirène, nageoire sirène silicone, SIREN LAGOON SPLASH H2O GOLDFISH ARIEL, queue classique silicone, pieds invisibles sirène, longfish sirène, monopalme personnalisée",
    commander:     "commander queue de sirène, devis queue de sirène, queue de sirène prix, fabrication sur mesure sirène, commande nageoire sirène, mesures queue de sirène, queue de sirène artisanale prix",
    faq:           "prix queue de sirène, délai fabrication queue de sirène, queue de sirène entretien, silicone pour sirène, queue de sirène livraison, FAQ sirène, queue de sirène combien ça coûte",
    avis: "avis clients sirène, témoignages sirène, galerie queue de sirène, photos queue de sirène, sirènes professionnelles, queue de sirène portée",
    histoire: "histoire créatrice queue de sirène, Mermaid Aquata histoire, nageoire silicone unique, extension au-delà des pieds, monopalme artisanale, silicone sirène, pigments sirène, création queue de sirène France",
  },
  en: {
    home:          "mermaid tail, silicone mermaid tail, custom mermaid tail, mermaid tail maker, realistic mermaid tail, professional mermaid, mermaid tail France, handmade mermaid tail, mermaid monofin",
    catalogue:     "mermaid tail catalogue, mermaid tail models, silicone mermaid fin, SIREN LAGOON SPLASH H2O GOLDFISH ARIEL, classic silicone tail, invisible feet mermaid, longfish tail, custom monofin",
    commander:     "order mermaid tail, mermaid tail price, custom mermaid tail order, bespoke mermaid tail, mermaid tail measurements, mermaid tail quote",
    faq:           "mermaid tail price, mermaid tail lead time, mermaid tail maintenance, silicone mermaid, mermaid tail shipping, FAQ mermaid tail, how much does a mermaid tail cost",
    avis: "mermaid tail reviews, customer testimonials, mermaid tail gallery, mermaid tail photos, professional mermaids, mermaid tail worn",
    histoire: "mermaid tail creator story, Mermaid Aquata story, unique silicone tail, extension beyond feet, handmade monofin, silicone mermaid, mermaid pigments, mermaid tail creation France",
  },
  es: {
    home:          "cola de sirena, cola de sirena silicona, cola de sirena a medida, fabricación cola de sirena, aleta sirena, monofin sirena, disfraz sirena, sirena profesional, cola de sirena artesanal, cola de sirena Francia",
    catalogue:     "catálogo cola de sirena, modelos cola sirena, aleta sirena silicona, SIREN LAGOON SPLASH H2O GOLDFISH ARIEL, cola silicona clásica, pies invisibles sirena, longfish sirena, monofin personalizado",
    commander:     "pedir cola de sirena, presupuesto cola sirena, precio cola sirena, fabricación a medida sirena, medidas cola de sirena, cola de sirena artesanal precio",
    faq:           "precio cola de sirena, plazo fabricación cola sirena, mantenimiento cola sirena, silicona sirena, envío cola sirena, FAQ sirena, cuánto cuesta una cola de sirena",
    avis: "reseñas clientes cola de sirena, testimonios sirena, galería cola de sirena, fotos cola de sirena, sirenas profesionales",
    histoire: "historia creadora cola de sirena, historia Mermaid Aquata, aleta silicona única, extensión más allá de los pies, monoaleta artesanal, silicona sirena, pigmentos sirena, creación cola de sirena Francia",
  },
};

function setOrCreate(selector: string, attr: string, attrValue: string, contentAttr: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(contentAttr, content);
}

export function useSEO(page: SeoPage) {
  const { lang } = useLanguage();

  useEffect(() => {
    const seo = translations[lang].seo[page];

    // Title
    document.title = seo.title;
    document.documentElement.lang = LANG_CODES[lang];

    // Description
    setOrCreate('meta[name="description"]', "name", "description", "content", seo.description);

    // Keywords
    setOrCreate('meta[name="keywords"]', "name", "keywords", "content", PAGE_KEYWORDS[lang][page]);

    // Robots
    setOrCreate('meta[name="robots"]', "name", "robots", "content", "index, follow");

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    // hreflang
    const langs: Lang[] = ["fr", "en", "es"];
    langs.forEach((l) => {
      const id = `hreflang-${l}`;
      let link = document.querySelector<HTMLLinkElement>(`link#${id}`);
      if (!link) {
        link = document.createElement("link");
        link.id = id;
        link.rel = "alternate";
        link.hreflang = LANG_CODES[l];
        document.head.appendChild(link);
      }
      link.href = window.location.origin + window.location.pathname;
    });

    // Open Graph
    setOrCreate('meta[property="og:title"]', "property", "og:title", "content", seo.title);
    setOrCreate('meta[property="og:description"]', "property", "og:description", "content", seo.description);
    setOrCreate('meta[property="og:locale"]', "property", "og:locale", "content", LANG_CODES[lang].replace("-", "_"));
    setOrCreate('meta[property="og:type"]', "property", "og:type", "content", "website");
    setOrCreate('meta[property="og:image"]', "property", "og:image", "content", `${window.location.origin}/images/hero.jpg`);
    setOrCreate('meta[property="og:url"]', "property", "og:url", "content", window.location.origin + window.location.pathname);

    // Twitter Card
    setOrCreate('meta[name="twitter:card"]', "name", "twitter:card", "content", "summary_large_image");
    setOrCreate('meta[name="twitter:title"]', "name", "twitter:title", "content", seo.title);
    setOrCreate('meta[name="twitter:description"]', "name", "twitter:description", "content", seo.description);
    setOrCreate('meta[name="twitter:image"]', "name", "twitter:image", "content", `${window.location.origin}/images/hero.jpg`);
  }, [lang, page]);
}
