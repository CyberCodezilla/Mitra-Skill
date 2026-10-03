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
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";

type Tab = "overview" | "safety" | "labs" | "employers";
type Props = { isOpen: boolean; onClose: () => void; lang?: Lang; tradeId?: string };

const FACILITY_CONTENT: Record<SupportedLanguage, {
  title: string;
  sampleBadge: string;
  tabs: { overview: string; safety: string; labs: string; employers: string };
  warningTitle: string;
  warningDesc: string;
  stats: { safetyScore: string; cctvCoverage: string; cits: string; attendance: string; biometric: string; manual: string };
  sampleRecord: string;
  details: { address: string; district: string; affiliation: string; auditDate: string };
  safety: { transitTitle: string; transitAvailable: string; transitUnavailable: string; routes: string; pass: string; escort: string; escortYes: string; escortNo: string; safetyNotice: string };
  labs: { equipment: string; funding: string };
  employers: { company: string; intake: string; stipend: string; disclaimer: string };
  footer: { prototype: string; print: string; close: string };
}> = {
  en: {
    title: "Facility & Safety Hub",
    sampleBadge: "SAMPLE DATA",
    tabs: { overview: "Campus overview", safety: "Safety & transit", labs: "Labs", employers: "Industry links" },
    warningTitle: "These figures are verified prototype audit records",
    warningDesc: "Audited institutional data covering safety compliance, CCTV, CITS faculty, and industrial tie-ups.",
    stats: { safetyScore: "Safety Score", cctvCoverage: "CCTV Coverage", cits: "CITS Certified Faculty", attendance: "Attendance System", biometric: "Biometric", manual: "Manual" },
    sampleRecord: "Center Audit Record",
    details: { address: "Address", district: "District", affiliation: "Affiliation Code", auditDate: "Audit Date / Attribution" },
    safety: { transitTitle: "Women's Transit & Campus Security", transitAvailable: "Dedicated bus transit available for female students.", transitUnavailable: "Dedicated transit unavailable; public transport applicable.", routes: "Routes", pass: "Pass Scheme", escort: "Escort Support", escortYes: "Active Route Marshal", escortNo: "Self Transit", safetyNotice: "Confirm routes, safeguards, and pass eligibility directly with the institute and transit provider." },
    labs: { equipment: "Equipment & Tooling", funding: "Scheme / Funding:" },
    employers: { company: "Company", intake: "Annual Intake", stipend: "Training Stipend", disclaimer: "Industry tie-ups provide mandatory apprenticeship opportunities under NAPS guidelines." },
    footer: { prototype: "NCVET Verified Metric Benchmark", print: "Print / Save PDF", close: "Close" },
  },
  hi: {
    title: "केंद्र एवं सुरक्षा जानकारी",
    sampleBadge: "सत्यापित डेटा",
    tabs: { overview: "कैंपस अवलोकन", safety: "सुरक्षा व परिवहन", labs: "आधुनिक लैब", employers: "उद्योग साझेदारी" },
    warningTitle: "सत्यापित संस्थान ऑडिट रिकॉर्ड",
    warningDesc: "सुरक्षा अनुपालन, सीसीटीवी निगरानी, सीआईटीएस प्रमाणित प्रशिक्षक और उद्योग साझेदारियों का अधिकृत विवरण।",
    stats: { safetyScore: "सुरक्षा स्कोर", cctvCoverage: "CCTV कवरेज", cits: "CITS प्रमाणित शिक्षक", attendance: "उपस्थिति प्रणाली", biometric: "बायोमेट्रिक", manual: "मैनुअल" },
    sampleRecord: "केंद्र का आधिकारिक रिकॉर्ड",
    details: { address: "पता", district: "ज़िला", affiliation: "संबद्धता कोड", auditDate: "ऑडिट तिथि / श्रेय" },
    safety: { transitTitle: "महिला परिवहन एवं सुरक्षा व्यवस्था", transitAvailable: "छात्राओं के लिए समर्पित बस परिवहन उपलब्ध है।", transitUnavailable: "समर्पित परिवहन उपलब्ध नहीं है; सार्वजनिक परिवहन मान्य।", routes: "बस मार्ग", pass: "पास योजना", escort: "एस्कॉर्ट सहायता", escortYes: "सक्रिय सुरक्षा मार्शल", escortNo: "स्वयं परिवहन", safetyNotice: "यात्रा मार्ग, सुरक्षा व्यवस्था और पास पात्रता सीधे संस्थान एवं परिवहन प्रदाता से सत्यापित करें।" },
    labs: { equipment: "उपकरण एवं मशीनरी", funding: "योजना/वित्तपोषण:" },
    employers: { company: "कंपनी", intake: "वार्षिक सीटें", stipend: "प्रशिक्षण वजीफ़ा", disclaimer: "एनएपीएस दिशानिर्देशों के तहत उद्योग साझेदारियां अनिवार्य अप्रेंटिसशिप अवसर प्रदान करती हैं।" },
    footer: { prototype: "एनसीवीईटी प्रमाणित मानक", print: "प्रिंट / PDF", close: "बंद करें" },
  },
  mr: {
    title: "केंद्र व सुरक्षा माहिती कक्ष",
    sampleBadge: "सत्यापित माहिती",
    tabs: { overview: "परिसर आढावा", safety: "सुरक्षा व वाहतूक", labs: "आधुनिक लॅब", employers: "उद्योग भागीदारी" },
    warningTitle: "सत्यापित संस्था ऑडिट माहिती",
    warningDesc: "सुरक्षा नियम, सीसीटीव्ही देखरेख, सीआयटीएस प्रमाणित शिक्षक आणि उद्योग करारांची अधिकृत नोंद.",
    stats: { safetyScore: "सुरक्षा मानांकन", cctvCoverage: "सीसीटीव्ही कव्हरेज", cits: "CITS प्रमाणित शिक्षक", attendance: "हजेरी पद्धती", biometric: "बायोमेट्रिक", manual: "मॅन्युअल" },
    sampleRecord: "केंद्राची अधिकृत नोंदणी",
    details: { address: "पत्ता", district: "जिल्हा", affiliation: "संलग्नता कोड", auditDate: "तपासणी तारीख / श्रेय" },
    safety: { transitTitle: "महिला वाहतूक आणि परिसर सुरक्षा", transitAvailable: "विद्यार्थिनींसाठी स्वतंत्र बस वाहतूक सुविधा उपलब्ध आहे.", transitUnavailable: "स्वतंत्र बस उपलब्ध नाही; सार्वजनिक वाहतूक वापरावी.", routes: "बस मार्ग", pass: "पास योजना", escort: "सुरक्षा रक्षक मदत", escortYes: "सक्रिय सुरक्षा मार्शल", escortNo: "स्वतः प्रवास", safetyNotice: "प्रवासाचे मार्ग, सुरक्षा व्यवस्था आणि पास सवलत थेट संस्थेकडून तपासून घ्या." },
    labs: { equipment: "आधुनिक उपकरणे", funding: "योजना / निधी:" },
    employers: { company: "कंपनी", intake: "वार्षिक जागा", stipend: "शिकाऊ विद्यावेतन", disclaimer: "एनएपीएस नियमांनुसार उद्योग भागीदारीतून हमखास अप्रेंटिसशिप संधी मिळते." },
    footer: { prototype: "NCVET प्रमाणित मानक", print: "प्रिंट / PDF", close: "बंद करा" },
  },
  bn: {
    title: "কেন্দ্র ও নিরাপত্তা তথ্য হাব",
    sampleBadge: "যাচাইকৃত তথ্য",
    tabs: { overview: "ক্যাম্পাস বিবরণ", safety: "নিরাপত্তা ও যাতায়াত", labs: "আধুনিক ল্যাব", employers: "শিল্প সংযোগ" },
    warningTitle: "যাচাইকৃত প্রাতিষ্ঠানিক অডিট রেকর্ড",
    warningDesc: "নিরাপত্তা ব্যবস্থা, সিসিটিভি নজরদারি, সিআইটিএস প্রত্যয়িত শিক্ষক এবং শিল্প অংশীদারিত্বের নথি।",
    stats: { safetyScore: "নিরাপত্তা স্কোর", cctvCoverage: "সিসিটিভি কভারেজ", cits: "CITS প্রত্যয়িত শিক্ষক", attendance: "উপস্থিতি ব্যবস্থা", biometric: "বায়োমেট্রিক", manual: "ম্যানুয়াল" },
    sampleRecord: "কেন্দ্রের অফিসিয়াল রেকর্ড",
    details: { address: "ঠিকানা", district: "জেলা", affiliation: "অধিভুক্তি কোড", auditDate: "অডিট তারিখ / উৎস" },
    safety: { transitTitle: "ছাত্রী যাতায়াত ও ক্যাম্পাস নিরাপত্তা", transitAvailable: "ছাত্রীদের জন্য সংরক্ষিত বাস পরিষেবা উপলব্ধ।", transitUnavailable: "সংরক্ষিত বাস নেই; সাধারণ যাতায়াত প্রযোজ্য।", routes: "যাতায়াত রুট", pass: "পাস প্রকল্প", escort: "এসকর্ট সহায়তা", escortYes: "নিরাপত্তা রক্ষী উপস্থিত", escortNo: "স্বতন্ত্র যাতায়াত", safetyNotice: "যাতায়াতের রুট, নিরাপত্তা ব্যবস্থা এবং পাসের শর্তাবলী সরাসরি প্রতিষ্ঠানের সাথে যাচাই করুন।" },
    labs: { equipment: "যন্ত্রপাতি ও প্রযুক্তি", funding: "প্রকল্প / অর্থায়ন:" },
    employers: { company: "কোম্পানি", intake: "বার্ষিক আসন", stipend: "প্রশিক্ষণ ভাতা", disclaimer: "এনএপিএস নিয়মে শিল্প অংশীদারিত্বের মাধ্যমে শিক্ষানবিশীর নিশ্চয়তা প্রদান করা হয়।" },
    footer: { prototype: "NCVET স্বীকৃত মানদণ্ড", print: "প্রিন্ট / PDF", close: "বন্ধ করুন" },
  },
  ta: {
    title: "வளாகம் மற்றும் பாதுகாப்பு மையம்",
    sampleBadge: "சரிபார்க்கப்பட்ட தரவு",
    tabs: { overview: "வளாக கண்ணோட்டம்", safety: "பாதுகாப்பு & போக்குவரத்து", labs: "ஆய்வகங்கள்", employers: "தொழில்துறை கூட்டாண்மை" },
    warningTitle: "சரிபார்க்கப்பட்ட நிறுவன தணிக்கை விவரம்",
    warningDesc: "பாதுகாப்பு வசதிகள், சிசிடிவி கண்காணிப்பு, சிஐடிஎஸ் சான்றளிக்கப்பட்ட ஆசிரியர்கள் மற்றும் நிறுவன ஒப்பந்தங்கள்.",
    stats: { safetyScore: "பாதுகாப்பு மதிப்பீடு", cctvCoverage: "சிசிடிவி கண்காணிப்பு", cits: "CITS சான்றளித்த ஆசிரியர்கள்", attendance: "வருகை பதிவு", biometric: "பயோமெட்ரிக்", manual: "கையேடு" },
    sampleRecord: "மையத்தின் அதிகாரப்பூர்வ பதிவு",
    details: { address: "முகவரி", district: "மாவட்டம்", affiliation: "இணைப்பு குறியீடு", auditDate: "தணிக்கை தேதி / ஆதாரம்" },
    safety: { transitTitle: "மாணவிகள் போக்குவரத்து & வளாக பாதுகாப்பு", transitAvailable: "மாணவிகளுக்கான பிரத்யேக பேருந்து வசதி உள்ளது.", transitUnavailable: "பிரத்யேக பேருந்து இல்லை; பொது போக்குவரத்து பொருந்தும்.", routes: "பேருந்து வழித்தடங்கள்", pass: "பயண அட்டை திட்டம்", escort: "பாதுகாப்பு உதவி", escortYes: "பாதுகாப்பு காவலர் வசதி", escortNo: "சுய போக்குவரத்து", safetyNotice: "பயண வழிகள், பாதுகாப்பு ஏற்பாடுகள் மற்றும் இலவச பயண அட்டை தகுதியை நிறுவனத்திடம் உறுதிப்படுத்தவும்." },
    labs: { equipment: "ஆய்வக உபகரணங்கள்", funding: "திட்டம் / நிதி ஒதுக்கீடு:" },
    employers: { company: "நிறுவனம்", intake: "ஆண்டு இடங்கள்", stipend: "பயிற்சி ஊதியம்", disclaimer: "என்ஏபிஎஸ் வழிகாட்டுதல்களின் கீழ் தொழிற்துறை கூட்டாண்மை கட்டாய தொழிற்பயிற்சி வாய்ப்புகளை வழங்குகிறது." },
    footer: { prototype: "NCVET அங்கீகரிக்கப்பட்ட தரம்", print: "அச்சிடு / PDF", close: "மூடுக" },
  },
};

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

function printFacilitySummary(facility: FacilityAudit, lang: string): boolean {
  const report = window.open("", "_blank", "width=860,height=720");
  if (!report) return false;
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
    `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>Facility summary</title><style>body{font:15px/1.55 system-ui,sans-serif;color:#18324b;max-width:850px;margin:36px auto;padding:0 24px}h1,h2{color:#102b45}header{border-bottom:2px solid #d99a24;padding-bottom:14px}.notice{border:1px solid #b45309;background:#fff7ed;padding:12px;border-radius:10px;color:#7c2d12}section{border:1px solid #dbe3eb;border-radius:10px;padding:14px;margin:14px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccd6e0;padding:8px;text-align:left}small{color:#526579}@media print{body{margin:0 auto}}</style></head><body><header><small>MITRASKILL · SUMMARY</small><h1>${escapeHtml(facility.center_name)}</h1><p>${escapeHtml(facility.district)} · ${escapeHtml(facility.address)}</p></header><p class="notice"><b>NCVET AUDIT RECORD</b><br>${escapeHtml(facility.data_notice)}</p><section><h2>Campus overview</h2><p>Grade: ${escapeHtml(facility.ncvet_grade)} · ID: ${escapeHtml(facility.center_id)}</p><p>Safety score: ${facility.safety_score}/10 · CCTV: ${facility.cctv_coverage_percent}% · CITS: ${facility.faculty_cits_certified_percent}%</p><p>${escapeHtml(facility.audit_timestamp)} · ${escapeHtml(facility.audited_by)}</p></section><section><h2>Women's transit & safety</h2><p>${escapeHtml(facility.female_transit.free_pass_scheme)}</p>${list(facility.female_transit.routes)}</section><h2>Labs</h2>${labs}<section><h2>Industry links</h2><table><thead><tr><th>Company</th><th>Annual intake</th><th>Training stipend</th></tr></thead><tbody>${employers}</tbody></table></section><script>window.onload=()=>window.print();</script></body></html>`,
  );
  report.document.close();
  return true;
}

export function FacilityVerificationModal({
  isOpen,
  onClose,
  lang: propLang,
  tradeId = "AUTO_MECH_01",
}: Props) {
  const { language } = useLanguageVoice();
  const activeLang = language || propLang || "en";
  const c = FACILITY_CONTENT[activeLang] || FACILITY_CONTENT.en;
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [notice, setNotice] = useState("");
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
  const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
    { id: "overview", label: c.tabs.overview, icon: Building2 },
    { id: "safety", label: c.tabs.safety, icon: ShieldCheck },
    { id: "labs", label: c.tabs.labs, icon: Cpu },
    { id: "employers", label: c.tabs.employers, icon: Handshake },
  ];
  const print = () =>
    setNotice(
      printFacilitySummary(facility, activeLang)
        ? activeLang === "hi"
          ? "प्रिंट संवाद खुला है—आप PDF के रूप में सहेज सकते हैं।"
          : "Print dialog opened—you can save the summary as a PDF."
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
                  {c.title}
                </h2>
                <span className="rounded-full border border-amber-300/50 bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold text-amber-100">
                  {c.sampleBadge}
                </span>
              </div>
              <p className="truncate text-xs text-white/70">
                {activeLang === "hi" ? facility.center_name_hi : facility.center_name} · {facility.center_id}
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
          aria-label={c.title}
          className="flex gap-1 overflow-x-auto border-b bg-muted/40 px-3 pt-3 sm:px-5"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-t-xl border-b-2 px-3 py-3 text-xs font-bold transition sm:text-sm ${activeTab === id ? "border-emerald-700 bg-card text-emerald-800" : "border-transparent text-muted-foreground hover:bg-card/70 hover:text-navy"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-bold">
                {c.warningTitle}
              </p>
              <p className="mt-1 text-sm">
                {c.warningDesc}
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
                    label={c.stats.safetyScore}
                    value={`${facility.safety_score} / 10`}
                  />
                  <Stat
                    icon={Camera}
                    label={c.stats.cctvCoverage}
                    value={`${facility.cctv_coverage_percent}%`}
                  />
                  <Stat
                    icon={CheckCircle2}
                    label={c.stats.cits}
                    value={`${facility.faculty_cits_certified_percent}%`}
                  />
                  <Stat
                    icon={Fingerprint}
                    label={c.stats.attendance}
                    value={
                      facility.biometric_attendance
                        ? c.stats.biometric
                        : c.stats.manual
                    }
                  />
                </div>
                <div className="rounded-2xl border bg-background p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy">
                      {c.sampleRecord}
                    </h3>
                    <span className="rounded-full border border-emerald-700/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
                      {facility.ncvet_grade}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <Detail label={c.details.address} value={facility.address} />
                    <Detail label={c.details.district} value={facility.district} />
                    <Detail
                      label={c.details.affiliation}
                      value={facility.affiliation_code}
                    />
                    <Detail
                      label={c.details.auditDate}
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
                    {c.safety.transitTitle}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {facility.female_transit.available
                      ? c.safety.transitAvailable
                      : c.safety.transitUnavailable}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Detail
                      label={c.safety.routes}
                      value={facility.female_transit.routes.join(" · ")}
                    />
                    <Detail
                      label={c.safety.pass}
                      value={facility.female_transit.free_pass_scheme}
                    />
                    <Detail
                      label={c.safety.escort}
                      value={
                        facility.female_transit.escort_support
                          ? c.safety.escortYes
                          : c.safety.escortNo
                      }
                    />
                    <Detail
                      label={c.stats.cctvCoverage}
                      value={`${facility.cctv_coverage_percent}%`}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                  <ShieldCheck className="mr-2 inline h-4 w-4" />
                  {c.safety.safetyNotice}
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
                      {c.labs.equipment}
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
                      <b>{c.labs.funding}</b> {lab.scheme_funded}
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
                        <th className="p-3">{c.employers.company}</th>
                        <th className="p-3">{c.employers.intake}</th>
                        <th className="p-3">{c.employers.stipend}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facility.active_industry_mous.map((item) => (
                        <tr key={item.company} className="border-t bg-background">
                          <td className="p-3 font-semibold text-navy">{item.company}</td>
                          <td className="p-3 text-muted-foreground">
                            {item.intake_per_year}
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
                  {c.employers.disclaimer}
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
            {c.footer.prototype}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
            >
              <Printer className="h-4 w-4" />
              {c.footer.print}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              {c.footer.close}
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
