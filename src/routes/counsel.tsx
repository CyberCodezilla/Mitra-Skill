import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MapPin, Scale } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { SCRIPTS, type ChatItem, type Topic } from "@/data/dialogueScripts";
import { DyadicChatFeed } from "@/components/counsel/DyadicChatFeed";
import { SimulationBottomBar } from "@/components/counsel/SimulationBottomBar";
import { ParentRoiModal } from "@/components/counsel/ParentRoiModal";
import { AlumniStoryModal } from "@/components/counsel/AlumniStoryModal";

export const Route = createFileRoute("/counsel")({
  head: () => ({ meta: [{ title: "Dyadic Dialogue — MitraSkill Family Counselling" }] }),
  component: Counsel,
});
let id = 0;
const messageId = () => `counsel-${++id}`;
const opening = (tradeId: string): ChatItem[] => {
  const script = SCRIPTS[tradeId]!;
  return [
    { id: messageId(), kind: "student", text: script.opening.student },
    { id: messageId(), kind: "parent", text: script.opening.parent },
    { id: messageId(), kind: "arbiter", tradeId, text: script.opening.arbiter },
  ];
};

function Counsel() {
  const { lang } = useApp();
  const [tradeId, setTradeId] = useState("AUTO_MECH_01");
  const [items, setItems] = useState<ChatItem[]>(() => opening("AUTO_MECH_01"));
  const [listening, setListening] = useState(false);
  const [modal, setModal] = useState<"roi" | "alumni" | null>(null);
  const [converged, setConverged] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, listening]);
  const switchTrade = (next: string) => {
    if (next === tradeId) return;
    setTradeId(next);
    setItems(opening(next));
    setConverged(false);
  };
  const simulate = (who: "student" | "parent", topic?: Topic) => {
    if (listening) return;
    setListening(true);
    window.setTimeout(() => {
      const script = SCRIPTS[tradeId]!;
      const additions: ChatItem[] =
        who === "student"
          ? [
              { id: messageId(), kind: "student", text: script.studentFollowUp },
              { id: messageId(), kind: "arbiter", tradeId, text: script.objections.salary.arbiter },
            ]
          : [
              {
                id: messageId(),
                kind: "parent",
                text: script.objections[topic ?? script.parentDefault].parent,
              },
              {
                id: messageId(),
                kind: "arbiter",
                tradeId,
                text: script.objections[topic ?? script.parentDefault].arbiter,
              },
            ];
      setItems((current) => [...current, ...additions]);
      setConverged(true);
      setListening(false);
    }, 1500);
  };
  return (
    <div className="pb-56 sm:pb-44">
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
          <div className="w-full text-sm font-semibold text-navy">
            2. Dyadic Dialogue{" "}
            <span lang="hi" className="text-muted-foreground">
              (द्विपक्षीय संवाद)
            </span>
          </div>
          {MOCK_TRADES.map((trade) => (
            <button
              key={trade.trade_id}
              onClick={() => switchTrade(trade.trade_id)}
              aria-pressed={tradeId === trade.trade_id}
              className={`rounded-full border px-3 py-2 text-sm font-semibold ${tradeId === trade.trade_id ? "border-navy bg-navy text-white" : "bg-background text-navy hover:border-primary"}`}
            >
              {lang === "hi" ? trade.hindi_title : trade.trade_name}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full border border-success px-3 py-1.5 text-sm font-medium text-success">
              <MapPin className="h-4 w-4" /> District: Meerut, UP (Audited Industrial Corridor)
            </span>
            <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-navy">
              <Scale className="h-4 w-4 text-primary" /> Divergence (Δ_dyad):{" "}
              {converged ? "0.18" : "0.42"}
              <small className="rounded-full bg-primary px-2 py-0.5 text-white">
                {converged ? "Convergence Reached" : "Arbitration Mode Active"}
              </small>
            </span>
          </div>
        </div>
      </section>
      <DyadicChatFeed
        items={items}
        lang={lang}
        endRef={endRef}
        onRoi={() => setModal("roi")}
        onAlumni={() => setModal("alumni")}
      />
      <SimulationBottomBar lang={lang} listening={listening} onSimulate={simulate} />
      {modal === "roi" && <ParentRoiModal onClose={() => setModal(null)} />}
      {modal === "alumni" && <AlumniStoryModal onClose={() => setModal(null)} />}
    </div>
  );
}
