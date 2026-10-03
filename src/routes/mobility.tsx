import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { NcrfLadderStepper } from "@/components/mobility/NcrfLadderStepper";
import { CreditMathExplainer } from "@/components/mobility/CreditMathExplainer";
import { SocialStatusMatrix } from "@/components/mobility/SocialStatusMatrix";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t: ui } = useTranslation();
  const m = ui.mobility;
  const [tradeId, setTradeId] = useState("AUTO_MECH_01");
  const [activeStage, setActiveStage] = useState(2);
  const { speak, stop, isSpeaking: playing } = useIndicVoice();
  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;
  const hi = lang === "hi";
  useEffect(() => {
    window.sessionStorage.setItem("mitraskill_mobility_explored", "true");
  }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:pt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-primary">
          {m.stepBadge}
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
              {m.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground sm:text-lg">
              {m.subtitle}
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
          onPlay={() =>
            playing
              ? stop()
              : speak(
                  `${m.title}. ${m.subtitle}. ${m.creditMathTitle}: ${m.creditMathDesc}`,
                  lang,
                )
          }
        />
        <SocialStatusMatrix trade={trade} lang={lang} />
      </main>
      <nav
        aria-label="Mobility navigation"
        className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link
          to="/counsel"
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold text-navy cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> {m.backBtn}
        </Link>
        <Link
          to="/accord"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E87722] px-5 py-3 font-semibold text-white shadow-saffron hover:bg-[#d0681a] cursor-pointer"
        >
          📜 {m.generateAccordBtn}{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}
