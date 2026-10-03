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
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";

type CallState = "dossier" | "connecting" | "active" | "completed";

const COUNSELOR_CONTENT: Record<SupportedLanguage, {
  dialogTitle: string;
  sampleProfile: string;
  briefingTitle: string;
  learner: string;
  guardian: string;
  trade: string;
  familyConcern: string;
  concernVal: string;
  learnerInterest: string;
  interestVal: string;
  location: string;
  officerTitle: string;
  consentText: string;
  startBtn: string;
  endBtn: string;
}> = {
  en: {
    dialogTitle: "Counselor Referral & Live Triage",
    sampleProfile: "Sample Profile · Prototype Bridge",
    briefingTitle: "Session Briefing Dossier",
    learner: "Learner / Student",
    guardian: "Guardian / Father",
    trade: "Selected Trade",
    familyConcern: "Family Concern & Reservation Wage",
    concernVal: "Social perception, repair stigma, and reservation wage ₹20,000/month",
    learnerInterest: "Learner Interest",
    interestVal: "EV computerized diagnostics and robotics career path",
    location: "District Hub",
    officerTitle: "Senior Vocational Guidance Officer · DGT Certified",
    consentText: "I have reviewed this case dossier and consent to initiate the counselor arbitration bridge.",
    startBtn: "Start Demo Audio Bridge",
    endBtn: "End Demo Call",
  },
  hi: {
    dialogTitle: "काउंसलर रेफ़रल एवं लाइव मध्यस्थता",
    sampleProfile: "नमूना प्रोफ़ाइल · प्रोटोटाइप ब्रिज",
    briefingTitle: "सत्र ब्रीफिंग दस्तावेज़",
    learner: "छात्र / उम्मीदवार",
    guardian: "अभिभावक / पिता",
    trade: "चुना हुआ ट्रेड",
    familyConcern: "पारिवारिक चिंता व अपेक्षित न्यूनतम वेतन",
    concernVal: "सामाजिक प्रतिष्ठा, मैकेनिक का काम समझने की चिंता, अपेक्षित न्यूनतम वेतन ₹20,000/माह",
    learnerInterest: "छात्र की रुचि",
    interestVal: "ईवी कम्प्यूटरीकृत डायग्नोस्टिक्स एवं रोबोटिक्स में तकनीकी भविष्य",
    location: "जिला केंद्र",
    officerTitle: "वरिष्ठ व्यावसायिक मार्गदर्शन अधिकारी · डीजीटी प्रमाणित",
    consentText: "मैंने यह केस विवरण देखा है और काउंसलर मध्यस्थता ब्रिज शुरू करने की सहमति देता/देती हूँ।",
    startBtn: "डेमो ऑडियो ब्रिज शुरू करें",
    endBtn: "डेमो कॉल समाप्त करें",
  },
  mr: {
    dialogTitle: "समुपदेशक संदर्भ व थेट मदत",
    sampleProfile: "नमुना प्रोफाइल · प्रोटोटाइप ब्रीज",
    briefingTitle: "सत्र माहिती गोषवारा",
    learner: "विद्यार्थी / उमेदवार",
    guardian: "पालक / वडील",
    trade: "निवडलेला ट्रेड",
    familyConcern: "कौटुंबिक काळजी व अपेक्षित किमान वेतन",
    concernVal: "सामाजिक प्रतिष्ठा, गॅरेजच्या कामाची भीती, अपेक्षित किमान पगार ₹२०,०००/महिना",
    learnerInterest: "विद्यार्थ्याची आवड",
    interestVal: "ईव्ही संगणकीय चाचणी आणि रोबोटिक्स तंत्रज्ञान",
    location: "जिल्हा केंद्र",
    officerTitle: "वरिष्ठ व्यावसायिक मार्गदर्शन अधिकारी · DGT प्रमाणित",
    consentText: "मी ही केस माहिती पाहिली असून समुपदेशक मध्यस्थी सत्र सुरू करण्यास सहमती देतो.",
    startBtn: "थेट ऑडिओ सत्र सुरू करा",
    endBtn: "कॉल पूर्ण करा",
  },
  bn: {
    dialogTitle: "পরামর্শদাতা রেফারেল ও সহায়তা",
    sampleProfile: "নমুনা প্রোফাইল · প্রোটোটাইপ ব্রিজ",
    briefingTitle: "সেশন বিবরণী নথি",
    learner: "ছাত্র / প্রার্থী",
    guardian: "অভিভাবক / পিতা",
    trade: "নির্বাচিত ট্রেড",
    familyConcern: "পারিবারিক উদ্বেগ ও প্রত্যাশিত ন্যূনতম বেতন",
    concernVal: "সামাজিক মর্যাদা, মেকানিক কাজের দ্বিধা ও ন্যূনতম প্রত্যাশিত বেতন ₹২০,০০০/মাস",
    learnerInterest: "ছাত্রের আগ্রহ",
    interestVal: "ইভি কম্পিউটারাইজড ডায়াগনস্টিকস ও রোবোটিক্স ক্যারিয়ার পথ",
    location: "জেলা কেন্দ্র",
    officerTitle: "বরিষ্ঠ বৃত্তিমূলক নির্দেশিকা কর্মকর্তা · ডিজিটি প্রত্যয়িত",
    consentText: "আমি কেস নথি পর্যালোচনা করেছি এবং মধ্যস্থতা ব্রিজ শুরু করার সম্মতি দিচ্ছি।",
    startBtn: "অডিও ব্রিজ শুরু করুন",
    endBtn: "কল সমাপ্ত করুন",
  },
  ta: {
    dialogTitle: "ஆலோசகர் பரிந்துரை மற்றும் நேரடி உதவி",
    sampleProfile: "மாதிரி சுயவிவரம் · நேரடி இணைப்பு",
    briefingTitle: "அமர்வு சுருக்க ஆவணம்",
    learner: "மாணவர் / விண்ணப்பதாரர்",
    guardian: "பெற்றோர் / தந்தை",
    trade: "தேர்ந்தெடுக்கப்பட்ட பிரிவு",
    familyConcern: "குடும்ப கவலை மற்றும் குறைந்தபட்ச ஊதிய எதிர்பார்ப்பு",
    concernVal: "சமூக அந்தஸ்து, மெக்கானிக் வேலை என்ற தயக்கம் மற்றும் தொடக்க ஊதியம் ₹20,000/மாதம்",
    learnerInterest: "மாணவரின் ஆர்வம்",
    interestVal: "மின்சார வாகன கணினி பரிசோதனை மற்றும் ரோபோட்டிக்ஸ் துறை",
    location: "மாவட்ட மையம்",
    officerTitle: "முதுநிலை தொழிற்பயிற்சி வழிகாட்டு அலுவலர் · DGT அங்கீகரிக்கப்பட்டது",
    consentText: "நான் இந்த வழக்கின் விவரங்களை பார்வையிட்டேன் மற்றும் ஆலோசகர் உரையாடலை தொடங்க ஒப்புதல் அளிக்கிறேன்.",
    startBtn: "ஆடியோ இணைப்பைத் தொடங்கவும்",
    endBtn: "அழைப்பை முடிக்கவும்",
  },
};

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
  lang: propLang,
  selectedTradeName,
  currentDivergence,
}: Props) {
  const { language } = useLanguageVoice();
  const activeLang = language || propLang || "en";
  const c = COUNSELOR_CONTENT[activeLang] || COUNSELOR_CONTENT.en;
  const [state, setState] = useState<CallState>("dossier");
  const [consent, setConsent] = useState(false);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notice, setNotice] = useState("");
  const { speak, stop } = useIndicVoice();
  const hi = activeLang === "hi";

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
  const script = COUNSELOR_GREETING_AUDIO_SCRIPT[activeLang as Lang] || COUNSELOR_GREETING_AUDIO_SCRIPT.en;
  const playGreeting = () => {
    if (!("speechSynthesis" in window)) {
      setNotice(
        hi
          ? "इस ब्राउज़र में वॉइस प्लेबैक उपलब्ध नहीं है।"
          : "Voice playback is not available in this browser.",
      );
      return;
    }
    speak(script, activeLang as Lang);
  };
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const connect = () => {
    setNotice("");
    setState("connecting");
  };
  const finish = () => {
    stop();
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
                {c.dialogTitle}
              </h2>
              <p className="text-xs text-white/70">
                {c.sampleProfile}
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
                      {c.briefingTitle}
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
                      {c.briefingTitle}
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">
                      Δ {currentDivergence.toFixed(2)}
                    </span>
                  </div>
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <Data
                      label={c.learner}
                      value="Aman Sharma · age 17 · Class 10 (58%)"
                    />
                    <Data label={c.guardian} value="Ramesh Sharma · father" />
                    <Data
                      label={c.trade}
                      value={selectedTradeName}
                    />
                    <Data
                      label={c.familyConcern}
                      value={c.concernVal}
                    />
                    <Data
                      label={c.learnerInterest}
                      value={c.interestVal}
                    />
                    <Data label={c.location} value="Meerut, Uttar Pradesh" />
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
                        {c.sampleProfile}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{c.officerTitle}</p>
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
                    {c.consentText}
                  </span>
                </label>
                <button
                  type="button"
                  disabled={!consent}
                  onClick={connect}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Phone className="h-5 w-5" />
                  {c.startBtn}
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
                    lang={activeLang}
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700 cursor-pointer"
                >
                  <PhoneOff className="h-5 w-5" />
                  {c.endBtn}
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
