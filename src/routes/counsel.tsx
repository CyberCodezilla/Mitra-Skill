import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Activity as ActivityIcon, ChevronDown, MapPin, Scale, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES, getLocalizedTradeName } from "@/data/mockTrades";
import {
  SCRIPTS,
  type Bi,
  type ChatItem,
  type Topic,
  type BalancedDyadicTurn,
} from "@/data/dialogueScripts";
import { DyadicChatFeed, type Activity } from "@/components/counsel/DyadicChatFeed";
import { SimulationBottomBar } from "@/components/counsel/SimulationBottomBar";
import { ParentRoiModal } from "@/components/counsel/ParentRoiModal";
import { AlumniReelsDrawer } from "@/components/counsel/AlumniReelsDrawer";
import { CounselorTriageModal } from "@/components/counsel/CounselorTriageModal";
import { ConsensusMathInspector } from "@/components/counsel/ConsensusMathInspector";
import { CenterLocatorModal } from "@/components/counsel/CenterLocatorModal";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import type { ArbiterTopic } from "@/data/arbiterEvidence";

export const Route = createFileRoute("/counsel")({
  head: () => ({ meta: [{ title: "Dyadic Dialogue | MitraSkill Family Counselling" }] }),
  component: Counsel,
});

type DialogueEvent =
  | {
      kind: "student";
      text: Bi;
      topic?: Topic | undefined;
      thinkingMs?: number;
      balancedScenario?: BalancedDyadicTurn | undefined;
    }
  | {
      kind: "parent";
      text: Bi;
      topic?: Topic | undefined;
      thinkingMs?: number;
      balancedScenario?: BalancedDyadicTurn | undefined;
    }
  | {
      kind: "arbiter";
      tradeId: string;
      text: Bi;
      topic?: ArbiterTopic | undefined;
      thinkingMs?: number;
      balancedScenario?: BalancedDyadicTurn | undefined;
    };

let messageSequence = 0;
const messageId = () => `counsel-${++messageSequence}`;
const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const opening = (tradeId: string): DialogueEvent[] => {
  const script = SCRIPTS[tradeId]!;
  return [
    { kind: "student", text: script.opening.student },
    { kind: "parent", text: script.opening.parent },
    { kind: "arbiter", tradeId, text: script.opening.arbiter, topic: "opening" },
  ];
};

const DETAILS_HIDE_LABEL: Record<SupportedLanguage, string> = {
  en: "Hide details",
  hi: "विवरण छिपाएँ",
  mr: "तपशील लपवा",
  bn: "বিবরণ লুকান",
  ta: "விவரங்களை மறை",
};

const DETAILS_SHOW_LABEL: Record<SupportedLanguage, string> = {
  en: "Trade & session details",
  hi: "ट्रेड और सत्र विवरण",
  mr: "कौशल्य व सत्र तपशील",
  bn: "কোর্স ও সেশনের বিবরণ",
  ta: "தொழில் மற்றும் அமர்வு விவரங்கள்",
};

const DEADLOCK_NOTICE: Record<SupportedLanguage, { title: string; desc: string; btn: string }> = {
  en: {
    title: "Family divergence persists",
    desc: "Would you like to connect with a verified district ITI counsellor?",
    btn: "Review demo referral",
  },
  hi: {
    title: "परिवार की असहमति बनी हुई है",
    desc: "क्या आप ज़िला ITI के प्रमाणित काउंसलर से बात करना चाहेंगे?",
    btn: "डेमो रेफ़रल देखें",
  },
  mr: {
    title: "कौटुंबिक मतभेद कायम आहे",
    desc: "तुम्ही जिल्हा आयटीआय समुपदेशकांशी संपर्क साधू इच्छिता का?",
    btn: "समुपदेशन संदर्भ पहा",
  },
  bn: {
    title: "পারিবারিক মতপার্থক্য বজায় রয়েছে",
    desc: "আপনি কি জেলা আইটিআই কাউন্সেলরের সাথে পরামর্শ করতে চান?",
    btn: "রেফারেল বিবরণ দেখুন",
  },
  ta: {
    title: "குடும்ப கருத்து வேறுபாடு தொடர்கிறது",
    desc: "மாவட்ட ஐடிஐ சான்றளிக்கப்பட்ட ஆலோசகருடன் பேச விரும்புகிறீர்களா?",
    btn: "ஆலோசனை பரிந்துரையை காண்க",
  },
};

function Counsel() {
  const {
    lang,
    currentDivergence,
    studentAptitude,
    selectedTradeId,
    setSelectedTradeId,
    setActiveTradeName,
    setCurrentDivergence,
  } = useApp();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.counsel;
  const [tradeId, setTradeId] = useState(selectedTradeId);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [activity, setActivity] = useState<Activity>(null);
  const [busy, setBusy] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [modal, setModal] = useState<"roi" | "alumni" | null>(null);
  const [converged, setConverged] = useState(false);
  const [counselorOpen, setCounselorOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [locatorOpen, setLocatorOpen] = useState(false);
  const [objectionClicks, setObjectionClicks] = useState(0);
  const [mobilityExplored, setMobilityExplored] = useState(false);
  const [deadlockDismissed, setDeadlockDismissed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const initialTradeId = useRef(tradeId);
  const langRef = useRef<SupportedLanguage>(language);
  langRef.current = language;

  useEffect(() => {
    setMobilityExplored(window.sessionStorage.getItem("mitraskill_mobility_explored") === "true");
  }, []);
  useEffect(() => {
    const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId);
    if (trade) setActiveTradeName(trade.trade_name);
  }, [tradeId, setActiveTradeName]);
  useEffect(() => {
    setCurrentDivergence(converged ? 0.18 : 0.42);
  }, [converged, tradeId, setCurrentDivergence]);

  const animateEvents = useCallback(async (events: DialogueEvent[]) => {
    const thisRun = ++runId.current;
    setBusy(true);
    for (const event of events) {
      if (thisRun !== runId.current) return;
      const id = messageId();
      // Brief 800ms typing indicator for Arbiter evaluates constraints
      const thinkingMs =
        event.kind === "arbiter"
          ? (event.thinkingMs ?? 800)
          : (event.thinkingMs ?? 180);
      const eventText = event.text[langRef.current] || event.text.hi || event.text.en || "";
      const characterCount = Array.from(eventText).length;
      const messageWaitMs =
        event.kind === "arbiter" ? 0 : Math.min(1800, Math.max(600, characterCount * 18));
      setActivity({ ...event, id, thinkingMs });
      await delay(thinkingMs + messageWaitMs);
      if (thisRun !== runId.current) return;
      const item: ChatItem =
        event.kind === "arbiter"
          ? {
              id,
              kind: "arbiter",
              tradeId: event.tradeId,
              text: event.text,
              topic: event.topic,
              balancedScenario: event.balancedScenario,
            }
          : {
              id,
              kind: event.kind,
              text: event.text,
              topic: event.topic,
              balancedScenario: event.balancedScenario,
            };
      setItems((current) => [...current, item]);
      setActivity(null);
      await delay(450);
    }
    if (thisRun === runId.current) {
      setActivity(null);
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void animateEvents(opening(initialTradeId.current));
    return () => {
      runId.current += 1;
    };
  }, [animateEvents]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, activity]);

  const switchTrade = (next: string) => {
    if (next === tradeId || busy) return;
    setTradeId(next);
    setSelectedTradeId(next);
    setItems([]);
    setConverged(false);
    void animateEvents(opening(next));
  };

  const simulate = (who: "student" | "parent", topic?: Topic) => {
    if (busy) return;
    const script = SCRIPTS[tradeId]!;
    const activeTopic: Topic = topic ?? (who === "student" ? "salary" : script.parentDefault);
    const events: DialogueEvent[] =
      who === "student"
        ? [
            { kind: "student", text: script.studentFollowUp, topic: "salary" },
            { kind: "arbiter", tradeId, text: script.objections.salary.arbiter, topic: "salary" },
          ]
        : [
            { kind: "parent", text: script.objections[activeTopic].parent, topic: activeTopic },
            {
              kind: "arbiter",
              tradeId,
              text: script.objections[activeTopic].arbiter,
              topic: activeTopic,
            },
          ];
    setConverged(true);
    void animateEvents(events);
  };

  const handleSelectBalancedScenario = useCallback(
    async (scenario: BalancedDyadicTurn) => {
      if (busy) return;
      setConverged(true);
      if (scenario.initiator === "parent") {
        setObjectionClicks((count) => count + 1);
      } else {
        setObjectionClicks(0);
      }

      const userTextBi: Bi = {
        en: scenario.userMessage.text_en,
        hi: scenario.userMessage.text_hi,
        mr: scenario.userMessage.text_mr || scenario.userMessage.text_hi,
        bn: scenario.userMessage.text_bn || scenario.userMessage.text_hi,
        ta: scenario.userMessage.text_ta || scenario.userMessage.text_hi,
      };

      const arbiterTextBi: Bi = {
        en: scenario.arbiterResponse.fullText_en,
        hi: scenario.arbiterResponse.fullText_hi,
        mr: scenario.arbiterResponse.fullText_mr || scenario.arbiterResponse.fullText_hi,
        bn: scenario.arbiterResponse.fullText_bn || scenario.arbiterResponse.fullText_hi,
        ta: scenario.arbiterResponse.fullText_ta || scenario.arbiterResponse.fullText_hi,
      };

      const arbiterTopic: ArbiterTopic =
        scenario.category === "PARENT_WAGE" || scenario.category === "STUDENT_UNREALISTIC_EXPECTATION"
          ? "salary"
          : scenario.category === "PARENT_STIGMA"
          ? "stigma"
          : "safety";

      const events: DialogueEvent[] = [
        {
          kind: scenario.initiator === "student" ? "student" : "parent",
          text: userTextBi,
          balancedScenario: scenario,
          topic: scenario.category === "PARENT_STIGMA" ? "stigma" : "salary",
        },
        {
          kind: "arbiter",
          tradeId,
          text: arbiterTextBi,
          thinkingMs: 800,
          balancedScenario: scenario,
          topic: arbiterTopic,
        },
      ];

      await animateEvents(events);
    },
    [busy, tradeId, animateEvents]
  );

  const selectedTrade = MOCK_TRADES.find((trade) => trade.trade_id === tradeId)!;

  return (
    <div className="pb-48 sm:pb-44 pt-1 sm:pt-2">
      <section className="border-b bg-card/95 backdrop-blur-xs">
        <div className="mx-auto max-w-5xl px-4 py-2.5">
          <div className="flex flex-col gap-2">
            {/* Top row: Step Badge, Current Trade, and Seats Available */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-navy/10 px-2.5 py-1 text-xs font-extrabold tracking-tight text-navy">
                  {c.stepBadge}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  • {getLocalizedTradeName(selectedTrade, language)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLocatorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-950 transition hover:bg-emerald-100 active:scale-95 dark:border-emerald-300/30 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{c.seatsBtn}</span>
              </button>
            </div>

            {/* Bottom row: Divergence metric pill + Details drawer toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
              <button
                type="button"
                onClick={() => setInspectorOpen(true)}
                aria-label={c.mathBtn}
                className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-950 transition hover:bg-amber-500/20 active:scale-95"
              >
                <ActivityIcon className="h-3.5 w-3.5 text-amber-700 group-hover:animate-pulse" />
                <span>{c.divergenceBadge}: {currentDivergence.toFixed(2)}</span>
                <span className="hidden sm:inline">
                  · {c.mathBtn}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
                aria-expanded={detailsOpen}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-background px-3 py-1 text-xs font-semibold text-navy transition hover:bg-muted active:scale-95"
              >
                <span>{detailsOpen ? DETAILS_HIDE_LABEL[language] || "Hide details" : DETAILS_SHOW_LABEL[language] || "Trade & session details"}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Details / Trade selection drawer */}
          {detailsOpen && (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {MOCK_TRADES.map((trade) => {
                  const localizedName = getLocalizedTradeName(trade, language);
                  return (
                    <button
                      key={trade.trade_id}
                      onClick={() => switchTrade(trade.trade_id)}
                      aria-pressed={tradeId === trade.trade_id}
                      disabled={busy}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 active:scale-95 ${
                        tradeId === trade.trade_id
                          ? "border-navy bg-navy text-white shadow-xs"
                          : "border-slate-200 bg-background text-navy hover:border-primary hover:bg-slate-50"
                      }`}
                    >
                      {localizedName}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <MapPin className="h-3.5 w-3.5" /> {c.districtTag}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-navy">
                  <Scale className="h-3.5 w-3.5 text-primary" />
                  {c.divergenceBadge}: {converged ? "0.18" : "0.42"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
      <DyadicChatFeed
        items={items}
        lang={language}
        activity={activity}
        endRef={endRef}
        onRoi={() => setModal("roi")}
        onAlumni={() => setModal("alumni")}
        onEscalate={() => setCounselorOpen(true)}
      />
      <SimulationBottomBar
        lang={lang}
        busy={busy}
        onSimulate={simulate}
        onObjectionClick={() => setObjectionClicks((count) => count + 1)}
        onRegularResponse={() => setObjectionClicks(0)}
        onSelectScenario={handleSelectBalancedScenario}
      />
      {objectionClicks >= 3 && !mobilityExplored && !deadlockDismissed && (
        <aside
          role="status"
          className="fixed bottom-32 right-4 z-40 max-w-sm animate-in slide-in-from-right rounded-2xl border border-amber-300 bg-card p-4 shadow-xl sm:bottom-28 sm:right-6"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-800">
              <Scale className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy">
                {DEADLOCK_NOTICE[language]?.title || DEADLOCK_NOTICE.hi.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {DEADLOCK_NOTICE[language]?.desc || DEADLOCK_NOTICE.hi.desc}
              </p>
              <button
                type="button"
                onClick={() => setCounselorOpen(true)}
                className="mt-3 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
              >
                {DEADLOCK_NOTICE[language]?.btn || DEADLOCK_NOTICE.hi.btn}
              </button>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setDeadlockDismissed(true)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}
      <CounselorTriageModal
        isOpen={counselorOpen}
        onClose={() => setCounselorOpen(false)}
        lang={lang}
        selectedTradeName={getLocalizedTradeName(selectedTrade, language)}
        currentDivergence={converged ? 0.18 : 0.42}
      />
      <ConsensusMathInspector
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        lang={lang}
        tradeId={selectedTrade.trade_id}
        onDivergenceChange={setCurrentDivergence}
        studentAptitude={studentAptitude}
      />
      <CenterLocatorModal isOpen={locatorOpen} onClose={() => setLocatorOpen(false)} lang={lang} />
      {modal === "roi" && <ParentRoiModal onClose={() => setModal(null)} />}
      <AlumniReelsDrawer
        isOpen={modal === "alumni"}
        onClose={() => setModal(null)}
        lang={lang}
        initialTradeId={selectedTrade.trade_id}
      />
    </div>
  );
}
