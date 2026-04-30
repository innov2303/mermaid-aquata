import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";
import type { Lang } from "@/lib/translations";

type SeoPage = "home" | "catalogue" | "commander" | "faq" | "remerciements";

const LANG_CODES: Record<Lang, string> = {
  fr: "fr-FR",
  en: "en",
  es: "es",
};

export function useSEO(page: SeoPage) {
  const { lang } = useLanguage();

  useEffect(() => {
    const seo = translations[lang].seo[page];

    document.title = seo.title;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.description;

    document.documentElement.lang = LANG_CODES[lang];

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
      link.href = window.location.href;
    });

    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = seo.title;

    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = seo.description;

    let ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement("meta");
      ogLocale.setAttribute("property", "og:locale");
      document.head.appendChild(ogLocale);
    }
    ogLocale.content = LANG_CODES[lang];
  }, [lang, page]);
}
