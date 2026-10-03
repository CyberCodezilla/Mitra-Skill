import { useState, useEffect, useCallback, useRef } from "react";
import { SupportedLanguage, useLanguageVoice } from "../context/LanguageVoiceContext";
import { PersonaId, PERSONA_PROFILES } from "./voiceProfiles";

const VALID_PERSONA_IDS: PersonaId[] = [
  "student_aman",
  "parent_ramesh",
  "arbiter",
  "counselor_officer",
];

const VALID_LANGS: SupportedLanguage[] = ["en", "hi", "mr", "bn", "ta"];

export interface SpeakFunction {
  (text: string, persona?: PersonaId, customLang?: SupportedLanguage, onEnd?: () => void): void;
  (text: string, lang?: SupportedLanguage, onEnd?: () => void): void;
}

export function useIndicVoice() {
  const { language, gender } = useLanguageVoice();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingPersona, setCurrentSpeakingPersona] = useState<PersonaId | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      } catch {
        setVoices([]);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectBestVoice = useCallback(
    (lang: SupportedLanguage, targetGender: "male" | "female"): SpeechSynthesisVoice | null => {
      if (voices.length === 0) return null;

      const localeMap: Record<SupportedLanguage, string> = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        ta: "ta-IN",
      };

      const targetLocale = localeMap[lang];
      const langMatches = voices.filter(
        (v) =>
          v.lang.toLowerCase() === targetLocale.toLowerCase() ||
          v.lang.toLowerCase().replace("_", "-") === targetLocale.toLowerCase() ||
          v.lang.toLowerCase().startsWith(lang),
      );

      const candidateList =
        langMatches.length > 0 ? langMatches : voices.filter((v) => v.lang.toUpperCase().includes("IN"));

      if (candidateList.length === 0) return voices[0] || null;

      const femaleHints = [
        "female",
        "swara",
        "priya",
        "zira",
        "sheetal",
        "kalpana",
        "kavita",
        "ananya",
      ];
      const maleHints = [
        "male",
        "madhur",
        "sachin",
        "ravi",
        "david",
        "george",
        "valluvar",
        "hemant",
      ];
      const targetHints = targetGender === "female" ? femaleHints : maleHints;

      const genderMatch = candidateList.find((v) =>
        targetHints.some((hint) => v.name.toLowerCase().includes(hint)),
      );

      return genderMatch || candidateList[0] || null;
    },
    [voices],
  );

  const speak: SpeakFunction = useCallback(
    (
      text: string,
      personaOrLang?: PersonaId | SupportedLanguage,
      customLangOrOnEnd?: SupportedLanguage | (() => void),
      onEndCallback?: () => void,
    ) => {
      let onEnd: (() => void) | undefined = onEndCallback;
      if (typeof customLangOrOnEnd === "function") {
        onEnd = customLangOrOnEnd;
      }

      if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) {
        if (onEnd) onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      // Backward-compatibility: if second argument is a language code (e.g., "hi", "en"), route it as lang
      let resolvedPersona: PersonaId = "arbiter";
      let resolvedLang: SupportedLanguage = typeof customLangOrOnEnd === "string" ? customLangOrOnEnd : language;

      if (personaOrLang) {
        if (VALID_LANGS.includes(personaOrLang as SupportedLanguage)) {
          resolvedLang = personaOrLang as SupportedLanguage;
          resolvedPersona = "arbiter";
        } else if (VALID_PERSONA_IDS.includes(personaOrLang as PersonaId)) {
          resolvedPersona = personaOrLang as PersonaId;
        }
      }

      const profile = PERSONA_PROFILES[resolvedPersona];
      const targetGender = resolvedPersona === "arbiter" ? gender : profile.preferredGender;

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;

      const matchedVoice = selectBestVoice(resolvedLang, targetGender);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        const localeFallback: Record<SupportedLanguage, string> = {
          en: "en-IN",
          hi: "hi-IN",
          mr: "mr-IN",
          bn: "bn-IN",
          ta: "ta-IN",
        };
        utterance.lang = localeFallback[resolvedLang];
      }

      // Apply demographic-calibrated DSP pitch and tempo
      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;

      let finished = false;
      const handleFinish = () => {
        if (finished) return;
        finished = true;
        setIsSpeaking(false);
        setCurrentSpeakingPersona(null);
        if (onEnd) onEnd();
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingPersona(resolvedPersona);
      };
      utterance.onend = handleFinish;
      utterance.onerror = handleFinish;

      window.speechSynthesis.speak(utterance);
    },
    [language, gender, selectBestVoice],
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingPersona(null);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    currentSpeakingPersona,
    currentLanguage: language,
    activeGender: gender,
    isSupported,
    voices,
  };
}
