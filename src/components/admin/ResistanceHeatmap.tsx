import { useState } from "react";
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import type { Lang } from "@/lib/app-context";

type Block = {
  name: string;
  sessions: number;
  resistance: number;
  objection: string;
  action: string;
};
const blocks: Block[] = [
  {
    name: "Meerut Sadar",
    sessions: 1420,
    resistance: 24,
    objection: "Wage Skepticism",
    action: "Expand local NAPS industry tie-ups",
  },
  {
    name: "Mawana",
    sessions: 1180,
    resistance: 48,
    objection: "Social Prestige",
    action: "Run ITI alumni village felicitation",
  },
  {
    name: "Sardhana",
    sessions: 1210,
    resistance: 67,
    objection: "Female Safety",
    action: "Deploy dedicated women's ITI bus route",
  },
  {
    name: "Daurala",
    sessions: 1011,
    resistance: 39,
    objection: "Degree Mobility",
    action: "Distribute NCrF ladder flyers in schools",
  },
];
const levels = ["Low", "Medium", "High"];

export function ResistanceHeatmap({ lang, district }: { lang: Lang; district: string }) {
  const hi = lang === "hi";
  const [selected, setSelected] = useState<string | null>(null);
  const scoped =
    district === "Meerut"
      ? blocks
      : blocks.map((block, index) => ({
          ...block,
          sessions: Math.round(
            block.sessions *
              (district === "Ghaziabad" ? 0.82 : district === "Varanasi" ? 0.67 : 0.73),
          ),
          resistance: Math.max(18, Math.min(82, block.resistance + (index % 2 ? 9 : -4))),
        }));
  const active = scoped.find((block) => block.name === selected);
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
          <MapPin className="h-5 w-5 text-primary" />
          {hi ? "जिला प्रतिरोध और भावना" : "District resistance & sentiment"}
        </h2>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-navy">
          {district} · {hi ? "नमूना टेलीमेट्री" : "Sample telemetry"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {scoped.map((block) => {
          const levelIndex = block.resistance < 35 ? 0 : block.resistance < 60 ? 1 : 2;
          const selectedBlock = selected === block.name;
          return (
            <button
              key={block.name}
              onClick={() => setSelected(selectedBlock ? null : block.name)}
              aria-pressed={selectedBlock}
              className={`rounded-xl border p-4 text-left transition hover:shadow-card ${selectedBlock ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-navy">{block.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${levelIndex === 0 ? "bg-emerald-100 text-emerald-800" : levelIndex === 1 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}
                >
                  {levelIndex === 0 ? (
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                  ) : levelIndex === 2 ? (
                    <AlertTriangle className="mr-1 inline h-3.5 w-3.5 animate-pulse" />
                  ) : null}
                  {hi ? ["कम", "मध्यम", "उच्च"][levelIndex] : levels[levelIndex]} ·{" "}
                  {block.resistance}%
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">{hi ? "सत्र" : "Sessions"}</span>
                <b className="text-navy">{block.sessions.toLocaleString("en-IN")}</b>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {hi ? "मुख्य चिंता" : "Top objection"}:{" "}
                <span className="font-medium text-navy">{block.objection}</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {hi ? "अनुशंसित कार्रवाई" : "Recommended action"}:{" "}
                <span className="font-medium text-navy">{block.action}</span>
              </div>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="mt-4 rounded-xl bg-navy p-4 text-white">
          <div className="text-xs uppercase tracking-wide text-white/60">
            {hi ? "चयनित क्षेत्र" : "Selected sub-district"}
          </div>
          <div className="mt-1 font-bold">
            {active.name}: {active.sessions.toLocaleString("en-IN")} {hi ? "सत्र" : "sessions"}
          </div>
          <p className="mt-1 text-sm text-white/80">{active.action}</p>
        </div>
      )}
    </section>
  );
}
