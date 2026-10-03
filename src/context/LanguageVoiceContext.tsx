import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type SupportedLanguage = "en" | "hi" | "mr" | "bn" | "ta";
export type VoiceGender = "male" | "female";

export interface LanguageVoiceContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  gender: VoiceGender;
  setGender: (gender: VoiceGender) => void;
}

export const LANGUAGE_LABELS: Record<SupportedLanguage, { native: string; english: string }> = {
  hi: { native: "हिन्दी", english: "Hindi" },
  en: { native: "English", english: "English" },
  mr: { native: "मराठी", english: "Marathi" },
  bn: { native: "বাংলা", english: "Bengali" },
  ta: { native: "தமிழ்", english: "Tamil" },
};

const defaultContext: LanguageVoiceContextType = {
  language: "hi",
  setLanguage: () => {},
  gender: "female",
  setGender: () => {},
};

export const LanguageVoiceContext = createContext<LanguageVoiceContextType>(defaultContext);

export function LanguageVoiceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("hi");
  const [gender, setGenderState] = useState<VoiceGender>("female");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("mitraskill_lang") as SupportedLanguage | null;
      if (savedLang && ["en", "hi", "mr", "bn", "ta"].includes(savedLang)) {
        setLanguageState(savedLang);
      }
      const savedGender = localStorage.getItem("mitraskill_voice_gender") as VoiceGender | null;
      if (savedGender && ["male", "female"].includes(savedGender)) {
        setGenderState(savedGender);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("mitraskill_lang", lang);
    } catch {}
  };

  const setGender = (g: VoiceGender) => {
    setGenderState(g);
    try {
      localStorage.setItem("mitraskill_voice_gender", g);
    } catch {}
  };

  return (
    <LanguageVoiceContext.Provider value={{ language, setLanguage, gender, setGender }}>
      {children}
    </LanguageVoiceContext.Provider>
  );
}

export function useLanguageVoice() {
  const context = useContext(LanguageVoiceContext);
  return context || defaultContext;
}
