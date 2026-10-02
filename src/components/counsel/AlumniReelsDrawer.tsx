import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Building2,
  GraduationCap,
  MapPin,
  Pause,
  Play,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { MOCK_ALUMNI_STORIES, type AlumniStory } from "@/data/mockAlumni";
import type { Lang } from "@/lib/app-context";
import { useIndicVoice } from "@/utils/useIndicVoice";

type Filter = "ALL" | "AUTO" | "SOLAR" | "WOMEN";
type Props = { isOpen: boolean; onClose: () => void; lang: Lang; initialTradeId?: string };

export function AlumniReelsDrawer({ isOpen, onClose, lang, initialTradeId }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const { speak, stop } = useIndicVoice();
  const hi = lang === "hi";

  useEffect(() => {
    if (!isOpen) stop();
  }, [isOpen, stop]);

  useEffect(() => {
    if (!isOpen) return;
    setFilter(
      initialTradeId === "AUTO_MECH_01"
        ? "AUTO"
        : initialTradeId === "SOLAR_TECH_02"
          ? "SOLAR"
          : "ALL",
    );
    setSelectedStoryId(null);
    stop();
    setPlayingStoryId(null);
    setElapsed(0);
    elapsedRef.current = 0;
  }, [isOpen, initialTradeId, stop]);
  useEffect(() => {
    if (!isOpen) return;
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

  const stories = useMemo(
    () =>
      MOCK_ALUMNI_STORIES.filter((story) => {
        if (filter === "AUTO") return story.trade_id === "AUTO_MECH_01";
        if (filter === "SOLAR") return story.trade_id === "SOLAR_TECH_02";
        if (filter === "WOMEN") return story.gender === "female";
        return true;
      }),
    [filter],
  );

  useEffect(() => {
    if (!selectedStoryId || stories.some((story) => story.id === selectedStoryId)) return;
    setSelectedStoryId(null);
    setPlayingStoryId(null);
    setElapsed(0);
    elapsedRef.current = 0;
  }, [selectedStoryId, stories]);

  useEffect(() => {
    if (!playingStoryId) return;
    const story = MOCK_ALUMNI_STORIES.find((item) => item.id === playingStoryId);
    if (!story) return;
    const timer = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playingStoryId]);

  if (!isOpen) return null;
  const togglePlayback = (story: AlumniStory) => {
    if (playingStoryId === story.id) {
      stop();
      setPlayingStoryId(null);
      return;
    }
    if (selectedStoryId !== story.id) {
      setSelectedStoryId(story.id);
      setElapsed(0);
      elapsedRef.current = 0;
    }
    setPlayingStoryId(story.id);
    speak(
      `${lang === "hi" ? story.name_hi : story.name}: ${lang === "hi" ? story.quote_hi : story.quote_en}`,
      lang,
      () => {
        setPlayingStoryId(null);
        setElapsed(0);
        elapsedRef.current = 0;
      },
    );
  };
  const filters: { id: Filter; en: string; hi: string }[] = [
    { id: "ALL", en: "All stories", hi: "सभी कहानियाँ" },
    { id: "AUTO", en: "Automotive", hi: "ऑटोमोटिव" },
    { id: "SOLAR", en: "Solar", hi: "सोलर" },
    { id: "WOMEN", en: "Women in tech", hi: "तकनीकी क्षेत्र में महिलाएँ" },
  ];

  return (
    <div
      className="fixed inset-0 z-[85] flex justify-end bg-navy/70 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="alumni-reels-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="flex h-full w-full max-w-xl flex-col border-l bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-amber-300/15 text-amber-200">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="alumni-reels-title" className="font-bold">
                  {hi ? "स्थानीय पूर्व-छात्र यात्रा रील्स" : "Local Alumni Trajectory Reels"}
                </h2>
                <span className="rounded-full border border-amber-200/60 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                  {hi ? "नमूना कहानियाँ" : "SAMPLE STORIES"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/70">
                {hi
                  ? "काल्पनिक करियर उदाहरण · सत्यापित प्रशंसापत्र नहीं"
                  : "Illustrative career examples · not verified testimonials"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alumni reels"
            className="rounded-lg p-2 text-white/75 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div
          className="flex gap-2 overflow-x-auto border-b bg-background px-4 py-3"
          role="group"
          aria-label={hi ? "कहानियाँ फ़िल्टर करें" : "Filter stories"}
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${filter === item.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary hover:text-navy"}`}
            >
              {hi ? item.hi : item.en}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-muted/25 p-4 sm:p-5">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
            <p>
              {hi
                ? "सभी नाम, उद्धरण, आय, नियोक्ता और करियर विवरण डेमो हेतु गढ़े गए हैं। इन्हें वास्तविक पूर्व-छात्रों या नौकरी के परिणामों के रूप में प्रस्तुत न करें।"
                : "All names, quotes, earnings, employers, and career details are fictional demo content. Do not present them as real alumni or employment outcomes."}
            </p>
          </div>
          <AnimatePresence mode="popLayout">
            {stories.map((story) => (
              <ReelCard
                key={story.id}
                story={story}
                lang={lang}
                isPlaying={playingStoryId === story.id}
                isSelected={selectedStoryId === story.id}
                elapsed={elapsed}
                onToggle={() => togglePlayback(story)}
              />
            ))}
          </AnimatePresence>
          {stories.length === 0 && (
            <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
              {hi ? "इस फ़िल्टर के लिए कोई कहानी नहीं है।" : "No stories match this filter."}
            </p>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

function ReelCard({
  story,
  lang,
  isPlaying,
  isSelected,
  elapsed,
  onToggle,
}: {
  story: AlumniStory;
  lang: Lang;
  isPlaying: boolean;
  isSelected: boolean;
  elapsed: number;
  onToggle: () => void;
}) {
  const hi = lang === "hi";
  const duration = story.audio_duration_secs;
  const progress = isSelected ? Math.min(100, (elapsed / duration) * 100) : 0;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="overflow-hidden rounded-3xl border bg-card shadow-sm"
    >
      <div className="relative flex min-h-40 items-end overflow-hidden bg-gradient-to-br from-navy via-indigo-950 to-emerald-950 p-4 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5"
        />
        <div
          aria-hidden="true"
          className="absolute right-16 top-6 h-24 w-24 rounded-full bg-emerald-300/10 blur-xl"
        />
        <div className="relative flex w-full items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-amber-300 text-xl font-black text-navy shadow-lg">
              {(hi ? story.name_hi : story.name).slice(0, 1)}
            </div>
            <div>
              <p className="flex flex-wrap items-center gap-2 font-bold">
                {hi ? story.name_hi : story.name}
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
                  {hi ? "काल्पनिक प्रोफ़ाइल" : "Fictional profile"}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-white/75">
                <MapPin className="h-3.5 w-3.5 text-amber-200" />
                {story.hometown_district}
              </p>
            </div>
          </div>
          {story.is_female_pioneer && (
            <span className="hidden items-center gap-1 rounded-full bg-rose-300/20 px-2.5 py-1 text-[10px] font-bold text-rose-100 sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              {hi ? "महिला तकनीकी प्रोफ़ाइल" : "Women in tech"}
            </span>
          )}
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-1 text-[10px] font-semibold text-white/90">
          <Play className="h-3 w-3" />
          {hi ? "वीडियो प्लेसहोल्डर" : "Video placeholder"}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info
            icon={GraduationCap}
            label={hi ? "प्रशिक्षण" : "Training"}
            value={`${story.trade_name} · ${story.graduating_iti} · ${story.graduation_year}`}
          />
          <Info
            icon={Building2}
            label={hi ? "भूमिका (नमूना)" : "Role (sample)"}
            value={`${hi ? story.current_role_hi : story.current_role} · ${story.employer}`}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-emerald-50 p-3 text-emerald-950">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <TrendingUp className="h-4 w-4" />
              {hi ? "मासिक आय (केवल उदाहरण)" : "Monthly earnings (illustrative)"}
            </p>
            <p className="mt-1 font-bold">{story.monthly_earnings}</p>
          </div>
          <div className="rounded-xl border bg-indigo-50 p-3 text-indigo-950">
            <p className="text-xs font-semibold">
              {hi ? "संभावित अगला कदम (गारंटी नहीं)" : "Possible next step (not guaranteed)"}
            </p>
            <p className="mt-1 text-sm font-medium">{story.five_year_trajectory}</p>
          </div>
        </div>
        <blockquote className="rounded-xl border-l-4 border-amber-500 bg-muted/45 p-3 text-sm leading-relaxed text-navy">
          <p lang={lang}>“{hi ? story.quote_hi : story.quote_en}”</p>
          <footer className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {hi ? "नमूना स्क्रिप्ट · वास्तविक उद्धरण नहीं" : "Sample script · not a real quotation"}
          </footer>
        </blockquote>
        <div className="rounded-xl border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={isPlaying}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-navy/90"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying
                ? hi
                  ? "रोकें"
                  : "Stop narration"
                : hi
                  ? "नमूना वॉइस नोट सुनें"
                  : "Listen to sample story"}
            </button>
            <span className="font-mono text-xs text-muted-foreground">
              {isSelected ? `0:${String(elapsed).padStart(2, "0")}` : "0:00"} / 0:
              {String(duration).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="mt-2 flex h-5 items-end gap-1"
            aria-label={
              isPlaying ? (hi ? "नमूना आवाज़ चल रही है" : "Sample voice note playing") : undefined
            }
            aria-hidden={!isPlaying}
          >
            {Array.from({ length: 18 }, (_, index) => (
              <motion.span
                key={index}
                className={`w-1 rounded-full ${isPlaying ? "bg-emerald-600" : "bg-muted-foreground/30"}`}
                animate={
                  isPlaying
                    ? { height: [4, 8 + ((index * 5) % 16), 5 + ((index * 7) % 11)] }
                    : { height: 4 }
                }
                transition={{
                  duration: 0.5 + (index % 3) * 0.15,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "reverse",
                  delay: index * 0.02,
                }}
              />
            ))}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {hi
              ? "केवल प्लेबैक एनीमेशन; कोई रिकॉर्डेड ऑडियो नहीं।"
              : "Browser-generated narration of a fictional sample story; this is not a real recording."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-navy">{value}</p>
    </div>
  );
}
