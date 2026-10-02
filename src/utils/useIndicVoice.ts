import { useCallback, useEffect, useState } from "react";

export function useIndicVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synthesis = window.speechSynthesis;
    const updateVoices = () => setVoices(synthesis.getVoices());
    updateVoices();
    synthesis.addEventListener?.("voiceschanged", updateVoices);
    return () => {
      synthesis.removeEventListener?.("voiceschanged", updateVoices);
      synthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, lang: "hi" | "en" = "hi", onEnd?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        onEnd?.();
        return;
      }

      const synthesis = window.speechSynthesis;
      synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1;
      const prefix = lang === "hi" ? "hi" : "en";
      const locale = lang === "hi" ? "hi-in" : "en-in";
      const voice =
        voices.find((candidate) => candidate.lang.toLowerCase() === locale) ??
        voices.find((candidate) => candidate.lang.toLowerCase().startsWith(prefix)) ??
        voices.find((candidate) => candidate.lang.toLowerCase().includes("-in")) ??
        null;
      if (voice) utterance.voice = voice;
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.onstart = () => setIsSpeaking(true);
      const finish = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      synthesis.speak(utterance);
    },
    [voices],
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, voices };
}
