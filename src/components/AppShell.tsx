import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, MessageCircle, Moon, Phone, Shield, Sun, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
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

  return (
    <div lang={lang} className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="tiranga-rule" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Crest />
            <div>
              <div className="font-display text-xl font-bold text-navy">MitraSkill</div>
              <div className="text-xs leading-tight text-muted-foreground">{n.brandSubtitle}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/whatsapp"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/25 bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-100 dark:border-emerald-300/25 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900/60 sm:px-3"
            >
              <span>📱</span>
              <span className="hidden sm:inline">{n.whatsappDemo}</span>
            </Link>
            <Link
              to={path.startsWith("/admin") ? "/accord" : "/admin"}
              data-tour="tour-admin-link"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 px-2.5 py-2 text-xs font-semibold text-navy transition hover:border-primary sm:px-3"
            >
              <Shield className="h-4 w-4" />
              {path.startsWith("/admin") ? n.familyFlow : n.adminConsole}
            </Link>
            <button
              onClick={startTour}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent/60 px-2.5 py-2 text-xs font-semibold text-navy transition hover:bg-accent sm:px-3"
              aria-label={n.appGuide}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">{n.appGuide}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-navy transition hover:border-primary"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div
              className="flex items-center rounded-full border bg-muted p-0.5 text-xs font-semibold overflow-x-auto max-w-[280px] sm:max-w-none"
              role="group"
              aria-label="Language Selector"
            >
              {(["hi", "en", "mr", "bn", "ta"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLanguage(l);
                    if (l === "en" || l === "hi") {
                      setLang(l);
                    }
                  }}
                  aria-pressed={voiceLang === l}
                  className={`rounded-full px-2.5 py-1 text-xs transition cursor-pointer font-bold ${
                    voiceLang === l
                      ? "bg-navy text-navy-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={LANGUAGE_LABELS[l].english}
                >
                  {LANGUAGE_LABELS[l].native}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="glow-pill flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{n.liveCounselor}</span>
            </button>
          </div>
        </div>
        <nav aria-label="Session stage" className="border-t bg-background/80">
          <ol className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-sm">
            {t.steps[lang].map((s, i) => (
              <li key={s} className="flex shrink-0 items-center gap-1">
                <span
                  className={`rounded-full px-3 py-1 font-medium ${
                    i === active
                      ? "bg-primary text-primary-foreground"
                      : i < active
                        ? "bg-accent text-navy"
                        : "text-muted-foreground"
                  }`}
                >
                  {i + 1}. {s}
                </span>
                {i < 3 && <span className="text-muted-foreground">→</span>}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <main className="pt-36 sm:pt-32">{children}</main>

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
