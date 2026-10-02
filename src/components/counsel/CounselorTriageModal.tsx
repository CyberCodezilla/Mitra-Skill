import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  ShieldCheck,
  Volume2,
  X,
} from "lucide-react";
import { COUNSELOR_GREETING_AUDIO_SCRIPT, MOCK_COUNSELOR } from "@/data/mockCounselor";
import type { Lang } from "@/lib/app-context";

type CallState = "dossier" | "connecting" | "active" | "completed";

function closeTriage(onClose: () => void) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  onClose();
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  selectedTradeName: string;
  currentDivergence: number;
};

export function CounselorTriageModal({
  isOpen,
  onClose,
  lang,
  selectedTradeName,
  currentDivergence,
}: Props) {
  const [state, setState] = useState<CallState>("dossier");
  const [consent, setConsent] = useState(false);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notice, setNotice] = useState("");
  const hi = lang === "hi";

  useEffect(() => {
    if (!isOpen) return;
    setState("dossier");
    setConsent(false);
    setSeconds(0);
    setNotice("");
    setMuted(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTriage(onClose);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (state !== "active") return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (state !== "connecting") return;
    const timer = window.setTimeout(() => setState("active"), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );

  if (!isOpen) return null;
  const script = COUNSELOR_GREETING_AUDIO_SCRIPT[lang];
  const playGreeting = () => {
    if (!("speechSynthesis" in window)) {
      setNotice(
        hi
          ? "इस ब्राउज़र में वॉइस प्लेबैक उपलब्ध नहीं है।"
          : "Voice playback is not available in this browser.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = hi ? "hi-IN" : "en-IN";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const connect = () => {
    setNotice("");
    setState("connecting");
  };
  const finish = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setState("completed");
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeTriage(onClose);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="counselor-dialog-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b bg-navy px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-300">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <h2 id="counselor-dialog-title" className="font-bold">
                {hi ? "काउंसलर रेफ़रल डेमो" : "Counselor referral demo"}
              </h2>
              <p className="text-xs text-white/70">
                {hi
                  ? "नमूना प्रोफ़ाइल · कोई वास्तविक कॉल नहीं"
                  : "Sample profile · no real call is placed"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => closeTriage(onClose)}
            aria-label="Close"
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {state === "dossier" && (
              <motion.div
                key="dossier"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <p className="font-semibold">
                      {hi ? "साझा करने से पहले सारांश देखें" : "Review the briefing before sharing"}
                    </p>
                    <p className="mt-1 text-sm">
                      {hi
                        ? "यह स्थानीय डेमो केस डेटा है। किसी सर्वर या काउंसलर को कुछ नहीं भेजा जाएगा।"
                        : "This is sample case data for the prototype. Nothing is sent to a server or counselor."}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border bg-background p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2 font-bold text-navy">
                      <FileText className="h-5 w-5 text-primary" />{" "}
                      {hi ? "सत्र ब्रीफिंग" : "Session briefing"}
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">
                      Δ {currentDivergence.toFixed(2)}
                    </span>
                  </div>
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <Data
                      label={hi ? "छात्र" : "Learner"}
                      value="Aman Sharma · age 17 · Class 10 (58%)"
                    />
                    <Data label={hi ? "अभिभावक" : "Guardian"} value="Ramesh Sharma · father" />
                    <Data
                      label={hi ? "चुना हुआ ट्रेड" : "Selected trade"}
                      value={selectedTradeName}
                    />
                    <Data
                      label={hi ? "परिवार की चिंता" : "Family concern"}
                      value="Career stability, social perception and income expectations"
                    />
                    <Data
                      label={hi ? "छात्र की रुचि" : "Learner interest"}
                      value="Hands-on technical learning and future study options"
                    />
                    <Data label={hi ? "स्थान" : "Location"} value="Meerut, Uttar Pradesh" />
                  </dl>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border bg-card p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-navy">
                    VK
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-navy">{MOCK_COUNSELOR.name}</p>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                        {hi ? "नमूना प्रोफ़ाइल" : "Sample profile"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{MOCK_COUNSELOR.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {MOCK_COUNSELOR.center} · {MOCK_COUNSELOR.phone_masked}
                    </p>
                    <p className="mt-2 text-xs text-amber-800">
                      {hi
                        ? "नाम और योग्यताएँ प्रदर्शन हेतु काल्पनिक हैं; सत्यापित नहीं।"
                        : "Name and credentials are illustrative only and have not been verified."}
                    </p>
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm text-navy">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    {hi
                      ? "मैंने ऊपर दिखाया गया डेमो सारांश देखा है और समझता/समझती हूँ कि यह अभी साझा नहीं किया जा रहा।"
                      : "I reviewed the demo briefing above and understand it will not be transmitted in this prototype."}
                  </span>
                </label>
                <button
                  type="button"
                  disabled={!consent}
                  onClick={connect}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Phone className="h-5 w-5" />
                  {hi ? "डेमो ऑडियो ब्रिज शुरू करें" : "Start demo audio bridge"}
                </button>
              </motion.div>
            )}

            {state === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid min-h-72 place-items-center text-center"
              >
                <div>
                  <div className="mx-auto mb-5 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-accent text-primary">
                    <Phone className="h-9 w-9" />
                  </div>
                  <h3 className="text-lg font-bold text-navy">
                    {hi ? "डेमो कनेक्शन तैयार हो रहा है…" : "Preparing the demo connection…"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {hi
                      ? "यह स्थानीय सिमुलेशन है—कोई WebRTC कॉल या नेटवर्क कनेक्शन नहीं बनता।"
                      : "Local simulation only—no WebRTC call or network connection is created."}
                  </p>
                </div>
              </motion.div>
            )}

            {state === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="rounded-3xl bg-navy p-6 text-center text-white sm:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    {hi ? "डेमो सिमुलेशन" : "DEMO SIMULATION"}
                  </span>
                  <p className="mt-3 text-2xl font-bold">{MOCK_COUNSELOR.name}</p>
                  <p className="mt-1 text-sm text-white/65">
                    {hi ? "नमूना काउंसलर वार्तालाप" : "Sample counselor conversation"} · {time}
                  </p>
                  <div
                    className="my-7 flex h-16 items-center justify-center gap-1.5"
                    aria-label={hi ? "एनिमेटेड ऑडियो वेवफ़ॉर्म" : "Animated audio waveform"}
                  >
                    {Array.from({ length: 27 }, (_, index) => (
                      <motion.span
                        key={index}
                        className="w-1.5 rounded-full bg-emerald-300"
                        animate={{ height: [9, 18 + ((index * 11) % 38), 12 + ((index * 7) % 22)] }}
                        transition={{
                          duration: 0.5 + (index % 4) * 0.12,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: index * 0.018,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-white/90"
                    lang={lang}
                  >
                    {script}
                  </div>
                  <div className="mt-5 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMuted((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
                    >
                      {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {muted ? (hi ? "अनम्यूट" : "Unmute") : hi ? "म्यूट" : "Mute"}
                    </button>
                    <button
                      type="button"
                      onClick={playGreeting}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
                    >
                      <Volume2 className="h-4 w-4" />
                      {hi ? "नमूना आवाज़ सुनें" : "Play sample voice"}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700" />
                  <p>
                    {hi
                      ? "कैप्शन ऊपर दिखाए गए नमूना स्क्रिप्ट से हैं। माइक्रोफ़ोन सक्रिय नहीं है और कोई आवाज़ रिकॉर्ड या साझा नहीं होती।"
                      : "Subtitles are the sample script shown above. Your microphone is not active; no audio is recorded or shared."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={finish}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700"
                >
                  <PhoneOff className="h-5 w-5" />
                  {hi ? "डेमो कॉल समाप्त करें" : "End demo call"}
                </button>
              </motion.div>
            )}

            {state === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-lg py-7 text-center"
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                <h3 className="mt-3 text-xl font-bold text-navy">
                  {hi ? "डेमो वार्तालाप पूरा हुआ" : "Demo conversation complete"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {hi
                    ? "अगला कदम चुनें। नीचे दिए गए विकल्प केवल प्रोटोटाइप हैं—कोई संदेश नहीं भेजा जाएगा।"
                    : "Choose a next step. These prototype actions do not send a message or create a real booking."}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        hi
                          ? "डेमो: कैंपस विज़िट पास तैयार है; भेजने की सेवा जुड़ी नहीं है।"
                          : "Demo: campus visit pass prepared; no delivery service is connected.",
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-navy transition hover:bg-muted"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {hi ? "ओपन-डे पास" : "Open-day pass"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        hi
                          ? "डेमो: कैंपस विज़िट नोट तैयार है; कोई कैलेंडर बुकिंग नहीं हुई।"
                          : "Demo: campus visit note prepared; no calendar booking was made.",
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-navy transition hover:bg-muted"
                  >
                    <Clock3 className="h-4 w-4" />
                    {hi ? "कैंपस विज़िट तय करें" : "Plan campus visit"}
                  </button>
                </div>
                {notice && (
                  <p role="status" className="mt-4 rounded-lg bg-accent p-3 text-sm text-navy">
                    {notice}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => closeTriage(onClose)}
                  className="mt-6 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:brightness-105"
                >
                  {hi ? "बंद करें" : "Close"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {notice && state !== "completed" && (
            <p role="status" className="mt-3 text-center text-sm text-muted-foreground">
              {notice}
            </p>
          )}
        </div>
        <footer className="border-t px-5 py-3 text-center text-[11px] text-muted-foreground">
          {hi
            ? "MitraSkill प्रोटोटाइप · वास्तविक अधिकारी, कॉल, रिकॉर्डिंग या संदेश सेवा से जुड़ा नहीं"
            : "MitraSkill prototype · not connected to a real officer, call, recording, or messaging service"}
        </footer>
      </section>
    </div>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/65 p-3">
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-navy">{value}</dd>
    </div>
  );
}
