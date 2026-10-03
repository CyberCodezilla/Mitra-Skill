import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  MapPin,
  Volume2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp, type SessionMode, type Lang } from "@/lib/app-context";
import {
  VoiceAptitudeModal,
  type AptitudeDiscovery,
} from "@/components/onboard/VoiceAptitudeModal";
import { MOCK_TRADES } from "@/data/mockTrades";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import { DYADIC_DIALOGUES } from "@/data/dialogueScripts";
import type { PersonaId } from "@/utils/voiceProfiles";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MitraSkill — Family Skilling Guidance (MSDE)" },
      {
        name: "description",
        content:
          "Joint student–parent counselling for ITI trades, grounded in verified Ministry placement data.",
      },
      { property: "og:title", content: "MitraSkill — Ek Nayi Shuruaat, Parivaar Ke Saath" },
      {
        property: "og:description",
        content:
          "Joint student–parent counselling for ITI trades, grounded in verified Ministry placement data.",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const {
    lang,
    t,
    setMode,
    setStudentAptitude,
    setSelectedTradeId,
    setActiveTradeName,
    setAptitudeDiscovered,
    aptitudeDiscovered,
    studentAptitude,
    selectedTradeId,
  } = useApp();
  const nav = useNavigate();
  const [level, setLevel] = useState(1);
  const { speak, stop, isSpeaking: playing, currentSpeakingPersona } = useIndicVoice();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.home;
  const [aptitudeModalOpen, setAptitudeModalOpen] = useState(false);
  const heroTitle = c.headline;
  const isEnglish = language === "en" || (!language && lang === "en");
  const [heroInitial, ...heroRest] = isEnglish ? Array.from(heroTitle) : ["", heroTitle];

  // Fallback to active language or app lang
  const activeLang: SupportedLanguage = (language in DYADIC_DIALOGUES ? language : (lang as SupportedLanguage)) || "hi";
  const dialogue = DYADIC_DIALOGUES[activeLang] || DYADIC_DIALOGUES.hi;

  const handlePlayPersonaVoice = (personaId: PersonaId, text: string) => {
    if (playing && currentSpeakingPersona === personaId) {
      stop();
    } else {
      speak(text, personaId, activeLang);
    }
  };

  const go = (m: SessionMode) => {
    setMode(m);
    nav({ to: "/counsel" });
  };

  const handleDiscoveryComplete = (result: AptitudeDiscovery) => {
    setStudentAptitude(result.aptitudeVector);
    setSelectedTradeId(result.recommendedTradeId);
    setActiveTradeName(result.tradeName);
    setAptitudeDiscovered(true);
    setAptitudeModalOpen(false);
    setMode("JOINT");
    nav({ to: "/counsel" });
  };
  const selectedTrade = MOCK_TRADES.find((trade) => trade.trade_id === selectedTradeId);

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8">
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" /> {c.badge}
          </span>
          <h1 className="font-hero-title mx-auto mt-5 max-w-4xl text-4xl font-bold text-navy sm:text-6xl">
            {isEnglish ? (
              <>
                <span className="hero-initial" aria-hidden="true">
                  {heroInitial}
                </span>
                <span className="sr-only">{heroInitial}</span>
                {heroRest.join("")}
              </>
            ) : (
              heroTitle
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{c.subheadline}</p>

          <button
            onClick={() => (playing ? stop() : speak(`${c.headline}. ${c.subheadline}`, activeLang))}
            className="mx-auto mt-6 flex items-center gap-3 rounded-full border bg-card px-5 py-2.5 shadow-card cursor-pointer"
            aria-pressed={playing}
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Volume2 className="h-5 w-5" />
              {playing && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              )}
            </span>
            <span className="font-medium text-navy">
              {playing ? (
                t.playing[lang]
              ) : (
                <span>{c.audioBtn}</span>
              )}
            </span>
            {playing && (
              <span className="flex h-5 items-end gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="wave-bar h-full w-1 rounded bg-primary"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </button>
        </section>

        <section className="mx-auto mt-10 grid max-w-4xl gap-4 rounded-2xl border bg-card p-5 shadow-card md:grid-cols-[auto_1fr] md:items-center">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{c.districtFilterLabel}</span>
            <span className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent font-medium text-navy outline-none"
                defaultValue="meerut"
              >
                <option value="meerut">Meerut, Uttar Pradesh (Pilot Corridor)</option>
                <option value="ghaziabad">Ghaziabad, Uttar Pradesh</option>
                <option value="noida">Gautam Buddh Nagar, Uttar Pradesh</option>
              </select>
            </span>
          </label>
          <div>
            <span className="text-sm font-medium text-muted-foreground">{c.classFilterLabel}</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {t.levels[lang].map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLevel(i)}
                  aria-pressed={level === i}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    level === i
                      ? "border-navy bg-navy text-navy-foreground"
                      : "bg-background text-navy hover:border-primary"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          data-tour="tour-personas"
          className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2"
        >
          <PersonaCard
            tone="student"
            icon={<GraduationCap className="h-8 w-8" />}
            role={c.studentCard.role}
            name={c.studentCard.name}
            rows={[
              [lang === "hi" ? "शैक्षणिक स्तर" : "Schooling", c.studentCard.schooling],
              [lang === "hi" ? "व्यावहारिक रुचि" : "Interests", c.studentCard.interests],
            ]}
            badge={
              aptitudeDiscovered && selectedTrade
                ? `${lang === "hi" ? "रुचि मेल" : "Interest match"}: ${lang === "hi" ? selectedTrade.hindi_title : selectedTrade.trade_name}`
                : c.studentCard.tag
            }
            personaId="student_aman"
            audioText={dialogue.studentText}
            audioDuration={dialogue.studentAudioDuration}
            lang={lang}
            isPlaying={playing && currentSpeakingPersona === "student_aman"}
            onPlayVoice={() => handlePlayPersonaVoice("student_aman", dialogue.studentText)}
            action={
              <>
                <button
                  type="button"
                  onClick={() => setAptitudeModalOpen(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/35 bg-sky-500/10 px-4 py-3 text-sm font-bold text-sky-900 transition hover:border-sky-600 hover:bg-sky-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  {c.studentCard.aptitudeBtn}
                </button>
                {aptitudeDiscovered && selectedTrade && (
                  <p className="mt-2 rounded-lg bg-muted/60 p-2 text-xs text-muted-foreground">
                    {lang === "hi" ? "पिछला रुचि वेक्टर" : "Latest interest vector"}: [
                    {studentAptitude.map((score) => score.toFixed(2)).join(", ")}] ·{" "}
                    {lang === "hi" ? selectedTrade.hindi_title : selectedTrade.trade_name}
                  </p>
                )}
              </>
            }
          />
          <PersonaCard
            tone="parent"
            icon={<Users className="h-8 w-8" />}
            role={c.parentCard.role}
            name={c.parentCard.name}
            rows={[
              [
                lang === "hi" ? "मुख्य संशय" : "Hesitation / Concerns",
                c.parentCard.concerns,
              ],
              [lang === "hi" ? "अपेक्षित वेतन" : "Reservation Wage", c.parentCard.status],
            ]}
            badge={c.parentCard.tag}
            personaId="parent_ramesh"
            audioText={dialogue.parentText}
            audioDuration={dialogue.parentAudioDuration}
            lang={lang}
            isPlaying={playing && currentSpeakingPersona === "parent_ramesh"}
            onPlayVoice={() => handlePlayPersonaVoice("parent_ramesh", dialogue.parentText)}
          />
        </section>

        <section className="mx-auto mt-10 max-w-3xl text-center">
          <button
            onClick={() => go("JOINT")}
            className="pulse-saffron group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-6 text-lg font-bold uppercase tracking-wide text-primary-foreground sm:text-xl cursor-pointer"
          >
            {c.startBtn}
            <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-muted-foreground">{t.ctaSub[lang]}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <button
              onClick={() => go("STUDENT")}
              className="text-student underline-offset-4 hover:underline cursor-pointer"
            >
              {c.studentOnlyLink}
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => go("PARENT")}
              className="text-parent underline-offset-4 hover:underline cursor-pointer"
            >
              {c.parentOnlyLink}
            </button>
          </div>
        </section>
      </div>
      <VoiceAptitudeModal
        isOpen={aptitudeModalOpen}
        onClose={() => setAptitudeModalOpen(false)}
        lang={lang}
        onCompleteDiscovery={handleDiscoveryComplete}
      />
    </div>
  );
}

function PersonaCard({
  tone,
  icon,
  role,
  name,
  rows,
  badge,
  action,
  personaId,
  audioText,
  audioDuration,
  lang,
  onPlayVoice,
  isPlaying,
}: {
  tone: "student" | "parent";
  icon: React.ReactNode;
  role: string;
  name: string;
  rows: [string, string][];
  badge: string;
  action?: React.ReactNode;
  personaId?: PersonaId | undefined;
  audioText?: string | undefined;
  audioDuration?: string | undefined;
  lang?: Lang | undefined;
  onPlayVoice?: (() => void) | undefined;
  isPlaying?: boolean | undefined;
}) {
  const s =
    tone === "student"
      ? { bar: "bg-student", soft: "bg-student-soft", text: "text-student" }
      : { bar: "bg-parent", soft: "bg-parent-soft", text: "text-parent" };
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-card">
      <div className={`h-2 ${s.bar}`} />
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${s.soft} ${s.text}`}
          >
            {icon}
          </div>
          <div>
            <div className={`text-sm font-semibold uppercase tracking-wide ${s.text}`}>{role}</div>
            <h2 className="text-lg font-bold text-navy">{name}</h2>
          </div>
        </div>
        <dl className="mt-5 space-y-3">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="font-medium text-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <span
          className={`mt-5 inline-block rounded-full px-3 py-1 text-sm font-semibold ${s.soft} ${s.text}`}
        >
          {badge}
        </span>

        {/* Multi-Persona Native Audio Sample Button */}
        {personaId && audioText && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPlayVoice}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isPlaying
                  ? tone === "student"
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300 animate-pulse"
                    : "bg-amber-600 text-white shadow-md ring-2 ring-amber-300 animate-pulse"
                  : tone === "student"
                    ? "bg-blue-50/90 text-blue-900 hover:bg-blue-100 border border-blue-200"
                    : "bg-amber-50/90 text-amber-900 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>
                {isPlaying
                  ? lang === "hi"
                    ? "आवाज़ चल रही है · रोकें"
                    : "Playing Voice · Stop"
                  : tone === "student"
                    ? lang === "hi"
                      ? "🎙️ अमन की आवाज़ सुनें (17 वर्ष)"
                      : "🎙️ Listen to Aman (17y)"
                    : lang === "hi"
                      ? "🎙️ रमेश जी की आवाज़ सुनें (48 वर्ष)"
                      : "🎙️ Listen to Ramesh (48y)"}
              </span>
              {isPlaying && (
                <span className="flex h-3 items-end gap-0.5 ml-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-full w-1 rounded bg-white animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              )}
            </button>
            {audioDuration && (
              <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                {audioDuration} · {tone === "student" ? "Youthful (1.22x)" : "Grave (0.78x)"}
              </span>
            )}
          </div>
        )}

        {action}
      </div>
    </article>
  );
}
