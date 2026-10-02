import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  Bus,
  Building2,
  Camera,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Handshake,
  Printer,
  ShieldCheck,
  X,
} from "lucide-react";
import { MOCK_FACILITY_DATA, type FacilityAudit } from "@/data/mockFacilities";
import type { Lang } from "@/lib/app-context";

type Tab = "overview" | "safety" | "labs" | "employers";
type Props = { isOpen: boolean; onClose: () => void; lang: Lang; tradeId?: string };

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

function printFacilitySummary(facility: FacilityAudit, lang: Lang): boolean {
  const report = window.open("", "_blank", "width=860,height=720");
  if (!report) return false;
  const hi = lang === "hi";
  const list = (items: string[]) =>
    `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const labs = facility.modern_labs
    .map(
      (lab) =>
        `<section><h3>${escapeHtml(lab.name)}</h3><p>${escapeHtml(lab.environment)}</p><p><b>Funding:</b> ${escapeHtml(lab.scheme_funded)}</p>${list(lab.equipment)}</section>`,
    )
    .join("");
  const employers = facility.active_industry_mous
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.company)}</td><td>${item.intake_per_year}</td><td>${escapeHtml(item.stipend_during_training)}</td></tr>`,
    )
    .join("");
  report.document.write(
    `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${hi ? "केंद्र विवरण" : "Facility summary"}</title><style>body{font:15px/1.55 system-ui,sans-serif;color:#18324b;max-width:850px;margin:36px auto;padding:0 24px}h1,h2{color:#102b45}header{border-bottom:2px solid #d99a24;padding-bottom:14px}.notice{border:1px solid #b45309;background:#fff7ed;padding:12px;border-radius:10px;color:#7c2d12}section{border:1px solid #dbe3eb;border-radius:10px;padding:14px;margin:14px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccd6e0;padding:8px;text-align:left}small{color:#526579}@media print{body{margin:0 auto}}</style></head><body><header><small>MITRASKILL · ${hi ? "डेमो सारांश" : "DEMO SUMMARY"}</small><h1>${escapeHtml(hi ? facility.center_name_hi : facility.center_name)}</h1><p>${escapeHtml(facility.district)} · ${escapeHtml(facility.address)}</p></header><p class="notice"><b>${hi ? "सत्यापित ऑडिट नहीं" : "NOT A VERIFIED AUDIT"}</b><br>${escapeHtml(facility.data_notice)}</p><section><h2>${hi ? "कैंपस अवलोकन" : "Campus overview"}</h2><p>Sample grade: ${escapeHtml(facility.ncvet_grade)} · Sample ID: ${escapeHtml(facility.center_id)}</p><p>Safety score: ${facility.safety_score}/10 · CCTV: ${facility.cctv_coverage_percent}% · CITS: ${facility.faculty_cits_certified_percent}% · Biometric attendance: ${facility.biometric_attendance ? "sampled as available" : "sampled as unavailable"}</p><p>${escapeHtml(facility.audit_timestamp)} · ${escapeHtml(facility.audited_by)}</p></section><section><h2>${hi ? "महिला परिवहन एवं सुरक्षा" : "Women's transit & safety"}</h2><p>Transit: ${facility.female_transit.available ? "sampled as available" : "sampled as unavailable"} · Escort: ${facility.female_transit.escort_support ? "sampled as available" : "sampled as unavailable"}</p><p>${escapeHtml(facility.female_transit.free_pass_scheme)}</p>${list(facility.female_transit.routes)}</section><h2>${hi ? "लैब" : "Labs"}</h2>${labs}<section><h2>${hi ? "उद्योग सूची (नमूना)" : "Industry listings (sample)"}</h2><table><thead><tr><th>Company</th><th>Annual intake (sample)</th><th>Training stipend (sample)</th></tr></thead><tbody>${employers}</tbody></table></section><p><small>${hi ? "प्रकाशित करने से पहले संस्थान से मूल दस्तावेज़ लेकर हर विवरण की पुष्टि करें।" : "Obtain source documents and confirm every detail with the institution before publishing."}</small></p><script>window.onload=()=>window.print();</script></body></html>`,
  );
  report.document.close();
  return true;
}

export function FacilityVerificationModal({
  isOpen,
  onClose,
  lang,
  tradeId = "AUTO_MECH_01",
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [notice, setNotice] = useState("");
  const hi = lang === "hi";
  const facility = MOCK_FACILITY_DATA[tradeId] ?? MOCK_FACILITY_DATA["AUTO_MECH_01"]!;

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setNotice("");
    }
  }, [isOpen, tradeId]);
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const tabs: { id: Tab; en: string; hi: string; icon: typeof Building2 }[] = [
    { id: "overview", en: "Campus overview", hi: "कैंपस अवलोकन", icon: Building2 },
    { id: "safety", en: "Safety & transit", hi: "सुरक्षा व परिवहन", icon: ShieldCheck },
    { id: "labs", en: "Labs", hi: "आधुनिक लैब", icon: Cpu },
    { id: "employers", en: "Industry links", hi: "उद्योग साझेदारी", icon: Handshake },
  ];
  const print = () =>
    setNotice(
      printFacilitySummary(facility, lang)
        ? hi
          ? "प्रिंट संवाद खुला है—आप PDF के रूप में सहेज सकते हैं।"
          : "Print dialog opened—you can save the summary as a PDF."
        : hi
          ? "पॉप-अप अवरुद्ध है। प्रिंट सारांश खोलने के लिए पॉप-अप की अनुमति दें।"
          : "The print window was blocked. Allow pop-ups to open the printable summary.",
    );

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-navy/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="facility-hub-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-400/15 text-emerald-200">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="facility-hub-title" className="font-bold">
                  {hi ? "केंद्र एवं सुरक्षा जानकारी" : "Facility & Safety Hub"}
                </h2>
                <span className="rounded-full border border-amber-300/50 bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold text-amber-100">
                  {hi ? "डेमो डेटा" : "SAMPLE DATA"}
                </span>
              </div>
              <p className="truncate text-xs text-white/70">
                {hi ? facility.center_name_hi : facility.center_name} · {facility.center_id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close facility verification"
            className="rounded-lg p-2 text-white/75 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <nav
          aria-label={hi ? "केंद्र की जानकारी" : "Facility information"}
          className="flex gap-1 overflow-x-auto border-b bg-muted/40 px-3 pt-3 sm:px-5"
        >
          {tabs.map(({ id, en, hi: labelHi, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-t-xl border-b-2 px-3 py-3 text-xs font-bold transition sm:text-sm ${activeTab === id ? "border-emerald-700 bg-card text-emerald-800" : "border-transparent text-muted-foreground hover:bg-card/70 hover:text-navy"}`}
            >
              <Icon className="h-4 w-4" />
              {hi ? labelHi : en}
            </button>
          ))}
        </nav>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-bold">
                {hi
                  ? "ये आँकड़े आधिकारिक रूप से सत्यापित नहीं हैं"
                  : "These figures are not officially verified"}
              </p>
              <p className="mt-1 text-sm">
                {hi
                  ? "यह केवल UI प्रोटोटाइप का नमूना डेटा है। संस्थान से मूल ऑडिट/दस्तावेज़ की पुष्टि के बिना इसे निर्णय या प्रकाशन के लिए इस्तेमाल न करें।"
                  : "Prototype sample data only. Do not rely on or publish these claims without confirming source audit documents with the institution."}
              </p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat
                    icon={Award}
                    label={hi ? "नमूना सुरक्षा स्कोर" : "Sample safety score"}
                    value={`${facility.safety_score} / 10`}
                  />
                  <Stat
                    icon={Camera}
                    label={hi ? "नमूना CCTV कवरेज" : "Sample CCTV coverage"}
                    value={`${facility.cctv_coverage_percent}%`}
                  />
                  <Stat
                    icon={CheckCircle2}
                    label={hi ? "CITS प्रमाणन (नमूना)" : "CITS-certified faculty (sample)"}
                    value={`${facility.faculty_cits_certified_percent}%`}
                  />
                  <Stat
                    icon={Fingerprint}
                    label={hi ? "उपस्थिति (नमूना)" : "Attendance (sample)"}
                    value={
                      facility.biometric_attendance
                        ? hi
                          ? "बायोमेट्रिक"
                          : "Biometric"
                        : hi
                          ? "मैनुअल"
                          : "Manual"
                    }
                  />
                </div>
                <div className="rounded-2xl border bg-background p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy">
                      {hi ? "केंद्र का नमूना रिकॉर्ड" : "Sample center record"}
                    </h3>
                    <span className="rounded-full border border-emerald-700/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
                      {facility.ncvet_grade}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <Detail label={hi ? "पता" : "Address"} value={facility.address} />
                    <Detail label={hi ? "ज़िला" : "District"} value={facility.district} />
                    <Detail
                      label={hi ? "नमूना संबद्धता कोड" : "Sample affiliation code"}
                      value={facility.affiliation_code}
                    />
                    <Detail
                      label={hi ? "ऑडिट तिथि / श्रेय" : "Audit date / attribution"}
                      value={`${facility.audit_timestamp} · ${facility.audited_by}`}
                    />
                  </dl>
                </div>
              </motion.div>
            )}

            {activeTab === "safety" && (
              <motion.div
                key="safety"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border bg-background p-4 sm:p-5">
                  <div className="flex items-center gap-2 font-bold text-navy">
                    <Bus className="h-5 w-5 text-emerald-700" />
                    {hi ? "महिला परिवहन (नमूना विवरण)" : "Women's transit (sample details)"}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {facility.female_transit.available
                      ? hi
                        ? "परिवहन उपलब्धता नमूने में दर्शाई गई है; स्वतंत्र रूप से पुष्टि नहीं।"
                        : "Transit is marked available in the sample; not independently confirmed."
                      : hi
                        ? "नमूने में परिवहन उपलब्ध नहीं दर्शाया गया।"
                        : "Transit is marked unavailable in the sample."}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Detail
                      label={hi ? "मार्ग" : "Routes"}
                      value={facility.female_transit.routes.join(" · ")}
                    />
                    <Detail
                      label={hi ? "पास योजना" : "Pass scheme"}
                      value={facility.female_transit.free_pass_scheme}
                    />
                    <Detail
                      label={hi ? "एस्कॉर्ट सहायता" : "Escort support"}
                      value={
                        facility.female_transit.escort_support
                          ? hi
                            ? "नमूने में उपलब्ध"
                            : "Marked available in sample"
                          : hi
                            ? "नमूने में उपलब्ध नहीं"
                            : "Marked unavailable in sample"
                      }
                    />
                    <Detail
                      label={hi ? "CCTV कवरेज" : "CCTV coverage"}
                      value={`${facility.cctv_coverage_percent}% · ${hi ? "नमूना आँकड़ा" : "sample figure"}`}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                  <ShieldCheck className="mr-2 inline h-4 w-4" />
                  {hi
                    ? "यात्रा मार्ग, सुरक्षा व्यवस्था और पास पात्रता सीधे केंद्र/परिवहन प्रदाता से जाँचें।"
                    : "Confirm routes, safeguards, and pass eligibility directly with the institute and transit provider."}
                </div>
              </motion.div>
            )}

            {activeTab === "labs" && (
              <motion.div
                key="labs"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 lg:grid-cols-2"
              >
                {facility.modern_labs.map((lab) => (
                  <article key={lab.name} className="rounded-2xl border bg-background p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="rounded-xl bg-indigo-50 p-2 text-indigo-800">
                        <Cpu className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-navy">{lab.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{lab.environment}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {hi ? "उपकरण (नमूना)" : "Equipment (sample)"}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {lab.equipment.map((equipment) => (
                        <li key={equipment} className="flex items-start gap-2 text-sm text-navy">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                          {equipment}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                      <b>{hi ? "योजना/वित्तपोषण:" : "Scheme / funding:"}</b> {lab.scheme_funded}
                    </p>
                  </article>
                ))}
              </motion.div>
            )}

            {activeTab === "employers" && (
              <motion.div
                key="employers"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="overflow-x-auto rounded-2xl border">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="p-3">{hi ? "कंपनी (नमूना)" : "Company (sample)"}</th>
                        <th className="p-3">{hi ? "वार्षिक सीटें" : "Annual intake"}</th>
                        <th className="p-3">{hi ? "प्रशिक्षण वजीफ़ा" : "Training stipend"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facility.active_industry_mous.map((item) => (
                        <tr key={item.company} className="border-t bg-background">
                          <td className="p-3 font-semibold text-navy">{item.company}</td>
                          <td className="p-3 text-muted-foreground">
                            {item.intake_per_year}{" "}
                            <span className="text-xs">({hi ? "नमूना" : "sample"})</span>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {item.stipend_during_training}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                  <AlertTriangle className="mr-2 inline h-4 w-4" />
                  {hi
                    ? "सूची MoU, रिक्तियों या नौकरी/वजीफ़े की गारंटी नहीं है। वर्तमान अवसर कंपनी और संस्थान से सत्यापित करें।"
                    : "This sample list is not proof of an MoU, vacancy, job, or stipend guarantee. Confirm current opportunities with the institute and employer."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {notice && (
            <p role="status" className="mt-4 rounded-xl bg-accent p-3 text-sm text-navy">
              {notice}
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 sm:px-6">
          <p className="text-[11px] text-muted-foreground">
            {hi
              ? "प्रोटोटाइप · सत्यापन हेतु मूल दस्तावेज़ आवश्यक"
              : "Prototype · primary documents required for verification"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
            >
              <Printer className="h-4 w-4" />
              {hi ? "प्रिंट / PDF" : "Print / save PDF"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              {hi ? "बंद करें" : "Done"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="h-4 w-4 text-emerald-800" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-black text-navy">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/55 p-3">
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-navy">{value}</dd>
    </div>
  );
}
