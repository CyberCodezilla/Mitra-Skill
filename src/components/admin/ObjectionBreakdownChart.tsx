import { AlertTriangle } from "lucide-react";
import type { Lang } from "@/lib/app-context";
import { useTranslation } from "@/hooks/useTranslation";

const data = [
  {
    key: "prestige",
    percent: 42,
    color: "bg-rose-500",
    en: "Social Prestige / Relative Stigma",
    hi: "सामाजिक प्रतिष्ठा / रिश्तेदारों की चिंता",
    noteEn: "Top in rural sub-divisions",
    noteHi: "ग्रामीण क्षेत्रों में प्रमुख",
  },
  {
    key: "wage",
    percent: 31,
    color: "bg-orange-500",
    en: "Starting Wage Skepticism",
    hi: "शुरुआती वेतन पर संदेह",
    noteEn: "Parents expect ₹25k+ immediately",
    noteHi: "अभिभावकों की अपेक्षा तुरंत ₹25k+",
  },
  {
    key: "safety",
    percent: 16,
    color: "bg-amber-400",
    en: "Workplace Safety & Hazard",
    hi: "कार्यस्थल सुरक्षा",
    noteEn: "Prominent among female candidate cohorts",
    noteHi: "महिला उम्मीदवार समूहों में प्रमुख",
  },
  {
    key: "mobility",
    percent: 11,
    color: "bg-blue-500",
    en: "Fear of Academic Dead-End",
    hi: "शिक्षा में आगे रास्ता न होने की चिंता",
    noteEn: "NCrF equivalence is less understood",
    noteHi: "NCrF समकक्षता की कम जानकारी",
  },
];

export function ObjectionBreakdownChart({ lang }: { lang: Lang }) {
  const { t: ui } = useTranslation();
  const adm = ui.admin;
  const hi = lang === "hi";
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-card">
      <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
        <AlertTriangle className="h-5 w-5 text-primary" />
        {adm.breakdownTitle}
      </h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div key={item.key}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-navy">{hi ? item.hi : item.en}</div>
                <div className="text-xs text-muted-foreground">
                  {hi ? item.noteHi : item.noteEn}
                </div>
              </div>
              <div className="font-bold text-navy">{item.percent}%</div>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {hi ? "नमूना डैशबोर्ड वितरण" : "Sample dashboard distribution"}
      </p>
    </section>
  );
}
