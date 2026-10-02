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
      window.localStorage.getItem("mitraskill_tour_completed")
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
      // Keep the explanation panel outside the spotlight. Try each side in
      // order, then choose the side with the most room if the viewport is tight.
      const cardWidth = Math.min(380, window.innerWidth - 32);
      const cardHeight = Math.min(360, window.innerHeight - 32);
      const gap = 24;
      const margin = 16;
      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), Math.max(min, max));
      const centeredLeft = clamp(
        rect.left + rect.width / 2 - cardWidth / 2,
        margin,
        window.innerWidth - cardWidth - margin,
      );
      const centeredTop = clamp(
        rect.top + rect.height / 2 - cardHeight / 2,
        margin,
        window.innerHeight - cardHeight - margin,
      );
      const candidates = [
        { top: rect.bottom + gap, left: centeredLeft },
        { top: rect.top - cardHeight - gap, left: centeredLeft },
        { top: centeredTop, left: rect.right + gap },
        { top: centeredTop, left: rect.left - cardWidth - gap },
      ].map((candidate) => ({
        top: clamp(candidate.top, margin, window.innerHeight - cardHeight - margin),
        left: clamp(candidate.left, margin, window.innerWidth - cardWidth - margin),
      }));
      const doesNotOverlap = (candidate: { top: number; left: number }) =>
        candidate.left + cardWidth <= rect.left - gap ||
        candidate.left >= rect.right + gap ||
        candidate.top + cardHeight <= rect.top - gap ||
        candidate.top >= rect.bottom + gap;
      const selected = candidates.find(doesNotOverlap) ?? candidates[0]!;
      setCard(selected);
    };
    animation = window.requestAnimationFrame(() => {
      const target = current.target
        ? document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
        : null;
      if (step !== 5) target?.scrollIntoView({ behavior: "smooth", block: "center" });
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
            <SpotlightBackdrop box={box} />
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
              className="pointer-events-none fixed z-[61] rounded-2xl ring-4 ring-amber-500 ring-offset-4 ring-offset-slate-900 shadow-[0_0_50px_rgba(232,119,34,0.5)]"
              style={{
                top: box.top - 5,
                left: box.left - 5,
                width: box.width + 10,
                height: box.height + 10,
              }}
            />
          )}
          {adminBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none fixed z-[61] rounded-full ring-4 ring-amber-500 ring-offset-4 ring-offset-slate-900 shadow-[0_0_50px_rgba(232,119,34,0.5)]"
              style={{
                top: adminBox.top - 5,
                left: adminBox.left - 5,
                width: adminBox.width + 10,
                height: adminBox.height + 10,
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
            className={`fixed z-[62] w-[calc(100vw-2rem)] max-w-[380px] rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl outline-none ${box ? "" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
            {...(box ? { style: { top: card.top, left: card.left } } : {})}
          >
            <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-slate-100">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                animate={{ width: `${((step + 1) / 6) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                {hi ? `चरण ${step + 1} / 6` : `Step ${step + 1} of 6`}
              </span>
              <button
                onClick={() => close(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                aria-label={hi ? "बंद करें" : "Close tour"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white">
              {step === 0 ? (
                <Handshake className="h-5 w-5" />
              ) : step === 5 ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Rocket className="h-5 w-5" />
              )}
            </div>
            <h2 id="tour-title" className="mt-3 text-lg font-bold text-navy">
              {current.title[lang]}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.body[lang]}</p>
            {step === 0 ? (
              <button
                onClick={() => move(1)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E87722] px-4 py-3 font-semibold text-white"
              >
                {hi ? "यात्रा शुरू करें" : "Start Guided Tour"}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="mt-5 flex items-center justify-between gap-2">
                <button
                  onClick={() => move(step - 1)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {hi ? "पीछे" : "Back"}
                </button>
                <button
                  onClick={() => move(step + 1)}
                  className="inline-flex items-center gap-1 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {step === 5 ? (hi ? "समाप्त" : "Finish") : hi ? "अगला" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => close(false)}
              className="mt-2 w-full py-1 text-xs text-slate-400 hover:text-slate-600"
            >
              {hi ? "यात्रा छोड़ें" : "Skip Tour"}
            </button>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

function SpotlightBackdrop({ box }: { box: Box }) {
  const pad = 12;
  const top = Math.max(0, box.top - pad);
  const left = Math.max(0, box.left - pad);
  const right = Math.min(window.innerWidth, box.left + box.width + pad);
  const bottom = Math.min(window.innerHeight, box.top + box.height + pad);
  const className = "pointer-events-none fixed z-[60] bg-slate-950/75 backdrop-blur-sm";
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
        style={{ top: 0, left: 0, right: 0, height: top }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
        style={{ top: bottom, left: 0, right: 0, bottom: 0 }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
        style={{ top, bottom: window.innerHeight - bottom, left: 0, width: left }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
        style={{ top, bottom: window.innerHeight - bottom, left: right, right: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
