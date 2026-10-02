import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";

export const Route = createFileRoute("/counsel")({
  head: () => ({
    meta: [
      { title: "Family Counselling Session — MitraSkill" },
      { name: "description", content: "Student and parent explore verified ITI trades together with real placement and salary data." },
      { property: "og:title", content: "Family Counselling Session — MitraSkill" },
      { property: "og:description", content: "Student and parent explore verified ITI trades together." },
    ],
  }),
  component: Counsel,
});

function Counsel() {
  const { lang, mode } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
      <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-navy">Session: {mode}</span>
      <h1 className="mt-4 text-3xl font-bold text-navy">{lang === "hi" ? "संवाद: सत्यापित ट्रेड" : "Dyadic Dialogue: Verified Trades"}</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {MOCK_TRADES.map((tr) => (
          <article key={tr.trade_id} className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold text-navy">{lang === "hi" ? tr.hindi_title : tr.trade_name}</h2>
            <p className="text-sm text-muted-foreground">NSQF {tr.nsqf_level} · {tr.duration_months} months</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted p-3"><div className="text-sm text-muted-foreground">Avg start</div><div className="text-lg font-bold text-navy">₹{tr.verified_metrics.avg_starting_monthly_inr.toLocaleString("en-IN")}</div></div>
              <div className="rounded-xl bg-muted p-3"><div className="text-sm text-muted-foreground">Placement</div><div className="text-lg font-bold text-success">{tr.verified_metrics.placement_rate_percentage}%</div></div>
            </div>
            <p className="mt-4 rounded-xl bg-parent-soft p-3 text-navy" lang={lang}>{tr.parent_reassurance_script[lang]}</p>
            <p className="mt-3 text-xs text-muted-foreground">Source: {tr.verified_metrics.audit_source}</p>
          </article>
        ))}
      </div>
      <Link to="/" className="mt-8 inline-block text-primary underline">← Back to onboarding</Link>
    </div>
  );
}
