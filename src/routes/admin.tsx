import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Download,
  FileText,
  MapPin,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { ResistanceHeatmap } from "@/components/admin/ResistanceHeatmap";
import { ObjectionBreakdownChart } from "@/components/admin/ObjectionBreakdownChart";
import { SentimentMigrationChart } from "@/components/admin/SentimentMigrationChart";
import { DsdpReportModal } from "@/components/admin/DsdpReportModal";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "MSDE Administrator Console — MitraSkill" }] }),
  component: Admin,
});
const events = [
  {
    time: "10 mins ago",
    place: "Mawana (Meerut)",
    text: "Dyadic divergence resolved for AUTO_MECH_01 after NCrF ladder projection.",
    type: "Consensus",
  },
  {
    time: "24 mins ago",
    place: "Sardhana",
    text: "Live counselor WebRTC call triggered due to persistent female transit objection.",
    type: "Counselor referral",
  },
  {
    time: "32 mins ago",
    place: "Meerut Sadar",
    text: "Parivaar Rozgar Patra generated for SOLAR_TECH_02.",
    type: "Family accord",
  },
];
function Admin() {
  const { lang } = useApp();
  const { t: ui } = useTranslation();
  const adm = ui.admin;
  const hi = lang === "hi";
  const [state, setState] = useState("Uttar Pradesh");
  const [district, setDistrict] = useState("Meerut");
  const [trade, setTrade] = useState("All Trades");
  const [dsdpOpen, setDsdpOpen] = useState(false);
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          trade === "All Trades" ||
          event.text.includes(
            trade === "Automotive Mechatronics" ? "AUTO_MECH_01" : "SOLAR_TECH_02",
          ),
      ),
    [trade],
  );
  const exportCsv = () => {
    const rows = [
      [
        "State",
        "District",
        "Block",
        "Sessions",
        "Resistance Index",
        "Top Objection",
        "Recommended Action",
      ],
      ...[
        ["Meerut Sadar", 1420, 24, "Wage Skepticism", "Expand local NAPS industry tie-ups"],
        ["Mawana", 1180, 48, "Social Prestige", "Run ITI alumni village felicitation"],
        ["Sardhana", 1210, 67, "Female Safety", "Deploy dedicated women's ITI bus route"],
        ["Daurala", 1011, 39, "Degree Mobility", "Distribute NCrF ladder flyers in schools"],
      ].map((row) => [state, district, ...row]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mitraskill-${district.toLowerCase()}-skill-plan.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-navy p-6 text-white sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
            <Shield className="h-4 w-4" /> MSDE · Scheme Administrator Portal
          </div>
          <h1 className="mt-3 text-3xl font-bold">
            {adm.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            {adm.subtitle}
          </p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="text-xs text-white/60">{hi ? "डेटा स्थिति" : "Data status"}</div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {hi ? "प्रोटोटाइप नमूना डेटा" : "Prototype sample data"}
          </div>
        </div>
      </header>
      <section
        aria-label="Dashboard filters"
        className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4 shadow-card"
      >
        <Select
          label={hi ? "राज्य" : "State"}
          value={state}
          onChange={setState}
          values={["Uttar Pradesh", "Maharashtra", "Madhya Pradesh"]}
        />
        <Select
          label={hi ? "जिला" : "District"}
          value={district}
          onChange={setDistrict}
          values={["Meerut", "Ghaziabad", "Varanasi", "Pune"]}
        />
        <Select
          label={hi ? "ट्रेड" : "Trade filter"}
          value={trade}
          onChange={setTrade}
          values={["All Trades", "Automotive Mechatronics", "Solar PV Rooftop"]}
        />
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E87722] px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {adm.exportBtn}
        </button>
        <button
          type="button"
          onClick={() => setDsdpOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100 dark:border-emerald-300/30 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer"
        >
          <FileText className="h-4 w-4" /> Export District Action Report
        </button>
      </section>
      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<Users />}
          label={adm.kpiSessions}
          value="4,821"
          note="+18.4% this month"
        />
        <Kpi
          icon={<Activity />}
          label={adm.kpiConsensus}
          value="74.2%"
          note="Family Accord generated"
        />
        <Kpi
          icon={<TrendingUp />}
          label={adm.kpiShift}
          value="+41.8%"
          note="Pre 68% hesitant → Post 74% reassured"
        />
        <Kpi
          icon={<AlertTriangle />}
          label={adm.kpiTopFriction}
          value={hi ? "सामाजिक प्रतिष्ठा" : "Social Prestige / Marriage Market"}
          note="42% of sessions"
        />
      </section>
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ResistanceHeatmap lang={lang} district={district} />
        <ObjectionBreakdownChart lang={lang} />
      </div>
      <DsdpReportModal
        isOpen={dsdpOpen}
        onClose={() => setDsdpOpen(false)}
        state={state}
        district={district}
        lang={lang}
      />
      <div className="mt-5">
        <SentimentMigrationChart lang={lang} />
      </div>
      <section className="mt-5 rounded-2xl border bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <Activity className="h-5 w-5 text-success" />
            {hi ? "हाल की टेलीमेट्री गतिविधि" : "Live telemetry incident feed"}
          </h2>
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            {hi ? "नमूना लाइव फ़ीड" : "Sample live feed"}
          </span>
        </div>
        <div className="mt-4 divide-y">
          {filteredEvents.map((event) => (
            <div
              key={event.time}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-5"
            >
              <div className="w-28 shrink-0 text-xs font-semibold text-muted-foreground">
                {event.time}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-navy">
                  {event.place}{" "}
                  <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] text-navy">
                    {event.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/accord"
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          {hi ? "परिवार प्रमाणपत्र पर वापस जाएँ" : "Back to Family Accord"}
        </Link>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {state} · {district}
        </span>
      </div>
    </div>
  );
}
function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-40 flex-1 flex-col gap-1 text-xs font-semibold text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border bg-background px-3 text-sm font-medium text-navy"
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
function Kpi({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-navy">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </article>
  );
}
