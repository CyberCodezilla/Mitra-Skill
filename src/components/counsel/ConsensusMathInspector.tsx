import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  evaluateDyadConsensus,
  type HouseholdParameters,
  type TradeCompetencyProfile,
} from "@/utils/arbitrationEngine";
import type { AptitudeVector, Lang } from "@/lib/app-context";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  tradeId?: string;
  onDivergenceChange?: (value: number) => void;
  studentAptitude?: AptitudeVector;
};

const TRADE_PROFILES: Record<string, TradeCompetencyProfile> = {
  AUTO_MECH_01: {
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics",
    competency_vector: [0.85, 0.92, 0.78, 0.88],
    median_wage: 19500,
    female_safety_score: 9.4,
    center_distance_km: 8.5,
  },
  SOLAR_TECH_02: {
    trade_id: "SOLAR_TECH_02",
    trade_name: "Solar PV Rooftop Technician",
    competency_vector: [0.72, 0.78, 0.85, 0.95],
    median_wage: 21000,
    female_safety_score: 8.9,
    center_distance_km: 12,
  },
};

const DEFAULTS = {
  reservationWage: 22000,
  w1: 0.45,
  w2: 0.4,
  w3: 0.15,
  distanceKm: 8.5,
  requiresSafety: false,
  threshold: 0.35,
};
const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function ConsensusMathInspector({
  isOpen,
  onClose,
  lang,
  tradeId = "AUTO_MECH_01",
  onDivergenceChange,
  studentAptitude,
}: Props) {
  const [reservationWage, setReservationWage] = useState(DEFAULTS.reservationWage);
  const [w1, setW1] = useState(DEFAULTS.w1);
  const [w2, setW2] = useState(DEFAULTS.w2);
  const [w3, setW3] = useState(DEFAULTS.w3);
  const [distanceKm, setDistanceKm] = useState(DEFAULTS.distanceKm);
  const [requiresSafety, setRequiresSafety] = useState(DEFAULTS.requiresSafety);
  const [threshold, setThreshold] = useState(DEFAULTS.threshold);
  const hi = lang === "hi";
  const baseTrade = TRADE_PROFILES[tradeId] ?? TRADE_PROFILES["AUTO_MECH_01"]!;
  const trade = useMemo(
    () => ({ ...baseTrade, center_distance_km: distanceKm }),
    [baseTrade, distanceKm],
  );
  const params: HouseholdParameters = useMemo(
    () => ({
      student_aptitude: studentAptitude ?? [0.8, 0.94, 0.75, 0.86],
      parent_reservation_wage: reservationWage,
      parent_requires_female_safety: requiresSafety,
      weights: { w1, w2, w3 },
      gamma: 0.0005,
      lambda: 0.05,
      conflict_threshold: threshold,
    }),
    [reservationWage, requiresSafety, w1, w2, w3, threshold, studentAptitude],
  );
  const result = useMemo(() => evaluateDyadConsensus(trade, params), [trade, params]);
  const weightSum = w1 + w2 + w3 || 1;

  useEffect(() => {
    if (isOpen) onDivergenceChange?.(result.divergence);
  }, [isOpen, result.divergence, onDivergenceChange]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const reset = () => {
    setReservationWage(DEFAULTS.reservationWage);
    setW1(DEFAULTS.w1);
    setW2(DEFAULTS.w2);
    setW3(DEFAULTS.w3);
    setDistanceKm(baseTrade.center_distance_km);
    setRequiresSafety(DEFAULTS.requiresSafety);
    setThreshold(DEFAULTS.threshold);
  };
  const close = () => {
    onDivergenceChange?.(result.divergence);
    onClose();
  };
  const labels = hi
    ? {
        title: "परिवार सहमति गणित निरीक्षक",
        subtitle: "लाइव सिमुलेशन · निर्णय सहायता नहीं",
        conflict: "सिमुलेशन में संघर्ष सीमा पार",
        aligned: "सिमुलेशन में संघर्ष सीमा के भीतर",
        conflictNote:
          "मॉडल का Δ चुनी गई τ से अधिक है। यह डेमो arbitration flag सक्रिय करता है; वास्तविक निर्णय व्यक्ति करें।",
        alignedNote: "मॉडल का Δ चुनी गई τ से अधिक नहीं है। इसे परिवार की वास्तविक सहमति न मानें।",
        wage: "अभिभावक की न्यूनतम अपेक्षित आय",
        distance: "केंद्र तक दूरी",
        weights: "उद्देश्य भार",
        student: "छात्र योग्यता (w₁)",
        parent: "अभिभावक व्यवहार्यता (w₂)",
        geo: "भौगोलिक पहुँच (w₃)",
        threshold: "संघर्ष सीमा τ",
        safety: "महिला सुरक्षा स्कोर की न्यूनतम शर्त लागू करें (8.5/10)",
        reset: "डिफ़ॉल्ट रीसेट",
        close: "निरीक्षक बंद करें",
        breakdown: "लाइव गणना",
        similarity: "योग्यता समानता · Sim",
        feasibility: "अभिभावक व्यवहार्यता · Feas",
        accessibility: "भौगोलिक पहुँच · Loc",
        utility: "संयुक्त उपयोगिता · U(T)",
        divergence: "द्विपक्षीय विचलन · Δ",
        disclaimer:
          "डेमो मॉडल: वेतन, क्षमता, सुरक्षा और दूरी के इनपुट उदाहरण मात्र हैं। भार केवल U(T) में लगते हैं; इस मॉडल में Δ = |Sim − Feas| है।",
      }
    : {
        title: "Consensus Math Inspector",
        subtitle: "Live simulation · not a decision system",
        conflict: "Conflict threshold crossed in simulation",
        aligned: "Within conflict threshold in simulation",
        conflictNote:
          "Model Δ is above the selected τ. This demo raises an arbitration flag; people make real decisions.",
        alignedNote:
          "Model Δ is at or below the selected τ. This is not evidence of actual family agreement.",
        wage: "Parent reservation wage",
        distance: "Distance to center",
        weights: "Objective weights",
        student: "Student aptitude (w₁)",
        parent: "Parent feasibility (w₂)",
        geo: "Geographic access (w₃)",
        threshold: "Conflict threshold τ",
        safety: "Apply minimum female-safety score (8.5/10)",
        reset: "Reset defaults",
        close: "Close inspector",
        breakdown: "Live calculation",
        similarity: "Aptitude similarity · Sim",
        feasibility: "Parent feasibility · Feas",
        accessibility: "Geographic access · Loc",
        utility: "Composite utility · U(T)",
        divergence: "Dyadic divergence · Δ",
        disclaimer:
          "Demo model: wage, aptitude, safety, and distance inputs are illustrative. Weights affect U(T); this model defines Δ = |Sim − Feas|.",
      };
  const wText = (weight: number) => (weight / weightSum).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex justify-end bg-navy/65 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="consensus-inspector-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="flex h-full w-full max-w-2xl flex-col border-l bg-card shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-amber-300/15 text-amber-200">
                  <Activity className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 id="consensus-inspector-title" className="font-bold">
                    {labels.title}
                  </h2>
                  <p className="text-xs text-white/70">
                    {trade.trade_name} · {labels.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={reset}
                  title={labels.reset}
                  aria-label={labels.reset}
                  className="rounded-lg p-2 text-white/75 transition hover:bg-white/15 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="rounded-lg p-2 text-white/75 transition hover:bg-white/15 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <section
                aria-live="polite"
                className={`rounded-2xl border p-4 ${result.isArbitrationTriggered ? "border-rose-300 bg-rose-50 text-rose-950" : "border-emerald-300 bg-emerald-50 text-emerald-950"}`}
              >
                <div className="flex items-start gap-3">
                  {result.isArbitrationTriggered ? (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">
                      {result.isArbitrationTriggered ? labels.conflict : labels.aligned}
                    </h3>
                    <p className="mt-1 text-sm">
                      {result.isArbitrationTriggered ? labels.conflictNote : labels.alignedNote}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wide">
                      Δ / τ
                    </span>
                    <span className="font-mono text-lg font-black">
                      {result.divergence} / {threshold.toFixed(2)}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border bg-background p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 font-bold text-navy">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  {hi ? "पैरामीटर समायोजित करें" : "Tune parameters"}
                </div>
                <div className="space-y-5">
                  <Slider
                    label={labels.wage}
                    value={reservationWage}
                    display={inr(reservationWage)}
                    min={14000}
                    max={28000}
                    step={500}
                    onChange={setReservationWage}
                  />
                  <Slider
                    label={labels.distance}
                    value={distanceKm}
                    display={`${distanceKm.toFixed(1)} km`}
                    min={1}
                    max={40}
                    step={0.5}
                    onChange={setDistanceKm}
                  />
                  <div className="space-y-4 rounded-xl bg-muted/45 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {labels.weights}{" "}
                      <span className="font-normal normal-case">
                        ({hi ? "सामान्यीकृत" : "normalized"})
                      </span>
                    </p>
                    <Slider
                      label={labels.student}
                      value={w1}
                      display={wText(w1)}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      onChange={setW1}
                    />
                    <Slider
                      label={labels.parent}
                      value={w2}
                      display={wText(w2)}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      onChange={setW2}
                    />
                    <Slider
                      label={labels.geo}
                      value={w3}
                      display={wText(w3)}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      onChange={setW3}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {hi
                        ? "भारों को योग 1 करने के लिए सामान्यीकृत किया जाता है।"
                        : "Weights are normalized to sum to 1 for the utility calculation."}
                    </p>
                  </div>
                  <Slider
                    label={labels.threshold}
                    value={threshold}
                    display={threshold.toFixed(2)}
                    min={0.1}
                    max={0.75}
                    step={0.01}
                    onChange={setThreshold}
                  />
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={requiresSafety}
                      onChange={(event) => setRequiresSafety(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span>{labels.safety}</span>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border bg-background p-4 sm:p-5">
                <h3 className="font-bold text-navy">{labels.breakdown}</h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  U(T) = ŵ₁·Sim + ŵ₂·Feas + ŵ₃·Loc &nbsp;|&nbsp; Δ = |Sim − Feas|
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Value
                    label={labels.similarity}
                    value={result.similarity}
                    detail={`cos(student aptitude, ${hi ? "ट्रेड प्रोफ़ाइल" : "trade profile"})`}
                  />
                  <Value
                    label={labels.feasibility}
                    value={result.feasibility}
                    detail={`sigmoid(${inr(baseTrade.median_wage)} − ${inr(reservationWage)})${requiresSafety ? " × safety gate" : ""}`}
                  />
                  <Value
                    label={labels.accessibility}
                    value={result.accessibility}
                    detail={`exp(−0.05 × ${distanceKm.toFixed(1)} km)`}
                  />
                  <Value
                    label={labels.utility}
                    value={result.compositeUtility}
                    detail={`${wText(w1)}×${result.similarity} + ${wText(w2)}×${result.feasibility} + ${wText(w3)}×${result.accessibility}`}
                  />
                  <Value
                    label={labels.divergence}
                    value={result.divergence}
                    detail={`|${result.similarity} − ${result.feasibility}|`}
                  />
                </div>
              </section>

              <p className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-blue-950">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
                {labels.disclaimer}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-4 w-4" />
                {hi
                  ? "गणना इस डेमो पैनल में तुरंत अपडेट होती है।"
                  : "Calculations update instantly in this demo panel."}
              </div>
            </div>
            <footer className="flex items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 sm:px-6">
              <span className="text-xs text-muted-foreground">
                {hi
                  ? "मॉडल परिणाम · वास्तविक परिवार की स्थिति नहीं"
                  : "Model output · not a real household assessment"}
              </span>
              <button
                type="button"
                onClick={close}
                className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy/90"
              >
                {labels.close}
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = `math-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-navy">
          {label}
        </label>
        <output htmlFor={id} className="shrink-0 font-mono text-sm font-bold text-primary">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Value({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-xl border bg-muted/35 p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xl font-black text-navy">{value.toFixed(3)}</p>
      <p className="mt-1 break-words text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}
