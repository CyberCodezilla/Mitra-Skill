import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, RotateCcw, Smartphone } from "lucide-react";
import { PhoneMockupFrame } from "@/components/whatsapp/PhoneMockupFrame";
import { WhatsAppChatInterface } from "@/components/whatsapp/WhatsAppChatInterface";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp Companion Demo | MitraSkill" }] }),
  component: WhatsAppSimulator,
});

function WhatsAppSimulator() {
  const { lang } = useApp();
  const hi = lang === "hi";
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:pt-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-950/40 dark:text-emerald-200">
            <Smartphone className="h-3.5 w-3.5" /> SIH 2026 · Mobile companion simulator
          </div>
          <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
            {hi ? "MitraSkill WhatsApp साथी" : "MitraSkill WhatsApp Companion"}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {hi
              ? "परिवारों के लिए क्षेत्रीय भाषा में कौशल मार्गदर्शन का इंटरैक्टिव डेमो।"
              : "An interactive demo of regional-language skill guidance for families."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setResetKey((key) => key + 1)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground transition hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          <RotateCcw className="h-4 w-4" /> {hi ? "डेमो रीसेट करें" : "Reset demo"}
        </button>
      </div>

      <div className="grid items-start justify-items-center gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:justify-items-end">
        <aside className="order-2 w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-card lg:order-1 lg:justify-self-start">
          <div className="flex items-center gap-2 text-sm font-bold text-navy">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            {hi ? "डेमो नियंत्रण" : "Demo controls"}
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>• Tap a suggested question to replay a sample parent-to-assistant exchange.</li>
            <li>
              • Voice bubbles use browser speech synthesis where available; otherwise they animate
              as a simulated voice note.
            </li>
            <li>
              • The microphone button runs the next scripted scenario. Text input is local demo
              interaction only.
            </li>
          </ul>
          <div className="mt-4 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            Demo interface only. This is not connected to WhatsApp, MSDE, an official business
            account, live placement records, or an end-to-end encrypted messaging service. All
            sample claims must be independently verified.
          </div>
        </aside>

        <div className="order-1 lg:order-2">
          <PhoneMockupFrame>
            <WhatsAppChatInterface lang={lang} onReset={resetKey} />
          </PhoneMockupFrame>
        </div>
      </div>
    </div>
  );
}
