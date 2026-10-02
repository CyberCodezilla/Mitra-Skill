import { motion } from "framer-motion";
import { Calculator, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import type { TradeRecord } from "@/data/mockTrades";

export function CreditMathExplainer({
  trade,
  lang,
  playing,
  onPlay,
}: {
  trade: TradeRecord;
  lang: Lang;
  playing: boolean;
  onPlay: () => void;
}) {
  const hi = lang === "hi";
  const hours = trade.duration_months * 100;
  const credits = trade.ncrf_mobility.credits_earned;
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy">
            {hi ? "क्रेडिट का हिसाब" : "How credit hours add up"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hi
              ? "सीखने का समय क्रेडिट में बदलता है।"
              : "Learning time is counted as transferable credit."}
          </p>
        </div>
        <button
          onClick={onPlay}
          aria-pressed={playing}
          className="flex items-center gap-2 rounded-full border border-success px-3 py-2 text-sm font-semibold text-success"
        >
          🔊{" "}
          {playing
            ? hi
              ? "ऑडियो चल रहा है"
              : "Playing Hindi audio"
            : hi
              ? "NCrF नियम सुनें"
              : "Listen to NCrF Rules in Hindi"}
          {playing && <Wave />}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-accent p-3 text-center font-bold text-navy sm:text-lg">
        <span>30 {hi ? "सीखने के घंटे" : "Notional Learning Hours"}</span>
        <span className="text-primary">=</span>
        <span>1 {hi ? "अकादमिक क्रेडिट" : "Academic Credit"}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MathTile
          label={hi ? "1-वर्षीय ट्रेड का उदाहरण" : "1-year trade example"}
          value="1,200 Hours = 40 Credits"
        />
        <MathTile
          label={hi ? "2-वर्षीय ट्रेड का उदाहरण" : "2-year trade example"}
          value="2,400 Hours = 80 Credits"
        />
        <MathTile
          label={hi ? "इस चयनित ट्रेड में" : "Selected trade"}
          value={`${hours.toLocaleString("en-IN")} Hours = ${credits} Credits`}
          highlight
        />
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-navy">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <p>
          {hi
            ? "NCrF राष्ट्रीय क्रेडिट ढांचा देता है। क्रेडिट की स्वीकृति और पॉलिटेक्निक में छूट संबंधित प्रवेश प्राधिकरण के नियमों के अनुसार होती है।"
            : "NCrF provides a national credit framework. Credit acceptance and any Polytechnic exemption are subject to the admitting authority’s rules."}
        </p>
      </div>
    </section>
  );
}
function MathTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-navy text-white" : "bg-muted text-navy"}`}>
      <div className={`text-xs ${highlight ? "text-white/70" : "text-muted-foreground"}`}>
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2 font-bold">
        <Calculator className="h-4 w-4 shrink-0" />
        {value}
      </div>
    </div>
  );
}
function Wave() {
  return (
    <motion.span
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      className="flex h-4 items-end gap-0.5"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="wave-bar h-full w-1 rounded bg-success"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </motion.span>
  );
}
