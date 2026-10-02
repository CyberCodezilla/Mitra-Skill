import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Scale } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { SCRIPTS, type Bi, type ChatItem, type Topic } from "@/data/dialogueScripts";
import { DyadicChatFeed } from "@/components/counsel/DyadicChatFeed";
import { SimulationBottomBar } from "@/components/counsel/SimulationBottomBar";
import { ParentRoiModal } from "@/components/counsel/ParentRoiModal";
import { AlumniStoryModal } from "@/components/counsel/AlumniStoryModal";

export const Route = createFileRoute("/counsel")({
  head: () => ({ meta: [{ title: "Dyadic Dialogue | MitraSkill Family Counselling" }] }),
  component: Counsel,
});

type Activity = "student" | "parent" | "arbiter" | null;
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
  const { lang } = useApp();
  const [tradeId, setTradeId] = useState("AUTO_MECH_01");
  const [items, setItems] = useState<ChatItem[]>([]);
  const [activity, setActivity] = useState<Activity>(null);
  const [busy, setBusy] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [modal, setModal] = useState<"roi" | "alumni" | null>(null);
  const [converged, setConverged] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);

  const animateEvents = useCallback(async (events: DialogueEvent[]) => {
    const thisRun = ++runId.current;
    setBusy(true);
    for (const event of events) {
      if (thisRun !== runId.current) return;
      setActivity(event.kind);
      await delay(event.kind === "arbiter" ? 1450 : 850);
      if (thisRun !== runId.current) return;
      const item: ChatItem = { ...event, id: messageId() };
      setItems((current) => [...current, item]);
      await delay(event.kind === "arbiter" ? 250 : 380);
    }
    if (thisRun === runId.current) {
      setActivity(null);
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void animateEvents(opening("AUTO_MECH_01"));
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
            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              aria-expanded={detailsOpen}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-muted"
            >
              {detailsOpen
                ? lang === "hi" ? "विवरण छिपाएँ" : "Hide details"
                : lang === "hi" ? "ट्रेड और सत्र विवरण" : "Trade & session details"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
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
                  <Scale className="h-4 w-4 text-primary" /> Divergence: {converged ? "0.18" : "0.42"}
                  <small className="rounded-full bg-primary px-2 py-0.5 text-white">
                    {converged ? "Convergence reached" : "Arbitration active"}
                  </small>
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
      />
      <SimulationBottomBar lang={lang} busy={busy} onSimulate={simulate} />
      {modal === "roi" && <ParentRoiModal onClose={() => setModal(null)} />}
      {modal === "alumni" && <AlumniStoryModal onClose={() => setModal(null)} />}
    </div>
  );
}
