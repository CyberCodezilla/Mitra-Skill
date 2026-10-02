import { CheckCircle2, QrCode, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import type { TradeRecord } from "@/data/mockTrades";

export function CertificateCard({ trade, lang }: { trade: TradeRecord; lang: Lang }) {
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
          Verified
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
            MINISTRY OF SKILL DEVELOPMENT & ENTREPRENEURSHIP
          </div>
          <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-navy sm:text-3xl">
            Parivaar Rozgar Patra
          </h1>
          <p lang="hi" className="text-lg font-semibold text-navy">
            परिवार रोज़गार पत्र
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ministry of Skill Development & Entrepreneurship (MSDE) | Skill India Mission
          </p>
          <div className="mx-auto mt-4 inline-block rounded-full border border-amber-600/30 bg-amber-50 px-4 py-1.5 font-mono text-xs font-bold text-amber-800">
            MSDE-NDS-2026-MEERUT-8842
          </div>
        </header>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-600">
          {hi
            ? "यह पारिवारिक संकल्प पत्र कौशल प्रशिक्षण के चयन और आगे की शैक्षणिक यात्रा को दर्ज करता है।"
            : "This family milestone records a shared choice of technical training and a pathway for continued learning."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info
            label={hi ? "उम्मीदवार" : "Candidate"}
            value={`${candidate} · Age 17`}
            sub={hi ? "कक्षा 10 उत्तीर्ण" : "10th Pass"}
          />
          <Info
            label={hi ? "अभिभावक" : "Parent / Guardian"}
            value={guardian}
            sub={hi ? "पिता" : "Father"}
          />
          <Info
            label={hi ? "चयनित व्यवसाय" : "Selected vocation"}
            value={trade.trade_name}
            sub={`NSQF Level ${trade.nsqf_level}`}
          />
          <Info
            label={hi ? "प्रशिक्षण केंद्र" : "Training center"}
            value="Government ITI Saket"
            sub="Meerut Node, Uttar Pradesh"
          />
        </div>
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
          <h2 className="font-bold text-navy">
            {hi ? "हमारी साझा प्रतिबद्धताएँ" : "Shared family commitments"}
          </h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <Term>
              {hi
                ? `${trade.duration_months} महीने के प्रशिक्षण में नियमित भागीदारी और 85% या अधिक उपस्थिति का लक्ष्य।`
                : `Student commitment: complete ${trade.duration_months} months of training with a target of 85%+ attendance.`}
            </Term>
            <Term>
              {hi
                ? "अभिभावक सामान्य BA पाठ्यक्रम के बजाय तकनीकी कौशल प्रशिक्षण का समर्थन करेंगे।"
                : "Parent agreement: support technical skilling alongside the family's education and career planning."}
            </Term>
            <Term>
              {hi
                ? `${trade.ncrf_mobility.credits_earned} NCrF क्रेडिट अर्जित; डिप्लोमा में क्रेडिट/प्रवेश संबंधित संस्था के नियमों के अनुसार।`
                : `${trade.ncrf_mobility.credits_earned} NCrF credits shown in the pathway; diploma credit and entry decisions follow the admitting institution's rules.`}
            </Term>
            <Term>
              {hi
                ? `सत्यापित शुरुआती वेतन सीमा ${monthly}/माह (${trade.verified_metrics.audit_source})।`
                : `Audited starting pay benchmark: ${monthly}/month (${trade.verified_metrics.audit_source}).`}
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
          {hi
            ? "प्रोटोटाइप पारिवारिक सहमति प्रमाणपत्र · आधिकारिक सरकारी दस्तावेज़ नहीं"
            : "Prototype family agreement certificate · not an official government document"}
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
