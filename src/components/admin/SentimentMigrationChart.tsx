import { useState } from "react";
import { ArrowRight, ChartNoAxesCombined, Info } from "lucide-react";
import { MOCK_SENTIMENT_COHORTS, type TradeSentimentCohort } from "@/data/mockSentimentTelemetry";
import type { Lang } from "@/lib/app-context";

type CohortKey = "ALL_TRADES" | "AUTO_MECH_01" | "SOLAR_TECH_02";

const stages = [
  {
    key: "resistant_percent",
    color: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
    label: "Resistant",
    labelHi: "असहमत",
  },
  {
    key: "skeptical_percent",
    color: "bg-amber-400",
    text: "text-amber-700 dark:text-amber-300",
    label: "Skeptical",
    labelHi: "संशय में",
  },
  {
    key: "receptive_percent",
    color: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Receptive",
    labelHi: "सहमत",
  },
] as const;

function DistributionBar({
  cohort,
  phase,
  lang,
}: {
  cohort: TradeSentimentCohort;
  phase: "pre_session" | "post_session";
  lang: Lang;
}) {
  const distribution = cohort[phase];
  const phaseLabel =
    phase === "pre_session"
      ? lang === "hi"
        ? "बातचीत से पहले"
        : "Before session"
      : lang === "hi"
        ? "बातचीत के बाद"
        : "After session";
  const values = [
    distribution.resistant_percent,
    distribution.skeptical_percent,
    distribution.receptive_percent,
  ];
  const description = stages
    .map((stage, index) => `${lang === "hi" ? stage.labelHi : stage.label}: ${values[index] ?? 0}%`)
    .join(", ");

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">{phaseLabel}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <div
        role="img"
        aria-label={`${phaseLabel}: ${description}`}
        className="flex h-12 w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border"
      >
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            title={`${lang === "hi" ? stage.labelHi : stage.label}: ${values[index]}%`}
            className={`${stage.color} flex min-w-0 items-center justify-center text-xs font-bold text-white transition-[width] duration-700 ease-out`}
            style={{ width: `${values[index]}%` }}
          >
            {(values[index] ?? 0) >= 12 && <span>{values[index]}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SentimentMigrationChart({ lang = "en" }: { lang?: Lang }) {
  const [selected, setSelected] = useState<CohortKey>("ALL_TRADES");
  const hi = lang === "hi";
  const cohort = MOCK_SENTIMENT_COHORTS[selected]!;
  const shift = Number(
    (cohort.post_session.receptive_percent - cohort.pre_session.receptive_percent).toFixed(1),
  );
  const filters: { key: CohortKey; label: string; labelHi: string }[] = [
    { key: "ALL_TRADES", label: "All trades", labelHi: "सभी ट्रेड" },
    { key: "AUTO_MECH_01", label: "Automotive", labelHi: "ऑटोमोटिव" },
    { key: "SOLAR_TECH_02", label: "Solar", labelHi: "सोलर" },
  ];

  return (
    <section
      aria-labelledby="sentiment-migration-title"
      className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-card sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            <ChartNoAxesCombined className="h-4 w-4" />
            {hi ? "भावना का बदलाव" : "Sentiment migration"}
          </div>
          <h2 id="sentiment-migration-title" className="mt-1 text-lg font-bold text-foreground">
            {hi ? "बातचीत से पहले और बाद का रुझान" : "Before-and-after stance distribution"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hi
              ? "परिवारों के रुझान का उदाहरणात्मक सार"
              : "Illustrative view of family stance across a session"}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={hi ? "ट्रेड चुनें" : "Choose trade cohort"}
        >
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              aria-pressed={selected === filter.key}
              onClick={() => setSelected(filter.key)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${selected === filter.key ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950" : "border-border bg-background text-muted-foreground hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"}`}
            >
              {hi ? filter.labelHi : filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-5">
          <DistributionBar cohort={cohort} phase="pre_session" lang={lang} />
          <DistributionBar cohort={cohort} phase="post_session" lang={lang} />
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {stages.map((stage) => (
              <span
                key={stage.key}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className={`h-2.5 w-2.5 rounded-sm ${stage.color}`} />
                {hi ? stage.labelHi : stage.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            {hi ? "सकारात्मक रुझान में बदलाव" : "Receptive stance shift"}
          </span>
          <div className="mt-1 flex items-center gap-1 text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-200">
            <ArrowRight className="h-5 w-5" />+{shift}
            <span className="text-base">pp</span>
          </div>
          <span className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-200/80">
            {hi ? "प्रतिशत-अंक (उदाहरण)" : "percentage points (illustrative)"}
          </span>
          <div className="mt-4 border-t border-emerald-200 pt-3 text-xs text-muted-foreground dark:border-emerald-900">
            {hi ? "उदाहरणात्मक समूह आकार" : "Illustrative cohort size"}:{" "}
            <strong className="text-foreground">{cohort.sample_size.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">
            {hi ? "संभावित सहायक हस्तक्षेप" : "Example intervention attribution"}
          </h3>
          <span className="text-xs text-muted-foreground">
            {hi ? "केवल उदाहरणात्मक हिस्सेदारी" : "Illustrative attribution shares"}
          </span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cohort.top_effective_interventions.map((intervention) => (
            <div
              key={intervention.intervention_name}
              className="rounded-xl border border-border bg-background/70 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold leading-snug text-foreground">
                  {hi ? intervention.intervention_name_hi : intervention.intervention_name}
                </span>
                <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {intervention.share_percentage}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                  style={{ width: `${intervention.share_percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {hi ? intervention.description_hi : intervention.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 flex gap-2 rounded-xl bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {hi
            ? "डेमो के लिए सभी आंकड़े कृत्रिम और उदाहरणात्मक हैं—ये वास्तविक परिवारों के परिणाम, मापे गए प्रभाव या कारणात्मक प्रमाण नहीं हैं। इन्हें वास्तविक, सहमति-आधारित डेटा से बदलें।"
            : "All values are synthetic examples for the demo—not observed family outcomes, measured effects, or causal evidence. Replace them with sourced, consented data before operational use."}
        </span>
      </p>
    </section>
  );
}
