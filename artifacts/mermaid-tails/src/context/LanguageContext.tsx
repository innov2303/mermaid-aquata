import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import translations, { type Lang, type Translations } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: translations.fr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('ma_lang');
    return (saved === 'fr' || saved === 'en' || saved === 'es') ? saved : 'fr';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('ma_lang', l);
  };

  const t = translations[lang] as Translations;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
