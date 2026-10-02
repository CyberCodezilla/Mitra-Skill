import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, ChevronDown, MapPin, Scale, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { SCRIPTS, type Bi, type ChatItem, type Topic } from "@/data/dialogueScripts";
import { DyadicChatFeed } from "@/components/counsel/DyadicChatFeed";
import { SimulationBottomBar } from "@/components/counsel/SimulationBottomBar";
import { ParentRoiModal } from "@/components/counsel/ParentRoiModal";
import { AlumniReelsDrawer } from "@/components/counsel/AlumniReelsDrawer";
import { CounselorTriageModal } from "@/components/counsel/CounselorTriageModal";
import { ConsensusMathInspector } from "@/components/counsel/ConsensusMathInspector";
import { CenterLocatorModal } from "@/components/counsel/CenterLocatorModal";

export const Route = createFileRoute("/counsel")({
  head: () => ({ meta: [{ title: "Dyadic Dialogue | MitraSkill Family Counselling" }] }),
  component: Counsel,
});

type Activity =
  | { id: string; kind: "student" | "parent"; text: Bi; thinkingMs: number }
  | { id: string; kind: "arbiter"; tradeId: string; text: Bi; thinkingMs: number }
  | null;
type DialogueEvent =
  | { kind: "student"; text: Bi }
  | { kind: "parent"; text: Bi }
  | { kind: "arbiter"; tradeId: string; text: Bi };

let messageSequence = 0;
const messageId = () => `counsel-${++messageSequence}`;
const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const opening = (tradeId: string): DialogueEvent[] => {
  const script = SCRIPTS[tradeId]!;
  return [
    { kind: "student", text: script.opening.student },
    { kind: "parent", text: script.opening.parent },
    { kind: "arbiter", tradeId, text: script.opening.arbiter },
  ];
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
  const langRef = useRef(lang);
  langRef.current = lang;

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
      const thinkingMs = event.kind === "arbiter" ? 3150 + Math.random() * 450 : 180;
      const characterCount = Array.from(event.text[langRef.current]).length;
      const messageWaitMs =
        event.kind === "arbiter" ? 0 : Math.min(3400, Math.max(1000, characterCount * 27));
      setActivity({ ...event, id, thinkingMs });
      await delay(thinkingMs + messageWaitMs);
      if (thisRun !== runId.current) return;
      const item: ChatItem =
        event.kind === "arbiter"
          ? { id, kind: "arbiter", tradeId: event.tradeId, text: event.text }
          : { id, kind: event.kind, text: event.text };
      setItems((current) => [...current, item]);
      setActivity(null);
      await delay(620 + Math.random() * 360);
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
    const events: DialogueEvent[] =
      who === "student"
        ? [
            { kind: "student", text: script.studentFollowUp },
            { kind: "arbiter", tradeId, text: script.objections.salary.arbiter },
          ]
        : [
            { kind: "parent", text: script.objections[topic ?? script.parentDefault].parent },
            {
              kind: "arbiter",
              tradeId,
              text: script.objections[topic ?? script.parentDefault].arbiter,
            },
          ];
    setConverged(true);
    void animateEvents(events);
  };

  const selectedTrade = MOCK_TRADES.find((trade) => trade.trade_id === tradeId)!;

  return (
    <div className="pb-32 sm:pb-28">
      <section className="border-b bg-card/95">
        <div className="mx-auto max-w-5xl px-4 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight text-navy">
                {lang === "hi" ? "पारिवारिक संवाद" : "Family dialogue"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {lang === "hi" ? selectedTrade.hindi_title : selectedTrade.trade_name}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectorOpen(true)}
                aria-label={
                  lang === "hi" ? "गणित निरीक्षक खोलें" : "Open divergence math inspector"
                }
                className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-950 transition hover:bg-amber-500/20"
              >
                <Activity className="h-3.5 w-3.5 text-amber-700 group-hover:animate-pulse" />
                <span>Δ {currentDivergence.toFixed(2)}</span>
                <span className="hidden sm:inline">
                  · {lang === "hi" ? "गणित जाँचें" : "Inspect math"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
                aria-expanded={detailsOpen}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-muted"
              >
                {detailsOpen
                  ? lang === "hi"
                    ? "विवरण छिपाएँ"
                    : "Hide details"
                  : lang === "hi"
                    ? "ट्रेड और सत्र विवरण"
                    : "Trade & session details"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${detailsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setLocatorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/30 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-100 dark:border-emerald-300/30 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              >
                <MapPin className="h-3.5 w-3.5" />
                {lang === "hi" ? "नज़दीकी ITI सीटें" : "Nearby ITI Seats & Apprenticeships"}
              </button>
            </div>
          </div>
          {detailsOpen && (
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-2">
              {MOCK_TRADES.map((trade) => (
                <button
                  key={trade.trade_id}
                  onClick={() => switchTrade(trade.trade_id)}
                  aria-pressed={tradeId === trade.trade_id}
                  disabled={busy}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${tradeId === trade.trade_id ? "border-navy bg-navy text-white" : "bg-background text-navy hover:border-primary"}`}
                >
                  {lang === "hi" ? trade.hindi_title : trade.trade_name}
                </button>
              ))}
              <div className="ml-auto flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full border border-success px-3 py-1.5 text-xs font-medium text-success">
                  <MapPin className="h-4 w-4" /> Meerut, UP
                </span>
                <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-navy">
                  <Scale className="h-4 w-4 text-primary" />
                  {lang === "hi" ? "सत्र का डेमो माप" : "Session demo measure"}:{" "}
                  {converged ? "0.18" : "0.42"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
      <DyadicChatFeed
        items={items}
        lang={lang}
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
                {lang === "hi" ? "परिवार की असहमति बनी हुई है" : "Family divergence persists"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "hi"
                  ? "क्या आप मेरठ ITI के काउंसलर से बात करना चाहेंगे?"
                  : "Would you like to connect with a Meerut ITI counsellor?"}
              </p>
              <button
                type="button"
                onClick={() => setCounselorOpen(true)}
                className="mt-3 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
              >
                {lang === "hi" ? "डेमो रेफ़रल देखें" : "Review demo referral"}
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
        selectedTradeName={selectedTrade.trade_name}
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
