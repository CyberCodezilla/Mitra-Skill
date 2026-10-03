import React, { useState } from "react";
import { Mic, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BALANCED_DYADIC_SCENARIOS,
  type BalancedDyadicTurn,
  getScenarioPromptLabel,
  getScenarioUserText,
  DYADIC_DIALOGUES,
  type Topic,
} from "@/data/dialogueScripts";
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
  onSelectScenario?: (scenario: BalancedDyadicTurn) => void;
}

const SUGGESTIONS_STRINGS: Record<
  SupportedLanguage,
  {
    headerTitle: string;
    showBtn: string;
    hideBtn: string;
    countBadge: string;
  }
> = {
  en: {
    headerTitle: "Suggested Questions & Reality Checks",
    showBtn: "Show Questions",
    hideBtn: "Hide Questions",
    countBadge: "4 scenarios",
  },
  hi: {
    headerTitle: "सुझाई गई शंकाएं व यथार्थवादी प्रश्न",
    showBtn: "प्रश्न देखें",
    hideBtn: "प्रश्न छिपाएँ",
    countBadge: "4 प्रश्न",
  },
  mr: {
    headerTitle: "सुचवलेले प्रश्न व वास्तववादी शंका",
    showBtn: "प्रश्न पहा",
    hideBtn: "प्रश्न लपवा",
    countBadge: "४ प्रश्न",
  },
  bn: {
    headerTitle: "প্রস্তাবিত প্রশ্ন ও বাস্তবসম্মত অনুসন্ধান",
    showBtn: "প্রশ্ন দেখুন",
    hideBtn: "প্রশ্ন লুকান",
    countBadge: "৪টি প্রশ্ন",
  },
  ta: {
    headerTitle: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    showBtn: "கேள்விகளைக் காட்டு",
    hideBtn: "கேள்விகளை மறை",
    countBadge: "4 கேள்விகள்",
  },
};

export function SimulationBottomBar({
  lang,
  busy,
  onSimulate,
  onObjectionClick,
  onRegularResponse,
  onSelectScenario,
}: SimulationBottomBarProps) {
  const { speak, isSpeaking, currentSpeakingPersona } = useIndicVoice();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.counsel;

  const [amanIndex, setAmanIndex] = useState(0);
  const [rameshIndex, setRameshIndex] = useState(0);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);

  // Resolve active language prioritizing language context or page lang
  const activeLang: SupportedLanguage = (language in DYADIC_DIALOGUES ? language : (lang as SupportedLanguage)) || "hi";
  const dialogue = DYADIC_DIALOGUES[activeLang] || DYADIC_DIALOGUES.hi;
  const strings = SUGGESTIONS_STRINGS[activeLang] || SUGGESTIONS_STRINGS.hi;

  const studentScenarios = BALANCED_DYADIC_SCENARIOS.filter((s) => s.initiator === "student");
  const parentScenarios = BALANCED_DYADIC_SCENARIOS.filter((s) => s.initiator === "parent");

  const handleSpeakAman = () => {
    const scenario = studentScenarios[amanIndex % studentScenarios.length]!;
    setAmanIndex((i) => i + 1);
    const textToSpeak = getScenarioUserText(scenario, activeLang) || dialogue.studentText;
    speak(textToSpeak, "student_aman", activeLang);
    onRegularResponse();
    if (onSelectScenario) {
      onSelectScenario(scenario);
    } else {
      onSimulate("student");
    }
  };

  const handleSpeakRamesh = () => {
    const scenario = parentScenarios[rameshIndex % parentScenarios.length]!;
    setRameshIndex((i) => i + 1);
    const textToSpeak = getScenarioUserText(scenario, activeLang) || dialogue.parentText;
    speak(textToSpeak, "parent_ramesh", activeLang);
    onObjectionClick();
    if (onSelectScenario) {
      onSelectScenario(scenario);
    } else {
      onSimulate("parent");
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 shadow-[0_-8px_28px_rgba(15,41,66,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-2 sm:py-2.5">
        {/* Collapsible Suggested Inquiries Section */}
        <div className="flex flex-col gap-1.5">
          {/* Header Row with Toggle Handle */}
          <div className="flex items-center justify-between gap-2 px-0.5">
            <button
              type="button"
              onClick={() => setIsQuestionsOpen((prev) => !prev)}
              className="flex items-center gap-2 group cursor-pointer text-left select-none"
              aria-expanded={isQuestionsOpen}
              aria-controls="suggested-inquiries-tray"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold transition group-hover:scale-110 shadow-2xs">
                💡
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-primary transition">
                {strings.headerTitle}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {strings.countBadge}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuestionsOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition cursor-pointer shadow-2xs active:scale-95 ${
                isQuestionsOpen
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  : "bg-navy text-white hover:bg-navy/90 font-extrabold"
              }`}
              aria-label={isQuestionsOpen ? strings.hideBtn : strings.showBtn}
            >
              <span>{isQuestionsOpen ? strings.hideBtn : strings.showBtn}</span>
              {isQuestionsOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-amber-300" />
              )}
            </button>
          </div>

          {/* AnimatePresence Sliding Drawer for Suggested Inquiries */}
          <AnimatePresence initial={false}>
            {isQuestionsOpen && (
              <motion.div
                id="suggested-inquiries-tray"
                key="suggested-inquiries-tray"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden flex flex-col gap-2 pt-0.5"
              >
                {/* Blue Chips: Student Doubts & Reality Checks */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                  <span className="shrink-0 text-xs font-bold text-blue-900 flex items-center gap-1.5 bg-blue-100/90 px-2.5 py-1 rounded-full border border-blue-300">
                    <span>🧑🔧</span>
                    <span>
                      {activeLang === "hi"
                        ? "अमन के सवाल (Student Doubts):"
                        : activeLang === "mr"
                        ? "अमनचे प्रश्न (Student Doubts):"
                        : activeLang === "bn"
                        ? "আমানের প্রশ্ন (Student Doubts):"
                        : activeLang === "ta"
                        ? "அமனின் கேள்விகள் (Student Doubts):"
                        : "Student Doubts & Reality Checks:"}
                    </span>
                  </span>
                  {studentScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        onRegularResponse();
                        if (onSelectScenario) {
                          onSelectScenario(scenario);
                        } else {
                          onSimulate("student");
                        }
                      }}
                      className="shrink-0 cursor-pointer rounded-full border border-blue-400/80 bg-blue-50/95 px-3 py-1 text-xs font-semibold text-blue-950 transition hover:border-blue-600 hover:bg-blue-100 disabled:cursor-wait disabled:opacity-50 active:scale-95 shadow-2xs"
                    >
                      {getScenarioPromptLabel(scenario, activeLang)}
                    </button>
                  ))}
                </div>

                {/* Amber Chips: Parent Practical Hesitations */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                  <span className="shrink-0 text-xs font-bold text-amber-950 flex items-center gap-1.5 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300">
                    <span>👨🦳</span>
                    <span>
                      {activeLang === "hi"
                        ? "रमेश जी की चिंताएं (Parent Doubts):"
                        : activeLang === "mr"
                        ? "रमेशजींच्या शंका (Parent Doubts):"
                        : activeLang === "bn"
                        ? "রমেশ বাবুর সংশয় (Parent Doubts):"
                        : activeLang === "ta"
                        ? "ரமேஷ் அவர்களின் கவலைகள் (Parent Doubts):"
                        : "Parent Practical Hesitations:"}
                    </span>
                  </span>
                  {parentScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        onObjectionClick();
                        if (onSelectScenario) {
                          onSelectScenario(scenario);
                        } else {
                          onSimulate("parent");
                        }
                      }}
                      className="shrink-0 cursor-pointer rounded-full border border-amber-400/80 bg-amber-50/95 px-3 py-1 text-xs font-semibold text-amber-950 transition hover:border-amber-600 hover:bg-amber-100 disabled:cursor-wait disabled:opacity-50 active:scale-95 shadow-2xs"
                    >
                      {getScenarioPromptLabel(scenario, activeLang)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dual-Mic Persona Audio Triggers (Aman - 17y vs Ramesh - 48y) */}
        <div data-tour="tour-mic-bar" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Student Voice Trigger (Aman - 17y) */}
          <button
            type="button"
            disabled={busy}
            onClick={handleSpeakAman}
            className={`w-full py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center justify-between gap-2 border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
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
            className={`w-full py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center justify-between gap-2 border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
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
