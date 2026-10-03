import { CheckCircle2, QrCode, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import type { TradeRecord } from "@/data/mockTrades";
import { useTranslation } from "@/hooks/useTranslation";

export function CertificateCard({ trade, lang }: { trade: TradeRecord; lang: Lang }) {
  const { t } = useTranslation();
  const a = t.accord;
  const hi = lang === "hi";
  const candidate = "Aman Sharma";
  const guardian = "Ramesh Sharma";
  const monthly = `₹${trade.verified_metrics.salary_range_min.toLocaleString("en-IN")} – ₹${trade.verified_metrics.salary_range_max.toLocaleString("en-IN")}`;
  return (
    <article
      id="accord-certificate"
      data-tour="tour-accord-card"
      className="relative overflow-hidden rounded-2xl border-4 border-amber-600/30 bg-[#FFFDF9] p-5 shadow-2xl sm:p-8 print:rounded-none print:border-4 print:p-8 print:shadow-none"
    >
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-amber-500/30" />
      <div
        className="pointer-events-none absolute left-4 top-4 text-xl text-amber-600/60"
        aria-hidden
      >
        ❧
      </div>
      <div
        className="pointer-events-none absolute right-4 top-4 -scale-x-100 text-xl text-amber-600/60"
        aria-hidden
      >
        ❧
      </div>
      <div
        className="pointer-events-none absolute bottom-4 left-4 -rotate-90 text-xl text-amber-600/60"
        aria-hidden
      >
        ❧
      </div>
      <div
        className="pointer-events-none absolute bottom-4 right-4 rotate-180 text-xl text-amber-600/60"
        aria-hidden
      >
        ❧
      </div>
      <div
        className="pointer-events-none absolute right-6 top-28 hidden -rotate-12 sm:block"
        aria-hidden
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/70 bg-amber-100/60 text-center text-[9px] font-black uppercase tracking-wider text-amber-800 shadow-[0_0_0_5px_rgba(217,119,6,0.12)]">
          {a.verifiedSeal.split("•")[0]?.trim() || "Verified"}
          <br />
          Family
          <br />
          Accord
        </div>
        <div className="mx-auto h-5 w-12 bg-gradient-to-b from-amber-500/70 to-transparent" />
      </div>
      <div className="relative">
        <header className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 bg-white text-navy">
            <Crest />
          </div>
          <div className="mt-3 text-xs font-bold tracking-[.18em] text-amber-700">
            {a.subTitle.split("|")[0]?.trim() || "MINISTRY OF SKILL DEVELOPMENT & ENTREPRENEURSHIP"}
          </div>
          <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-navy sm:text-3xl">
            {a.officialTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {a.subTitle}
          </p>
          <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-50 px-4 py-1.5 font-mono text-xs font-bold text-amber-800">
            <span className="opacity-70">{a.docIdLabel}</span>
            <span>MSDE-NDS-2026-MEERUT-8842</span>
          </div>
        </header>
        <div className="mt-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-900/70">
            {a.partiesTitle}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              label={a.candidateLabel}
              value={`${candidate} · Age 17`}
              sub={hi ? "कक्षा 10 उत्तीर्ण" : "10th Pass"}
            />
            <Info
              label={a.parentLabel}
              value={guardian}
              sub={hi ? "पिता" : "Father"}
            />
            <Info
              label={a.tradeLabel}
              value={trade.trade_name}
              sub={`NSQF Level ${trade.nsqf_level}`}
            />
            <Info
              label={a.centerLabel}
              value="Government ITI Saket"
              sub="Meerut Node, Uttar Pradesh"
            />
          </div>
        </div>
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
          <h2 className="font-bold text-navy">
            {a.termsTitle}
          </h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <Term>
              {a.term1}
            </Term>
            <Term>
              {a.term2}
            </Term>
            <Term>
              {a.term3}
            </Term>
            <Term>
              {a.term4}
            </Term>
          </ul>
        </section>
        <div className="mt-5 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-navy/30 bg-muted text-navy">
              <QrCode className="h-12 w-12" />
            </div>
            <span className="max-w-36 text-xs font-medium text-slate-600">
              Scan to verify NCVET accreditation{" "}
              <small className="mt-1 block">Demo QR placeholder</small>
            </span>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            {[
              `${candidate} (Learner Acknowledged)`,
              `${guardian} (Guardian Acknowledged)`,
              "Authorized Signatory, District Skill Committee Meerut",
            ].map((name) => (
              <div
                key={name}
                className="border-t border-emerald-600/30 pt-2 text-xs text-slate-700"
              >
                <CheckCircle2 className="mb-1 h-4 w-4 text-emerald-600" />
                <span className="font-serif italic text-emerald-800">Acknowledged</span>
                <div className="mt-1 font-medium">{name}</div>
              </div>
            ))}
          </div>
        </div>
        <footer className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success" />
          <span>{a.verifiedSeal}</span>
        </footer>
      </div>
    </article>
  );
}
function Info({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border bg-white/80 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-bold text-navy">{value}</div>
      <div className="text-sm text-slate-600">{sub}</div>
    </div>
  );
}
function Term({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{children}</span>
    </li>
  );
}
function Crest() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-label="Official emblem placeholder">
      <path d="M12 16h24l-3 5H15zM16 22h16v11H16zM12 36h24v3H12z" fill="currentColor" />
      <circle cx="24" cy="11" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 18l-4-4m36 4 4-4M8 26l-4 2m36-2 4 2M10 34l-5 5m33-5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
