import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Cpu,
  FileSearch,
  Fan,
  GraduationCap,
  Hammer,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  MOCK_APTITUDE_SCENARIOS,
  type AptitudeScenario,
  type ScenarioOption,
} from "@/data/mockAptitudeScenarios";
import { computeCosineSimilarity } from "@/utils/arbitrationEngine";
import type { AptitudeVector, Lang } from "@/lib/app-context";

export type AptitudeDiscovery = {
  aptitudeVector: AptitudeVector;
  recommendedTradeId: string;
  tradeName: string;
  tradeNameHi: string;
  matchPercentage: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  onCompleteDiscovery: (results: AptitudeDiscovery) => void;
};

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  Wrench,
  Zap,
  Compass,
  Layers,
  Hammer,
  FileSearch,
  Fan,
  Activity,
};
const TRADE_MATCHES = [
  {
    id: "AUTO_MECH_01",
    en: "Automotive Mechatronics",
    hi: "ऑटोमोटिव मेकाट्रॉनिक्स",
    vector: [0.85, 0.92, 0.78, 0.88] as AptitudeVector,
  },
  {
    id: "SOLAR_TECH_02",
    en: "Solar PV Rooftop Technician",
    hi: "सोलर पीवी रूफटॉप तकनीशियन",
    vector: [0.72, 0.78, 0.85, 0.95] as AptitudeVector,
  },
];
const DOMAIN_KEYS = ["spatial", "mechanical", "analytical", "digital"] as const;
const DOMAIN_LABELS = {
  en: ["Spatial", "Mechanical", "Analytical", "Digital"],
  hi: ["स्थानिक समझ", "यांत्रिक", "विश्लेषणात्मक", "डिजिटल"],
};

export function VoiceAptitudeModal({ isOpen, onClose, lang, onCompleteDiscovery }: Props) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [choices, setChoices] = useState<ScenarioOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const elapsedRef = useRef(0);
  const hi = lang === "hi";
  const scenario = MOCK_APTITUDE_SCENARIOS[step]!;

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
    setPlaying(false);
  };
  const close = () => {
    stopAudio();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setChoices([]);
    setShowResults(false);
    setPlaying(false);
    setAudioSeconds(0);
    elapsedRef.current = 0;
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setPlaying(false);
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);
  useEffect(() => {
    if (!playing) return;
    elapsedRef.current = 0;
    setAudioSeconds(0);
    const timer = window.setInterval(() => {
      elapsedRef.current += 1;
      setAudioSeconds(elapsedRef.current);
      if (elapsedRef.current >= scenario.duration_secs) {
        window.speechSynthesis?.cancel();
        setPlaying(false);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, scenario.duration_secs]);
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const results = useMemo(() => {
    const mean = (key: (typeof DOMAIN_KEYS)[number]) =>
      choices.length
        ? choices.reduce((sum, option) => sum + option.domain_scores[key], 0) / choices.length
        : 0;
    const vector: AptitudeVector = [
      mean("spatial"),
      mean("mechanical"),
      mean("analytical"),
      mean("digital"),
    ];
    const matches = TRADE_MATCHES.map((trade) => ({
      ...trade,
      score: computeCosineSimilarity(vector, trade.vector),
    }));
    const recommended = matches.reduce(
      (best, next) => (next.score > best.score ? next : best),
      matches[0]!,
    );
    return {
      vector,
      matches,
      recommended,
      matchPercentage: Math.round(recommended.score * 1000) / 10,
    };
  }, [choices]);

  if (!isOpen) return null;
  const toggleAudio = () => {
    if (playing) {
      stopAudio();
      return;
    }
    elapsedRef.current = 0;
    setAudioSeconds(0);
    setPlaying(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scenario.audio_script_hi);
      utterance.lang = "hi-IN";
      utterance.rate = 0.92;
      utterance.onend = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };
  const selectOption = (option: ScenarioOption) => {
    stopAudio();
    elapsedRef.current = 0;
    setAudioSeconds(0);
    setChoices((current) => [...current, option]);
    if (step + 1 < MOCK_APTITUDE_SCENARIOS.length) setStep((current) => current + 1);
    else setShowResults(true);
  };
  const restart = () => {
    stopAudio();
    setStep(0);
    setChoices([]);
    setShowResults(false);
    setAudioSeconds(0);
    elapsedRef.current = 0;
  };
  const complete = () =>
    onCompleteDiscovery({
      aptitudeVector: results.vector,
      recommendedTradeId: results.recommended.id,
      tradeName: results.recommended.en,
      tradeNameHi: results.recommended.hi,
      matchPercentage: results.matchPercentage,
    });

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/70 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="aptitude-title"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/40 bg-sky-300/15 text-sky-200">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="aptitude-title" className="font-bold">
                {hi ? "व्यावहारिक रुचि खोजें" : "Practical Aptitude Discovery"}
              </h2>
              <p className="text-xs text-white/70">
                {hi
                  ? "3 स्थितियाँ · कोई सही या गलत उत्तर नहीं"
                  : "3 scenarios · no right or wrong answers"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close aptitude discovery"
            className="rounded-lg p-2 text-white/75 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!showResults ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-navy">
                  {hi
                    ? `स्थिति ${step + 1} / ${MOCK_APTITUDE_SCENARIOS.length}`
                    : `Scenario ${step + 1} of ${MOCK_APTITUDE_SCENARIOS.length}`}
                </p>
                <div className="flex items-center gap-1.5" aria-label={hi ? "प्रगति" : "Progress"}>
                  {MOCK_APTITUDE_SCENARIOS.map((item, index) => (
                    <span
                      key={item.id}
                      className={`h-2 rounded-full transition-all ${index === step ? "w-8 bg-primary" : index < step ? "w-5 bg-emerald-600" : "w-5 bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border bg-background p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">
                    {scenario.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{scenario.title_en}</span>
                </div>
                <p lang={lang} className="mt-4 text-base font-semibold leading-relaxed text-navy">
                  {hi ? scenario.situation_hi : scenario.situation_en}
                </p>
                <div className="mt-4 rounded-2xl bg-navy p-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={toggleAudio}
                        aria-pressed={playing}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${playing ? "bg-amber-300 text-navy" : "bg-white/15 hover:bg-white/25"}`}
                      >
                        {playing ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-bold">
                          {hi ? "हिंदी में स्थिति सुनें" : "Listen to scenario in Hindi"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/70">
                          {hi
                            ? "ब्राउज़र वॉइस · कोई रिकॉर्डिंग नहीं"
                            : "Browser voice · nothing is recorded"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-white/75">
                      {playing ? audioSeconds : 0}s / {scenario.duration_secs}s
                    </span>
                  </div>
                  <div
                    className="mt-4 flex h-8 items-center justify-center gap-1"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 29 }, (_, index) => (
                      <motion.span
                        key={index}
                        className={`w-1 rounded-full ${playing ? "bg-amber-300" : "bg-white/30"}`}
                        animate={
                          playing
                            ? { height: [5, 9 + ((index * 7) % 24), 6 + ((index * 3) % 17)] }
                            : { height: 5 }
                        }
                        transition={{
                          duration: 0.45 + (index % 4) * 0.12,
                          repeat: playing ? Infinity : 0,
                          repeatType: "reverse",
                          delay: index * 0.02,
                        }}
                      />
                    ))}
                  </div>
                  <p
                    lang="hi"
                    className="mt-3 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/85"
                  >
                    {scenario.audio_script_hi}
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-navy">
                    {hi ? "आप क्या करेंगे?" : "What would you do?"}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {hi ? "विकल्प चुनें" : "Choose one response"}
                  </span>
                </div>
                <div className="grid gap-3">
                  {scenario.options.map((option) => {
                    const Icon = ICONS[option.icon_name] ?? Wrench;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selectOption(option)}
                        className="group flex items-start gap-3 rounded-2xl border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:bg-accent/40 hover:shadow-md"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-navy transition group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="pt-0.5 text-sm font-medium leading-relaxed text-navy">
                          {hi ? option.text_hi : option.text_en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-blue-950">
                {hi
                  ? "यह छोटा अभ्यास रुचियों पर विचार करने का तरीका है, प्रमाणित मनोमितीय परीक्षण नहीं। माइक्रोफ़ोन नहीं खुलता और कोई आवाज़ रिकॉर्ड नहीं होती।"
                  : "This short exercise is a way to reflect on interests, not a validated psychometric test. It does not access your microphone or record speech."}
              </p>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    stopAudio();
                    setStep((current) => current - 1);
                    setChoices((current) => current.slice(0, -1));
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {hi ? "पिछली स्थिति" : "Previous scenario"}
                </button>
              )}
            </div>
          ) : (
            <Results
              lang={lang}
              vector={results.vector}
              matches={results.matches}
              recommended={results.recommended}
              matchPercentage={results.matchPercentage}
              onRetake={restart}
              onComplete={complete}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function Results({
  lang,
  vector,
  matches,
  recommended,
  matchPercentage,
  onRetake,
  onComplete,
}: {
  lang: Lang;
  vector: AptitudeVector;
  matches: { id: string; en: string; hi: string; vector: AptitudeVector; score: number }[];
  recommended: { id: string; en: string; hi: string; vector: AptitudeVector; score: number };
  matchPercentage: number;
  onRetake: () => void;
  onComplete: () => void;
}) {
  const hi = lang === "hi";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />
        <h3 className="mt-2 text-lg font-bold text-emerald-950">
          {hi ? "आपका रुचि-सारांश तैयार है" : "Your interest snapshot is ready"}
        </h3>
        <p className="mt-1 text-sm text-emerald-900">
          {hi
            ? "यह आपके चुने हुए उत्तरों का डेमो सारांश है—स्थायी क्षमता का माप नहीं।"
            : "A demo summary of your choices—not a measure of fixed ability."}
        </p>
      </div>
      <section className="rounded-2xl border bg-background p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <h3 className="font-bold text-navy">
            {hi ? "रुचि वेक्टर" : "Interest vector"} · [Spatial, Mechanical, Analytical, Digital]
          </h3>
          <code className="rounded-lg bg-muted px-2 py-1 text-xs font-bold text-navy">
            [{vector.map((value) => value.toFixed(2)).join(", ")}]
          </code>
        </div>
        <div className="mt-4 space-y-3">
          {DOMAIN_KEYS.map((domain, index) => (
            <div key={domain} className="grid grid-cols-[100px_1fr_42px] items-center gap-3">
              <span className="text-xs font-semibold text-navy">{DOMAIN_LABELS[lang][index]}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${vector[index]! * 100}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className={`h-full rounded-full ${["bg-blue-600", "bg-amber-600", "bg-emerald-600", "bg-indigo-600"][index]}`}
                />
              </div>
              <span className="text-right font-mono text-xs font-bold text-navy">
                {Math.round(vector[index]! * 100)}%
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border-2 border-amber-400/60 bg-amber-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-950">
            {hi ? "ट्रेड समानता · उदाहरण" : "Trade affinity · illustrative"}
          </p>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-950">
            {matchPercentage}% cosine similarity
          </span>
        </div>
        <h4 className="mt-3 flex items-center gap-2 text-base font-bold text-navy">
          <GraduationCap className="h-5 w-5 text-primary" />
          {hi ? recommended.hi : recommended.en}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          {hi
            ? "अंतिम चयन छात्र और परिवार का है। प्रवेश, रोजगार या सफलता की गारंटी नहीं।"
            : "The learner and family make the final choice. This does not guarantee admission, employment, or success."}
        </p>
        <div className="mt-4 space-y-2">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-navy">{hi ? match.hi : match.en}</span>
              <span className="font-mono font-bold text-muted-foreground">
                {(match.score * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm font-bold text-navy transition hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          {hi ? "दोबारा करें" : "Retake"}
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-105"
        >
          {hi ? "चुने गए ट्रेड के साथ आगे बढ़ें" : "Continue with this trade"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
