import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { NcrfLadderStepper } from "@/components/mobility/NcrfLadderStepper";
import { CreditMathExplainer } from "@/components/mobility/CreditMathExplainer";
import { SocialStatusMatrix } from "@/components/mobility/SocialStatusMatrix";

export const Route = createFileRoute("/mobility")({
  head: () => ({
    meta: [
      { title: "Degree Mobility (NCrF Ladder) — MitraSkill" },
      {
        name: "description",
        content:
          "Explore an NCrF credit pathway from ITI training toward diploma and degree study.",
      },
    ],
  }),
  component: Mobility,
});

function Mobility() {
  const { lang } = useApp();
  const [tradeId, setTradeId] = useState("AUTO_MECH_01");
  const [activeStage, setActiveStage] = useState(2);
  const [playing, setPlaying] = useState(false);
  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;
  const hi = lang === "hi";
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), 4000);
    return () => window.clearTimeout(timer);
  }, [playing]);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:pt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-primary">
          3. {hi ? "शैक्षणिक गतिशीलता" : "Degree Mobility"}{" "}
          <span className="text-muted-foreground">
            ({hi ? "शैक्षणिक गतिशीलता" : "NCrF pathway"})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOCK_TRADES.map((item) => (
            <button
              key={item.trade_id}
              onClick={() => setTradeId(item.trade_id)}
              aria-pressed={tradeId === item.trade_id}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${tradeId === item.trade_id ? "border-navy bg-navy text-white" : "bg-white text-navy hover:border-primary"}`}
            >
              {hi ? item.hindi_title : item.trade_name}
            </button>
          ))}
        </div>
      </div>
      <header className="rounded-3xl bg-hero p-6 sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-success/30 bg-white/80 px-3 py-1 text-sm font-semibold text-success">
              <ShieldCheck className="h-4 w-4" /> National Credit Framework · NEP 2020
            </div>
            <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl">
              {hi
                ? "राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) - डिग्री एवं डिप्लोमा की राह"
                : "National Credit Framework (NCrF) Academic Mobility Pathway"}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground sm:text-lg">
              {hi
                ? "व्यावसायिक शिक्षा आगे बढ़ने का रास्ता है। ITI में अर्जित क्रेडिट आगे की पढ़ाई में गिने जा सकते हैं, लागू प्रवेश नियमों के अनुसार।"
                : "Vocational training is not a dead end. Credits earned in ITI can support further diploma and university study, subject to applicable admission rules."}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
      </header>
      <main className="mt-7 space-y-6">
        <NcrfLadderStepper
          trade={trade}
          lang={lang}
          activeStage={activeStage}
          onSelect={setActiveStage}
        />
        <CreditMathExplainer
          trade={trade}
          lang={lang}
          playing={playing}
          onPlay={() => setPlaying(true)}
        />
        <SocialStatusMatrix trade={trade} lang={lang} />
      </main>
      <nav
        aria-label="Mobility navigation"
        className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link
          to="/counsel"
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> {hi ? "संवाद पर वापस जाएँ" : "Back to Dialogue"}
        </Link>
        <Link
          to="/accord"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E87722] px-5 py-3 font-semibold text-white shadow-saffron hover:bg-[#d0681a]"
        >
          📜 {hi ? "परिवार रोज़गार पत्र बनाएँ" : "Generate Parivaar Rozgar Patra (Family Accord)"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}
