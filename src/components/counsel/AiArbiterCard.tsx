import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clapperboard,
  Database,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  Volume2,
} from "lucide-react";
import { MOCK_TRADES } from "@/data/mockTrades";
import type { Bi } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { FacilityVerificationModal } from "@/components/counsel/FacilityVerificationModal";
import { CenterLocatorModal } from "@/components/counsel/CenterLocatorModal";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import { DYADIC_DIALOGUES } from "@/data/dialogueScripts";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ARBITER_EVIDENCE,
  EVIDENCE_LOADING_TEXT,
  type ArbiterTopic,
  type EvidenceMetricItem,
  type TopicEvidence,
} from "@/data/arbiterEvidence";

export function Equalizer() {
  return (
    <span className="flex h-5 items-end gap-1" aria-label="Audio playing">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="wave-bar h-full w-1.5 rounded bg-success"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

const processIcons = [GraduationCap, HeartHandshake, Database, Scale];

const ANALYSIS_STEPS: Record<SupportedLanguage, string[]> = {
  en: [
    "Understand the student's goal",
    "Identify the family's concern",
    "Check verified trade evidence",
    "Shape a balanced response",
  ],
  hi: [
    "छात्र के लक्ष्य को समझना",
    "परिवार की चिंता पहचानना",
    "ट्रेड के सत्यापित तथ्य जाँचना",
    "संतुलित जवाब तैयार करना",
  ],
  mr: [
    "विद्यार्थ्याचे ध्येय समजून घेणे",
    "पालकांची चिंता ओळखणे",
    "प्रमाणित कौशल्य तथ्ये तपासणे",
    "संतुलित उत्तर तयार करणे",
  ],
  bn: [
    "ছাত্রের লক্ষ্য বিশ্লেষণ করা",
    "অভিভাবকের উদ্বেগ চিহ্নিত করা",
    "যাচাইকৃত কোর্সের তথ্য যাচাই করা",
    "ভারসাম্যপূর্ণ উত্তর প্রস্তুত করা",
  ],
  ta: [
    "மாணவரின் இலக்கை புரிந்துகொள்ளுதல்",
    "பெற்றோரின் கவலையை அறிதல்",
    "சரிபார்க்கப்பட்ட தொழில் சான்றுகளை ஆய்வு செய்தல்",
    "சமநிலையான பதிலை உருவாக்குதல்",
  ],
};

const STATUS_TEXTS: Record<
  SupportedLanguage,
  {
    generating: string;
    beforeResponse: string;
    weighing: string;
    speakingStop: string;
    escalate: string;
  }
> = {
  en: {
    generating: "Building a balanced response",
    beforeResponse: "Before responding",
    weighing: "Weighing both perspectives against the trade facts",
    speakingStop: "Arbiter Speaking · stop",
    escalate: "Escalate to District Counsellor",
  },
  hi: {
    generating: "जवाब तैयार हो रहा है",
    beforeResponse: "जवाब देने से पहले",
    weighing: "दोनों पक्षों और ट्रेड के तथ्यों को साथ देख रहा है",
    speakingStop: "आर्बिटर बोल रहा है · रोकें",
    escalate: "जिला काउंसलर से बात करें",
  },
  mr: {
    generating: "संतुलित उत्तर तयार होत आहे",
    beforeResponse: "उत्तर देण्यापूर्वी",
    weighing: "दोन्ही बाजू आणि कौशल्याची सत्यता पडताळत आहे",
    speakingStop: "लवाद बोलत आहे · थांबवा",
    escalate: "जिल्हा समुपदेशकांशी बोला",
  },
  bn: {
    generating: "ভারসাম্যপূর্ণ প্রতিক্রিয়া তৈরি হচ্ছে",
    beforeResponse: "উত্তর দেওয়ার আগে",
    weighing: "উভয় দৃষ্টিভঙ্গি ও কোর্সের সত্যতা যাচাই করা হচ্ছে",
    speakingStop: "সালিশকারী বলছেন · থামান",
    escalate: "জেলা কাউন্সেলরের সাথে কথা বলুন",
  },
  ta: {
    generating: "சமநிலையான பதில் தயாராகிறது",
    beforeResponse: "பதிலளிப்பதற்கு முன்",
    weighing: "இரு தரப்பு கருத்துக்களையும் தொழில் உண்மைகளையும் ஒப்பிடுகிறது",
    speakingStop: "மத்தியஸ்தர் பேசுகிறார் · நிறுத்து",
    escalate: "மாவட்ட ஆலோசகரிடம் தொடர்பு கொள்ளவும்",
  },
};

export function AiArbiterCard({
  tradeId,
  text,
  topic = "opening",
  isGenerating = false,
  lang,
  onRoi,
  onAlumni,
  onEscalate,
}: {
  tradeId: string;
  text: Bi;
  topic?: ArbiterTopic | undefined;
  isGenerating?: boolean;
  lang: SupportedLanguage | Lang;
  onRoi: () => void;
  onAlumni: () => void;
  onEscalate: () => void;
}) {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(true);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isLocatorOpen, setIsLocatorOpen] = useState(false);
  const { speak, stop, isSpeaking, currentSpeakingPersona } = useIndicVoice();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.counsel;
  const activeLang: SupportedLanguage =
    (language in DYADIC_DIALOGUES
      ? language
      : (lang as SupportedLanguage)) || "hi";
  const dialogue = DYADIC_DIALOGUES[activeLang] || DYADIC_DIALOGUES.hi;
  const statusText = STATUS_TEXTS[activeLang] || STATUS_TEXTS.hi;
  const steps = ANALYSIS_STEPS[activeLang] || ANALYSIS_STEPS.hi;

  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;

  // Resolve active topic evidence
  const activeTopic: ArbiterTopic = topic || "opening";
  const defaultEvidence = ARBITER_EVIDENCE["AUTO_MECH_01"]!;
  const tradeEvidence = ARBITER_EVIDENCE[tradeId] ?? defaultEvidence;
  const topicData: TopicEvidence = tradeEvidence[activeTopic] ?? tradeEvidence["opening"]!;

  const arbiterText =
    text[activeLang] || text.hi || text.en || dialogue.arbiterRebuttal;
  const reassuranceText =
    topicData.reassurance[activeLang] ||
    topicData.reassurance.hi ||
    topicData.reassurance.en ||
    trade.parent_reassurance_script?.[activeLang] ||
    c.arbiterReassurance;

  const handlePlayArbiter = () => {
    if (isSpeaking && currentSpeakingPersona === "arbiter") {
      stop();
    } else {
      speak(arbiterText, "arbiter", activeLang);
    }
  };

  useEffect(() => {
    if (!isGenerating) return;
    setAnalysisStep(0);
    const timer = window.setInterval(() => setAnalysisStep((step) => Math.min(step + 1, 3)), 760);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  // Loading animation management for the green box evidence section
  useEffect(() => {
    setIsEvidenceLoading(true);
    const timer = window.setTimeout(() => {
      setIsEvidenceLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [topic, tradeId]);

  const prevGenerating = useRef(isGenerating);
  useEffect(() => {
    let timer: number | undefined;
    if (prevGenerating.current && !isGenerating) {
      setIsEvidenceLoading(true);
      timer = window.setTimeout(() => {
        setIsEvidenceLoading(false);
      }, 700);
    }
    prevGenerating.current = isGenerating;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isGenerating]);

  const showEvidenceLoading = isEvidenceLoading || isGenerating;

  return (
    <article className="rounded-2xl border-2 border-indigo-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-saffron bg-navy text-navy-foreground">
          <Award className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold text-navy">{c.arbiterTitle}</h3>
          {isGenerating && (
            <span
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700"
              role="status"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
              </span>
              {statusText.generating}
            </span>
          )}
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-950">
          <Award className="h-4 w-4" />{" "}
          <span>{c.verifiedAuditTag}</span>
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isGenerating ? (
          <motion.div
            key="arbiter-process"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="status"
            aria-live="polite"
            className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-amber-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-navy">
                  {statusText.beforeResponse}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {statusText.weighing}
                </div>
              </div>
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-indigo-100"
                animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Award className="h-4 w-4" />
              </motion.span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {steps.map((step, index) => {
                const complete = index < analysisStep;
                const active = index === analysisStep;
                const StepIcon = processIcons[index]!;
                return (
                  <motion.div
                    key={step}
                    animate={{
                      opacity: index <= analysisStep ? 1 : 0.46,
                      scale: active ? 1 : 0.99,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`relative flex min-h-11 items-center gap-2.5 overflow-hidden rounded-lg border px-3 py-2 text-xs font-semibold ${active ? "border-indigo-300 bg-white text-indigo-950 shadow-sm" : complete ? "border-emerald-100 bg-emerald-50/70 text-emerald-800" : "border-indigo-100/70 bg-white/50 text-slate-500"}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${active ? "bg-indigo-100 text-indigo-700" : complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {complete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="relative z-10">{step}</span>
                    {active && (
                      <motion.span
                        layoutId="arbiter-analysis-marker"
                        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-indigo-500"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="arbiter-answer"
            initial={{ opacity: 0, filter: "blur(9px)", y: 5 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-4 overflow-hidden rounded-xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/40 via-white to-amber-50/30 p-4 sm:p-5"
          >
            <p lang={activeLang} className="text-base sm:text-lg font-medium leading-relaxed text-navy break-words">
              {arbiterText}
            </p>
            <motion.span
              aria-hidden="true"
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 0.95, delay: 0.08, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showEvidenceLoading ? (
          <motion.div
            key={`evidence-loading-${activeTopic}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
            role="status"
            aria-label="Verifying audited evidence"
          >
            {/* Live Telemetry Ping Banner */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-300/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 px-3 py-2 text-xs font-semibold text-emerald-900 dark:border-emerald-800/50 dark:from-emerald-950/50 dark:via-teal-950/30 dark:to-emerald-950/50 dark:text-emerald-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                </span>
                <span className="truncate">
                  {EVIDENCE_LOADING_TEXT[activeLang] || EVIDENCE_LOADING_TEXT.hi}
                </span>
              </div>
              <span className="flex h-3.5 items-end gap-0.5 shrink-0" aria-hidden="true">
                <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>

            {/* Reassurance skeleton */}
            <div className="border-l-2 border-emerald-400/50 pl-3 py-1 space-y-1.5">
              <div className="h-3.5 w-11/12 rounded bg-emerald-100/70 dark:bg-emerald-950/60 animate-pulse" />
              <div className="h-3.5 w-4/5 rounded bg-emerald-100/50 dark:bg-emerald-950/40 animate-pulse" />
            </div>

            {/* Metric skeletons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-200/80 dark:bg-emerald-800/60 animate-pulse" />
                  <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="mt-2.5 h-6 w-32 rounded bg-emerald-200/80 dark:bg-emerald-800/70 animate-pulse" />
                <div className="mt-2 h-3 w-40 rounded bg-slate-200/70 dark:bg-slate-800/50 animate-pulse" />
                <motion.span
                  aria-hidden="true"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-200/80 dark:bg-emerald-800/60 animate-pulse" />
                  <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="mt-2.5 h-6 w-20 rounded bg-emerald-200/80 dark:bg-emerald-800/70 animate-pulse" />
                <div className="mt-2 h-3 w-36 rounded bg-slate-200/70 dark:bg-slate-800/50 animate-pulse" />
                <motion.span
                  aria-hidden="true"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`evidence-ready-${activeTopic}`}
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-4"
          >
            {/* The Green Left-Bordered Reassurance Quote */}
            <p
              lang={activeLang}
              className="border-l-2 border-success pl-3 text-xs sm:text-sm leading-relaxed text-muted-foreground break-words"
            >
              {reassuranceText}
            </p>

            {/* The 2 Dynamic Metric Cards with Highlight */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {topicData.metrics.map((metric) => (
                <EvidenceMetricCard
                  key={metric.id}
                  metric={metric}
                  lang={activeLang}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={handlePlayArbiter}
        disabled={isGenerating}
        className={`mt-5 flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition-all cursor-pointer ${
          isSpeaking && currentSpeakingPersona === "arbiter"
            ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20"
            : "border-border bg-background text-navy hover:bg-accent/40"
        }`}
        aria-pressed={isSpeaking && currentSpeakingPersona === "arbiter"}
      >
        <Volume2 className="h-5 w-5 text-primary" />{" "}
        {isSpeaking && currentSpeakingPersona === "arbiter"
          ? statusText.speakingStop
          : `🔊 ${c.audioBtn}`}{" "}
        {isSpeaking && currentSpeakingPersona === "arbiter" && <Equalizer />}
      </button>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsFacilityModalOpen(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border border-emerald-700/35 bg-emerald-50 px-4 py-2 font-semibold text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Building2 className="h-4 w-4 text-emerald-800" />
          {c.facilityBtn}
        </button>
        <button
          type="button"
          onClick={() => setIsLocatorOpen(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border border-teal-700/30 bg-teal-50 px-4 py-2 font-semibold text-teal-950 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-teal-300/30 dark:bg-teal-950/40 dark:text-teal-100 dark:hover:bg-teal-900/60"
        >
          <MapPin className="h-4 w-4" />{" "}
          {c.seatsBtn}
        </button>
        <button
          onClick={onEscalate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-accent/50 px-4 py-2 font-medium text-navy transition hover:border-primary hover:bg-accent disabled:opacity-50"
        >
          <Users className="h-5 w-5" />{" "}
          {statusText.escalate}
        </button>
        <Link
          to="/mobility"
          onClick={(event) => {
            if (isGenerating) event.preventDefault();
          }}
          aria-disabled={isGenerating}
          tabIndex={isGenerating ? -1 : undefined}
          className="flex items-center gap-2 rounded-xl bg-[#E87722] px-4 py-2 font-medium text-white hover:bg-[#d0681a]"
        >
          <GraduationCap className="h-5 w-5" /> {c.mobilityBtn}{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onRoi}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 border-success px-4 py-2 font-medium text-success"
        >
          <BarChart3 className="h-5 w-5" /> {c.roiBtn}
        </button>
        <button
          onClick={onAlumni}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-medium text-slate-600"
        >
          <Clapperboard className="h-5 w-5" /> {c.alumniBtn}
        </button>
      </div>
      <FacilityVerificationModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        lang={activeLang}
        tradeId={tradeId}
      />
      <CenterLocatorModal
        isOpen={isLocatorOpen}
        onClose={() => setIsLocatorOpen(false)}
        lang={activeLang}
      />
    </article>
  );
}

function renderMetricIcon(iconType: EvidenceMetricItem["iconType"]) {
  switch (iconType) {
    case "salary":
      return <TrendingUp className="h-3.5 w-3.5" />;
    case "placement":
      return <Users className="h-3.5 w-3.5" />;
    case "credits":
      return <GraduationCap className="h-3.5 w-3.5" />;
    case "safety":
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case "environment":
      return <Building2 className="h-3.5 w-3.5" />;
    case "demand":
      return <BarChart3 className="h-3.5 w-3.5" />;
    case "stipend":
      return <Award className="h-3.5 w-3.5" />;
    default:
      return <TrendingUp className="h-3.5 w-3.5" />;
  }
}

function EvidenceMetricCard({
  metric,
  lang,
}: {
  metric: EvidenceMetricItem;
  lang: SupportedLanguage;
}) {
  const isFocus = metric.isFocus;
  const labelText = metric.label[lang] || metric.label.en;
  const valueText = metric.value[lang] || metric.value.en;
  const noteText = metric.note[lang] || metric.note.en;
  const badgeText = metric.focusBadge?.[lang] || metric.focusBadge?.en;

  if (isFocus) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-teal-50/80 p-3 sm:p-4 shadow-md ring-2 ring-emerald-400/40 dark:border-emerald-400 dark:from-emerald-950/70 dark:via-emerald-900/40 dark:to-teal-950/50 transition-all duration-300">
        {/* Focus Target Badge Pill */}
        <div className="mb-2 flex items-center justify-between gap-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-85" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span>{badgeText || "FOCUS TARGET"}</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">AUDITED</span>
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs">
            {renderMetricIcon(metric.iconType)}
          </span>
          <span className="truncate">{labelText}</span>
        </div>

        {/* Highlighted Value */}
        <div className="mt-1.5 text-lg font-black text-emerald-800 dark:text-emerald-300 sm:text-xl tracking-tight">
          {valueText}
        </div>

        {/* Note / Citation */}
        <div className="mt-1 text-[11px] leading-snug text-emerald-800/90 dark:text-emerald-300/80 font-medium">
          {noteText}
        </div>

        {/* Ambient sweep overlay on mount */}
        <motion.span
          aria-hidden="true"
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.1, delay: 0.1, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 transition-all duration-300">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {renderMetricIcon(metric.iconType)}
        </span>
        <span className="truncate">{labelText}</span>
      </div>
      <div className="mt-1.5 text-lg font-bold text-navy dark:text-slate-100 sm:text-xl">
        {valueText}
      </div>
      <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {noteText}
      </div>
    </div>
  );
}
