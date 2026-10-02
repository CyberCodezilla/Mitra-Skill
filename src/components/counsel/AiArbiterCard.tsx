import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Award,
  ArrowRight,
  BarChart3,
  Check,
  Clapperboard,
  Database,
  GraduationCap,
  HeartHandshake,
  Scale,
  TrendingUp,
  Users,
  Volume2,
} from "lucide-react";
import { MOCK_TRADES } from "@/data/mockTrades";
import type { Bi } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";

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

export function AiArbiterCard({
  tradeId,
  text,
  isGenerating = false,
  lang,
  onRoi,
  onAlumni,
}: {
  tradeId: string;
  text: Bi;
  isGenerating?: boolean;
  lang: Lang;
  onRoi: () => void;
  onAlumni: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;
  const metrics = trade.verified_metrics;
  const steps = lang === "hi"
    ? ["छात्र के लक्ष्य को समझना", "परिवार की चिंता पहचानना", "ट्रेड के सत्यापित तथ्य जाँचना", "संतुलित जवाब तैयार करना"]
    : ["Understand the student's goal", "Identify the family's concern", "Check verified trade evidence", "Shape a balanced response"];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), 4000);
    return () => window.clearTimeout(timer);
  }, [playing]);

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
          <h3 className="text-lg font-bold text-navy">MitraSkill Career Arbiter</h3>
          {isGenerating && (
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700" role="status">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
              </span>
              {lang === "hi" ? "जवाब तैयार हो रहा है" : "Building a balanced response"}
            </span>
          )}
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-2 ring-emerald-400/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <Award className="h-4 w-4" /> Verified DGT 2024 Audit
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
                  {lang === "hi" ? "जवाब देने से पहले" : "Before responding"}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {lang === "hi" ? "दोनों पक्षों और ट्रेड के तथ्यों को साथ देख रहा है" : "Weighing both perspectives against the trade facts"}
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
                    animate={{ opacity: index <= analysisStep ? 1 : 0.46, scale: active ? 1 : 0.99 }}
                    transition={{ duration: 0.25 }}
                    className={`relative flex min-h-11 items-center gap-2.5 overflow-hidden rounded-lg border px-3 py-2 text-xs font-semibold ${active ? "border-indigo-300 bg-white text-indigo-950 shadow-sm" : complete ? "border-emerald-100 bg-emerald-50/70 text-emerald-800" : "border-indigo-100/70 bg-white/50 text-slate-500"}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${active ? "bg-indigo-100 text-indigo-700" : complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {complete ? <Check className="h-3.5 w-3.5" /> : <StepIcon className="h-3.5 w-3.5" />}
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
            className="relative mt-4 overflow-hidden rounded-lg"
          >
            <p lang={lang} className="text-lg text-navy">
              {text[lang]}
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

      <p lang={lang} className="mt-2 border-l-2 border-success pl-3 text-sm text-muted-foreground">
        {trade.parent_reassurance_script[lang]}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          icon={<TrendingUp className="h-4 w-4" />}
          label="Starting Salary Range"
          value={`${money(metrics.salary_range_min)} – ${money(metrics.salary_range_max)} / month`}
          note={`Source: ${metrics.audit_source}`}
          verified
        />
        <Metric
          icon={<Users className="h-4 w-4" />}
          label="Verified Campus Placement"
          value={`${metrics.placement_rate_percentage}%`}
          note={`Top Recruiters: ${metrics.top_employers.slice(0, 2).join(", ")}`}
          verified
        />
      </div>
      <button
        onClick={() => setPlaying(true)}
        disabled={isGenerating}
        className="mt-5 flex items-center gap-2 rounded-full border bg-background px-4 py-2 font-medium text-navy"
        aria-pressed={playing}
      >
        <Volume2 className="h-5 w-5 text-primary" />{" "}
        {playing ? "Playing Hindi audio" : "Suno Hindi Mein / Listen Audio"}{" "}
        {playing && <Equalizer />}
      </button>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/mobility"
          onClick={(event) => { if (isGenerating) event.preventDefault(); }}
          aria-disabled={isGenerating}
          tabIndex={isGenerating ? -1 : undefined}
          className="flex items-center gap-2 rounded-xl bg-[#E87722] px-4 py-2 font-medium text-white hover:bg-[#d0681a]"
        >
          <GraduationCap className="h-5 w-5" /> View Degree Mobility (NCrF Ladder){" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onRoi}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 border-success px-4 py-2 font-medium text-success"
        >
          <BarChart3 className="h-5 w-5" /> Parent ROI Calculator (BA vs ITI)
        </button>
        <button
          onClick={onAlumni}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-medium text-slate-600"
        >
          <Clapperboard className="h-5 w-5" /> Local Alumni Story (Meerut)
        </button>
      </div>
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
