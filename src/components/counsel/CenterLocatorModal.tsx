import { useMemo, useState } from "react";
import {
  BusFront,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  MapPin,
  Navigation,
  Users,
} from "lucide-react";
import { MOCK_CENTERS, type TrainingCenterRecord } from "@/data/mockCenters";
import type { Lang } from "@/lib/app-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RadiusFilter = "under10" | "under20" | "all";
type TypeFilter = "ALL" | "GOVT_ITI" | "WOMEN_ITI" | "PMKK";

export function CenterLocatorModal({
  isOpen,
  onClose,
  lang = "en",
}: {
  isOpen: boolean;
  onClose: () => void;
  lang?: Lang;
}) {
  const hi = lang === "hi";
  const [radius, setRadius] = useState<RadiusFilter>("under10");
  const [centerType, setCenterType] = useState<TypeFilter>("ALL");
  const [reservedToken, setReservedToken] = useState<{ centerId: string; token: string } | null>(
    null,
  );
  const centers = useMemo(
    () =>
      MOCK_CENTERS.filter((center) => {
        const inRadius =
          radius === "all" ||
          (radius === "under10" ? center.distance_km < 10 : center.distance_km < 20);
        const inType =
          centerType === "ALL" ||
          (centerType === "GOVT_ITI" && center.type === "GOVT_ITI") ||
          center.type === centerType;
        return inRadius && inType;
      }).sort((a, b) => a.distance_km - b.distance_km),
    [centerType, radius],
  );

  const reserveVisit = (center: TrainingCenterRecord) => {
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    setReservedToken({ centerId: center.id, token: `DEMO-${center.id}-${suffix}` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-border bg-card p-0 text-card-foreground">
        <div className="bg-gradient-to-r from-emerald-950 to-teal-800 p-6 pr-12 text-white sm:p-7">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <MapPin className="h-5 w-5" />
            </div>
            <DialogTitle className="text-left text-xl font-bold text-white">
              {hi ? "Nearby ITI Seats & Apprenticeships" : "Nearby ITI Seats & Apprenticeships"}
            </DialogTitle>
            <DialogDescription className="text-left text-emerald-50/80">
              Meerut training centers · filter by distance and center type
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
            <FilterGroup<RadiusFilter>
              label={hi ? "दूरी" : "Distance radius"}
              value={radius}
              onChange={(value) => setRadius(value)}
              options={[
                { value: "under10", label: "<10 km" },
                { value: "under20", label: "<20 km" },
                { value: "all", label: "All Meerut" },
              ]}
            />
            <FilterGroup<TypeFilter>
              label={hi ? "केंद्र का प्रकार" : "Center type"}
              value={centerType}
              onChange={(value) => setCenterType(value)}
              options={[
                { value: "ALL", label: "All" },
                { value: "GOVT_ITI", label: "Govt ITI" },
                { value: "WOMEN_ITI", label: "Women ITI" },
                { value: "PMKK", label: "PMKK" },
              ]}
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <Navigation className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {hi
                ? "केवल डेमो निर्देशिका: दूरी, ग्रेड, सीटें, बस सेवा और NAPS अवसर उदाहरण हैं, लाइव या सत्यापित नहीं। यात्रा या आवेदन से पहले संस्थान और आधिकारिक NAPS पोर्टल से पुष्टि करें।"
                : "Sample directory only: distances, grades, seats, bus services, and NAPS opportunities are illustrative—not live or verified. Confirm details with the institution and official NAPS portal before travelling or applying."}
            </span>
          </div>

          <div className="space-y-4" aria-live="polite">
            {centers.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                lang={lang}
                token={reservedToken?.centerId === center.id ? reservedToken.token : null}
                onReserve={() => reserveVisit(center)}
              />
            ))}
            {centers.length === 0 && (
              <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                No sample centers match these filters.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterGroup<Value extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Value;
  onChange: (value: Value) => void;
  options: { value: Value; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-28 shrink-0 text-xs font-bold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${value === option.value ? "border-emerald-800 bg-emerald-800 text-white dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950" : "border-border bg-card text-muted-foreground hover:border-emerald-700 hover:text-emerald-800 dark:hover:text-emerald-200"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CenterCard({
  center,
  lang,
  token,
  onReserve,
}: {
  center: TrainingCenterRecord;
  lang: Lang;
  token: string | null;
  onReserve: () => void;
}) {
  const hi = lang === "hi";
  const seatPercent = Math.min(
    100,
    (center.available_vacant_seats / center.total_trade_seats) * 100,
  );
  const mapQuery = encodeURIComponent(
    `${center.name}, ${center.block}, ${center.district}, Uttar Pradesh, India`,
  );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=transit`;
  const typeLabel = {
    GOVT_ITI: "Government ITI",
    WOMEN_ITI: "Women ITI",
    PMKK: "PMKK",
  }[center.type];

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-950 dark:bg-teal-950 dark:text-teal-200">
                {typeLabel}
              </span>
              <span className="rounded-full border border-amber-400/70 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-950 dark:bg-amber-950/50 dark:text-amber-200">
                {center.ncvet_grade} · sample
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              {hi ? center.name_hi : center.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {center.block}, {center.district} · {center.id}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200">
            <MapPin className="h-3.5 w-3.5" /> {center.distance_km} km
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-muted/60 p-3.5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-foreground">
              {center.available_vacant_seats} of {center.total_trade_seats} seats available
            </span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
              {Math.round(seatPercent)}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width]"
              style={{ width: `${seatPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {hi
              ? "डेमो स्थिति: Round 2 Admissions Active · कृपया पुष्टि करें"
              : "Sample status: Round 2 Admissions Active · confirm with the center"}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground">
          <BusFront className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
          <span>
            <strong className="text-foreground">{hi ? "बस संपर्क" : "Bus connectivity"}:</strong>{" "}
            {center.bus_connectivity}
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 dark:border-indigo-900 dark:bg-indigo-950/25">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-100">
            <BriefcaseBusiness className="h-4 w-4" />
            {hi
              ? "NAPS Apprenticeship openings · sample listings"
              : "NAPS apprenticeship openings · sample listings"}
          </div>
          <div className="space-y-2">
            {center.active_naps_apprenticeships.map((opening) => (
              <div
                key={`${opening.company}-${opening.role}`}
                className="rounded-lg bg-white/75 p-2.5 text-xs dark:bg-slate-950/35"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <strong className="text-foreground">{opening.company}</strong>
                  <span className="font-bold text-indigo-800 dark:text-indigo-200">
                    {opening.vacancies} sample openings
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap justify-between gap-1 text-muted-foreground">
                  <span>{opening.role}</span>
                  <span>{opening.stipend_inr}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
            {hi
              ? "कंपनी संबंध, रिक्तियां और वजीफा सत्यापित नहीं हैं।"
              : "Employer ties, vacancy counts, and stipends are unverified examples—not confirmed openings."}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-teal-800/30 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-950 transition hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-teal-300/30 dark:bg-teal-950/40 dark:text-teal-100 dark:hover:bg-teal-900/60"
          >
            <ExternalLink className="h-4 w-4" />{" "}
            {hi ? "Get Directions (GPS Map)" : "Get Directions (GPS Map)"}
          </a>
          <button
            type="button"
            onClick={onReserve}
            className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <Users className="h-4 w-4" />{" "}
            {hi ? "Reserve Campus Visit Token" : "Reserve Campus Visit Token"}
          </button>
        </div>
        {token && (
          <div
            role="status"
            className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>
                {hi ? "डेमो विज़िट अनुरोध बनाया गया" : "Demo visit request created"}: {token}.
              </strong>{" "}
              {hi
                ? "यह केंद्र में बुकिंग नहीं है; कृपया सीधे संस्थान से समय की पुष्टि करें।"
                : "This is not a confirmed campus booking. Contact the institution to arrange a visit."}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
