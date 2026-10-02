import { createFileRoute, Link } from "@tanstack/react-router";
import { MOCK_TRADES } from "@/data/mockTrades";

export const Route = createFileRoute("/mobility")({
  head: () => ({
    meta: [
      { title: "Degree Mobility (NCrF Ladder) — MitraSkill" },
      { name: "description", content: "How ITI credits ladder into Polytechnic diplomas and B.Tech degrees under NCrF." },
      { property: "og:title", content: "Degree Mobility — MitraSkill" },
      { property: "og:description", content: "How ITI credits ladder into diplomas and degrees under NCrF." },
    ],
  }),
  component: Mobility,
});

function Mobility() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
      <h1 className="text-3xl font-bold text-navy">Degree Mobility — NCrF Ladder</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {MOCK_TRADES.map((t) => (
          <article key={t.trade_id} className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold text-navy">{t.trade_name}</h2>
            <ol className="mt-4 space-y-3">
              <li className="rounded-xl bg-muted p-3"><b>{t.ncrf_mobility.credits_earned} NCrF credits</b> earned</li>
              <li className="rounded-xl bg-accent p-3">{t.ncrf_mobility.next_academic_step}</li>
              <li className="rounded-xl bg-success/15 p-3">{t.ncrf_mobility.degree_eligibility}</li>
            </ol>
          </article>
        ))}
      </div>
      <Link to="/counsel" className="mt-8 inline-block text-primary underline">← Back to dialogue</Link>
    </div>
  );
}
