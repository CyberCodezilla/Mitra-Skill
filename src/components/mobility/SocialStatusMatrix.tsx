import { Scale, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import type { TradeRecord } from "@/data/mockTrades";

export function SocialStatusMatrix({ lang, trade }: { lang: Lang; trade: TradeRecord }) {
  const hi = lang === "hi";
  const pay = `₹${trade.verified_metrics.salary_range_min.toLocaleString("en-IN")}`;
  const rows: [string, string][] = hi
    ? [
        [
          "वह हमेशा सड़क किनारे मैकेनिक रहेगा।",
          "पॉलिटेक्निक डिप्लोमा में पार्श्व प्रवेश का रास्ता उपलब्ध हो सकता है; नियम राज्य और संस्था तय करते हैं।",
        ],
        [
          "वह सरकारी अधिकारी परीक्षाएँ नहीं दे पाएगा।",
          "आगे B.Voc / B.Tech डिग्री पूरी करने पर संबंधित पदों की योग्यता पूरी हो सकती है; हर परीक्षा के नियम अलग हैं।",
        ],
        [
          "इस काम को समाज में सम्मान नहीं मिलेगा।",
          `${trade.verified_metrics.work_environment}; सत्यापित शुरुआती वेतन ${pay}/माह से शुरू।`,
        ],
      ]
    : [
        [
          "He will remain a roadside mechanic forever.",
          "A route to lateral entry in a Polytechnic Diploma may be available; the state and institution set the rules.",
        ],
        [
          "He can never sit for government officer exams.",
          "A B.Voc / B.Tech may meet eligibility for relevant posts; each exam has its own rules.",
        ],
        [
          "This work has low social prestige.",
          `${trade.verified_metrics.work_environment}; verified starting pay ranges from ${pay}/month.`,
        ],
      ];
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-navy">
        <Scale className="h-5 w-5 text-primary" />
        {hi ? "धारणा बनाम वास्तविकता" : "Roadside Perception vs. NCrF Pathway"}
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map(([perception, reality]) => (
          <article key={perception} className="rounded-xl border p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-parent">
              {hi ? "सामाजिक भ्रम" : "What relatives assume"}
            </div>
            <p className="mt-1 font-medium text-navy">“{perception}”</p>
            <div className="my-3 h-px bg-border" />
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-success">
                  {hi ? "NCrF का संभावित मार्ग" : "What the NCrF pathway can support"}
                </div>
                <p className="mt-1 text-sm text-navy">{reality}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {hi
          ? "पात्रता और क्रेडिट हस्तांतरण की पुष्टि संबंधित प्रवेश संस्था से करें।"
          : "Confirm current credit transfer and eligibility with the admitting institution or exam authority."}
      </p>
    </section>
  );
}
