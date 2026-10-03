import React from "react";
import { Mic, Send, Volume2 } from "lucide-react";
import { TOPIC_LABELS, DYADIC_DIALOGUES, type Topic } from "@/data/dialogueScripts";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { Lang } from "@/lib/app-context";

interface SimulationBottomBarProps {
  lang: Lang;
  busy: boolean;
  onSimulate: (who: "student" | "parent", topic?: Topic) => void;
  onObjectionClick: () => void;
  onRegularResponse: () => void;
}

export function SimulationBottomBar({
  lang,
  busy,
  onSimulate,
  onObjectionClick,
  onRegularResponse,
}: SimulationBottomBarProps) {
  const { speak, isSpeaking, currentSpeakingPersona } = useIndicVoice();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.counsel;

  // Resolve active language prioritizing language context or page lang
  const activeLang: SupportedLanguage = (language in DYADIC_DIALOGUES ? language : (lang as SupportedLanguage)) || "hi";
  const dialogue = DYADIC_DIALOGUES[activeLang] || DYADIC_DIALOGUES.hi;

  const handleSpeakAman = () => {
    speak(dialogue.studentText, "student_aman", activeLang);
    onRegularResponse();
    onSimulate("student");
  };

  const handleSpeakRamesh = () => {
    speak(dialogue.parentText, "parent_ramesh", activeLang);
    onRegularResponse();
    onSimulate("parent");
  };

  const getChipLabel = (topic: Topic) => {
    if (topic === "salary") return c.chips.salary;
    if (topic === "stigma") return c.chips.stigma;
    if (topic === "safety") return c.chips.safety;
    return TOPIC_LABELS[topic]?.[lang] || topic;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 shadow-[0_-8px_28px_rgba(15,41,66,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-2.5 px-4 py-3">
        {/* Parent Common Objections Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          <span className="shrink-0 text-xs font-bold text-muted-foreground flex items-center gap-1">
            <span>⚠️</span>
            <span>{lang === "hi" ? "अभिभावक की मुख्य शंकाएँ:" : "Parent Doubts:"}</span>
          </span>
          {(Object.keys(TOPIC_LABELS) as Topic[]).map((topic) => (
            <button
              key={topic}
              type="button"
              disabled={busy}
              onClick={() => {
                onObjectionClick();
                onSimulate("parent", topic);
              }}
              className="shrink-0 cursor-pointer rounded-full border border-parent/35 bg-parent-soft px-3 py-1 text-xs font-semibold text-navy transition hover:border-parent hover:bg-parent/20 disabled:cursor-wait disabled:opacity-50 active:scale-95"
            >
              {getChipLabel(topic)}
            </button>
          ))}
        </div>

        {/* Dual-Mic Persona Audio Triggers (Aman - 17y vs Ramesh - 48y) */}
        <div data-tour="tour-mic-bar" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Student Voice Trigger (Aman - 17y) */}
          <button
            type="button"
            disabled={busy}
            onClick={handleSpeakAman}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-between gap-2 border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
              currentSpeakingPersona === "student_aman" && isSpeaking
                ? "bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-400/30 animate-pulse"
                : "bg-blue-50/90 text-blue-900 border-blue-200 hover:bg-blue-100 hover:border-blue-400"
            } disabled:cursor-wait disabled:opacity-60`}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                <Mic className="h-4 w-4" />
              </span>
              <div className="text-left">
                <div className="text-xs font-extrabold">
                  🎙️ {c.studentMicBtn}
                </div>
                <div className="text-[10px] text-blue-700/80 font-normal">
                  {lang === "hi" ? "17 वर्ष • आकांक्षी, ऊर्जावान स्वर" : "17 yrs • Youthful, Energetic DSP"}
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-blue-200/80 text-blue-950 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
              Youthful (1.22x)
            </span>
          </button>

          {/* Parent Voice Trigger (Ramesh - 48y) */}
          <button
            type="button"
            disabled={busy}
            onClick={handleSpeakRamesh}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-between gap-2 border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
              currentSpeakingPersona === "parent_ramesh" && isSpeaking
                ? "bg-amber-600 text-white border-amber-600 shadow-md ring-4 ring-amber-400/30 animate-pulse"
                : "bg-amber-50/90 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-400"
            } disabled:cursor-wait disabled:opacity-60`}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white shadow-xs">
                <Mic className="h-4 w-4" />
              </span>
              <div className="text-left">
                <div className="text-xs font-extrabold">
                  🎙️ {c.parentMicBtn}
                </div>
                <div className="text-[10px] text-amber-800/80 font-normal">
                  {lang === "hi" ? "48 वर्ष • गंभीर, चिंतित स्वर" : "48 yrs • Mature, Hesitant DSP"}
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
              Parent (0.78x)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
