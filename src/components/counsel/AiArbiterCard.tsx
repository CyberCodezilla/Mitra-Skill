import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Award,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clapperboard,
  Database,
  GraduationCap,
  HeartHandshake,
  MapPin,
  PhoneCall,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  Volume2,
} from "lucide-react";
import { MOCK_TRADES } from "@/data/mockTrades";
import {
  DYADIC_DIALOGUES,
  type Bi,
  type BalancedDyadicTurn,
  getScenarioChildRealityCheck,
  getScenarioParentValidation,
  getScenarioFullText,
  getScenarioVerifiedFactMetric,
} from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { FacilityVerificationModal } from "@/components/counsel/FacilityVerificationModal";
import { CenterLocatorModal } from "@/components/counsel/CenterLocatorModal";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ARBITER_EVIDENCE,
  EVIDENCE_LOADING_TEXT,
  type ArbiterTopic,
  type EvidenceMetricItem,
  type TopicEvidence,
} from "@/data/arbiterEvidence";

export function Equalizer() {
  return (
    <span className="flex h-5 items-end gap-1" aria-label="Audio playing">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="wave-bar h-full w-1.5 rounded bg-success"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

const processIcons = [GraduationCap, HeartHandshake, Database, Scale];

const ANALYSIS_STEPS: Record<SupportedLanguage, string[]> = {
  en: [
    "Understand the student's goal",
    "Identify the family's concern",
    "Check verified trade evidence",
    "Shape a balanced response",
  ],
  hi: [
    "छात्र के लक्ष्य को समझना",
    "परिवार की चिंता पहचानना",
    "ट्रेड के सत्यापित तथ्य जाँचना",
    "संतुलित जवाब तैयार करना",
  ],
  mr: [
    "विद्यार्थ्याचे ध्येय समजून घेणे",
    "पालकांची चिंता ओळखणे",
    "प्रमाणित कौशल्य तथ्ये तपासणे",
    "संतुलित उत्तर तयार करणे",
  ],
  bn: [
    "ছাত্রের লক্ষ্য বিশ্লেষণ করা",
    "অভিভাবকের উদ্বেগ চিহ্নিত করা",
    "যাচাইকৃত কোর্সের তথ্য যাচাই করা",
    "ভারসাম্যপূর্ণ উত্তর প্রস্তুত করা",
  ],
  ta: [
    "மாணவரின் இலக்கை புரிந்துகொள்ளுதல்",
    "பெற்றோரின் கவலையை அறிதல்",
    "சரிபார்க்கப்பட்ட தொழில் சான்றுகளை ஆய்வு செய்தல்",
    "சமநிலையான பதிலை உருவாக்குதல்",
  ],
};

const STATUS_TEXTS: Record<
  SupportedLanguage,
  {
    generating: string;
    beforeResponse: string;
    weighing: string;
    speakingStop: string;
    escalate: string;
  }
> = {
  en: {
    generating: "MitraSkill Arbiter is evaluating constraints...",
    beforeResponse: "Before responding",
    weighing: "Weighing both perspectives against the trade facts",
    speakingStop: "Arbiter Speaking · stop",
    escalate: "Escalate to District Counsellor",
  },
  hi: {
    generating: "MitraSkill Arbiter is evaluating constraints...",
    beforeResponse: "जवाब देने से पहले",
    weighing: "दोनों पक्षों और ट्रेड के तथ्यों को निष्पक्षता से तौल रहा है",
    speakingStop: "आर्बिटर बोल रहा है · रोकें",
    escalate: "जिला काउंसलर से बात करें",
  },
  mr: {
    generating: "MitraSkill Arbiter is evaluating constraints...",
    beforeResponse: "उत्तर देण्यापूर्वी",
    weighing: "दोन्ही बाजू आणि कौशल्याची सत्यता पडताळत आहे",
    speakingStop: "लवाद बोलत आहे · थांबवा",
    escalate: "जिल्हा समुपदेशकांशी बोला",
  },
  bn: {
    generating: "MitraSkill Arbiter is evaluating constraints...",
    beforeResponse: "উত্তর দেওয়ার আগে",
    weighing: "উভয় দৃষ্টিভঙ্গি ও কোর্সের সত্যতা যাচাই করা হচ্ছে",
    speakingStop: "সালিশকারী বলছেন · থামান",
    escalate: "জেলা কাউন্সেলরের সাথে কথা বলুন",
  },
  ta: {
    generating: "MitraSkill Arbiter is evaluating constraints...",
    beforeResponse: "பதிலளிப்பதற்கு முன்",
    weighing: "இரு தரப்பு கருத்துக்களையும் தொழில் உண்மைகளையும் ஒப்பிடுகிறது",
    speakingStop: "மத்தியஸ்தர் பேசுகிறார் · நிறுத்து",
    escalate: "மாவட்ட ஆலோசகரிடம் தொடர்பு கொள்ளவும்",
  },
};

const COUNSEL_UI_STRINGS = {
  verdictTitle: {
    en: "Official Mediation Verdict • Counsel Finding",
    hi: "आधिकारिक मध्यस्थता निर्णय • Counsel Verdict",
    mr: "अधिकृत लवाद निकाल • Counsel Verdict",
    bn: "সরকারি মধ্যস্থতা রায় • Counsel Verdict",
    ta: "அதிகாரப்பூர்வ மத்தியஸ்த தீர்ப்பு • Counsel Verdict",
  },
  docketRef: {
    en: "Docket #MS-DGT-2026 • Institutional Counsel Bench",
    hi: "दस्तावेज़ संख्या #MS-DGT-2026 • निष्पक्ष संस्थागत परामर्श पीठ",
    mr: "प्रकरण नोंद #MS-DGT-2026 • निष्पक्ष संस्थागत लवाद पीठ",
    bn: "কেস রেকর্ড #MS-DGT-2026 • নিরপেক্ষ প্রাতিষ্ঠানিক মধ্যস্থতা বেঞ্চ",
    ta: "வழக்கு ஆவணம் #MS-DGT-2026 • நடுநிலையான ஆலோசனை அமர்வு",
  },
  auditedReview: {
    en: "Audited Neutral Review",
    hi: "सत्यापित निष्पक्ष समीक्षा",
    mr: "प्रमाणित निष्पक्ष पडताळणी",
    bn: "যাচাইকৃত নিরপেক্ষ পর্যালোচনা",
    ta: "சரிபார்க்கப்பட்ட நடுநிலை ஆய்வு",
  },
  learnerRealityTitle: {
    en: "Reality Check for Aman (Learner Rigor)",
    hi: "अमन के लिए वास्तविकता (Reality Check for Aman)",
    mr: "अमनसाठी वस्तुस्थिती (Learner Rigor)",
    bn: "আমানের জন্য বাস্তবতা (Learner Rigor)",
    ta: "அமனுக்கான கள எதார்த்தம் (Learner Rigor)",
  },
  learnerPill: {
    en: "Learner Rigor",
    hi: "कठोर अनुशासन",
    mr: "कठोर शिस्त",
    bn: "কঠোর শৃঙ্খলা",
    ta: "கடுமையான ஒழுக்கம்",
  },
  learnerSub: {
    en: "Shopfloor Effort, 400V Safety Rules & Standards:",
    hi: "कार्यशाला श्रम, 400V सुरक्षा नियम व परीक्षा मानक:",
    mr: "वर्कशॉप श्रम, ४००V सुरक्षा नियम आणि परीक्षा मानक:",
    bn: "ওয়ার্কশপের শ্রম, ৪০০ ভোল্ট নিরাপত্তা বিধি ও মানদণ্ড:",
    ta: "பணிமனை உழைப்பு, 400V பாதுகாப்பு விதிகள் மற்றும் தரநிலைகள்:",
  },
  learnerTakeaway: {
    en: "60-70% Practical Workshop • 400V Safety Mandatory • Physical Discipline",
    hi: "60-70% व्यावहारिक वर्कशॉप • 400V सुरक्षा अनिवार्य • शारीरिक अनुशासन",
    mr: "६०-७०% प्रात्यक्षिक कार्यशाळा • ४००V सुरक्षा बंधनकारक • शारीरिक शिस्त",
    bn: "৬০-৭০% ব্যবহারিক ওয়ার্কশপ • ৪০০ ভোল্ট নিরাপত্তা বাধ্যতামূলক",
    ta: "60-70% செய்முறை பணிமனை • 400V பாதுகாப்பு கட்டாயம்",
  },
  parentValidationTitle: {
    en: "Validation for Ramesh-ji (Parental Prudence)",
    hi: "रमेश जी के लिए प्रमाण (Validation for Ramesh-ji)",
    mr: "रमेशजींसाठी पडताळणी (Parental Prudence)",
    bn: "রমেশ বাবুর জন্য प्रमाण (Parental Prudence)",
    ta: "ரமேஷ் அவர்களுக்கான உறுதிப்பாடு (Parental Prudence)",
  },
  parentPill: {
    en: "Parent Prudence",
    hi: "वित्तीय सुरक्षा",
    mr: "आर्थिक सुरक्षा",
    bn: "আর্থিক নিরাপত্তা",
    ta: "நிதிப் பாதுகாப்பு",
  },
  parentSub: {
    en: "Parental Security & Prudent Math Validated:",
    hi: "पितृत्व संरक्षण व पारदर्शी हिसाब की पुष्टि:",
    mr: "पालकत्व संरक्षण आणि पारदर्शक हिशोब पडताळणी:",
    bn: "অভিভাবকত্ব সুরক্ষা ও স্বচ্ছ হিসাবের স্বীকৃতি:",
    ta: "தந்தைவழி பாதுகாப்பு மற்றும் தெளிவான கணக்கு உறுதி:",
  },
  parentTakeaway: {
    en: "Father's Caution 100% Valid • DGT & NAPS Audited Data • Real Security",
    hi: "पिता का संशय 100% सही • DGT व NAPS प्रमाणित डेटा • सुरक्षित भविष्य",
    mr: "वडिलांचा संशय १००% रास्त • DGT आणि NAPS प्रमाणित डेटा",
    bn: "পিতার সন্দেহ শতভাগ সঠিক • DGT ও NAPS অডিট ডেটা",
    ta: "தந்தையின் சந்தேகம் 100% நியாயமானது • DGT & NAPS தணிக்கை தரவு",
  },
  synthesisTitle: {
    en: "The Counselor's Strategic Synthesis (Golden Middle Path)",
    hi: "मध्यस्थता का स्वर्णिम निष्कर्ष • सामंजस्य फॉर्मूला",
    mr: "लवादाचा सुवर्णमध्य निष्कर्ष • सामंजस्य सूत्र",
    bn: "সালিশীর সুবর্ণ সমন্বয় • ভারসাম্য ফর্মুলা",
    ta: "மத்தியஸ்தரின் சமரச தீர்வு • தங்கப் பாதை",
  },
  synthesisFormula: {
    en: "Learner Technical Passion + Father's Financial Discipline = 2-Year Certified Specialist (NCrF Level 4)",
    hi: "छात्र का तकनीकी उत्साह + पिता का वित्तीय अनुशासन = 2 साल में प्रमाणित प्लांट स्पेशलिस्ट (NCrF Level 4)",
    mr: "विद्यार्थ्याची तांत्रिक आवड + पालकांची आर्थिक शिस्त = २ वर्षांत प्रमाणित प्लांट स्पेशलिस्ट (NCrF Level 4)",
    bn: "শিক্ষার্থীর প্রযুক্তিগত উৎসাহ + পিতার আর্থিক শৃঙ্খলা = ২ বছরে প্রত্যয়িত স্পেশালিস্ট (NCrF Level 4)",
    ta: "மாணவரின் தொழில்நுட்ப ஆர்வம் + தந்தையின் நிதி ஒழுக்கம் = 2 ஆண்டுகளில் சான்றளிக்கப்பட்ட நிபுணர் (NCrF Level 4)",
  },
  synthesisSub: {
    en: "Lateral entry into Polytechnic 2nd Year open | Stipend via NAPS | Direct campus placement",
    hi: "NCrF 80 क्रेडिट्स से पॉलिटेक्निक 2nd ईयर में लेटरल एंट्री खुली • NAPS वजीफा • कैंपस भर्ती",
    mr: "NCrF ८० क्रेडिट्ससह पॉलिटेक्निक दुसऱ्या वर्षात प्रवेश • NAPS विद्यावेतन • थेट प्लेसमेंट",
    bn: "NCrF ৮০ ক্রেডিট নিয়ে পলিটেকনিক ২য় বর্ষে সরাসরি ভর্তি • NAPS ভাতা • সরাসরি ক্যাম্পাস নিয়োগ",
    ta: "NCrF 80 கிரெடிட்கள் மூலம் பாலிடெக்னிக் 2-ஆம் ஆண்டில் நேரடி சேர்க்கை • NAPS உதவித்தொகை",
  },
  audioListenTitle: {
    en: "Listen to Official Lead Arbiter (DGT Certified Counselor)",
    hi: "मुख्य करियर मध्यस्थ (DGT Certified Counselor) की आवाज में सुनें",
    mr: "मुख्य कारकीर्द लवादाच्या (DGT Certified) आवाजात ऐका",
    bn: "প্রধান ক্যারিয়ার সালিশকারীর (DGT Certified) কণ্ঠে শুনুন",
    ta: "தலைமை தொழில் ஆலோசகரின் (DGT Certified) குரலில் கேட்கவும்",
  },
  audioSubtitle: {
    en: "Unbiased Counselor Voice • 100% Synchronized Indic Audio DSP",
    hi: "निष्पक्ष संस्थागत मध्यस्थता वॉइस • 100% सिंक्रोनाइज़्ड Indic Audio DSP",
    mr: "निष्पक्ष लवाद आवाज • १००% सिंक्रोनाइझ केलेले Indic Audio DSP",
    bn: "নিরপেক্ষ সালিশি ভয়েস • ১০০% সিঙ্ক্রোনাইজড Indic Audio DSP",
    ta: "நடுநிலையான குரல் • 100% ஒருங்கிணைக்கப்பட்ட Indic Audio DSP",
  },
  evidencePlacardTitle: {
    en: "DGT & NCVET Official Institutional Standard",
    hi: "डीजीटी व एनसीवीईटी आधिकारिक संस्थागत मानक",
    mr: "DGT आणि NCVET अधिकृत संस्थात्मक मानक",
    bn: "DGT ও NCVET সরকারি প্রাতিষ্ঠানিক মানদণ্ড",
    ta: "DGT & NCVET அதிகாரப்பூர்வ நிறுவன தரநிலை",
  },
  evidenceNote: {
    en: "Audited National Standard • Mandatory for all Govt & Private ITIs",
    hi: "सत्यापित सरकारी प्रमाणक • सभी राजकीय व निजी आईटीआई में अनिवार्य",
    mr: "प्रमाणित शासकीय मानक • सर्व सरकारी आणि खाजगी आयटीआयमध्ये अनिवार्य",
    bn: "সরকারি প্রত্যয়িত মানদণ্ড • সকল সরকারি ও বেসরকারি আইটিআই-তে বাধ্যতামূলক",
    ta: "அரசு தணிக்கை செய்யப்பட்ட தரநிலை • அனைத்து ஐடிஐகளிலும் கட்டாயமானது",
  },
  consensusFormulaBadge: {
    en: "✔ Consensus Formula",
    hi: "✔ सामंजस्य फॉर्मूला",
    mr: "✔ सामंजस्य सूत्र",
    bn: "✔ ভারসাম্য ফর্মুলা",
    ta: "✔ சமரச தீர்வு",
  },
  sensitiveMatterTitle: {
    en: "Unsatisfied or dealing with sensitive family hesitation?",
    hi: "इस उत्तर से असंतुष्ट हैं या संवेदनशील पारिवारिक संकोच है?",
    mr: "या उत्तराने समाधानी नाही किंवा संवेदनशील कौटुंबिक चिंता आहे?",
    bn: "উত্তরে অসন্তুষ্ট বা সংবেদনশীল পারিবারিক দ্বিধা রয়েছে?",
    ta: "பதிலில் திருப்தி இல்லையா அல்லது குடும்ப தயக்கம் உள்ளதா?",
  },
  sensitiveBadge: {
    en: "Human Guidance Recommended",
    hi: "मानवीय मार्गदर्शन अनुशंसित",
    mr: "मानवी समुपदेशन आवश्यक",
    bn: "মানবিক পরামর্শ বাঞ্ছনীয়",
    ta: "நேரடி மனித ஆலோசனை தேவை",
  },
  sensitiveMatterDesc: {
    en: "Matters of career stigma, financial pressure, or female safety need compassionate human guidance.",
    hi: "सामाजिक प्रतिष्ठा, घरेलू आर्थिक दबाव या छात्रा सुरक्षा जैसे संवेदनशील मामलों में अनुभवी ज़िला काउंसलर से सीधा संवाद सर्वोत्तम समाधान है।",
    mr: "सामाजिक प्रतिष्ठा, आर्थिक अडचणी किंवा मुलींच्या सुरक्षेसाठी अनुभवी जिल्हा समुपदेशकांशी थेट संवाद सर्वोत्तम ठरतो.",
    bn: "সামাজিক মর্যাদা, আর্থিক চাপ বা মেয়েদের সুরক্ষার মতো স্পর্শকাতর বিষয়ে অভিজ্ঞ কাউন্সেলরের সাথে সরাসরি কথা বলাই শ্রেয়।",
    ta: "சமூக கௌரவம், நிதிச்சுமை அல்லது மாணவிகள் பாதுகாப்புக்கு அனுபவம் வாய்ந்த மாவட்ட ஆலோசகரின் நேரடி உரையாடல் மிக சிறந்தது.",
  },
  unsatisfiedBtn: {
    en: "Talk to Live ITI Counselor",
    hi: "लाइव ITI काउंसलर से बात करें",
    mr: "थेट आयटीआय समुपदेशकांशी बोला",
    bn: "লাইভ আইটিআই কাউন্সেলরের সাথে কথা বলুন",
    ta: "நேரடி ஐடிஐ ஆலோசகருடன் பேசவும்",
  },
};

const HIGHLIGHT_REGEX =
  /(60% समय|60%|70%|30%|400V हाई-वोल्टेज बैटरी सुरक्षा|400V|भारी वायरिंग|अनुशासन जरूरी है|सक्षम प्लांट स्पेशलिस्ट|प्लांट स्पेशलिस्ट|2 साल बाद|2 साल|2 वर्ष|₹18,500 से ₹24,500|₹18,500|₹24,500|₹18,000|₹9,500\/माह|₹9,500|₹50,000|₹22,000|100% जायज|100% सही|NCrF(?: Level 4)?|NAPS|DGT|पॉलिटेक्निक डिप्लोमा|high-voltage battery safety|physical tools|shopfloor sweat|heavy wiring|grounded discipline|plant specialist|2 years|Year 1|Year 2|₹18,500 - ₹24,500|₹9,500\/month|100% justified|100% valid|Polytechnic Diploma|६०%|४००V|हाय-व्होल्टेज बॅटरी सुरक्षा|शिस्त आवश्यक|२ वर्षांनंतर|₹१८,५०० ते ₹२४,५००|१००% रास्त|৬০%|৪০০ ভোল্ট|হাই-ভোল্টেজ ব্যাটারি নিরাপত্তা|শৃঙ্খলা জরুরি|২ বছর পর|শতভাগ যৌক্তিক|உயர் மின்னழுத்த பேட்டரி பாதுகாப்பு|ஒழுக்கம் அவசியம்|2 ஆண்டுகளுக்குப் பிறகு|100% நியாயமானது)/gi;

function HighlightedCounselText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(HIGHLIGHT_REGEX);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        const isMatch = part.match(HIGHLIGHT_REGEX);
        HIGHLIGHT_REGEX.lastIndex = 0;
        if (isMatch) {
          return (
            <span
              key={index}
              className="mx-0.5 inline-block rounded-md bg-amber-400/25 px-1.5 py-0.5 font-black text-amber-200 border border-amber-400/40 shadow-2xs"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function AiArbiterCard({
  tradeId,
  text,
  topic = "opening",
  isGenerating = false,
  lang,
  balancedScenario,
  onRoi,
  onAlumni,
  onEscalate,
}: {
  tradeId: string;
  text: Bi;
  topic?: ArbiterTopic | undefined;
  isGenerating?: boolean;
  lang: SupportedLanguage | Lang;
  balancedScenario?: BalancedDyadicTurn | undefined;
  onRoi: () => void;
  onAlumni: () => void;
  onEscalate: () => void;
}) {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(true);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isLocatorOpen, setIsLocatorOpen] = useState(false);
  const { speak, stop, isSpeaking, currentSpeakingPersona } = useIndicVoice();
  const { language } = useLanguageVoice();
  const { t: ui } = useTranslation();
  const c = ui.counsel;
  const activeLang: SupportedLanguage =
    (language in DYADIC_DIALOGUES
      ? language
      : (lang as SupportedLanguage)) || "hi";
  const dialogue = DYADIC_DIALOGUES[activeLang] || DYADIC_DIALOGUES.hi;
  const statusText = STATUS_TEXTS[activeLang] || STATUS_TEXTS.hi;
  const steps = ANALYSIS_STEPS[activeLang] || ANALYSIS_STEPS.hi;

  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;

  // Resolve active topic evidence
  const activeTopic: ArbiterTopic = topic || "opening";
  const defaultEvidence = ARBITER_EVIDENCE["AUTO_MECH_01"]!;
  const tradeEvidence = ARBITER_EVIDENCE[tradeId] ?? defaultEvidence;
  const topicData: TopicEvidence = tradeEvidence[activeTopic] ?? tradeEvidence["opening"]!;

  const arbiterText = balancedScenario
    ? getScenarioFullText(balancedScenario, activeLang)
    : text[activeLang] || text.hi || text.en || dialogue.arbiterRebuttal;
  const reassuranceText =
    topicData.reassurance[activeLang] ||
    topicData.reassurance.hi ||
    topicData.reassurance.en ||
    trade.parent_reassurance_script?.[activeLang] ||
    c.arbiterReassurance;

  const handlePlayArbiter = () => {
    if (isSpeaking && currentSpeakingPersona === "arbiter") {
      stop();
    } else {
      speak(arbiterText, "arbiter", activeLang);
    }
  };

  useEffect(() => {
    if (!isGenerating) return;
    setAnalysisStep(0);
    const timer = window.setInterval(() => setAnalysisStep((step) => Math.min(step + 1, 3)), 760);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  // Loading animation management for the green box evidence section
  useEffect(() => {
    setIsEvidenceLoading(true);
    const timer = window.setTimeout(() => {
      setIsEvidenceLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [topic, tradeId]);

  const prevGenerating = useRef(isGenerating);
  useEffect(() => {
    let timer: number | undefined;
    if (prevGenerating.current && !isGenerating) {
      setIsEvidenceLoading(true);
      timer = window.setTimeout(() => {
        setIsEvidenceLoading(false);
      }, 700);
    }
    prevGenerating.current = isGenerating;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isGenerating]);

  const showEvidenceLoading = isEvidenceLoading || isGenerating;
  return (
    <article className="relative overflow-hidden rounded-3xl border-2 border-indigo-200/90 bg-white p-5 sm:p-7 shadow-xl shadow-indigo-100/40">
      {/* Institutional Tri-color Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-amber-400 bg-navy text-white shadow-sm ring-4 ring-navy/10">
          <Scale className="h-5 w-5 text-amber-300" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-navy">{c.arbiterTitle}</h3>
            {isGenerating && (
              <span
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200"
                role="status"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
                </span>
                {statusText.generating}
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {activeLang === "hi"
              ? "निष्पक्ष संस्थागत मध्यस्थता पीठ • Dispute Resolution & Ground Truth Guidance"
              : "Institutional Dispute Resolution & Ground Truth Guidance"}
          </div>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-1 text-xs font-black text-amber-950 shadow-2xs">
          <Award className="h-4 w-4 text-amber-600" />
          <span>{c.verifiedAuditTag}</span>
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isGenerating ? (
          <motion.div
            key="arbiter-process"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="status"
            aria-live="polite"
            className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-amber-50/60 p-5"
          >
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-navy">
                  {statusText.beforeResponse}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {statusText.weighing}
                </div>
              </div>
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-indigo-100"
                animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Award className="h-4 w-4" />
              </motion.span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {steps.map((step, index) => {
                const complete = index < analysisStep;
                const active = index === analysisStep;
                const StepIcon = processIcons[index]!;
                return (
                  <motion.div
                    key={step}
                    animate={{
                      opacity: index <= analysisStep ? 1 : 0.46,
                      scale: active ? 1 : 0.99,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`relative flex min-h-11 items-center gap-2.5 overflow-hidden rounded-lg border px-3 py-2 text-xs font-semibold ${active ? "border-indigo-300 bg-white text-indigo-950 shadow-sm" : complete ? "border-emerald-100 bg-emerald-50/70 text-emerald-800" : "border-indigo-100/70 bg-white/50 text-slate-500"}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${active ? "bg-indigo-100 text-indigo-700" : complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {complete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="relative z-10">{step}</span>
                    {active && (
                      <motion.span
                        layoutId="arbiter-analysis-marker"
                        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-indigo-500"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="arbiter-answer"
            initial={{ opacity: 0, filter: "blur(9px)", y: 5 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-5 overflow-hidden rounded-3xl border-2 border-amber-400/90 bg-gradient-to-br from-[#071329] via-[#0B1B3D] to-[#12224A] p-6 sm:p-7 text-white shadow-2xl shadow-navy/30"
          >
            {/* Ambient Gold Radial Glow in Corner */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

            {/* Official Verdict Header Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-700/60 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-navy font-black shadow-md ring-2 ring-amber-300/40">
                  <Scale className="h-4 w-4 text-navy" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                      {COUNSEL_UI_STRINGS.verdictTitle[activeLang] || COUNSEL_UI_STRINGS.verdictTitle.hi}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium tracking-wide">
                    {COUNSEL_UI_STRINGS.docketRef[activeLang] || COUNSEL_UI_STRINGS.docketRef.hi}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1 rounded-full shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    {COUNSEL_UI_STRINGS.auditedReview[activeLang] || COUNSEL_UI_STRINGS.auditedReview.hi}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handlePlayArbiter}
                  disabled={isGenerating}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black transition cursor-pointer active:scale-95 shadow-xs ${
                    isSpeaking && currentSpeakingPersona === "arbiter"
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-amber-400 text-navy hover:bg-amber-300"
                  }`}
                  aria-label="Quick Audio Listen"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isSpeaking && currentSpeakingPersona === "arbiter" ? statusText.speakingStop : `🔊 ${c.audioBtn}`}</span>
                </button>
              </div>
            </div>

            {/* Prominent, Big, Highly Readable Counselor Statement with Highlighted Words */}
            <div className="relative z-10 flex items-start gap-3 sm:gap-4 my-2">
              <span className="select-none font-serif text-4xl sm:text-6xl font-black leading-none text-amber-400/40 -mt-2">
                “
              </span>
              <div className="flex-1">
                <p
                  lang={activeLang}
                  className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed sm:leading-loose text-white tracking-normal break-words drop-shadow-xs"
                >
                  <HighlightedCounselText text={arbiterText} />
                </p>
              </div>
            </div>

            {/* Ambient Shimmer Sweep Animation */}
            <motion.span
              aria-hidden="true"
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 1.1, delay: 0.12, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {balancedScenario ? (
        <motion.div
          key={`balanced-scenario-${balancedScenario.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-6 space-y-4"
        >
          {/* Dual-Wing Counseling Framework: Learner Reality Check vs. Guardian Validation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Learner Reality Check (Blue Card) */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-blue-400/90 bg-gradient-to-b from-blue-50/95 via-white to-blue-50/60 p-5 shadow-sm border-t-4 border-t-blue-600 transition hover:shadow-md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-blue-200/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-2xs">
                      🧑🔧
                    </span>
                    <span className="font-extrabold text-base sm:text-lg text-blue-950">
                      {COUNSEL_UI_STRINGS.learnerRealityTitle[activeLang] || COUNSEL_UI_STRINGS.learnerRealityTitle.hi}
                    </span>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-blue-200/90 text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-300/80">
                    {COUNSEL_UI_STRINGS.learnerPill[activeLang] || COUNSEL_UI_STRINGS.learnerPill.hi}
                  </span>
                </div>
                <div className="text-xs font-bold text-blue-800/90 mb-2 uppercase tracking-wide">
                  {COUNSEL_UI_STRINGS.learnerSub[activeLang] || COUNSEL_UI_STRINGS.learnerSub.hi}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-semibold break-words">
                  {getScenarioChildRealityCheck(balancedScenario, activeLang)}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200/80 flex items-center gap-2 text-xs font-bold text-blue-950 bg-blue-100/70 -mx-5 -mb-5 p-3.5 rounded-b-2xl">
                <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="truncate">
                  {COUNSEL_UI_STRINGS.learnerTakeaway[activeLang] || COUNSEL_UI_STRINGS.learnerTakeaway.hi}
                </span>
              </div>
            </div>

            {/* Guardian Validation (Amber Card) */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-amber-400/90 bg-gradient-to-b from-amber-50/95 via-white to-amber-50/60 p-5 shadow-sm border-t-4 border-t-amber-600 transition hover:shadow-md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-amber-200/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-sm shadow-2xs">
                      👨🦳
                    </span>
                    <span className="font-extrabold text-base sm:text-lg text-amber-950">
                      {COUNSEL_UI_STRINGS.parentValidationTitle[activeLang] || COUNSEL_UI_STRINGS.parentValidationTitle.hi}
                    </span>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200/90 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300/80">
                    {COUNSEL_UI_STRINGS.parentPill[activeLang] || COUNSEL_UI_STRINGS.parentPill.hi}
                  </span>
                </div>
                <div className="text-xs font-bold text-amber-800/90 mb-2 uppercase tracking-wide">
                  {COUNSEL_UI_STRINGS.parentSub[activeLang] || COUNSEL_UI_STRINGS.parentSub.hi}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-semibold break-words">
                  {getScenarioParentValidation(balancedScenario, activeLang)}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-100/70 -mx-5 -mb-5 p-3.5 rounded-b-2xl">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse" />
                <span className="truncate">
                  {COUNSEL_UI_STRINGS.parentTakeaway[activeLang] || COUNSEL_UI_STRINGS.parentTakeaway.hi}
                </span>
              </div>
            </div>
          </div>

          {/* The Counselor's Strategic Synthesis (Golden Middle Path) */}
          <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 p-4 sm:p-5 shadow-sm border-l-6 border-l-emerald-600">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white font-black text-xs shadow-2xs">
                  🎯
                </span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-950">
                  {COUNSEL_UI_STRINGS.synthesisTitle[activeLang] || COUNSEL_UI_STRINGS.synthesisTitle.hi}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-200/90 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                {COUNSEL_UI_STRINGS.consensusFormulaBadge[activeLang] || COUNSEL_UI_STRINGS.consensusFormulaBadge.hi}
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-950 leading-relaxed">
              {COUNSEL_UI_STRINGS.synthesisFormula[activeLang] || COUNSEL_UI_STRINGS.synthesisFormula.hi}
            </div>
            <div className="mt-1 text-xs text-emerald-800/90 font-semibold">
              {COUNSEL_UI_STRINGS.synthesisSub[activeLang] || COUNSEL_UI_STRINGS.synthesisSub.hi}
            </div>
          </div>

          {/* Verified Fact Metric Container (Institutional Evidence Placard) */}
          {balancedScenario.arbiterResponse.verifiedFactMetric && (() => {
            const metric = getScenarioVerifiedFactMetric(balancedScenario, activeLang);
            if (!metric) return null;
            return (
              <div className="rounded-2xl border-2 border-emerald-600/70 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="font-black text-xs sm:text-sm text-emerald-300 flex items-center gap-2 uppercase tracking-wider">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <span>
                      {COUNSEL_UI_STRINGS.evidencePlacardTitle[activeLang] || COUNSEL_UI_STRINGS.evidencePlacardTitle.hi} • {metric.label}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-900/80 px-3.5 py-1 text-xs font-extrabold text-emerald-200 shadow-2xs">
                    <Database className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{metric.auditRef}</span>
                  </span>
                </div>
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-900/40 p-4 text-emerald-100 shadow-inner">
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-emerald-200 leading-snug break-words flex items-center gap-2.5">
                    <span className="text-xl">📊</span>
                    <span>{metric.value}</span>
                  </div>
                  <div className="mt-1.5 text-xs text-emerald-300/80 font-medium">
                    {COUNSEL_UI_STRINGS.evidenceNote[activeLang] || COUNSEL_UI_STRINGS.evidenceNote.hi}
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {showEvidenceLoading ? (
            <motion.div
              key={`evidence-loading-${activeTopic}`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-5 space-y-3"
              role="status"
              aria-label="Verifying audited evidence"
            >
              {/* Live Telemetry Ping Banner */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-300/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 px-3.5 py-2.5 text-xs font-semibold text-emerald-900">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </span>
                  <span className="truncate">
                    {EVIDENCE_LOADING_TEXT[activeLang] || EVIDENCE_LOADING_TEXT.hi}
                  </span>
                </div>
                <span className="flex h-3.5 items-end gap-0.5 shrink-0" aria-hidden="true">
                  <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-full w-1 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>

              {/* Reassurance skeleton */}
              <div className="border-l-4 border-emerald-400/50 pl-3.5 py-1.5 space-y-2">
                <div className="h-4 w-11/12 rounded bg-emerald-100/70 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-emerald-100/50 animate-pulse" />
              </div>

              {/* Metric skeletons */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-slate-50/80 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-200/80 animate-pulse" />
                    <div className="h-3.5 w-24 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="mt-2.5 h-6 w-32 rounded bg-emerald-200/80 animate-pulse" />
                  <div className="mt-2 h-3 w-40 rounded bg-slate-200/70 animate-pulse" />
                </div>
                <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-slate-50/80 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-200/80 animate-pulse" />
                    <div className="h-3.5 w-28 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="mt-2.5 h-6 w-20 rounded bg-emerald-200/80 animate-pulse" />
                  <div className="mt-2 h-3 w-36 rounded bg-slate-200/70 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`evidence-ready-${activeTopic}`}
              initial={{ opacity: 0, y: 6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-5"
            >
              {/* The Green Left-Bordered Reassurance Quote */}
              <p
                lang={activeLang}
                className="border-l-4 border-success pl-4 text-base sm:text-lg leading-relaxed text-slate-800 font-semibold break-words bg-emerald-50/50 py-3 rounded-r-xl"
              >
                {reassuranceText}
              </p>

              {/* The 2 Dynamic Metric Cards with Highlight */}
              <div className="mt-4 grid grid-cols-2 gap-3.5">
                {topicData.metrics.map((metric) => (
                  <EvidenceMetricCard
                    key={metric.id}
                    metric={metric}
                    lang={activeLang}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Sleek Voice Synthesis Console Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-indigo-200/90 bg-gradient-to-r from-slate-50 via-white to-indigo-50/50 p-4 shadow-sm transition hover:border-indigo-300">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayArbiter}
            disabled={isGenerating}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
              isSpeaking && currentSpeakingPersona === "arbiter"
                ? "bg-primary text-white ring-4 ring-primary/25 animate-pulse"
                : "bg-navy text-white hover:bg-navy/90 hover:scale-105"
            }`}
            aria-label="Play Arbiter Audio"
          >
            <Volume2 className="h-6 w-6" />
          </button>
          <div>
            <div className="text-sm sm:text-base font-black text-navy flex items-center gap-2">
              <span>{COUNSEL_UI_STRINGS.audioListenTitle[activeLang] || COUNSEL_UI_STRINGS.audioListenTitle.hi}</span>
              {isSpeaking && currentSpeakingPersona === "arbiter" && <Equalizer />}
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              {COUNSEL_UI_STRINGS.audioSubtitle[activeLang] || COUNSEL_UI_STRINGS.audioSubtitle.hi}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePlayArbiter}
          disabled={isGenerating}
          className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer active:scale-95 shadow-xs ${
            isSpeaking && currentSpeakingPersona === "arbiter"
              ? "bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100"
              : "bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100"
          }`}
        >
          {isSpeaking && currentSpeakingPersona === "arbiter"
            ? statusText.speakingStop
            : `🔊 ${c.audioBtn}`}
        </button>
      </div>

      {/* Sensitive Matter / Unsatisfied Escalation Callout */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 p-3 sm:p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/25">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm">{COUNSEL_UI_STRINGS.sensitiveMatterTitle[activeLang] || COUNSEL_UI_STRINGS.sensitiveMatterTitle.hi}</span>
              <span className="rounded-full bg-amber-200/90 dark:bg-amber-900/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                {COUNSEL_UI_STRINGS.sensitiveBadge[activeLang] || COUNSEL_UI_STRINGS.sensitiveBadge.hi}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {COUNSEL_UI_STRINGS.sensitiveMatterDesc[activeLang] || COUNSEL_UI_STRINGS.sensitiveMatterDesc.hi}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEscalate}
          disabled={isGenerating}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 font-black text-white shadow-md hover:from-amber-700 hover:to-orange-700 transition active:scale-95 cursor-pointer text-xs"
        >
          <PhoneCall className="h-4 w-4" />
          <span>{COUNSEL_UI_STRINGS.unsatisfiedBtn[activeLang] || COUNSEL_UI_STRINGS.unsatisfiedBtn.hi}</span>
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsFacilityModalOpen(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border border-emerald-700/35 bg-emerald-50 px-4 py-2 font-semibold text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Building2 className="h-4 w-4 text-emerald-800" />
          {c.facilityBtn}
        </button>
        <button
          type="button"
          onClick={() => setIsLocatorOpen(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border border-teal-700/30 bg-teal-50 px-4 py-2 font-semibold text-teal-950 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-teal-300/30 dark:bg-teal-950/40 dark:text-teal-100 dark:hover:bg-teal-900/60"
        >
          <MapPin className="h-4 w-4" />{" "}
          {c.seatsBtn}
        </button>
        <button
          onClick={onEscalate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-accent/50 px-4 py-2 font-medium text-navy transition hover:border-primary hover:bg-accent disabled:opacity-50"
        >
          <Users className="h-5 w-5" />{" "}
          {statusText.escalate}
        </button>
        <Link
          to="/mobility"
          onClick={(event) => {
            if (isGenerating) event.preventDefault();
          }}
          aria-disabled={isGenerating}
          tabIndex={isGenerating ? -1 : undefined}
          className="flex items-center gap-2 rounded-xl bg-[#E87722] px-4 py-2 font-medium text-white hover:bg-[#d0681a]"
        >
          <GraduationCap className="h-5 w-5" /> {c.mobilityBtn}{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onRoi}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 border-success px-4 py-2 font-medium text-success"
        >
          <BarChart3 className="h-5 w-5" /> {c.roiBtn}
        </button>
        <button
          onClick={onAlumni}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-medium text-slate-600"
        >
          <Clapperboard className="h-5 w-5" /> {c.alumniBtn}
        </button>
      </div>
      <FacilityVerificationModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        lang={activeLang}
        tradeId={tradeId}
      />
      <CenterLocatorModal
        isOpen={isLocatorOpen}
        onClose={() => setIsLocatorOpen(false)}
        lang={activeLang}
      />
    </article>
  );
}

function renderMetricIcon(iconType: EvidenceMetricItem["iconType"]) {
  switch (iconType) {
    case "salary":
      return <TrendingUp className="h-3.5 w-3.5" />;
    case "placement":
      return <Users className="h-3.5 w-3.5" />;
    case "credits":
      return <GraduationCap className="h-3.5 w-3.5" />;
    case "safety":
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case "environment":
      return <Building2 className="h-3.5 w-3.5" />;
    case "demand":
      return <BarChart3 className="h-3.5 w-3.5" />;
    case "stipend":
      return <Award className="h-3.5 w-3.5" />;
    default:
      return <TrendingUp className="h-3.5 w-3.5" />;
  }
}

function EvidenceMetricCard({
  metric,
  lang,
}: {
  metric: EvidenceMetricItem;
  lang: SupportedLanguage;
}) {
  const isFocus = metric.isFocus;
  const labelText = metric.label[lang] || metric.label.en;
  const valueText = metric.value[lang] || metric.value.en;
  const noteText = metric.note[lang] || metric.note.en;
  const badgeText = metric.focusBadge?.[lang] || metric.focusBadge?.en;

  if (isFocus) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-teal-50/80 p-3 sm:p-4 shadow-md ring-2 ring-emerald-400/40 dark:border-emerald-400 dark:from-emerald-950/70 dark:via-emerald-900/40 dark:to-teal-950/50 transition-all duration-300">
        {/* Focus Target Badge Pill */}
        <div className="mb-2 flex items-center justify-between gap-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-85" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span>{badgeText || "FOCUS TARGET"}</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">AUDITED</span>
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs">
            {renderMetricIcon(metric.iconType)}
          </span>
          <span className="truncate">{labelText}</span>
        </div>

        {/* Highlighted Value */}
        <div className="mt-1.5 text-lg font-black text-emerald-800 dark:text-emerald-300 sm:text-xl tracking-tight">
          {valueText}
        </div>

        {/* Note / Citation */}
        <div className="mt-1 text-[11px] leading-snug text-emerald-800/90 dark:text-emerald-300/80 font-medium">
          {noteText}
        </div>

        {/* Ambient sweep overlay on mount */}
        <motion.span
          aria-hidden="true"
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.1, delay: 0.1, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 transition-all duration-300">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {renderMetricIcon(metric.iconType)}
        </span>
        <span className="truncate">{labelText}</span>
      </div>
      <div className="mt-1.5 text-lg font-bold text-navy dark:text-slate-100 sm:text-xl">
        {valueText}
      </div>
      <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {noteText}
      </div>
    </div>
  );
}
