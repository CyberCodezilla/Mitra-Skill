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

// ─── Indic-aware sentence splitter ────────────────────────────────
// Splits on `.` `।` `?` `!` `;` and `,` (only when a clause exceeds
// ~80 chars). This prevents any single utterance from crossing Chrome's
// ~15-second garbage-collection boundary.
const SENTENCE_DELIMITERS = /(?<=[।\.!\?;])\s+/;
const CLAUSE_COMMA_SPLIT = /(?<=[,，،])\s+/;
const MAX_CHUNK_CHARS = 120; // if a sentence still exceeds this, split on commas

function splitIntoChunks(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  // Phase 1: split on sentence boundaries
  const rawSentences = text.split(SENTENCE_DELIMITERS).filter((s) => s.trim().length > 0);

  const chunks: string[] = [];
  for (const sentence of rawSentences) {
    if (sentence.length <= MAX_CHUNK_CHARS) {
      chunks.push(sentence.trim());
    } else {
      // Phase 2: sentence is too long → split on commas
      const subParts = sentence.split(CLAUSE_COMMA_SPLIT).filter((s) => s.trim().length > 0);
      let buffer = "";
      for (const part of subParts) {
        if (buffer.length + part.length > MAX_CHUNK_CHARS && buffer.length > 0) {
          chunks.push(buffer.trim());
          buffer = part;
        } else {
          buffer += (buffer ? ", " : "") + part;
        }
      }
      if (buffer.trim()) chunks.push(buffer.trim());
    }
  }

  return chunks.length > 0 ? chunks : [text.trim()];
}

// ─── Keepalive heartbeat ──────────────────────────────────────────
// Chrome's speechSynthesis silently kills utterances after ~15 sec of
// continuous playback.  A periodic pause()/resume() resets the timer.
const KEEPALIVE_INTERVAL_MS = 10_000;

export interface SpeakFunction {
  (text: string, persona?: PersonaId, customLang?: SupportedLanguage, onEnd?: () => void): void;
  (text: string, lang?: SupportedLanguage, onEnd?: () => void): void;
}

export function useIndicVoice() {
  const { language, gender } = useLanguageVoice();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingPersona, setCurrentSpeakingPersona] = useState<PersonaId | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Refs for chunk queue management
  const chunkQueueRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const onEndCallbackRef = useRef<(() => void) | null>(null);
  const keepaliveTimerRef = useRef<number | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Store resolved config so chunk playback can reuse it
  const resolvedConfigRef = useRef<{
    persona: PersonaId;
    lang: SupportedLanguage;
    targetGender: "male" | "female";
    pitch: number;
    rate: number;
  } | null>(null);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // ─── Voice loading ──────────────────────────────────────────────
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
      clearKeepalive();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Keepalive helpers ──────────────────────────────────────────
  const startKeepalive = useCallback(() => {
    clearKeepalive();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    keepaliveTimerRef.current = window.setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, KEEPALIVE_INTERVAL_MS);
  }, []);

  function clearKeepalive() {
    if (keepaliveTimerRef.current !== null) {
      window.clearInterval(keepaliveTimerRef.current);
      keepaliveTimerRef.current = null;
    }
  }

  // ─── Voice selection ────────────────────────────────────────────
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

  // ─── Play a single chunk ───────────────────────────────────────
  const playNextChunk = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const queue = chunkQueueRef.current;
    const idx = chunkIndexRef.current;

    // All chunks finished
    if (idx >= queue.length) {
      isPlayingRef.current = false;
      clearKeepalive();
      setIsSpeaking(false);
      setCurrentSpeakingPersona(null);
      if (onEndCallbackRef.current) {
        onEndCallbackRef.current();
        onEndCallbackRef.current = null;
      }
      return;
    }

    const config = resolvedConfigRef.current;
    if (!config) return;

    const chunkText = queue[idx]!;
    const utterance = new SpeechSynthesisUtterance(chunkText);
    currentUtteranceRef.current = utterance;

    const matchedVoice = selectBestVoice(config.lang, config.targetGender);
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
      utterance.lang = localeFallback[config.lang];
    }

    // Apply demographic-calibrated DSP pitch and tempo
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;

    let finished = false;
    const handleChunkFinish = () => {
      if (finished) return;
      finished = true;
      // Advance to next chunk
      chunkIndexRef.current += 1;
      // Small inter-chunk pause for natural cadence
      window.setTimeout(() => {
        if (isPlayingRef.current) {
          playNextChunk();
        }
      }, 80);
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingPersona(config.persona);
    };
    utterance.onend = handleChunkFinish;
    utterance.onerror = (event) => {
      // "interrupted" is expected when stop() is called — don't cascade
      if (event.error === "interrupted" || event.error === "canceled") return;
      handleChunkFinish();
    };

    window.speechSynthesis.speak(utterance);
  }, [selectBestVoice]);

  // ─── Public speak() ─────────────────────────────────────────────
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

      // Cancel any in-progress playback
      window.speechSynthesis.cancel();
      isPlayingRef.current = false;
      clearKeepalive();

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

      // Store config for chunk playback
      resolvedConfigRef.current = {
        persona: resolvedPersona,
        lang: resolvedLang,
        targetGender,
        pitch: profile.pitch,
        rate: profile.rate,
      };

      // Split text into safe chunks
      const chunks = splitIntoChunks(text);
      chunkQueueRef.current = chunks;
      chunkIndexRef.current = 0;
      onEndCallbackRef.current = onEnd || null;
      isPlayingRef.current = true;

      // Start keepalive heartbeat
      startKeepalive();

      // Begin sequential playback
      playNextChunk();
    },
    [language, gender, startKeepalive, playNextChunk],
  );

  // ─── Public stop() ──────────────────────────────────────────────
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Halt queue before cancelling to prevent chunk cascade
      isPlayingRef.current = false;
      chunkQueueRef.current = [];
      chunkIndexRef.current = 0;
      onEndCallbackRef.current = null;
      clearKeepalive();
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
