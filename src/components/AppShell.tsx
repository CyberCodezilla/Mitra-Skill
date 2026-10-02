import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Phone, X } from "lucide-react";
import { useApp } from "@/lib/app-context";

function Crest() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-saffron bg-navy">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-navy-foreground" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * Math.PI) / 12;
          return <line key={i} x1={12} y1={12} x2={12 + 9 * Math.cos(a)} y2={12 + 9 * Math.sin(a)} stroke="currentColor" strokeWidth="0.5" />;
        })}
      </svg>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useApp();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = path.startsWith("/counsel") ? 1 : 0;

  return (
    <div lang={lang} className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="tiranga-rule" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Crest />
            <div>
              <div className="font-display text-xl font-bold text-navy">MitraSkill</div>
              <div className="text-xs leading-tight text-muted-foreground">{t.subtitle[lang]}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border bg-muted p-1 text-sm font-semibold" role="group" aria-label="Language">
              {(["hi", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-full px-3 py-1 transition ${lang === l ? "bg-navy text-navy-foreground" : "text-muted-foreground"}`}
                >
                  {l === "hi" ? "हिंदी" : "English"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="glow-pill flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t.counsellor[lang]}</span>
            </button>
          </div>
        </div>
        <nav aria-label="Session stage" className="border-t bg-background/80">
          <ol className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-sm">
            {t.steps[lang].map((s, i) => (
              <li key={s} className="flex shrink-0 items-center gap-1">
                <span
                  className={`rounded-full px-3 py-1 font-medium ${
                    i === active ? "bg-primary text-primary-foreground" : i < active ? "bg-accent text-navy" : "text-muted-foreground"
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal className="w-full max-w-md rounded-2xl bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-navy">{t.counsellor[lang]}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
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
    </div>
  );
}
