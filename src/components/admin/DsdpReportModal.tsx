import { FileText, Printer, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lang } from "@/lib/app-context";

const MEMO_REFERENCE = "MSDE/DSC-MRT/2026/POLICY-REV-04";

export function DsdpReportModal({
  isOpen,
  onClose,
  state,
  district,
  lang = "en",
}: {
  isOpen: boolean;
  onClose: () => void;
  state: string;
  district: string;
  lang?: Lang;
}) {
  const hi = lang === "hi";
  const operationalMonth = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const printMemo = () => {
    const report = window.open("", "_blank", "width=900,height=760");
    if (!report) return;
    const escapeHtml = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ??
          character,
      );
    const safeState = escapeHtml(state);
    const safeDistrict = escapeHtml(district);
    const safeMonth = escapeHtml(operationalMonth);
    report.document
      .write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>DSDP Action Memo — ${safeDistrict}</title><style>
      *{box-sizing:border-box}body{font:14px/1.55 Arial,system-ui,sans-serif;color:#182b3b;max-width:900px;margin:30px auto;padding:0 32px}.letterhead{display:grid;grid-template-columns:62px 1fr auto;align-items:center;gap:16px;border-bottom:3px double #9b741e;padding:0 0 16px}.seal{width:58px;height:58px;border:2px solid #9b741e;border-radius:50%;display:grid;place-items:center;color:#17344f;font-weight:800;font-size:12px}.office{font-size:11px;font-weight:700;letter-spacing:.08em;color:#536579}.title{font:700 20px/1.25 Georgia,serif;margin:5px 0;color:#17344f}.draft{border:2px solid #ad3427;color:#ad3427;padding:7px 10px;font-weight:800;font-size:11px;letter-spacing:.1em;transform:rotate(-4deg);white-space:nowrap}.memo-meta{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px;border-bottom:1px solid #bac6d0;padding:14px 0;font-size:12px}.subject{margin:17px 0;padding:11px 13px;background:#f2f5f7;border-left:4px solid #9b741e}.subject strong{display:block;margin-bottom:4px}.notice{border:1px solid #d89a22;background:#fff8e8;padding:11px 13px;margin:15px 0;color:#68430a;font-size:12px}h2{font:700 16px Georgia,serif;color:#17344f;margin:20px 0 7px}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.metric{border:1px solid #d3dce3;border-radius:7px;padding:10px}.metric strong{display:block;font-size:18px;color:#17344f}.metric span{font-size:11px}.directives{padding-left:24px}.directives li{padding:0 0 9px 4px}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:45px;margin-top:42px}.signature{border-top:1px solid #536579;padding-top:7px;font-size:12px}.signature small{display:block;color:#8b3c31;font-weight:700;margin-top:5px}footer{border-top:1px solid #bac6d0;margin-top:25px;padding-top:10px;font-size:10px;color:#536579}@media print{body{margin:0 auto;padding:8mm}.draft{transform:rotate(-4deg)}}
      </style></head><body><header class="letterhead"><div class="seal">MSDE</div><div><div class="office">GOVERNMENT OF INDIA · MINISTRY OF SKILL DEVELOPMENT AND ENTREPRENEURSHIP</div><div class="title">DISTRICT SKILL COMMITTEE (${safeDistrict.toUpperCase()}) — ACTION MEMO</div><div class="office">District Skill Development Plan · ${safeState}</div></div><div class="draft">DRAFT<br>FOR REVIEW</div></header><div class="memo-meta"><div><b>Memo Ref:</b> ${MEMO_REFERENCE}</div><div><b>Operational month:</b> ${safeMonth}</div><div><b>To:</b> District Skill Committee (${safeDistrict})</div><div><b>From:</b> MitraSkill prototype · policy review draft</div></div><div class="subject"><strong>Subject</strong>Data-Driven Resource Allocation Mandates derived from MitraSkill Dyadic Telemetry.</div><div class="notice"><b>IMPORTANT — NOT AN ISSUED GOVERNMENT ORDER.</b> This prototype memo contains illustrative figures and proposed actions supplied for demonstration. They are not verified district findings, approved allocations, or authorized directives. Validate all telemetry, consult relevant agencies, confirm budgets and operational feasibility, and obtain competent authority approval before any action. No official Government of India emblem, seal, or signature is represented.</div><h2>1. Executive Friction Summary <small>(illustrative sample telemetry)</small></h2><div class="metric-grid"><div class="metric"><strong>4,821</strong><span>Total Dyad Sessions (sample figure)</span></div><div class="metric"><strong>42%</strong><span>of parents cite Social Prestige &amp; Relative Stigma as primary veto trigger (sample figure)</span></div><div class="metric"><strong>67%</strong><span>resistance in Sardhana block attributed to female transit concerns (sample figure)</span></div></div><h2>2. Proposed Administrative Directives &amp; Allocations</h2><p><b>For committee review only; these proposals are not approved or mandatory orders.</b></p><ol class="directives" type="A"><li><b>Transport access:</b> Consider deploying 2 dedicated UPSRTC Mission Shakti feeder buses covering Sardhana &amp; Mawana blocks to Government ITI Saket, subject to route feasibility, safety audit, budget approval, and UPSRTC authorization.</li><li><b>Family engagement:</b> Consider quarterly “Parivaar Rozgar Sammelan” events in 14 village panchayats, featuring Tata Motors &amp; Tata Power alumni only after partner participation and any alumni credentials are verified.</li><li><b>Academic mobility information:</b> Consider distributing NCrF Academic Equivalence circulars to secondary school principals in Meerut District after the applicable equivalence, credit-transfer, and admission guidance is confirmed by competent authorities.</li></ol><h2>3. Review &amp; Approval Record</h2><p>Before adoption, record the evidence source and validation date for each statistic, the responsible implementing agency, a cost estimate, approval reference, and measurable review indicators.</p><div class="signatures"><div class="signature">District Magistrate &amp; Chairman, DSC ${safeDistrict}<small>Signature / seal pending · draft template only</small></div><div class="signature">District Nodal Officer, MSDE<small>Name and authorized signature pending · draft template only</small></div></div><footer>MitraSkill prototype-generated policy discussion draft · Not an official communication, order, sanction, commitment, or signed government document.</footer><script>window.onload=()=>window.print()</script></body></html>`);
    report.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-border bg-card text-card-foreground">
        <DialogHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <FileText className="h-5 w-5" />
          </div>
          <DialogTitle>
            {hi ? "DSDP Executive Policy Memo" : "DSDP Executive Policy Memo"}
          </DialogTitle>
          <DialogDescription>
            Draft for review · {district}, {state} · {operationalMonth}
          </DialogDescription>
        </DialogHeader>

        <article className="relative overflow-hidden rounded-xl border border-border bg-background p-5 text-sm leading-relaxed sm:p-6">
          <div className="pointer-events-none absolute right-2 top-24 rotate-[-20deg] border-4 border-red-700/15 px-3 py-1 text-2xl font-black tracking-widest text-red-700/15">
            DRAFT
          </div>
          <div className="flex flex-wrap items-center gap-3 border-b-2 border-double border-amber-700/60 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-700 text-xs font-black text-navy">
              MSDE
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Government of India · Ministry of Skill Development and Entrepreneurship
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold leading-tight text-navy">
                District Skill Committee ({district.toUpperCase()}) — Action Memo
              </h3>
            </div>
            <span className="rounded border-2 border-red-700 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-red-800">
              Draft · Review
            </span>
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
            <p>
              <b>Memo Ref:</b> {MEMO_REFERENCE}
            </p>
            <p>
              <b>Operational month:</b> {operationalMonth}
            </p>
            <p>
              <b>To:</b> District Skill Committee ({district})
            </p>
            <p>
              <b>From:</b> MitraSkill prototype · policy review draft
            </p>
          </div>
          <div className="mt-4 rounded-lg border-l-4 border-amber-600 bg-amber-50 p-3 text-xs text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
            <b>Subject:</b> Data-Driven Resource Allocation Mandates derived from MitraSkill Dyadic
            Telemetry.
          </div>
          <div className="mt-3 flex gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <b>NOT AN ISSUED GOVERNMENT ORDER.</b> Figures and proposals below are illustrative
              demonstration content, not verified district findings, approved allocations, or
              authorized directives. Validate evidence, feasibility, budget, and approvals before
              action. No official emblem, seal, or signature is represented.
            </p>
          </div>

          <h4 className="mt-5 font-serif font-bold text-navy">
            1. Executive Friction Summary{" "}
            <span className="font-sans text-[10px] font-medium text-muted-foreground">
              (sample telemetry)
            </span>
          </h4>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <SummaryMetric value="4,821" text="Total Dyad Sessions · sample figure" />
            <SummaryMetric
              value="42%"
              text="of parents cite Social Prestige & Relative Stigma as primary veto trigger · sample figure"
            />
            <SummaryMetric
              value="67%"
              text="resistance in Sardhana block driven by female transit concerns · sample figure"
            />
          </div>
          <h4 className="mt-5 font-serif font-bold text-navy">
            2. Proposed Administrative Directives &amp; Allocations
          </h4>
          <p className="mt-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
            For committee consideration only; not approved or mandatory orders.
          </p>
          <ol className="mt-2 list-[upper-alpha] space-y-2 pl-5 text-xs text-muted-foreground">
            <li>
              <b className="text-foreground">Transport access:</b> Consider deploying 2 dedicated
              UPSRTC Mission Shakti feeder buses covering Sardhana &amp; Mawana blocks to Government
              ITI Saket, subject to route feasibility, safety audit, budget approval, and UPSRTC
              authorization.
            </li>
            <li>
              <b className="text-foreground">Family engagement:</b> Consider quarterly “Parivaar
              Rozgar Sammelan” in 14 village panchayats featuring Tata Motors &amp; Tata Power
              alumni only after partner participation and credentials are verified.
            </li>
            <li>
              <b className="text-foreground">Academic mobility information:</b> Consider
              distributing NCrF Academic Equivalence circulars to secondary school principals after
              guidance is confirmed by competent authorities.
            </li>
          </ol>
          <h4 className="mt-5 font-serif font-bold text-navy">3. Review &amp; Approval Record</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Before adoption, record evidence sources and validation dates, implementing agencies,
            cost estimates, approval references, and measurable review indicators.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <Signature title={`District Magistrate & Chairman, DSC ${district}`} />
            <Signature title="District Nodal Officer, MSDE" />
          </div>
          <p className="mt-4 text-center text-[10px] font-bold text-red-800">
            Signature and seal pending · draft template only
          </p>
          <p className="mt-4 border-t border-border pt-3 text-[10px] text-muted-foreground">
            MitraSkill prototype-generated discussion draft · Not an official communication, order,
            sanction, commitment, or signed government document.
          </p>
        </article>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {hi ? "Close" : "Close"}
          </button>
          <button
            type="button"
            onClick={printMemo}
            className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Printer className="h-4 w-4" />
            {hi ? "Print / Save Draft Memo (PDF)" : "Print / Save Draft Memo (PDF)"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryMetric({ value, text }: { value: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <strong className="block text-lg text-navy">{value}</strong>
      <span className="text-[10px] leading-snug text-muted-foreground">{text}</span>
    </div>
  );
}

function Signature({ title }: { title: string }) {
  return (
    <div className="border-t border-muted-foreground/60 pt-2 text-xs font-semibold text-foreground">
      {title}
      <span className="mt-1 block text-[10px] font-medium text-red-800">
        Signature pending · draft template only
      </span>
    </div>
  );
}
