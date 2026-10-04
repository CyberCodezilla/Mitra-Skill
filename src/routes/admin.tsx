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
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { ResistanceHeatmap } from "@/components/admin/ResistanceHeatmap";
import { ObjectionBreakdownChart } from "@/components/admin/ObjectionBreakdownChart";
import { SentimentMigrationChart } from "@/components/admin/SentimentMigrationChart";
import { DsdpReportModal } from "@/components/admin/DsdpReportModal";
import { useTranslation } from "@/hooks/useTranslation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminSandbox } from "@/hooks/useAdminSandbox";
import { AdminLoginPortal } from "@/components/admin/AdminLoginPortal";
import { AdminSandboxControlBar } from "@/components/admin/AdminSandboxControlBar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "MSDE Administrator Console — MitraSkill" }] }),
  component: Admin,
});

function Admin() {
  const { lang } = useApp();
  const { t: ui } = useTranslation();
  const adm = ui.admin;
  const hi = lang === "hi";

  // Authentication Layer
  const {
    session,
    isAuthenticated,
    isLoading: isAuthLoading,
    lockoutRemaining,
    login,
    quickDemoLogin,
    logout,
  } = useAdminAuth();

  // Browser-Scoped Sandbox (Changes stay strictly in this user's browser)
  const {
    sandbox,
    isLoaded: isSandboxLoaded,
    isSandboxModified,
    updateFilters,
    updateKpis,
    updatePolicies,
    addIncident,
    toggleResolveIncident,
    resetToBaseline,
  } = useAdminSandbox();

  const [dsdpOpen, setDsdpOpen] = useState(false);

  // Filter events based on sandboxed trade filter
  const filteredEvents = useMemo(
    () =>
      sandbox.events.filter(
        (event) =>
          sandbox.trade === "All Trades" ||
          event.text.includes(
            sandbox.trade === "Automotive Mechatronics" ? "AUTO_MECH_01" : "SOLAR_TECH_02",
          ),
      ),
    [sandbox.events, sandbox.trade],
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
      ].map((row) => [sandbox.state, sandbox.district, ...row]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mitraskill-${sandbox.district.toLowerCase()}-skill-plan.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // 1. Loading State
  if (isAuthLoading || !isSandboxLoaded) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Verifying Cryptographic Administrative Access...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated State: Show Government Authentication Portal
  if (!isAuthenticated || !session) {
    return (
      <AdminLoginPortal
        onLogin={login}
        onQuickDemoLogin={quickDemoLogin}
        lockoutRemaining={lockoutRemaining}
        lang={lang}
      />
    );
  }

  // 3. Authenticated State: Show Administrator Console
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-5">
      {/* Officer Session & Local Sandbox Controls */}
      <AdminSandboxControlBar
        session={session}
        onLogout={logout}
        sandbox={sandbox}
        isSandboxModified={isSandboxModified}
        onResetBaseline={resetToBaseline}
        onUpdateKpis={updateKpis}
        onUpdatePolicies={updatePolicies}
        onAddIncident={addIncident}
        lang={lang}
      />

      {/* Main Administrative Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-navy p-6 text-white sm:p-8 shadow-xl relative overflow-hidden">
        {/* National Tricolor Top Line */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 border border-white/15">
            <Shield className="h-4 w-4 text-amber-400" /> MSDE · Directorate General of Training (DGT)
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            {adm.title}
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
            {adm.subtitle}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              {hi ? "डेटा स्थिति" : "Telemetry Mode"}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {isSandboxModified ? (
                <span className="text-amber-300">Custom Browser Sandbox</span>
              ) : (
                <span>Official Sample Baseline</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Filters (Persisted to localStorage) */}
      <section
        aria-label="Dashboard filters"
        className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <Select
          label={hi ? "राज्य" : "State"}
          value={sandbox.state}
          onChange={(val) => updateFilters({ state: val })}
          values={["Uttar Pradesh", "Maharashtra", "Madhya Pradesh"]}
        />
        <Select
          label={hi ? "जिला" : "District"}
          value={sandbox.district}
          onChange={(val) => updateFilters({ district: val })}
          values={["Meerut", "Ghaziabad", "Varanasi", "Pune"]}
        />
        <Select
          label={hi ? "ट्रेड" : "Trade filter"}
          value={sandbox.trade}
          onChange={(val) => updateFilters({ trade: val })}
          values={["All Trades", "Automotive Mechatronics", "Solar PV Rooftop"]}
        />
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E87722] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:brightness-105 active:scale-95 transition cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {adm.exportBtn}
        </button>
        <button
          type="button"
          onClick={() => setDsdpOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 transition hover:bg-emerald-100 dark:border-emerald-300/30 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 cursor-pointer"
        >
          <FileText className="h-4 w-4" /> Export District Action Report
        </button>
      </section>

      {/* KPI Cards (Browser-isolated values) */}
      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<Users className="h-4 w-4 text-indigo-600" />}
          label={adm.kpiSessions}
          value={sandbox.kpis.sessions}
          note={sandbox.kpis.sessionsNote}
        />
        <Kpi
          icon={<Activity className="h-4 w-4 text-emerald-600" />}
          label={adm.kpiConsensus}
          value={sandbox.kpis.consensusRate}
          note={sandbox.kpis.consensusNote}
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4 text-teal-600" />}
          label={adm.kpiShift}
          value={sandbox.kpis.reassuranceShift}
          note={sandbox.kpis.shiftNote}
        />
        <Kpi
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          label={adm.kpiTopFriction}
          value={hi ? sandbox.kpis.topFrictionHi : sandbox.kpis.topFrictionEn}
          note={sandbox.kpis.frictionNote}
        />
      </section>

      {/* Heatmap & Objection Breakdown */}
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ResistanceHeatmap lang={lang} district={sandbox.district} />
        <ObjectionBreakdownChart lang={lang} />
      </div>

      <DsdpReportModal
        isOpen={dsdpOpen}
        onClose={() => setDsdpOpen(false)}
        state={sandbox.state}
        district={sandbox.district}
        lang={lang}
      />

      <div className="mt-5">
        <SentimentMigrationChart lang={lang} />
      </div>

      {/* Live Telemetry Incident Feed */}
      <section className="mt-5 rounded-2xl border-2 border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-navy dark:text-white">
              <Activity className="h-5 w-5 text-emerald-600" />
              {hi ? "हाल की टेलीमेट्री गतिविधि" : "Live Telemetry & Dispute Incident Feed"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time dyadic arbitration and counselor dispatch incidents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300/60 px-3 py-1 rounded-full dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {filteredEvents.length} Active Records
            </span>
          </div>
        </div>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-5 transition-opacity ${
                event.resolved ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="w-28 shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
                {event.time}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-navy dark:text-white">
                    {event.place}
                  </span>
                  <span className="rounded-full bg-amber-100 border border-amber-300/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    {event.type}
                  </span>
                  {event.resolved && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-bold">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {event.text}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleResolveIncident(event.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer ${
                  event.resolved
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {event.resolved ? "Reopen" : "Mark Resolved"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/accord"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-navy hover:bg-slate-50 transition shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {hi ? "परिवार प्रमाणपत्र पर वापस जाएँ" : "Back to Family Accord"}
        </Link>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-amber-600" />
          {sandbox.state} · {sandbox.district} District Jurisdiction
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
    <label className="flex min-w-40 flex-1 flex-col gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border-2 border-slate-200 bg-background px-3 text-xs sm:text-sm font-bold text-navy dark:text-white focus:border-amber-500 focus:outline-none transition cursor-pointer"
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
    <article className="rounded-2xl border-2 border-slate-200/90 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 transition hover:border-amber-400/50">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-navy dark:text-white tracking-tight">
        {value}
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
        {note}
      </p>
    </article>
  );
}
