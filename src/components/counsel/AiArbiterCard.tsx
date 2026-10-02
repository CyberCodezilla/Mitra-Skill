import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  Clapperboard,
  GraduationCap,
  ArrowRight,
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

export function AiArbiterCard({
  tradeId,
  text,
  visibleText,
  isGenerating = false,
  lang,
  onRoi,
  onAlumni,
}: {
  tradeId: string;
  text: Bi;
  visibleText?: string;
  isGenerating?: boolean;
  lang: Lang;
  onRoi: () => void;
  onAlumni: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;
  const metrics = trade.verified_metrics;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), 4000);
    return () => window.clearTimeout(timer);
  }, [playing]);
  useEffect(() => {
    if (!isGenerating) return;
    const timer = window.setInterval(() => setAnalysisStep((step) => (step + 1) % 3), 1100);
    return () => window.clearInterval(timer);
  }, [isGenerating]);
  const analysisLabel = lang === "hi"
    ? ["दोनों की बात समझ रहा है", "चिंता पर विचार कर रहा है", "जवाब तैयार कर रहा है"][analysisStep]
    : ["Listening to both perspectives", "Considering the concern", "Preparing a balanced response"][analysisStep];
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
              {analysisLabel}
            </span>
          )}
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-2 ring-emerald-400/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <Award className="h-4 w-4" /> Verified DGT 2024 Audit
        </span>
      </div>
      <p lang={lang} className="mt-4 text-lg text-navy">
        {isGenerating ? visibleText : text[lang]}
        {isGenerating && (
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-primary align-text-bottom" aria-hidden="true" />
        )}
      </p>
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
