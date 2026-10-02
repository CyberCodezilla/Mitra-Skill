import { FileText, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lang } from "@/lib/app-context";

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
  const issueDate = new Intl.DateTimeFormat(hi ? "hi-IN" : "en-IN", { dateStyle: "long" }).format(
    new Date(),
  );

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
    report.document
      .write(`<!doctype html><html lang="${hi ? "hi" : "en"}"><head><meta charset="utf-8"><title>DSDP Action Memo — ${safeDistrict}</title><style>
      *{box-sizing:border-box}body{font:15px/1.6 Arial,system-ui,sans-serif;color:#172b3c;max-width:900px;margin:36px auto;padding:0 32px}header{border-bottom:3px solid #b7791f;padding-bottom:18px;margin-bottom:24px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.08em;color:#526579}h1{font-size:27px;line-height:1.2;margin:8px 0}h2{font-size:17px;margin:24px 0 6px;color:#16334c}p{margin:8px 0}.status{display:inline-block;background:#fff4dc;border:1px solid #d99a24;padding:4px 9px;border-radius:20px;font-size:11px;font-weight:700}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f3f6f8;padding:14px;border-radius:8px}.notice{border-left:4px solid #b7791f;background:#fff8e8;padding:12px;margin:18px 0}.actions li{margin:10px 0}footer{border-top:1px solid #ccd6df;margin-top:32px;padding-top:12px;font-size:12px;color:#526579}.sign{display:flex;gap:60px;margin-top:42px}.sign div{width:45%;border-top:1px solid #718096;padding-top:7px;font-size:12px}@media print{body{margin:0 auto;padding:0 8mm}button{display:none}}
      </style></head><body><header><div class="eyebrow">MITRASKILL · DISTRICT SKILL DEVELOPMENT PLAN</div><span class="status">DRAFT FOR COMMITTEE REVIEW · SAMPLE TELEMETRY</span><h1>District Skill Committee — Policy Action Memo</h1><p>District Skill Development Plan (DSDP) review note</p></header><div class="meta"><div><b>State / District</b><br>${safeState} / ${safeDistrict}</div><div><b>Prepared</b><br>${escapeHtml(issueDate)}</div><div><b>Audience</b><br>District Skill Committee and local training partners</div><div><b>Purpose</b><br>Discussion draft for planning and validation</div></div><div class="notice"><b>Data limitation:</b> This is a prototype-generated planning memo. Dashboard indicators and all intervention suggestions shown here are illustrative sample data, not verified district measurements, sanctioned allocations, or official government directions. Validate with current DSDP records, ITIs, employers, and community stakeholders before adoption.</div><h2>1. Planning signal</h2><p>The prototype dashboard indicates potential friction around career awareness, family confidence, safe travel, local employment information, and post-ITI education routes. These signals should be treated only as hypotheses for committee validation.</p><h2>2. Proposed actions for committee consideration</h2><ol class="actions"><li><b>Validate the local opportunity map.</b> Ask ITIs and apprenticeship partners to confirm trade-wise intake, current vacancies, eligibility, stipend terms, and source dates.</li><li><b>Run family-facing career information sessions.</b> Include students, parents, women trainees, alumni, and local employers; publish accessible Hindi and English materials.</li><li><b>Review mobility and safety barriers.</b> Map actual commute times and available support with trainees and institutions before proposing transport interventions.</li><li><b>Strengthen verified progression guidance.</b> Confirm applicable NCrF credit recognition and admission rules directly with receiving institutions; avoid promising automatic transfer or admission.</li><li><b>Assign owners and review dates.</b> Record an accountable institution, evidence source, completion date, and an outcome measure for each committee-approved action.</li></ol><h2>3. Suggested monitoring fields</h2><p>Trade and institution · seats confirmed and date · apprenticeship openings confirmed and date · applicant-to-enrolment conversion · retention by gender and block · commute/safety issues raised and resolved · verified progression outcomes.</p><h2>4. Decisions requested</h2><p>Committee members are invited to validate or amend the planning signals, nominate data owners, and approve only actions supported by current local evidence and available resources.</p><div class="sign"><div>Chair / authorized committee representative<br>Name and date</div><div>District Skill Development Mission<br>Review and record reference</div></div><footer>Generated by MitraSkill prototype · No official order, approval, funding commitment, or verified field audit is represented by this draft.</footer><script>window.onload=()=>window.print()</script></body></html>`);
    report.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card text-card-foreground">
        <DialogHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <FileText className="h-5 w-5" />
          </div>
          <DialogTitle>{hi ? "DSDP policy action memo" : "DSDP Policy Action Memo"}</DialogTitle>
          <DialogDescription>
            {hi
              ? "Draft for District Skill Committee review"
              : `Draft planning memo for ${district}, ${state}`}
          </DialogDescription>
        </DialogHeader>
        <article className="rounded-xl border border-border bg-background p-5 text-sm leading-relaxed">
          <div className="text-xs font-bold tracking-widest text-muted-foreground">
            MITRASKILL · DISTRICT SKILL DEVELOPMENT PLAN
          </div>
          <div className="mt-2 inline-flex rounded-full border border-amber-400 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-950 dark:bg-amber-950 dark:text-amber-100">
            DRAFT · SAMPLE TELEMETRY
          </div>
          <h3 className="mt-3 text-xl font-bold text-foreground">
            District Skill Committee — Policy Action Memo
          </h3>
          <p className="text-muted-foreground">
            {district}, {state} · {issueDate}
          </p>
          <div className="mt-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
            Prototype-generated discussion draft. Dashboard signals are illustrative—not verified
            district measurements, sanctioned allocations, or official directions. Validate against
            current DSDP records before adoption.
          </div>
          <h4 className="mt-4 font-bold text-foreground">Proposed committee actions</h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-muted-foreground">
            <li>
              Confirm trade-wise ITI seats and apprenticeship openings with dated source records.
            </li>
            <li>
              Co-design Hindi and English career information sessions with students, families, women
              trainees, alumni, and employers.
            </li>
            <li>
              Review real commute and safety barriers with trainees and institutions before planning
              support.
            </li>
            <li>
              Verify NCrF credit and admission rules with receiving institutions; do not promise
              automatic admission or transfer.
            </li>
            <li>
              Assign an owner, evidence source, review date, and outcome measure to every approved
              action.
            </li>
          </ol>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Draft for committee discussion only · No government order, approval, or funding
            commitment is represented.
          </p>
        </article>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={printMemo}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Printer className="h-4 w-4" />
            {hi ? "Print / Save as PDF" : "Print / Save as PDF"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
