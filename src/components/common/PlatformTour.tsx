import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Handshake, Rocket, ShieldCheck, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useTour } from "@/context/TourContext";

const steps = [
  {
    target: null,
    path: "/",
    title: { en: "Welcome to MitraSkill", hi: "मित्रस्किल में आपका स्वागत है" },
    body: {
      en: "Vocational careers often stall when families have unanswered questions about wages and social standing. MitraSkill brings student aspirations and parent concerns into one conversation, grounded in verified data.",
      hi: "वेतन और सामाजिक सम्मान को लेकर परिवारों के सवालों का जवाब देना ज़रूरी है। मित्रस्किल छात्र की आकांक्षाओं और अभिभावक की चिंताओं को सत्यापित जानकारी के साथ एक संवाद में लाता है।",
    },
  },
  {
    target: "tour-personas",
    path: "/",
    title: { en: "Two perspectives, one decision", hi: "दो दृष्टिकोण, एक निर्णय" },
    body: {
      en: "Career guidance is not just an individual test. We consider the student's interests alongside the family's financial and social priorities.",
      hi: "करियर मार्गदर्शन केवल छात्र की परीक्षा नहीं है। इसमें छात्र की रुचि और परिवार की आर्थिक व सामाजिक प्राथमिकताएँ साथ देखी जाती हैं।",
    },
  },
  {
    target: "tour-chat-feed",
    path: "/counsel",
    title: { en: "Real-time family dialogue", hi: "परिवार का संवाद" },
    body: {
      en: "The AI Arbiter recognizes the parent's concern and responds with trade-specific placement and salary evidence.",
      hi: "AI मध्यस्थ अभिभावक की चिंता को समझकर ट्रेड से जुड़े प्लेसमेंट और वेतन के प्रमाण साझा करता है।",
    },
  },
  {
    target: "tour-mic-bar",
    path: "/counsel",
    title: { en: "Voice-first access", hi: "आवाज़ से आसान संवाद" },
    body: {
      en: "Student and parent can take turns speaking. The simulation supports a voice-first experience for families who prefer speaking to typing.",
      hi: "छात्र और अभिभावक बारी-बारी से अपनी बात कह सकते हैं। यह अनुभव टाइप करने के बजाय बोलने को प्राथमिकता देता है।",
    },
  },
  {
    target: "tour-mobility-ladder",
    path: "/mobility",
    title: { en: "Keep the degree path open", hi: "डिग्री तक आगे बढ़ने का रास्ता" },
    body: {
      en: "The NCrF ladder explains how ITI learning may carry forward into diploma and degree study. Credit acceptance and entry depend on the admitting institution's rules.",
      hi: "NCrF सीढ़ी दिखाती है कि ITI की पढ़ाई आगे डिप्लोमा और डिग्री में कैसे काम आ सकती है। क्रेडिट की स्वीकृति प्रवेश संस्था के नियमों पर निर्भर करती है।",
    },
  },
  {
    target: "tour-accord-card",
    path: "/accord",
    title: { en: "Family accord and policy insight", hi: "पारिवारिक सहमति और नीति जानकारी" },
    body: {
      en: "Families can review a shared career commitment, while administrators use anonymized resistance telemetry to plan local skilling support.",
      hi: "परिवार साझा करियर संकल्प देख सकते हैं और प्रशासक गुमनाम टेलीमेट्री से स्थानीय कौशल सहायता की योजना बना सकते हैं।",
    },
  },
];
type Box = { top: number; left: number; width: number; height: number };

export function PlatformTour() {
  const { isOpen, step, goTo, start, close } = useTour();
  const { lang } = useApp();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const [box, setBox] = useState<Box | null>(null);
  const [adminBox, setAdminBox] = useState<Box | null>(null);
  const [card, setCard] = useState({ top: 0, left: 0 });
  const autoStarted = useRef(false);
  const dialogRef = useRef<HTMLElement>(null);
  const current = steps[step]!;
  const hi = lang === "hi";

  useEffect(() => {
    if (
      path !== "/" ||
      autoStarted.current ||
      window.sessionStorage.getItem("mitraskill_tour_seen")
    )
      return;
    const timer = window.setTimeout(() => {
      autoStarted.current = true;
      start();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [path, start]);

  useEffect(() => {
    if (!isOpen) {
      setBox(null);
      setAdminBox(null);
      return;
    }
    if (path !== current.path) {
      if (current.path === "/") navigate({ to: "/" });
      else if (current.path === "/counsel") navigate({ to: "/counsel" });
      else if (current.path === "/mobility") navigate({ to: "/mobility" });
      else navigate({ to: "/accord" });
      return;
    }
    let animation = 0;
    const measure = () => {
      const target = current.target
        ? document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
        : null;
      if (!target) {
        setBox(null);
        setAdminBox(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      const nextBox = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      setBox(nextBox);
      const adminTarget =
        step === 5 ? document.querySelector<HTMLElement>("[data-tour='tour-admin-link']") : null;
      if (adminTarget) {
        const adminRect = adminTarget.getBoundingClientRect();
        setAdminBox({
          top: adminRect.top,
          left: adminRect.left,
          width: adminRect.width,
          height: adminRect.height,
        });
      } else setAdminBox(null);

      const cardWidth = Math.min(320, window.innerWidth - 32);
      const cardHeight = dialogRef.current?.offsetHeight || 270;
      const gap = 16;
      const margin = 14;
      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), Math.max(min, max));

      // Overlap checking function: true if card would intersect target (plus safety padding)
      const checkOverlap = (pos: { top: number; left: number }, pad = 8) => {
        const cardRight = pos.left + cardWidth;
        const cardBottom = pos.top + cardHeight;
        return !(
          cardRight <= rect.left - pad ||
          pos.left >= rect.right + pad ||
          cardBottom <= rect.top - pad ||
          pos.top >= rect.bottom + pad
        );
      };

      const centeredLeft = clamp(
        rect.left + rect.width / 2 - cardWidth / 2,
        margin,
        window.innerWidth - cardWidth - margin
      );

      // Candidate placements prioritized so they NEVER overlap the target
      const candidates: Array<{ top: number; left: number; side: "right" | "left" | "bottom" | "top" }> = [];

      // Check right side (ideal for desktop when target is centered)
      const spaceRight = window.innerWidth - (rect.right + 12);
      if (spaceRight >= cardWidth + margin) {
        candidates.push({
          top: clamp(rect.top + 20, margin, window.innerHeight - cardHeight - margin),
          left: rect.right + 14,
          side: "right",
        });
      }

      // Check left side
      const spaceLeft = rect.left - 12;
      if (spaceLeft >= cardWidth + margin) {
        candidates.push({
          top: clamp(rect.top + 20, margin, window.innerHeight - cardHeight - margin),
          left: rect.left - cardWidth - 14,
          side: "left",
        });
      }

      if (step === 3) {
        // Step 3 (mic bar) is fixed at the bottom: place card ABOVE it!
        const topAbove = rect.top - cardHeight - gap;
        candidates.unshift({
          top: Math.max(margin, topAbove),
          left: centeredLeft,
          side: "top",
        });
        candidates.push({
          top: Math.min(window.innerHeight - cardHeight - margin, rect.bottom + gap),
          left: centeredLeft,
          side: "bottom",
        });
      } else {
        // Below candidate with viewport auto-scroll guarantee
        const topBelow = rect.bottom + gap;
        const maxTop = window.innerHeight - cardHeight - margin;
        if (topBelow > maxTop) {
          const deficit = topBelow - maxTop;
          window.scrollBy({ top: deficit + 12, behavior: "smooth" });
        }
        candidates.push({
          top: Math.max(margin, Math.min(topBelow, maxTop)),
          left: centeredLeft,
          side: "bottom",
        });
        // Above candidate
        candidates.push({
          top: Math.max(margin, rect.top - cardHeight - gap),
          left: centeredLeft,
          side: "top",
        });
      }

      // Filter out candidates that overlap the target
      const nonOverlapping = candidates.filter((c) => !checkOverlap(c));

      // Pick first non-overlapping candidate or safe fallback
      const chosen = nonOverlapping[0] ?? candidates[0]!;
      setCard({
        top: clamp(chosen.top, margin, window.innerHeight - cardHeight - margin),
        left: clamp(chosen.left, margin, window.innerWidth - cardWidth - margin),
      });
    };

    animation = window.requestAnimationFrame(() => {
      const target = current.target
        ? document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
        : null;
      if (!target) {
        setBox(null);
        setAdminBox(null);
        return;
      }
      if (step === 3) {
        // Bottom mic bar: scroll to bottom so top area has maximum clearance
        target.scrollIntoView({ behavior: "smooth", block: "end" });
      } else if (step === 2) {
        // Step 2 is the framed scrollable chat feed: align at page top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Content targets: scroll so top starts with clean offset
        const targetTopDoc = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, targetTopDoc - 75), behavior: "smooth" });
      }
      window.setTimeout(measure, 320);
    });
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [isOpen, step, path, current, navigate]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, step, close]);

  const move = (next: number) => {
    if (next > 5) close(true);
    else goTo(next);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {box ? (
            <SpotlightBackdrop box={box} adminBox={adminBox} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-sm"
              aria-hidden="true"
            />
          )}
          {box && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none fixed z-[61] rounded-3xl border-2 border-amber-500 ring-4 ring-amber-500/35 shadow-[0_0_35px_rgba(232,119,34,0.4)]"
              style={{
                top: box.top - 4,
                left: box.left - 4,
                width: box.width + 8,
                height: box.height + 8,
              }}
            />
          )}
          {adminBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none fixed z-[61] rounded-2xl ring-4 ring-amber-500 ring-offset-4 ring-offset-slate-900 shadow-[0_0_30px_rgba(232,119,34,0.5)]"
              style={{
                top: adminBox.top - 6,
                left: adminBox.left - 6,
                width: adminBox.width + 12,
                height: adminBox.height + 12,
              }}
            />
          )}
          <motion.section
            ref={dialogRef}
            data-tour-dialog
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className={`fixed z-[62] w-[calc(100vw-2rem)] max-w-[330px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-slate-900 outline-none backdrop-blur-md ${box ? "" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
            {...(box ? { style: { top: card.top, left: card.left } } : {})}
          >
            {/* Seamless Top Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"
                initial={false}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>

            <div className="p-4 pt-3.5 sm:p-5 sm:pt-4">
              {/* Header: Step Badge + Segmented Pills + Percentage + Close */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {hi ? `चरण ${step + 1} / ${steps.length}` : `Step ${step + 1} of ${steps.length}`}
                  </span>
                  
                  {/* Segmented Dash Pills */}
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {steps.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === step
                            ? "w-3.5 bg-gradient-to-r from-amber-500 to-orange-500"
                            : i < step
                            ? "w-2 bg-emerald-500"
                            : "w-1.5 bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    {Math.round(((step + 1) / steps.length) * 100)}%
                  </span>
                  <button
                    onClick={() => close(false)}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition active:scale-95 cursor-pointer"
                    aria-label={hi ? "बंद करें" : "Close tour"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Icon */}
              <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white shadow-sm shadow-navy/20">
                {step === 0 ? (
                  <Handshake className="h-4 w-4" />
                ) : step === 5 ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <Rocket className="h-4 w-4" />
                )}
              </div>

              {/* Title & Body */}
              <h2 id="tour-title" className="mt-2.5 text-base sm:text-lg font-bold text-navy dark:text-slate-100 leading-snug">
                {current.title[lang]}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {current.body[lang]}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => move(step - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {hi ? "पीछे" : "Back"}
                </button>
                <button
                  type="button"
                  onClick={() => move(step + 1)}
                  className="inline-flex items-center gap-1 rounded-xl bg-navy px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-navy/20 hover:bg-[#153b62] transition active:scale-95 cursor-pointer"
                >
                  <span>{step === 5 ? (hi ? "समाप्त" : "Finish") : hi ? "अगला" : "Next"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => close(false)}
                className="mt-2 w-full py-1 text-center text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
              >
                {hi ? "यात्रा छोड़ें" : "Skip Tour"}
              </button>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

function SpotlightBackdrop({ box, adminBox }: { box: Box; adminBox?: Box | null }) {
  const pad = 4;
  const radius = 24; // Curved corners matching the rounded-3xl / rounded-2xl target
  const x = Math.max(0, box.left - pad);
  const y = Math.max(0, box.top - pad);
  const w = box.width + pad * 2;
  const h = box.height + pad * 2;

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <mask id="mitraskill-tour-curved-mask">
          {/* Entire screen opaque white */}
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {/* Curved corner rectangle cutout for primary target */}
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={radius}
            ry={radius}
            fill="black"
          />
          {/* Secondary target (e.g. admin link in step 5) */}
          {adminBox && (
            <rect
              x={adminBox.left - 6}
              y={adminBox.top - 6}
              width={adminBox.width + 12}
              height={adminBox.height + 12}
              rx={16}
              ry={16}
              fill="black"
            />
          )}
        </mask>
      </defs>
      {/* Dark overlay masked by curved rectangle */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(15, 23, 42, 0.78)"
        mask="url(#mitraskill-tour-curved-mask)"
      />
    </motion.svg>
  );
}
