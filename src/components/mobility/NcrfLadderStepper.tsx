import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Award, ArrowUpRight, BookOpen, GraduationCap, Layers, ShieldCheck } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import type { TradeRecord } from "@/data/mockTrades";
import { useTranslation } from "@/hooks/useTranslation";

type Stage = {
  id: number;
  title: string;
  level: string;
  credits: string;
  role: string;
  badge: string;
  detail: string;
  entry: string;
  salary?: string;
  modules: string[];
  exams: string[];
};
export function stagesFor(trade: TradeRecord, lang: Lang): Stage[] {
  const hi = lang === "hi";
  const credits = trade.ncrf_mobility.credits_earned;
  const isAuto = trade.trade_id === "AUTO_MECH_01";
  const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;
  return [
    {
      id: 1,
      title: hi ? "कक्षा 10 उत्तीर्ण" : "Class 10th Pass",
      level: "NSQF Level 2",
      credits: hi ? "0 क्रेडिट" : "0 Credits",
      role: hi ? "स्कूल स्नातक" : "School Graduate",
      badge: hi ? "शुरुआती चरण" : "Starting Line",
      detail: hi
        ? "कक्षा 10 के बाद तकनीकी प्रशिक्षण का रास्ता खुलता है।"
        : "After Class 10, a technical training route is open.",
      entry: hi
        ? "मान्यता प्राप्त बोर्ड से कक्षा 10 उत्तीर्ण।"
        : "Pass Class 10 from a recognized board.",
      modules: hi
        ? ["गणित और विज्ञान की बुनियाद", "कार्यस्थल पर संचार", "व्यावसायिक परिचय"]
        : ["Maths and science foundations", "Workplace communication", "Introduction to trades"],
      exams: ["Class 10 based entry tests"],
    },
    {
      id: 2,
      title: isAuto
        ? hi
          ? "आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स / NTC"
          : "ITI Automotive Mechatronics / NTC"
        : hi
          ? "आईटीआई सोलर PV तकनीशियन / NTC"
          : "ITI Solar PV Technician / NTC",
      level: "NSQF Level 4",
      credits: `${credits} NCrF Credits (${credits * 30} ${hi ? "अनुमानित घंटे" : "Notional Hours"})`,
      role: isAuto
        ? hi
          ? "जूनियर डायग्नोस्टिक विशेषज्ञ"
          : "Junior Diagnostic Specialist"
        : hi
          ? "जूनियर सोलर तकनीशियन"
          : "Junior Solar Technician",
      badge: hi ? "रोज़गार योग्य और डिग्री-पात्र" : "Employable & Degree-Eligible",
      detail: `${trade.verified_metrics.placement_rate_percentage}% ${hi ? "सत्यापित प्लेसमेंट; शुरुआती वेतन" : "verified placement; starting salary"} ${inr(trade.verified_metrics.salary_range_min)} – ${inr(trade.verified_metrics.salary_range_max)}/${hi ? "माह" : "month"}.`,
      entry: hi
        ? `${trade.duration_months} महीने का ITI पाठ्यक्रम पूरा करें।`
        : `Complete the ${trade.duration_months}-month ITI course.`,
      salary: `${inr(trade.verified_metrics.salary_range_min)} – ${inr(trade.verified_metrics.salary_range_max)}/month`,
      modules: trade.curriculum_focus,
      exams: ["Apprenticeship opportunities", "Trade certification assessments"],
    },
    {
      id: 3,
      title: isAuto
        ? hi
          ? "राज्य पॉलिटेक्निक ऑटो / मैकेनिकल इंजीनियरिंग डिप्लोमा"
          : "State Polytechnic Diploma in Auto / Mechanical Engineering"
        : hi
          ? "राज्य पॉलिटेक्निक विद्युत एवं नवीकरणीय ऊर्जा डिप्लोमा"
          : "State Polytechnic Diploma in Electrical & Renewable Energy",
      level: "NSQF Level 5",
      credits: hi
        ? `${credits} ITI क्रेडिट के आधार पर प्रवेश`
        : `Entry using ${credits} ITI credits`,
      role: hi
        ? "सहायक प्लांट इंजीनियर / पर्यवेक्षक"
        : "Assistant Plant Engineer / Diagnostic Supervisor",
      badge: hi ? "पर्यवेक्षी संवर्ग" : "Supervisory Cadre",
      detail: trade.ncrf_mobility.next_academic_step,
      entry: hi
        ? "द्वितीय वर्ष में पार्श्व प्रवेश राज्य और संस्था के नियमों के अधीन है।"
        : "Lateral entry to year 2 is subject to state and institutional rules.",
      salary: "₹32,000 – ₹42,000/month (illustrative)",
      modules: isAuto
        ? ["Vehicle systems engineering", "Industrial automation", "Quality and production"]
        : ["Power systems", "Renewable energy design", "Grid integration"],
      exams: [
        "State Polytechnic LEET (where applicable)",
        "Railway technical recruitment (eligibility varies)",
      ],
    },
    {
      id: 4,
      title: hi ? "B.Tech / B.Voc स्नातक डिग्री" : "B.Tech / B.Voc Degree",
      level: "NSQF Level 6 / 7",
      credits: hi ? "डिप्लोमा के बाद विश्वविद्यालय स्तर" : "University level after diploma",
      role: hi
        ? "वरिष्ठ सिस्टम इंजीनियर / अनुसंधान विशेषज्ञ"
        : "Senior Systems Engineer / R&D Specialist",
      badge: hi ? "पूर्ण इंजीनियर / अधिकारी स्तर" : "Full Engineer / Officer Grade",
      detail: `${trade.ncrf_mobility.degree_eligibility}. ${hi ? "प्रवेश संस्था और लागू नियमों पर निर्भर है।" : "Admission depends on the institution and applicable rules."}`,
      entry: hi
        ? "डिप्लोमा और विश्वविद्यालय के प्रवेश मानदंड पूरे करें।"
        : "Complete the diploma and meet university admission criteria.",
      modules: ["Advanced systems design", "Applied research project", "Engineering management"],
      exams: ["UPSC / State PSC / Railway exams where the specific post accepts the qualification"],
    },
  ];
}

export function NcrfLadderStepper({
  trade,
  lang,
  activeStage,
  onSelect,
}: {
  trade: TradeRecord;
  lang: Lang;
  activeStage: number;
  onSelect: (stage: number) => void;
}) {
  const { t: ui } = useTranslation();
  const m = ui.mobility;
  const stages = stagesFor(trade, lang);
  const hi = lang === "hi";
  const employerNames = [...trade.verified_metrics.top_employers.slice(0, 2), "Indian Railways*"];

  const getStageTitle = (id: number) => {
    if (id === 1) return m.stages.step1Title;
    if (id === 2) return m.stages.step2Title;
    if (id === 3) return m.stages.step3Title;
    return m.stages.step4Title;
  };
  const getStageDesc = (id: number) => {
    if (id === 1) return m.stages.step1Desc;
    if (id === 2) return m.stages.step2Desc;
    if (id === 3) return m.stages.step3Desc;
    return m.stages.step4Desc;
  };

  return (
    <section
      data-tour="tour-mobility-ladder"
      aria-label={hi ? "NCrF शैक्षणिक प्रगति" : "NCrF education progression"}
    >
      <div className="relative grid gap-4 lg:grid-cols-4 lg:gap-3">
        <div
          className="absolute left-8 top-10 hidden h-1 w-[calc(100%-4rem)] overflow-hidden rounded-full bg-gradient-to-r from-saffron/30 via-primary/30 to-success/30 lg:block"
          aria-hidden
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div
          className="absolute bottom-10 left-[2.35rem] top-10 w-1 overflow-hidden rounded-full bg-gradient-to-b from-saffron/30 via-primary/30 to-success/30 lg:hidden"
          aria-hidden
        >
          <motion.div
            className="h-1/3 w-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"
            animate={{ y: ["-100%", "400%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        {stages.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            aria-expanded={activeStage === stage.id}
            onClick={() => onSelect(stage.id)}
            className={`relative z-10 rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-card ${activeStage === stage.id ? "border-primary bg-white shadow-card" : "border-border bg-card"}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${activeStage === stage.id ? "border-primary bg-primary text-white" : "border-success bg-white text-success"}`}
              >
                {index === 0 ? <GraduationCap /> : index === 3 ? <Award /> : <Layers />}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {hi ? `चरण ${stage.id}` : `Stage ${stage.id}`} ·{" "}
                {index === 0 ? (hi ? "अभी" : "Now") : `+${index * 2} years`}
              </span>
            </div>
            <h3 className="mt-3 min-h-12 text-base font-bold text-navy">{getStageTitle(stage.id)}</h3>
            <div className="mt-2 text-xs font-semibold text-muted-foreground">{getStageDesc(stage.id)}</div>
            <div className="mt-2 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-navy">
              {activeStage === stage.id ? <AnimatedCredits value={stage.credits} /> : stage.credits}
            </div>
            <div className="mt-3 text-sm font-semibold text-navy">{stage.role}</div>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
              {stage.badge}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-card sm:p-6"
        >
          {(() => {
            const stage = stages[activeStage - 1]!;
            return (
              <>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">
                      {hi ? `चरण ${stage.id} का विवरण` : `Stage ${stage.id} details`}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-navy">{getStageTitle(stage.id)}</h3>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
                    {stage.badge}
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground">{stage.detail}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-muted p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-navy">
                      <BookOpen className="h-4 w-4" />
                      {hi ? "प्रवेश और पाठ्यक्रम" : "Entry & syllabus"}
                    </h4>
                    <p className="mt-2 text-sm">{stage.entry}</p>
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
                      {stage.modules.map((module) => (
                        <li key={module}>{module}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-muted p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-navy">
                      <ArrowUpRight className="h-4 w-4" />
                      {hi ? "करियर और पात्रता" : "Career & eligibility"}
                    </h4>
                    {stage.salary && (
                      <p className="mt-2 text-sm font-semibold text-success">
                        {hi ? "संकेतात्मक वेतन" : "Indicative pay"}: {stage.salary}
                      </p>
                    )}
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      {stage.exams.map((exam) => (
                        <li key={exam}>{exam}</li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {employerNames.map((employer) => (
                        <span
                          key={employer}
                          className="rounded-full border bg-white px-2.5 py-1 text-xs font-medium text-navy"
                        >
                          {employer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  *
                  {hi
                    ? "परीक्षा पात्रता, क्रेडिट स्वीकृति और प्रवेश संबंधित प्राधिकरण के वर्तमान नियमों पर निर्भर हैं।"
                    : "Exam eligibility, credit acceptance, lateral entry and degree admission depend on the relevant authority's current rules."}
                </p>
              </>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function AnimatedCredits({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) {
      setCount(0);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 650, 1);
      setCount(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, value]);
  return (
    <motion.span initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} key={value}>
      {match ? `${count}${match[2]}` : value}
    </motion.span>
  );
}
