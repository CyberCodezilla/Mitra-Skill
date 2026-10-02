import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Users, MapPin, Scale, Mic, Volume2, BarChart3, Clapperboard, ArrowRight, X, BadgeCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { SCRIPTS, TOPIC_LABELS, ROI_ROWS, type ChatItem, type Topic, type Bi } from "@/data/dialogueScripts";

export const Route = createFileRoute("/counsel")({
  head: () => ({
    meta: [
      { title: "Dyadic Dialogue — MitraSkill Family Counselling" },
      { name: "description", content: "Student aspirations meet parent concerns, arbitrated with verified DGT placement and salary data." },
      { property: "og:title", content: "Dyadic Dialogue — MitraSkill" },
      { property: "og:description", content: "Student aspirations meet parent concerns, arbitrated with verified Ministry data." },
    ],
  }),
  component: Counsel,
});

let uid = 0;
const nid = () => `m${++uid}`;

function openingFor(tradeId: string): ChatItem[] {
  const o = SCRIPTS[tradeId]!.opening;
  return [
    { id: nid(), kind: "student", text: o.student },
    { id: nid(), kind: "parent", text: o.parent },
    { id: nid(), kind: "arbiter", tradeId, text: o.arbiter },
  ];
}

function Counsel() {
  const { lang } = useApp();
  const [tradeId, setTradeId] = useState(MOCK_TRADES[0]!.trade_id);
  const [items, setItems] = useState<ChatItem[]>(() => openingFor(MOCK_TRADES[0]!.trade_id));
  const [listening, setListening] = useState(false);
  const [modal, setModal] = useState<null | "roi" | "alumni">(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, listening]);

  const switchTrade = (id: string) => {
    if (id === tradeId) return;
    setTradeId(id);
    setItems(openingFor(id));
  };

  const simulate = (who: "student" | "parent", topic?: Topic) => {
    if (listening) return;
    setListening(true);
    setTimeout(() => {
      const s = SCRIPTS[tradeId]!;
      const next: ChatItem[] = [];
      if (who === "student") {
        next.push({ id: nid(), kind: "student", text: s.studentFollowUp });
        next.push({ id: nid(), kind: "arbiter", tradeId, text: s.objections.salary.arbiter });
      } else {
        const o = s.objections[topic ?? s.parentDefault];
        next.push({ id: nid(), kind: "parent", text: o.parent });
        next.push({ id: nid(), kind: "arbiter", tradeId, text: o.arbiter });
      }
      setItems((p) => [...p, ...next]);
      setListening(false);
    }, 1500);
  };

  return (
    <div className="pb-56 sm:pb-44">
      {/* Context strip */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
          {MOCK_TRADES.map((t) => (
            <button
              key={t.trade_id}
              onClick={() => switchTrade(t.trade_id)}
              aria-pressed={tradeId === t.trade_id}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                tradeId === t.trade_id ? "border-navy bg-navy text-navy-foreground" : "bg-background text-navy hover:border-primary"
              }`}
            >
              {lang === "hi" ? t.hindi_title : t.trade_name} (NSQF Level {t.nsqf_level})
            </button>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success">
              <MapPin className="h-4 w-4" /> District: Meerut, UP (Audited Corridor)
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-navy">
              <Scale className="h-4 w-4 text-primary" /> Family Divergence (Δ_dyad): 0.42
              <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">Arbitration Mode Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        <AnimatePresence initial={false}>
          {items.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {m.kind === "arbiter" ? (
                <ArbiterCard tradeId={m.tradeId} text={m.text} onRoi={() => setModal("roi")} onAlumni={() => setModal("alumni")} />
              ) : (
                <Bubble kind={m.kind} text={m.text} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {listening && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
            <Waves />
            <span className="font-medium text-navy">Listening to speech / <span lang="hi">आवाज़ रिकॉर्ड हो रही है...</span></span>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            <button disabled={listening} onClick={() => simulate("student")} className="flex items-center justify-center gap-2 rounded-xl bg-student px-3 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:text-base">
              <Mic className="h-5 w-5" /> Speak as Student <span lang="hi" className="hidden sm:inline">(अमन की बात)</span>
            </button>
            <button disabled={listening} onClick={() => simulate("parent")} className="flex items-center justify-center gap-2 rounded-xl bg-parent px-3 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:text-base">
              <Mic className="h-5 w-5" /> Speak as Parent <span lang="hi" className="hidden sm:inline">(पिताजी की चिंता)</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Quick objections:</span>
            {(Object.keys(TOPIC_LABELS) as Topic[]).map((k) => (
              <button key={k} disabled={listening} onClick={() => simulate("parent", k)} className="rounded-full border border-parent/40 bg-parent-soft px-3 py-1.5 text-sm font-medium text-navy hover:border-parent disabled:opacity-60">
                {TOPIC_LABELS[k].en} <span lang="hi">({TOPIC_LABELS[k].hi})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal === "roi" && <RoiModal onClose={() => setModal(null)} />}
        {modal === "alumni" && <AlumniModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ kind, text }: { kind: "student" | "parent"; text: Bi }) {
  const { lang } = useApp();
  const student = kind === "student";
  return (
    <div className={`flex items-start gap-3 ${student ? "" : "flex-row-reverse"}`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${student ? "bg-student-soft text-student" : "bg-parent-soft text-parent"}`}>
        {student ? <GraduationCap className="h-6 w-6" /> : <Users className="h-6 w-6" />}
      </div>
      <div
        className={`max-w-xl rounded-2xl p-4 text-navy ${
          student ? "rounded-tl-sm border-l-4 border-student bg-student-soft" : "ml-auto rounded-tr-sm border-r-4 border-parent bg-parent-soft"
        }`}
      >
        <div className={`mb-1 text-sm font-semibold ${student ? "text-student" : "text-parent"}`}>{student ? "Aman (Student)" : "Ramesh (Father)"}</div>
        <p lang={lang}>{text[lang]}</p>
      </div>
    </div>
  );
}

function Waves() {
  return (
    <span className="flex h-6 items-end gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="wave-bar h-full w-1.5 rounded bg-primary" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

function ArbiterCard({ tradeId, text, onRoi, onAlumni }: { tradeId: string; text: Bi; onRoi: () => void; onAlumni: () => void }) {
  const { lang } = useApp();
  const [playing, setPlaying] = useState(false);
  const t = MOCK_TRADES.find((x) => x.trade_id === tradeId)!;
  const v = t.verified_metrics;
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return (
    <div className="rounded-2xl border-2 border-navy/15 bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-saffron bg-navy text-navy-foreground">
          <Scale className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-navy">
          MitraSkill Career Arbiter <span lang="hi" className="font-medium text-muted-foreground">(मध्यस्थता सहायक)</span>
        </h3>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
          <BadgeCheck className="h-4 w-4" /> Verified DGT 2024 Audit
        </span>
      </div>
      <p lang={lang} className="mt-4 text-lg text-navy">{text[lang]}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Starting Salary Range" value={`${inr(v.salary_range_min)} – ${inr(v.salary_range_max)} / month`} note={`Source: ${v.audit_source}`} />
        <Metric label="Verified Campus Placement" value={`${v.placement_rate_percentage}%`} note={`Top Recruiters: ${v.top_employers.slice(0, 2).join(", ")}`} accent />
      </div>

      <button onClick={() => setPlaying((p) => !p)} aria-pressed={playing} className="mt-5 flex items-center gap-2 rounded-full border bg-background px-4 py-2 font-medium text-navy">
        <Volume2 className="h-5 w-5 text-primary" /> Suno Hindi Mein {playing && <Waves />}
      </button>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/mobility" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-saffron">
          <GraduationCap className="h-5 w-5" /> View Degree Mobility (NCrF Ladder) <ArrowRight className="h-4 w-4" />
        </Link>
        <button onClick={onRoi} className="flex items-center gap-2 rounded-xl border-2 border-success px-4 py-2 font-semibold text-success">
          <BarChart3 className="h-5 w-5" /> Parent ROI Calculator (BA vs ITI)
        </button>
        <button onClick={onAlumni} className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-semibold text-muted-foreground">
          <Clapperboard className="h-5 w-5" /> Local Alumni Story (Meerut)
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, note, accent }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold ${accent ? "text-success" : "text-navy"}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{note}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function RoiModal({ onClose }: { onClose: () => void }) {
  const { lang } = useApp();
  return (
    <Modal title="Parent ROI Calculator — BA vs ITI" onClose={onClose}>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="text-muted-foreground">
            <tr className="border-b"><th className="py-2 pr-3">Path</th><th className="pr-3">Total cost</th><th className="pr-3">Stipend</th><th className="pr-3">Earnings start</th><th>5-Year cumulative</th></tr>
          </thead>
          <tbody>
            {ROI_ROWS.map((r, i) => (
              <tr key={i} className={`border-b ${i === 1 ? "bg-success/10 font-semibold" : ""}`}>
                <td className="py-3 pr-3 text-navy">{r.path[lang]}</td><td className="pr-3">{r.cost}</td><td className="pr-3">{r.stipend}</td><td className="pr-3">{r.start}</td>
                <td className={i === 1 ? "text-success" : ""}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 rounded-xl bg-accent p-4 font-semibold text-navy">ITI makes your son financially independent 2.5 years earlier.</p>
    </Modal>
  );
}

function AlumniModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Local Alumni Story — Meerut" onClose={onClose}>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-student-soft text-student"><GraduationCap className="h-8 w-8" /></div>
        <div>
          <div className="text-lg font-bold text-navy">Vikas Prajapati</div>
          <div className="text-sm text-muted-foreground">From Saket, Meerut · Completed ITI Mechatronics in 2023</div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-muted p-4">
        <div className="text-sm text-muted-foreground">Now</div>
        <div className="font-semibold text-navy">Diagnostic Technician, Tata Motors EV Plant, Sanand/Pantnagar</div>
        <div className="text-lg font-bold text-success">₹26,000 / month</div>
      </div>
      <blockquote className="mt-4 border-l-4 border-primary pl-4 text-lg italic text-navy">
        “My parents wanted me to do BA. Today I run diagnostic software and send ₹15,000 home every month.”
      </blockquote>
    </Modal>
  );
}
