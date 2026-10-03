import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Award,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Clapperboard,
  Database,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Scale,
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
  isGenerating = false,
  lang,
  onRoi,
  onAlumni,
  onEscalate,
}: {
  tradeId: string;
  text: Bi;
  isGenerating?: boolean;
  lang: SupportedLanguage | Lang;
  onRoi: () => void;
  onAlumni: () => void;
  onEscalate: () => void;
}) {
  const [analysisStep, setAnalysisStep] = useState(0);
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
  const metrics = trade.verified_metrics;

  const arbiterText =
    text[activeLang] || text.hi || text.en || dialogue.arbiterRebuttal;
  const reassuranceText =
    trade.parent_reassurance_script?.[activeLang] ||
    trade.parent_reassurance_script?.hi ||
    trade.parent_reassurance_script?.en ||
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

  const money = (number: number) => `₹${number.toLocaleString("en-IN")}`;

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

      <p lang={activeLang} className="mt-3 border-l-2 border-success pl-3 text-xs sm:text-sm leading-relaxed text-muted-foreground break-words">
        {reassuranceText}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          icon={<TrendingUp className="h-4 w-4" />}
          label={c.salaryCardTitle}
          value={`${money(metrics.salary_range_min)} – ${money(metrics.salary_range_max)} / month`}
          note={`${c.salaryCardSource} · ${metrics.audit_source}`}
          verified
        />
        <Metric
          icon={<Users className="h-4 w-4" />}
          label={c.placementCardTitle}
          value={`${metrics.placement_rate_percentage}%`}
          note={`${c.placementCardRecruiters}: ${metrics.top_employers.slice(0, 2).join(", ")}`}
          verified
        />
      </div>
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

function Metric({
  icon,
  label,
  value,
  note,
  verified,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-xl bg-muted p-3 sm:p-4">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold sm:text-xl ${verified ? "text-emerald-700" : "text-navy"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{note}</div>
    </div>
  );
}
