import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Activity as ActivityIcon, ChevronDown, HeartHandshake, MapPin, Phone, Scale, X } from "lucide-react";
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
import { HighDivergenceNoticeModal } from "@/components/counsel/HighDivergenceNoticeModal";
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

const DEADLOCK_NOTICE: Record<SupportedLanguage, { title: string; desc: string; btn: string; whyBtn: string }> = {
  en: {
    title: "High Family Divergence Detected",
    desc: "Sensitive matters like career stigma, female student safety, and wage security need compassionate human guidance.",
    btn: "Connect Live",
    whyBtn: "Why Human Counselor?",
  },
  hi: {
    title: "उच्च पारिवारिक मतभेद चिन्हित",
    desc: "सामाजिक प्रतिष्ठा, छात्रा सुरक्षा व वेतन सुरक्षा जैसे संवेदनशील मामलों में मानवीय मार्गदर्शन आवश्यक है।",
    btn: "लाइव बात करें",
    whyBtn: "काउंसलर क्यों ज़रूरी?",
  },
  mr: {
    title: "कौटुंबिक मतभेद उच्च पातळीवर",
    desc: "सामाजिक प्रतिष्ठा, मुलींची सुरक्षा व आर्थिक सुरक्षिततेसारख्या संवेदनशील विषयांसाठी मानवी समुपदेशन आवश्यक आहे.",
    btn: "थेट बोला",
    whyBtn: "समुपदेशक का?",
  },
  bn: {
    title: "উচ্চ পারিবারিক মতপার্থক্য শনাক্ত",
    desc: "সামাজিক মর্যাদা, মেয়েদের সুরক্ষা ও আর্থিক নিরাপত্তার মতো সংবেদনশীল বিষয়ে মানবিক পরামর্শ প্রয়োজন।",
    btn: "লাইভ কথা বলুন",
    whyBtn: "কাউন্সেলর কেন প্রয়োজন?",
  },
  ta: {
    title: "அதிக குடும்ப கருத்து வேறுபாடு",
    desc: "சமூக கௌரவம், மாணவிகள் பாதுகாப்பு மற்றும் நிதி பாதுகாப்பு போன்ற உணர்திறன் மிக்க விஷயங்களுக்கு நேரடி மனித ஆலோசனை தேவை.",
    btn: "நேரடியாக பேசவும்",
    whyBtn: "ஆலோசகர் ஏன்?",
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
  const [interventionOpen, setInterventionOpen] = useState(false);
  const hasAutoIntervened = useRef(false);
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
    setCurrentDivergence(converged ? 0.18 : 0.44);
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
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    if (who === "parent") {
      setConverged(false);
      setCurrentDivergence(0.44);
      setObjectionClicks((count) => {
        const next = count + 1;
        if (next >= 2 && !hasAutoIntervened.current) {
          hasAutoIntervened.current = true;
          setTimeout(() => {
            setInterventionOpen(true);
          }, 3200);
        }
        return next;
      });
    } else {
      setConverged(true);
      setCurrentDivergence(0.18);
      setObjectionClicks(0);
    }

    void animateEvents(events);
  };

  const handleSelectBalancedScenario = useCallback(
    async (scenario: BalancedDyadicTurn) => {
      if (busy) return;

      if (scenario.initiator === "parent") {
        setConverged(false);
        setCurrentDivergence(0.44);
        setObjectionClicks((count) => {
          const next = count + 1;
          if (next >= 2 && !hasAutoIntervened.current) {
            hasAutoIntervened.current = true;
            setTimeout(() => {
              setInterventionOpen(true);
            }, 3200);
          }
          return next;
        });
      } else {
        setConverged(true);
        setCurrentDivergence(0.18);
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
                  {c.divergenceBadge}: {currentDivergence.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Scrollable Framed Family Dialogue Feed Window */}
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-2 sm:py-3">
        <div
          data-tour="tour-chat-feed"
          tabIndex={0}
          role="region"
          aria-label={language === "hi" ? "पारिवारिक परामर्श संवाद" : "Family Dialogue Feed"}
          className="relative rounded-3xl border-2 border-slate-200/90 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 shadow-md backdrop-blur-sm overflow-hidden flex flex-col focus:outline-none"
          style={{
            maxHeight: "calc(100vh - 275px)",
            minHeight: "400px",
          }}
        >
          {/* Header Bar with Live Indicator and Scroll Hint */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 select-none">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                {language === "hi" ? "पारिवारिक परामर्श संवाद" : "Family Dialogue & Guidance Feed"}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                • {items.length} {language === "hi" ? "संदेश" : "turns"}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              ↕ {language === "hi" ? "संवाद स्क्रॉल करें" : "Scroll to explore"}
            </span>
          </div>

          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scroll-smooth focus:outline-none [scrollbar-width:thin]">
            <DyadicChatFeed
              items={items}
              lang={language}
              activity={activity}
              endRef={endRef}
              onRoi={() => setModal("roi")}
              onAlumni={() => setModal("alumni")}
              onEscalate={() => setInterventionOpen(true)}
            />
          </div>
        </div>
      </div>
      <SimulationBottomBar
        lang={lang}
        busy={busy}
        onSimulate={simulate}
        onObjectionClick={() => setObjectionClicks((count) => count + 1)}
        onRegularResponse={() => setObjectionClicks(0)}
        onSelectScenario={handleSelectBalancedScenario}
      />
      {(objectionClicks >= 2 || (!converged && currentDivergence > 0.35)) && !deadlockDismissed && (
        <aside
          role="status"
          className="fixed bottom-24 right-3 z-40 max-w-sm sm:max-w-md animate-in slide-in-from-right rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-4 shadow-2xl dark:border-amber-700 dark:from-slate-900 dark:to-amber-950/30 sm:bottom-28 sm:right-6"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-amber-500 p-2 text-white shadow-xs">
              <Scale className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-navy dark:text-amber-200">
                  {DEADLOCK_NOTICE[language]?.title || DEADLOCK_NOTICE.hi.title}
                </p>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                  Δ {currentDivergence.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {DEADLOCK_NOTICE[language]?.desc || DEADLOCK_NOTICE.hi.desc}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInterventionOpen(true)}
                  className="rounded-lg border border-amber-600/40 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 transition hover:bg-amber-100/60 shadow-2xs cursor-pointer"
                >
                  {DEADLOCK_NOTICE[language]?.whyBtn || DEADLOCK_NOTICE.hi.whyBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setCounselorOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:brightness-105 cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{DEADLOCK_NOTICE[language]?.btn || DEADLOCK_NOTICE.hi.btn}</span>
                </button>
              </div>
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
      <HighDivergenceNoticeModal
        isOpen={interventionOpen}
        onClose={() => setInterventionOpen(false)}
        onConnectCounselor={() => {
          setInterventionOpen(false);
          setCounselorOpen(true);
        }}
        lang={lang}
        divergence={currentDivergence}
        conflictThreshold={0.35}
        tradeName={getLocalizedTradeName(selectedTrade, language)}
      />
      <CounselorTriageModal
        isOpen={counselorOpen}
        onClose={() => setCounselorOpen(false)}
        lang={lang}
        selectedTradeName={getLocalizedTradeName(selectedTrade, language)}
        currentDivergence={currentDivergence}
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
