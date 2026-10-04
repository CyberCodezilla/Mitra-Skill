import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Scale,
  Users,
  PhoneCall,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
} from "lucide-react";
import type { SupportedLanguage } from "@/context/LanguageVoiceContext";

interface HighDivergenceNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectCounselor: () => void;
  lang: SupportedLanguage | string;
  divergence: number;
  conflictThreshold?: number;
  tradeName?: string;
}

interface ModalStrings {
  badge: string;
  title: string;
  subtitle: string;
  divergenceLabel: string;
  thresholdLabel: string;
  statusConflict: string;
  whyHeader: string;
  whyIntro: string;
  point1Title: string;
  point1Desc: string;
  point2Title: string;
  point2Desc: string;
  point3Title: string;
  point3Desc: string;
  counselorTitle: string;
  counselorDesc: string;
  btnConnect: string;
  btnContinueAi: string;
}

const STRINGS: Record<SupportedLanguage, ModalStrings> = {
  en: {
    badge: "AI Arbiter Ethical Guardrail · High Divergence",
    title: "Sensitive Family Matter Detected — Human Guidance Advised",
    subtitle:
      "When family opinions diverge deeply, algorithms provide data, but human decisions need empathy, safety assurance, and respectful dialogue.",
    divergenceLabel: "Family Divergence (Δ_dyad)",
    thresholdLabel: "Resolution Threshold (τ)",
    statusConflict: "Active Conflict Zone · Algorithm Yields to Human Counselor",
    whyHeader: "Why you should speak with a Live District ITI Counselor:",
    whyIntro:
      "MitraSkill AI algorithms are trained to recognize when a career disagreement touches deep personal, financial, or cultural sensitivities where machine responses are not enough.",
    point1Title: "Emotional & Cultural Sensitivity",
    point1Desc:
      "Career choices involve family sacrifices, social standing, and emotional trust. A certified counselor listens without bias and honors parental hesitation with dignity.",
    point2Title: "Ground Reality & Safety Verification",
    point2Desc:
      "Specific doubts regarding female student security, workshop safety, hostel discipline, and local transport cannot be settled by numbers alone—they need direct administrative verification.",
    point3Title: "Personalized Financial & Scholarship Pathways",
    point3Desc:
      "Human officers can unlock district-specific concessions, private CSR sponsorships, and industry stipend programs tailored to your family's exact economic reality.",
    counselorTitle: "District ITI Vocational Guidance Cell",
    counselorDesc:
      "DGT Certified Vocational Counselors are available for free 1-on-1 audio/video consultations across all 780+ district ITIs.",
    btnConnect: "Connect with Live District ITI Counselor",
    btnContinueAi: "I understand · Continue with AI exploration",
  },
  hi: {
    badge: "एआई आर्बिटर नैतिक सुरक्षा मानक • उच्च मतभेद",
    title: "संवेदनशील पारिवारिक निर्णय • मानवीय मार्गदर्शन की अनुशंसा",
    subtitle:
      "जब परिवार में मतभेद गहरा हो, तो एल्गोरिदम आंकड़े दे सकता है, किंतु संवेदनशील निर्णयों में समझ, सुरक्षा और सम्मानजनक मानवीय संवाद ही समाधान लाते हैं।",
    divergenceLabel: "पारिवारिक मतभेद सूचकांक (Δ_dyad)",
    thresholdLabel: "समाधान सीमा (τ)",
    statusConflict: "सक्रिय मतभेद क्षेत्र • एल्गोरिदम अब मानवीय काउंसलर को प्राथमिकता देता है",
    whyHeader: "इस मोड़ पर आपको वास्तविक मानवीय काउंसलर से क्यों बात करनी चाहिए:",
    whyIntro:
      "मित्रस्किल एआई प्रणाली यह पहचानती है कि जब कोई असहमति भावनात्मक, सामाजिक प्रतिष्ठा या पारिवारिक चिंताओं से जुड़ी हो, तो केवल डिजिटल जवाब पर्याप्त नहीं होते।",
    point1Title: "संवेदनशील एवं भावनात्मक विषय",
    point1Desc:
      "कैरियर का चुनाव पारिवारिक त्याग, सामाजिक प्रतिष्ठा और आपसी विश्वास से जुड़ा होता है। प्रमाणित काउंसलर निष्पक्षता से माता-पिता के संदेहों को सुनकर सम्मानपूर्वक समाधान सुझाते हैं।",
    point2Title: "जमीनी सुरक्षा व स्थानीय स्थिति की पुष्टि",
    point2Desc:
      "छात्रा सुरक्षा, वर्कशॉप का माहौल, हॉस्टल अनुशासन और स्थानीय परिवहन जैसे संवेदनशील प्रश्नों की सटीक पुष्टि सीधे ज़िला ITI प्रशासन से ही संभव है।",
    point3Title: "व्यक्तिगत आर्थिक सहायता व छात्रवृत्ति विकल्प",
    point3Desc:
      "सरकारी काउंसलर आपके परिवार की विशिष्ट आर्थिक स्थिति के अनुसार ज़िला स्तरीय विशेष छात्रवृत्ति, सीएसआर अनुदान और उद्योग वजीफे की व्यवस्था करा सकते हैं।",
    counselorTitle: "ज़िला ITI व्यावसायिक मार्गदर्शन प्रकोष्ठ",
    counselorDesc:
      "डीजीटी प्रमाणित वरिष्ठ काउंसलर सभी 780+ ज़िलों में निःशुल्क व्यक्तिगत ऑडियो/वीडियो परामर्श के लिए उपलब्ध हैं।",
    btnConnect: "लाइव ज़िला ITI काउंसलर से बात करें",
    btnContinueAi: "मैं समझ गया • एआई चैट जारी रखें",
  },
  mr: {
    badge: "एआय लवाद नैतिक सुरक्षा मानक • उच्च मतभेद",
    title: "संवेदनशील कौटुंबिक निर्णय • मानवी समुपदेशनाची गरज",
    subtitle:
      "कौटुंबिक मतभेद तीव्र असताना अल्गोरिदम डेटा देतो, पण संवेदनशील निर्णयासाठी आपुलकी, सुरक्षिततेची खात्री आणि थेट मानवी संवाद आवश्यक असतो.",
    divergenceLabel: "कौटुंबिक मतभेद निर्देशांक (Δ_dyad)",
    thresholdLabel: "सामंजस्य मर्यादा (τ)",
    statusConflict: "मतभेद क्षेत्र • अल्गोरिदम मानवी समुपदेशकाला प्राधान्य देत आहे",
    whyHeader: "तुम्ही थेट जिल्हा आयटीआय समुपदेशकांशी का बोलावे:",
    whyIntro:
      "मित्रस्किल एआय हे ओळखते की जेव्हा कुटुंबाची चिंता सामाजिक प्रतिष्ठा किंवा आर्थिक सुरक्षेशी संबंधित असते, तेव्हा केवळ डिजिटल संदेश पुरेसे नसतात.",
    point1Title: "भावनिक व सामाजिक संवेदनशीलता",
    point1Desc:
      "करिअर निवड पालकांच्या भावना व कौटुंबिक प्रतिष्ठेशी जोडलेली असते. समुपदेशक पालकांच्या शंकांचा आदर करून सुवर्णमध्य काढतात.",
    point2Title: "प्रत्यक्ष सुरक्षितता व वसतिगृह खात्री",
    point2Desc:
      "मुलींची सुरक्षितता, कार्यशाळेतील वातावरण आणि स्थानिक वाहतूक सोयींची खात्री थेट जिल्हा आयटीआय प्रशासनाकडूनच मिळते.",
    point3Title: "विशेष शिष्यवृत्ती व आर्थिक पाठबळ",
    point3Desc:
      "जिल्हा समुपदेशक कुटुंबाच्या परिस्थितीनुसार स्थानिक शिष्यवृत्ती, CSR निधी आणि शिकाऊ उमेदवारीची थेट मदत मिळवून देऊ शकतात.",
    counselorTitle: "जिल्हा आयटीआय व्यावसायिक मार्गदर्शन कक्ष",
    counselorDesc:
      "शासकीय प्रमाणित समुपदेशक सर्व जिल्ह्यांत मोफत ऑडिओ/व्हिडिओ समुपदेशनासाठी सज्ज आहेत.",
    btnConnect: "थेट जिल्हा आयटीआय समुपदेशकांशी संपर्क साधा",
    btnContinueAi: "मी समजलो • एआय संवाद सुरू ठेवा",
  },
  bn: {
    badge: "এআই সালিশকারী নীতিগত সুরক্ষা • উচ্চ মতপার্থক্য",
    title: "সংবেদনশীল পারিবারিক সিদ্ধান্ত • মানবিক দিকনির্দেশনা প্রয়োজন",
    subtitle:
      "পারিবারিক মতবিরোধ গভীর হলে অ্যালগরিদম ডেটা দিতে পারে, কিন্তু সংবেদনশীল সিদ্ধান্তের জন্য সহানুভূতি, সুরক্ষা ও মানবিক যোগাযোগ অপরিহার্য।",
    divergenceLabel: "পারিবারিক মতভেদ সূচক (Δ_dyad)",
    thresholdLabel: "মীমাংসা সীমা (τ)",
    statusConflict: "সক্রিয় মতপার্থক্য • অ্যালগরিদম অভিজ্ঞ মানবিক কাউন্সেলরকে প্রাধান্য দিচ্ছে",
    whyHeader: "এই মুহূর্তে সরাসরি জেলা আইটিআই কাউন্সেলরের সাথে কেন কথা বলা উচিত:",
    whyIntro:
      "মিত্রস্কিল এআই বুঝতে পারে যে সামাজিক মর্যাদা, মেয়েদের সুরক্ষা বা পারিবারিক আর্থিক চাপের মতো স্পর্শকাতর বিষয়ে শুধুমাত্র ডিজিটাল তথ্য যথেষ্ট নয়।",
    point1Title: "আবেগ ও সংবেদনশীলতার মূল্যায়ন",
    point1Desc:
      "ক্যারিয়ার নির্বাচন কেবল তথ্য নয়, এতে পরিবারের আত্মত্যাগ ও সম্মান জড়িত। সরকারি কাউন্সেলর নিরপেক্ষভাবে উভয় পক্ষের কথা শোনেন।",
    point2Title: "বাস্তব নিরাপত্তা ও স্থানীয় পরিবেশ যাচাই",
    point2Desc:
      "ছাত্রীদের নিরাপত্তা, হোস্টেল পরিবেশ ও যাতায়াতের নিরাপত্তা সরাসরি জেলা আইটিআই প্রশাসনের সাথে কথা বলে নিশ্চিত করা যায়।",
    point3Title: "ব্যক্তিগত আর্থিক সহায়তা ও বৃত্তি",
    point3Desc:
      "কাউন্সেলররা আপনার পারিবারিক আর্থিক অবস্থার ওপর ভিত্তি করে বিশেষ বৃত্তি ও ইন্ডাস্ট্রি স্টাইপেন্ডের ব্যবস্থা করতে পারেন।",
    counselorTitle: "জেলা আইটিআই বৃত্তিমূলক দিকনির্দেশনা সেল",
    counselorDesc:
      "সরকারি প্রত্যয়িত সিনিয়র কাউন্সেলররা বিনামূল্যে ১-অন-১ অডিও/ভিডিও পরামর্শের জন্য উপলব্ধ।",
    btnConnect: "লাইভ জেলা আইটিআই কাউন্সেলরের সাথে যোগাযোগ করুন",
    btnContinueAi: "আমি বুঝেছি • এআই অনুসন্ধান চালিয়ে যান",
  },
  ta: {
    badge: "AI நடுவர் நெறிமுறை பாதுகாப்பு • அதிக கருத்து வேறுபாடு",
    title: "உணர்திறன் வாய்ந்த குடும்ப முடிவு • மனித வழிகாட்டுதல் தேவை",
    subtitle:
      "குடும்ப கருத்து வேறுபாடு ஆழமாக இருக்கும்போது, AI தரவுகளை வழங்கலாம்; ஆனால் உணர்ச்சிகரமான முடிவுகளுக்கு மனித உரையாடல் மற்றும் பரஸ்பர புரிதல் அவசியம்.",
    divergenceLabel: "கருத்து வேறுபாடு குறியீடு (Δ_dyad)",
    thresholdLabel: "தீர்வு வரம்பு (τ)",
    statusConflict: "முரண்பாட்டு நிலை • AI அனுபவம் வாய்ந்த மனித ஆலோசகருக்கு முன்னுரிமை அளிக்கிறது",
    whyHeader: "நேரடி மாவட்ட ஐடிஐ ஆலோசகருடன் ஏன் பேச வேண்டும்:",
    whyIntro:
      "சமூக கௌரவம், பாதுகாப்பு அல்லது குடும்பத்தின் நிதிநிலை போன்ற உணர்திறன் மிக்க விஷயங்களில் மெஷின் பதில்கள் மட்டும் போதாது என்பதை மித்ராஸ்கில் அடையாளம் காண்கிறது.",
    point1Title: "உணர்ச்சி மற்றும் குடும்ப நலன்",
    point1Desc:
      "தொழில் தேர்வு என்பது குடும்பத்தின் தியாகங்கள் சார்ந்தது. சான்றளிக்கப்பட்ட ஆலோசகர் பெற்றோரின் தயக்கத்தை மதித்து சமரச தீர்வு காண்கிறார்.",
    point2Title: "நேரடி பாதுகாப்பு மற்றும் விடுதி உறுதி",
    point2Desc:
      "மாணவிகள் பாதுகாப்பு, பணிமனை சூழல் மற்றும் உள்ளூர் போக்குவரத்து சந்தேகங்களை மாவட்ட ஐடிஐ நிர்வாகத்திடம் நேரடியாக சரிபார்க்கலாம்.",
    point3Title: "தனிப்பயனாக்கப்பட்ட உதவித்தொகை",
    point3Desc:
      "உங்கள் குடும்பத்தின் பொருளாதார நிலைக்கு ஏற்ப மாவட்ட உதவித்தொகை மற்றும் தொழிற்பயிற்சி ஊதியங்களை ஆலோசகர்கள் ஏற்பாடு செய்வர்.",
    counselorTitle: "மாவட்ட ஐடிஐ தொழில் வழிகாட்டுதல் பிரிவு",
    counselorDesc:
      "அரசு சான்றளிக்கப்பட்ட ஆலோசகர்கள் இலவச 1-ஆன்-1 குரல்/வீடியோ ஆலோசனைக்கு தயாராக உள்ளனர்.",
    btnConnect: "நேரடி மாவட்ட ஐடிஐ ஆலோசகருடன் பேசவும்",
    btnContinueAi: "புரிந்துகொண்டேன் • AI அமர்வைத் தொடரவும்",
  },
};

export function HighDivergenceNoticeModal({
  isOpen,
  onClose,
  onConnectCounselor,
  lang,
  divergence = 0.42,
  conflictThreshold = 0.35,
  tradeName = "Automotive Mechatronics",
}: HighDivergenceNoticeModalProps) {
  const activeLang: SupportedLanguage = (lang as SupportedLanguage) in STRINGS
    ? (lang as SupportedLanguage)
    : "hi";
  const s = STRINGS[activeLang] || STRINGS.hi;

  if (!isOpen) return null;

  const isConflict = divergence > conflictThreshold;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy/70 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="high-divergence-modal-title"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-3xl border-2 border-amber-500/80 bg-white shadow-2xl dark:border-amber-500/70 dark:bg-slate-900 z-10 my-auto"
        >
          {/* Top High-Contrast Decorative Alert Banner */}
          <div className="relative shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-3.5 sm:p-4 text-white border-b-2 border-amber-500/40 shadow-inner">
            {/* Top Amber Highlight Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/50 shadow-xs text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <span className="inline-block rounded-full bg-amber-500/20 border border-amber-400/50 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-amber-300">
                    {s.badge}
                  </span>
                  <h2
                    id="high-divergence-modal-title"
                    className="text-base sm:text-lg font-black text-white leading-tight mt-0.5"
                  >
                    {s.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full bg-white/10 p-1.5 text-white/90 hover:bg-white/25 hover:text-white transition active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-amber-100 font-bold leading-relaxed">
              {s.subtitle}
            </p>
          </div>

          {/* Scrollable Body Content (Compact & High Contrast) */}
          <div className="p-3 sm:p-4 space-y-3 flex-1 overflow-y-auto min-h-0">
            {/* Divergence Math Metric Card */}
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/90 p-2.5 dark:border-amber-700/80 dark:bg-amber-950/40 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/90 pb-2 dark:border-amber-800/60">
                <div className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-amber-800 dark:text-amber-400" />
                  <span className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                    {s.statusConflict}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-black">
                  <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                    {s.thresholdLabel}: <strong className="font-mono text-slate-950 dark:text-white font-black">{conflictThreshold.toFixed(2)}</strong>
                  </span>
                  <span className="rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 font-mono font-black text-xs shadow-2xs">
                    Δ = {divergence.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="mt-2">
                <div className="flex justify-between text-[11px] font-black text-slate-900 dark:text-slate-100 mb-1">
                  <span>0.00 (Total Consensus)</span>
                  <span className="text-amber-950 dark:text-amber-300 font-black">
                    {s.divergenceLabel}: {divergence.toFixed(2)} ({isConflict ? "Conflict Zone" : "Near Consensus"})
                  </span>
                  <span>1.00 (Total Disagreement)</span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  {/* Threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white z-10"
                    style={{ left: `${conflictThreshold * 100}%` }}
                    title={`Threshold: ${conflictThreshold}`}
                  />
                  {/* Active bar */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(8, divergence * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Why Human Counselor is Needed Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wide">
                  {s.whyHeader}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {s.whyIntro}
              </p>

              <div className="grid gap-2 sm:grid-cols-3 pt-1">
                {/* Point 1 */}
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50/95 p-2.5 dark:border-slate-700 dark:bg-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white text-[11px] font-black">
                      1
                    </span>
                    <h4 className="text-xs font-black text-slate-950 dark:text-white leading-tight">
                      {s.point1Title}
                    </h4>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {s.point1Desc}
                  </p>
                </div>

                {/* Point 2 */}
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50/95 p-2.5 dark:border-slate-700 dark:bg-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white text-[11px] font-black">
                      2
                    </span>
                    <h4 className="text-xs font-black text-slate-950 dark:text-white leading-tight">
                      {s.point2Title}
                    </h4>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {s.point2Desc}
                  </p>
                </div>

                {/* Point 3 */}
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50/95 p-2.5 dark:border-slate-700 dark:bg-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white text-[11px] font-black">
                      3
                    </span>
                    <h4 className="text-xs font-black text-slate-950 dark:text-white leading-tight">
                      {s.point3Title}
                    </h4>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {s.point3Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Counselor Dossier Summary Placard */}
            <div className="flex items-center gap-2.5 rounded-xl border-2 border-emerald-400/80 bg-emerald-50/95 p-2.5 dark:border-emerald-700 dark:bg-emerald-950/40">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                <Building2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2">
                <span className="text-xs font-black text-emerald-950 dark:text-emerald-100">
                  {s.counselorTitle}:
                </span>
                <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 leading-tight">
                  {s.counselorDesc}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer (Pinned, Never Cropped) */}
          <div className="shrink-0 border-t-2 border-slate-200/90 bg-slate-100/95 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1 rounded-xl px-4 py-2 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition active:scale-95 text-center cursor-pointer"
            >
              {s.btnContinueAi}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onConnectCounselor();
              }}
              className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-emerald-700/25 hover:from-emerald-700 hover:to-teal-700 transition active:scale-95 cursor-pointer ring-2 ring-emerald-500/20"
            >
              <PhoneCall className="h-4 w-4 animate-bounce" />
              <span>{s.btnConnect}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
