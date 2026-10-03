import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Globe,
  Languages,
  Moon,
  Phone,
  Shield,
  Sun,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp, type Lang } from "@/lib/app-context";
import { useTour } from "@/context/TourContext";
import { PlatformTour } from "@/components/common/PlatformTour";
import { CounselorTriageModal } from "@/components/counsel/CounselorTriageModal";
import { useLanguageVoice, type SupportedLanguage, LANGUAGE_LABELS } from "@/context/LanguageVoiceContext";
import { useTranslation } from "@/hooks/useTranslation";

function Crest() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-saffron bg-navy">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-navy-foreground" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * Math.PI) / 12;
          const x = (12 + 9 * Math.cos(a)).toFixed(4);
          const y = (12 + 9 * Math.sin(a)).toFixed(4);
          return (
            <line key={i} x1={12} y1={12} x2={x} y2={y} stroke="currentColor" strokeWidth="0.5" />
          );
        })}
      </svg>
    </div>
  );
}

function LanguageDropdown({
  voiceLang,
  setLanguage,
  setLang,
}: {
  voiceLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  setLang: (lang: Lang) => void;
}) {
  const currentLang = LANGUAGE_LABELS[voiceLang] || LANGUAGE_LABELS.en;
  const SUPPORTED_LANGS: SupportedLanguage[] = ["hi", "en", "mr", "bn", "ta"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/20 dark:border-slate-700 bg-background/90 hover:bg-accent/80 hover:border-primary/50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-navy dark:text-slate-100 transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Select language"
        >
          <Globe className="h-3.5 w-3.5 text-primary shrink-0 transition-transform group-hover:rotate-12" />
          <span className="tracking-tight whitespace-nowrap">{currentLang.native}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card/95 backdrop-blur-md p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95"
      >
        <div className="px-2.5 py-1.5 border-b border-border/50 mb-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Languages className="h-3 w-3 text-primary" />
            <span>Select Language • भाषा</span>
          </div>
        </div>
        <div className="space-y-0.5">
          {SUPPORTED_LANGS.map((code) => {
            const isSelected = voiceLang === code;
            const langInfo = LANGUAGE_LABELS[code];
            return (
              <DropdownMenuItem
                key={code}
                onClick={() => {
                  setLanguage(code);
                  if (code === "en" || code === "hi") {
                    setLang(code);
                  }
                }}
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {code}
                  </span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm leading-tight">{langInfo.native}</div>
                    <div className="text-[10px] text-muted-foreground">{langInfo.english}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white shadow-2xs">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t, activeTradeName, currentDivergence } = useApp();
  const { language: voiceLang, setLanguage } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const n = ui.nav;
  const { start: startTour } = useTour();
  const [open, setOpen] = useState(false);
  const [legacyPopupEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = path.startsWith("/admin")
    ? -1
    : path.startsWith("/accord")
      ? 4
      : path.startsWith("/mobility")
        ? 2
        : path.startsWith("/counsel")
          ? 1
          : 0;

  useEffect(() => {
    const saved = window.localStorage.getItem("mitraskill_theme");
    const enabled = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleTheme = () => {
    const enabled = !darkMode;
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    window.localStorage.setItem("mitraskill_theme", enabled ? "dark" : "light");
  };

  const STEP_ROUTES = ["/", "/counsel", "/mobility", "/accord"];
  const STEP_LABELS: Record<SupportedLanguage, string[]> = {
    en: ["1. Onboarding", "2. Dyadic Dialogue", "3. Degree Mobility", "4. Family Accord"],
    hi: ["1. शुरुआत", "2. संवाद", "3. डिग्री अवसर", "4. पारिवारिक सहमति"],
    mr: ["1. सुरुवात", "2. संवाद", "3. पदवी संधी", "4. कौटुंबिक सहमती"],
    bn: ["1. शुरू", "2. সংলাপ", "3. ডিগ্রি সুযোগ", "4. পারিবারিক চুক্তি"],
    ta: ["1. தொடக்கம்", "2. உரையாடல்", "3. பட்டப்படிப்பு", "4. குடும்ப உடன்படிக்கை"],
  };
  const stepList = STEP_LABELS[voiceLang] || STEP_LABELS[lang as SupportedLanguage] || STEP_LABELS.en;

  return (
    <div lang={lang} className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-card/95 backdrop-blur shadow-2xs">
        <div className="tiranga-rule" />
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 xl:gap-3 px-3 sm:px-4 py-2">
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Crest />
            <div>
              <div className="font-display text-base sm:text-lg lg:text-xl font-bold text-navy tracking-tight leading-tight">
                MitraSkill
              </div>
              <div className="hidden 2xl:block text-[11px] leading-tight text-muted-foreground max-w-[260px] truncate">
                {n.brandSubtitle}
              </div>
            </div>
          </Link>

          {/* Center: Sleek Workflow Stepper (Session Stage Navigation) - shown on 2xl */}
          <nav
            aria-label="Session stage"
            className="hidden 2xl:flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 p-1 text-xs shadow-2xs"
          >
            {stepList.map((s, i) => {
              const isCurrent = i === active;
              const isDone = i < active && active !== -1;
              const targetPath = STEP_ROUTES[i] || "/";
              return (
                <div key={s} className="flex items-center gap-1">
                  <Link
                    to={targetPath}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold transition-all ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-xs font-bold scale-[1.02]"
                        : isDone
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        isCurrent
                          ? "bg-white text-primary"
                          : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className="whitespace-nowrap">{s.replace(/^\d+\.\s*/, "")}</span>
                  </Link>
                  {i < stepList.length - 1 && (
                    <span
                      className="text-slate-300 dark:text-slate-600 text-[11px] px-0.5 select-none"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Compact Stage Breadcrumb (md to 2xl) */}
          <div className="hidden md:flex 2xl:hidden items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 px-3 py-1 text-xs font-bold text-navy shadow-2xs shrink-0">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-black">
              {active >= 0 ? active + 1 : "•"}
            </span>
            <span className="text-primary truncate max-w-[130px] lg:max-w-[180px]">
              {active >= 0 ? stepList[active]?.replace(/^\d+\.\s*/, "") : "Admin"}
            </span>
            <span className="text-slate-400 text-[10px]">({active + 1}/4)</span>
          </div>

          {/* Right: Actions & Tools */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/whatsapp"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-700/25 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-100 dark:border-emerald-300/25 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900/60 sm:px-3"
            >
              <span>📱</span>
              <span className="hidden lg:inline">{n.whatsappDemo}</span>
            </Link>
            <Link
              to={path.startsWith("/admin") ? "/accord" : "/admin"}
              data-tour="tour-admin-link"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/20 px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:border-primary sm:px-3"
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{path.startsWith("/admin") ? n.familyFlow : n.adminConsole}</span>
            </Link>
            <button
              onClick={startTour}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-accent/60 px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:bg-accent sm:px-3"
              aria-label={n.appGuide}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">{n.appGuide}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex shrink-0 h-8 w-8 items-center justify-center rounded-full border bg-card text-navy transition hover:border-primary cursor-pointer"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Language Selector Dropdown */}
            <LanguageDropdown voiceLang={voiceLang} setLanguage={setLanguage} setLang={setLang} />

            {/* Live ITI Counselor Button */}
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 whitespace-nowrap glow-pill inline-flex items-center gap-1.5 rounded-full bg-success hover:bg-emerald-600 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
              title={n.liveCounselor}
              aria-label={n.liveCounselor}
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{n.liveCounselor}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 sm:pt-20">{children}</main>

      {legacyPopupEnabled && open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-navy">{t.counsellor[lang]}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-muted-foreground">District Counselor Helpline</p>
            <p className="text-lg font-semibold text-navy">Meerut ITI Nodal Officer</p>
            <p className="mt-1 text-sm text-muted-foreground">Available 9 AM – 6 PM</p>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-accent p-3 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-success" /> Online now
            </div>
          </div>
        </div>
      )}
      <CounselorTriageModal
        isOpen={open}
        onClose={() => setOpen(false)}
        lang={lang}
        selectedTradeName={activeTradeName}
        currentDivergence={currentDivergence}
      />
      <PlatformTour />
    </div>
  );
}
