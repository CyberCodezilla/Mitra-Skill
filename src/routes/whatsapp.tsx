import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Headphones,
  Laptop,
  MessageSquare,
  Moon,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Volume2,
} from "lucide-react";
import { PhoneMockupFrame } from "@/components/whatsapp/PhoneMockupFrame";
import { WhatsAppChatInterface } from "@/components/whatsapp/WhatsAppChatInterface";
import { WA_DARK_THEME, WA_LIGHT_THEME } from "@/components/whatsapp/whatsappTheme";
import { useApp } from "@/lib/app-context";
import { WHATSAPP_PROMPT_CHIPS } from "@/data/mockWhatsAppFlow";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      {
        title:
          "WhatsApp Mobile Simulator | MitraSkill (SIH 2026 - Problem Statement ID 26241)",
      },
    ],
  }),
  component: WhatsAppSimulatorRoute,
});

function WhatsAppSimulatorRoute() {
  const { lang } = useApp();
  const hi = lang === "hi";
  const [resetKey, setResetKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [externalTrigger, setExternalTrigger] = useState<{
    chipId: string;
    timestamp: number;
  } | null>(null);

  const activeTheme = isDarkMode ? WA_DARK_THEME : WA_LIGHT_THEME;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 pt-5 transition-colors duration-200 dark:bg-slate-950 sm:pt-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Breadcrumb & SIH Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>SIH 2026 · Problem Statement ID 26241 (MSDE)</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {hi
                ? "MitraSkill WhatsApp मोबाइल सिमुलेटर (1:1 Native)"
                : "MitraSkill WhatsApp Mobile Simulator (1:1 Native)"}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              {hi
                ? "ग्रामीण अभिभावकों के लिए बिना किसी ऐप डाउनलोड के WhatsApp पर स्थानीय भाषा में ऑडियो और सत्यापित कार्ड्स का सिमुलेशन।"
                : "A zero-barrier companion for rural guardians delivering regional voice notes and DGT-audited cards over WhatsApp."}
            </p>
          </div>

          {/* Top Controls: Reset & Return Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setResetKey((k) => k + 1)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40"
              title="Reset conversation flow to beginning"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{hi ? "सिम्युलेटर रीसेट करें" : "Reset Simulator"}</span>
            </button>

            <Link
              to="/counsel"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>{hi ? "डेस्कटॉप पोर्टल पर लौटें" : "Return to Desktop Portal"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Main Grid: Explanatory Evaluator Side Panel (Left) & Smartphone Frame with Hardware Switch (Right) */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_auto] xl:grid-cols-[1.25fr_auto]">
          {/* Side Presentation Panel for Evaluators & Projector Views */}
          <div className="order-2 space-y-5 lg:order-1">
            {/* 1. Core Pillar Card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
              <div className="flex items-center gap-2.5 text-base font-extrabold text-slate-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2>Zero-Barrier Rural Accessibility (WhatsApp Companion)</h2>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Addresses the digital divide for rural guardians who face literacy hurdles or lack
                the storage/bandwidth to install specialized government mobile applications.
              </p>

              {/* 3 Key Talking Points for Jury */}
              <div className="mt-5 space-y-3.5">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3.5 dark:bg-emerald-950/30">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Low-Literacy First Design
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-300/80">
                      Guardians in Tier-3 and rural blocks rarely read dense tables; they tap and
                      listen to authentic regional voice notes delivered with native 1x/1.5x/2x audio
                      controls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-50/50 p-3.5 dark:bg-blue-950/30">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-blue-950 dark:text-blue-200">
                      Deterministic Grounding & Zero Hallucination
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-blue-900/80 dark:text-blue-300/80">
                      All responses strictly cite verified DGT tracer audits (2024), actual local
                      industrial recruiters, and formal NCrF credit mobility guidelines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/50 p-3.5 dark:bg-amber-950/30">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                      Dual Output Modality
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80">
                      Every voice note is accompanied by an official WhatsApp Cloud API Interactive
                      Template Card designed for household discussion and one-tap counselor
                      handoff.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Interactive Scenario Evaluator Sandbox */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Interactive Test Scenarios (Click to Preview in Phone)</span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  4 High-Impact Prompts
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {WHATSAPP_PROMPT_CHIPS.map((chip, idx) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setExternalTrigger({ chipId: chip.id, timestamp: Date.now() })}
                    className="flex flex-col justify-between text-left cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-xs active:scale-[0.99] dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-500"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          Scenario #{idx + 1}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {chip.userMessage.type === "voice" ? "🎙️ Voice Input" : "⌨️ Text Input"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {chip.label_hi}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        {chip.label_en}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Official Spec Compliance Banner */}
            <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-slate-900 to-slate-800 p-5 text-white shadow-md dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Native Meta Design Specs Verified
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-slate-400">Light Mode Header</div>
                  <div className="font-mono text-[11px] font-bold text-emerald-300">#008069</div>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-slate-400">Dark Mode Header</div>
                  <div className="font-mono text-[11px] font-bold text-emerald-300">#1F2C34</div>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-slate-400">Read Receipts</div>
                  <div className="font-mono text-[11px] font-bold text-[#53BDEB]">#53BDEB (✓✓)</div>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-slate-400">Audio Waveform</div>
                  <div className="font-mono text-[11px] font-bold text-[#00A884]">
                    28 Bars (Scrubber)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Frame Column (Right) with Floating Hardware Switch */}
          <div className="order-1 flex flex-col items-center lg:order-2">
            {/* Floating Hardware Mode Toggle */}
            <div className="mb-4 flex items-center rounded-2xl border border-slate-300 bg-white p-1 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  !isDarkMode
                    ? "bg-[#008069] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>WhatsApp Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isDarkMode
                    ? "bg-[#1F2C34] text-[#25D366] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>WhatsApp Dark Mode</span>
              </button>
            </div>

            {/* Smartphone Chassis Frame */}
            <PhoneMockupFrame theme={activeTheme} isDark={isDarkMode}>
              <WhatsAppChatInterface
                lang={lang}
                theme={activeTheme}
                isDark={isDarkMode}
                onReset={resetKey}
                externalTrigger={externalTrigger}
              />
            </PhoneMockupFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
