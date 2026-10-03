import type { SupportedLanguage } from "../context/LanguageVoiceContext";

export type Bi = Record<SupportedLanguage, string>;

export interface WAMessage {
  id: string;
  sender: "user" | "bot";
  type: "text" | "voice" | "card";
  /** Single-language legacy text (used for rendering when textBi is absent) */
  text?: string;
  /** 5-language localized text for both display and TTS */
  textBi?: Bi;
  voiceDuration?: string;
  waveform?: number[];
  cardData?: {
    tradeTitle: string;
    /** Card metric labels in 5 languages */
    metricsBi?: {
      label: Bi;
      value: Bi;
      icon: string;
    }[];
    /** Legacy single-language metrics */
    metrics?: { label: string; value: string; icon: string }[];
    auditTagBi?: Bi;
    auditTag?: string;
    actionButtonsBi?: Bi[];
    actionButtons?: string[];
  };
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isRead?: boolean;
}

export interface ScenarioChip {
  id: string;
  label_hi: string;
  label_en: string;
  labelBi: Bi;
  userMessage: WAMessage;
  botReplies: WAMessage[];
}

export type PromptChip = ScenarioChip;

/** Resolve the best text for the active language from a WAMessage */
export function resolveText(msg: WAMessage, lang: SupportedLanguage): string {
  if (msg.textBi) {
    return msg.textBi[lang] || msg.textBi.hi || msg.textBi.en || msg.text || "";
  }
  return msg.text || "";
}

// ────────────────────────────────────────────────────────────────────
// INITIAL GREETING MESSAGE
// ────────────────────────────────────────────────────────────────────

export const DEFAULT_INITIAL_MESSAGES: WAMessage[] = [
  {
    id: "m_init_1",
    sender: "bot",
    type: "text",
    textBi: {
      en: "Hello Ramesh-ji! I am MitraSkill Career Sahayak. I understand you have concerns about Aman's ITI career. Please feel free to ask your question by voice or text.",
      hi: "नमस्ते रमेश जी! मैं मित्रास्किल (MitraSkill) करियर सहायक हूँ। मुझे ज्ञात हुआ है कि आप अमन के आईटीआई (ITI) करियर को लेकर चिंतित हैं। आप बेझिझक बोलकर या लिखकर अपना प्रश्न पूछ सकते हैं।",
      mr: "नमस्कार रमेशजी! मी मित्रास्किल (MitraSkill) करिअर सहाय्यक आहे. अमनच्या आयटीआय करिअरबद्दल तुमच्या शंका आहेत हे मला माहीत आहे. तुम्ही बोलून किंवा टाइप करून विचारू शकता.",
      bn: "নমস্কার রমেশ বাবু! আমি মিত্রাস্কিল (MitraSkill) ক্যারিয়ার সহায়ক। আমানের আইটিআই ক্যারিয়ার নিয়ে আপনার উদ্বেগ আছে জানি। আপনি কথা বলে বা লিখে প্রশ্ন করতে পারেন।",
      ta: "வணக்கம் ரமேஷ் அவர்களே! நான் மித்ராஸ்கில் (MitraSkill) தொழில் வழிகாட்டி. அமனின் ஐடிஐ தொழிலைப் பற்றி உங்களுக்கு கேள்விகள் உள்ளன என்று தெரியும். தயவுசெய்து பேசியோ அல்லது எழுதியோ கேளுங்கள்.",
    },
    text: "नमस्ते रमेश जी! मैं मित्रास्किल (MitraSkill) करियर सहायक हूँ। मुझे ज्ञात हुआ है कि आप अमन के आईटीआई (ITI) करियर को लेकर चिंतित हैं। आप बेझिझक बोलकर या लिखकर अपना प्रश्न पूछ सकते हैं।",
    timestamp: "10:12 AM",
    status: "read",
    isRead: true,
  },
];

// ────────────────────────────────────────────────────────────────────
// SCENARIO CHIPS — Full 5-language localized scripts
// ────────────────────────────────────────────────────────────────────

export const SCENARIO_CHIPS: ScenarioChip[] = [
  // ─── CHIP 1: SALARY ───────────────────────────────────────────
  {
    id: "CHIP_SALARY",
    label_hi: "💰 वेतन कितना मिलेगा? (Salary Doubt)",
    label_en: "💰 What is the starting salary?",
    labelBi: {
      en: "💰 What is the starting salary?",
      hi: "💰 वेतन कितना मिलेगा?",
      mr: "💰 पगार किती मिळेल?",
      bn: "💰 বেতন কত পাওয়া যাবে?",
      ta: "💰 தொடக்க ஊதியம் எவ்வளவு?",
    },
    userMessage: {
      id: "u_sal",
      sender: "user",
      type: "voice",
      voiceDuration: "0:08",
      waveform: [35, 60, 45, 80, 95, 65, 40, 75, 90, 85, 50, 70, 40, 30],
      textBi: {
        en: "Hello, does Automotive Mechatronics really pay well or will it be a waste of time?",
        hi: "नमस्ते, क्या ऑटोमोटिव मेकाट्रॉनिक्स के बाद सच में अच्छी पगार मिलती है या समय बर्बाद होगा?",
        mr: "नमस्कार, ऑटोमोटिव्ह मेकॅट्रॉनिक्स नंतर खरंच चांगला पगार मिळतो का, की वेळ वाया जाईल?",
        bn: "নমস্কার, অটোমোটিভ মেকাট্রনিক্স করলে কি সত্যিই ভালো বেতন পাওয়া যায়, নাকি সময় নষ্ট হবে?",
        ta: "வணக்கம், ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் படித்தால் நல்ல சம்பளம் கிடைக்குமா, இல்லை நேரம் வீணாகுமா?",
      },
      text: "नमस्ते, क्या ऑटोमोटिव मेकाट्रॉनिक्स के बाद सच में अच्छी पगार मिलती है या समय बर्बाद होगा?",
      timestamp: "10:14 AM",
      status: "read",
      isRead: true,
    },
    botReplies: [
      {
        id: "b_sal_v",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:24",
        waveform: [
          30, 45, 75, 90, 60, 100, 85, 70, 95, 80, 65, 90, 75, 50, 85, 60, 40, 70, 90, 65, 45, 30,
        ],
        textBi: {
          en: "Ramesh-ji, as per the 2024 DGT audit of Government ITI Saket, Meerut, 88.4% of Automotive Mechatronics graduates received campus placements at Tata Motors and Uno Minda with starting salaries of ₹18,500 to ₹24,500 per month.",
          hi: "रमेश जी, राजकीय आईटीआई साकेत (मेरठ) के 2024 DGT ऑडिट के अनुसार, ऑटोमोटिव मेकाट्रॉनिक्स के 88.4% छात्रों को टाटा मोटर्स और उनो मिंडा में ₹18,500 से ₹24,500 प्रति माह का शुरुआती वेतन मिला है।",
          mr: "रमेशजी, राजकीय आयटीआय साकेत (मेरठ) च्या 2024 DGT ऑडिटनुसार, ऑटोमोटिव्ह मेकॅट्रॉनिक्सच्या 88.4% विद्यार्थ्यांना टाटा मोटर्स आणि उनो मिंडा मध्ये ₹18,500 ते ₹24,500 दरमहा सुरुवातीचे वेतन मिळाले आहे.",
          bn: "রমেশ বাবু, সরকারি আইটিআই সাকেত (মিরাট)-এর ২০২৪ সালের DGT অডিট অনুসারে, অটোমোটিভ মেকাট্রনিক্সের ৮৮.৪% শিক্ষার্থী টাটা মোটরস ও উনো মিন্ডায় ₹১৮,৫০০ থেকে ₹২৪,৫০০ প্রতি মাসে শুরুর বেতন পেয়েছে।",
          ta: "ரமேஷ் அவர்களே, அரசு ஐடிஐ சாகேத் (மீரட்) 2024 DGT தணிக்கையின்படி, ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் பட்டதாரிகளில் 88.4% பேருக்கு டாடா மோட்டார்ஸ் மற்றும் உனோ மிண்டாவில் மாதம் ₹18,500 முதல் ₹24,500 வரை தொடக்க ஊதியம் கிடைத்துள்ளது.",
        },
        text: "रमेश जी, राजकीय आईटीआई साकेत (मेरठ) के 2024 DGT ऑडिट के अनुसार, ऑटोमोटिव मेकाट्रॉनिक्स के 88.4% छात्रों को टाटा मोटर्स और उनो मिंडा में ₹18,500 से ₹24,500 प्रति माह का शुरुआती वेतन मिला है।",
        timestamp: "10:14 AM",
        status: "read",
        isRead: true,
      },
      {
        id: "b_sal_c",
        sender: "bot",
        type: "card",
        cardData: {
          tradeTitle: "Automotive Mechatronics (NSQF Level 4)",
          metricsBi: [
            {
              label: {
                en: "Verified Placement",
                hi: "सत्यापित प्लेसमेंट",
                mr: "सत्यापित प्लेसमेंट",
                bn: "যাচাইকৃত প্লেসমেন্ট",
                ta: "சரிபார்க்கப்பட்ட வேலைவாய்ப்பு",
              },
              value: {
                en: "88.4% (Campus Placed)",
                hi: "88.4% (कैम्पस प्लेसमेंट)",
                mr: "88.4% (कॅम्पस प्लेसमेंट)",
                bn: "৮৮.৪% (ক্যাম্পাস প্লেসমেন্ট)",
                ta: "88.4% (வளாக வேலைவாய்ப்பு)",
              },
              icon: "CheckCircle2",
            },
            {
              label: {
                en: "Starting Salary",
                hi: "शुरुआती वेतन",
                mr: "सुरुवातीचे वेतन",
                bn: "শুরুর বেতন",
                ta: "தொடக்க ஊதியம்",
              },
              value: {
                en: "₹18,500 - ₹24,500 / month",
                hi: "₹18,500 - ₹24,500 / माह",
                mr: "₹18,500 - ₹24,500 / महिना",
                bn: "₹১৮,৫০০ - ₹২৪,৫০০ / মাস",
                ta: "₹18,500 - ₹24,500 / மாதம்",
              },
              icon: "TrendingUp",
            },
            {
              label: {
                en: "Top Recruiters",
                hi: "शीर्ष भर्तीकर्ता",
                mr: "शीर्ष भरतीकर्ते",
                bn: "শীর্ষ নিয়োগকর্তা",
                ta: "முன்னணி நிறுவனங்கள்",
              },
              value: {
                en: "Tata Motors, Uno Minda, Hero",
                hi: "Tata Motors, Uno Minda, Hero",
                mr: "Tata Motors, Uno Minda, Hero",
                bn: "Tata Motors, Uno Minda, Hero",
                ta: "Tata Motors, Uno Minda, Hero",
              },
              icon: "Building2",
            },
          ],
          metrics: [
            { label: "सत्यापित प्लेसमेंट", value: "88.4% (Campus Placed)", icon: "CheckCircle2" },
            { label: "शुरुआती वेतन", value: "₹18,500 - ₹24,500 / माह", icon: "TrendingUp" },
            { label: "शीर्ष भर्तीकर्ता", value: "Tata Motors, Uno Minda, Hero", icon: "Building2" },
          ],
          auditTagBi: {
            en: "🟢 Verified DGT & NCVET Audit 2024 (Meerut Corridor)",
            hi: "🟢 सत्यापित DGT व NCVET ऑडिट 2024 (मेरठ कॉरिडोर)",
            mr: "🟢 प्रमाणित DGT व NCVET ऑडिट 2024 (मेरठ कॉरिडॉर)",
            bn: "🟢 যাচাইকৃত DGT ও NCVET অডিট 2024 (মিরাট করিডর)",
            ta: "🟢 சரிபார்க்கப்பட்ட DGT & NCVET தணிக்கை 2024 (மீரட் பகுதி)",
          },
          auditTag: "🟢 सत्यापित DGT व NCVET ऑडिट 2024 (मेरठ कॉरिडोर)",
          actionButtonsBi: [
            {
              en: "📞 Talk to Nodal Officer",
              hi: "📞 नोडल अधिकारी से बात करें",
              mr: "📞 नोडल अधिकाऱ्यांशी बोला",
              bn: "📞 নোডাল অফিসারের সাথে কথা বলুন",
              ta: "📞 நோடல் அதிகாரியிடம் பேசுங்கள்",
            },
            {
              en: "📄 View Salary Certificate",
              hi: "📄 वेतन प्रमाण पत्र देखें",
              mr: "📄 वेतन प्रमाणपत्र पहा",
              bn: "📄 বেতন প্রত্যয়নপত্র দেখুন",
              ta: "📄 சம்பள சான்றிதழ் பார்க்கவும்",
            },
          ],
          actionButtons: ["📞 नोडल अधिकारी से बात करें", "📄 वेतन प्रमाण पत्र देखें"],
        },
        timestamp: "10:15 AM",
        status: "read",
        isRead: true,
      },
    ],
  },

  // ─── CHIP 2: STIGMA ───────────────────────────────────────────
  {
    id: "CHIP_STIGMA",
    label_hi: "👔 सड़क किनारे मैकेनिक का काम है? (Social Stigma)",
    label_en: "👔 Is it roadside mechanic work?",
    labelBi: {
      en: "👔 Is it roadside mechanic work?",
      hi: "👔 सड़क किनारे मैकेनिक का काम है?",
      mr: "👔 रस्त्यावरील गॅरेजचे काम आहे का?",
      bn: "👔 রাস্তার মেকানিকের কাজ?",
      ta: "👔 சாலையோர மெக்கானிக் வேலையா?",
    },
    userMessage: {
      id: "u_stigma",
      sender: "user",
      type: "voice",
      voiceDuration: "0:11",
      waveform: [40, 70, 85, 60, 90, 100, 75, 55, 80, 95, 65, 50, 35],
      textBi: {
        en: "Relatives say this is roadside car repair work with no social standing or respect.",
        hi: "रिश्तेदार कहते हैं कि यह सड़क किनारे गाड़ी सुधारने का काम है, इसमें समाज में कोई इज्जत नहीं है।",
        mr: "नातेवाईक म्हणतात की हे रस्त्यावर गाड्या दुरुस्त करण्याचे काम आहे, यात समाजात कसलाच मान नाही.",
        bn: "আত্মীয়রা বলে এটা রাস্তায় গাড়ি সারানোর কাজ, সমাজে এতে কোনো সম্মান নেই।",
        ta: "சொந்தக்காரர்கள் சொல்கிறார்கள் இது சாலையோர வண்டி பழுதுபார்க்கும் வேலை, இதில் சமூக மரியாதை இல்லை.",
      },
      text: "रिश्तेदार कहते हैं कि यह सड़क किनारे गाड़ी सुधारने का काम है, इसमें समाज में कोई इज्जत नहीं है।",
      timestamp: "10:16 AM",
      status: "read",
      isRead: true,
    },
    botReplies: [
      {
        id: "b_stigma_v",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:28",
        waveform: [
          25, 50, 70, 85, 100, 90, 75, 60, 95, 80, 70, 85, 65, 90, 100, 80, 60, 75, 55, 40, 30,
        ],
        textBi: {
          en: "That concern is natural, but modern Mechatronics is not roadside work. Students work in air-conditioned computer labs using digital scanners and laptops to diagnose electric vehicles. The designation is Junior Diagnostic Specialist.",
          hi: "यह सोचना स्वाभाविक है, लेकिन आधुनिक मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है। छात्र वातानुकूलित कंप्यूटर लैब में डिजिटल स्कैनर और लैपटॉप से इलेक्ट्रिक वाहनों की जांच करते हैं। इसे जूनियर डायग्नोस्टिक स्पेशलिस्ट कहा जाता है।",
          mr: "ही चिंता स्वाभाविक आहे, पण आधुनिक मेकॅट्रॉनिक्स हे रस्त्यावरचे काम नाही. विद्यार्थी वातानुकूलित कंप्यूटर लॅबमध्ये डिजिटल स्कॅनर आणि लॅपटॉपने इलेक्ट्रिक वाहनांची तपासणी करतात. पदनाम आहे: ज्युनिअर डायग्नोस्टिक स्पेशलिस्ट.",
          bn: "এই উদ্বেগ স্বাভাবিক, কিন্তু আধুনিক মেকাট্রনিক্স রাস্তার কাজ নয়। ছাত্ররা শীতাতপ নিয়ন্ত্রিত কম্পিউটার ল্যাবে ডিজিটাল স্ক্যানার ও ল্যাপটপ দিয়ে ইলেকট্রিক গাড়ি পরীক্ষা করে। পদবি হলো জুনিয়র ডায়াগনস্টিক স্পেশালিস্ট।",
          ta: "இந்த கவலை இயல்பானது, ஆனால் நவீன மெக்கட்ரானிக்ஸ் சாலையோர வேலை அல்ல. மாணவர்கள் ஏசி கணினி ஆய்வகத்தில் டிஜிட்டல் ஸ்கேனர் மற்றும் லேப்டாப் கொண்டு எலக்ட்ரிக் வாகனங்களை பரிசோதிக்கிறார்கள். பதவி பெயர்: ஜூனியர் டயக்னாஸ்டிக் ஸ்பெஷலிஸ்ட்.",
        },
        text: "यह सोचना स्वाभाविक है, लेकिन आधुनिक मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है। छात्र वातानुकूलित कंप्यूटर लैब में डिजिटल स्कैनर और लैपटॉप से इलेक्ट्रिक वाहनों की जांच करते हैं। इसे जूनियर डायग्नोस्टिक स्पेशलिस्ट कहा जाता है।",
        timestamp: "10:16 AM",
        status: "read",
        isRead: true,
      },
    ],
  },

  // ─── CHIP 3: NCrF DEGREE ──────────────────────────────────────
  {
    id: "CHIP_DEGREE",
    label_hi: "🎓 क्या आगे डिग्री मिल सकती है? (NCrF Degree)",
    label_en: "🎓 Can he get a university degree?",
    labelBi: {
      en: "🎓 Can he get a university degree?",
      hi: "🎓 क्या आगे डिग्री मिल सकती है?",
      mr: "🎓 पुढे पदवी मिळेल का?",
      bn: "🎓 পরে ডিগ্রি মিলবে কি?",
      ta: "🎓 பட்டம் பெற முடியுமா?",
    },
    userMessage: {
      id: "u_deg",
      sender: "user",
      type: "text",
      textBi: {
        en: "Can my son get a B.Tech or Engineering Diploma after completing ITI?",
        hi: "क्या आईटीआई के बाद मेरा बेटा आगे चलकर बी.टेक या इंजीनियरिंग डिप्लोमा कर सकता है?",
        mr: "आयटीआय पूर्ण केल्यानंतर माझा मुलगा पुढे बी.टेक किंवा इंजिनीअरिंग डिप्लोमा करू शकतो का?",
        bn: "আইটিআই শেষ করার পর আমার ছেলে কি বি.টেক বা ইঞ্জিনিয়ারিং ডিপ্লোমা করতে পারবে?",
        ta: "ஐடிஐ முடித்த பிறகு என் மகன் பி.டெக் அல்லது இன்ஜினியரிங் டிப்ளமோ படிக்க முடியுமா?",
      },
      text: "क्या आईटीआई के बाद मेरा बेटा आगे चलकर बी.टेक या इंजीनियरिंग डिप्लोमा कर सकता है?",
      timestamp: "10:18 AM",
      status: "read",
      isRead: true,
    },
    botReplies: [
      {
        id: "b_deg_v",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:23",
        waveform: [35, 65, 80, 95, 70, 85, 90, 60, 75, 100, 85, 65, 50, 70, 85, 60, 40, 30],
        textBi: {
          en: "Yes, absolutely! Under the National Credit Framework (NCrF), a 2-year ITI earns 80 credits. This gives the student direct lateral entry into the 2nd year of a Government Polytechnic Diploma, and after that, entry into a B.Tech programme.",
          hi: "जी हाँ! राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) के तहत 2 वर्ष की आईटीआई से 80 क्रेडिट मिलते हैं। इससे छात्र को राजकीय पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में सीधे लेटरल एंट्री मिलती है, और उसके बाद B.Tech में प्रवेश मिल सकता है।",
          mr: "हो, नक्कीच! राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) अंतर्गत 2 वर्षांच्या आयटीआयमधून 80 क्रेडिट मिळतात. यामुळे विद्यार्थ्याला राजकीय पॉलिटेक्निक डिप्लोमाच्या दुसऱ्या वर्षात थेट लॅटरल एंट्री मिळते, आणि त्यानंतर बी.टेक करता येते.",
          bn: "হ্যাঁ, অবশ্যই! ন্যাশনাল ক্রেডিট ফ্রেমওয়ার্ক (NCrF)-এর অধীনে ২ বছরের আইটিআই থেকে ৮০ ক্রেডিট পাওয়া যায়। এতে শিক্ষার্থী সরকারি পলিটেকনিক ডিপ্লোমার দ্বিতীয় বর্ষে সরাসরি ল্যাটারাল এন্ট্রি পায়, এবং তারপর বি.টেকেও ভর্তি হতে পারে।",
          ta: "ஆமாம், நிச்சயமாக! தேசிய கிரெடிட் கட்டமைப்பின் (NCrF) கீழ் 2 ஆண்டு ஐடிஐ படிப்பில் 80 கிரெடிட்கள் கிடைக்கும். இதன் மூலம் மாணவர் அரசு பாலிடெக்னிக் டிப்ளமோவின் 2-ஆம் ஆண்டில் நேரடியாக சேரலாம், பின்னர் பி.டெக்கிலும் சேர முடியும்.",
        },
        text: "जी हाँ! राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) के तहत 2 वर्ष की आईटीआई से 80 क्रेडिट मिलते हैं। इससे छात्र को राजकीय पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में सीधे लेटरल एंट्री मिलती है, और उसके बाद B.Tech में प्रवेश मिल सकता है।",
        timestamp: "10:18 AM",
        status: "read",
        isRead: true,
      },
    ],
  },

  // ─── CHIP 4: FEMALE SAFETY ────────────────────────────────────
  {
    id: "CHIP_SAFETY",
    label_hi: "🛡️️ लड़कियों के लिए सुरक्षा व बस? (Female Safety)",
    label_en: "🛡️ Safety and transit for female students?",
    labelBi: {
      en: "🛡️ Safety and transit for female students?",
      hi: "🛡️️ लड़कियों के लिए सुरक्षा व बस?",
      mr: "🛡️ मुलींसाठी सुरक्षा आणि बस?",
      bn: "🛡️ মেয়েদের জন্য নিরাপত্তা ও বাস?",
      ta: "🛡️ பெண்களுக்கு பாதுகாப்பு மற்றும் போக்குவரத்து?",
    },
    userMessage: {
      id: "u_safe",
      sender: "user",
      type: "text",
      textBi: {
        en: "Are solar and technical courses safe for girls? What are the transportation arrangements?",
        hi: "क्या सोलर और टेक्निकल कोर्स लड़कियों के लिए सुरक्षित हैं? आने-जाने की क्या व्यवस्था है?",
        mr: "सोलर आणि तांत्रिक अभ्यासक्रम मुलींसाठी सुरक्षित आहेत का? येण्या-जाण्याची काय व्यवस्था आहे?",
        bn: "সোলার এবং কারিগরি কোর্স কি মেয়েদের জন্য নিরাপদ? যাতায়াতের ব্যবস্থা কী আছে?",
        ta: "சோலார் மற்றும் தொழில்நுட்ப படிப்புகள் பெண்களுக்கு பாதுகாப்பானவையா? போக்குவரத்து ஏற்பாடு என்ன?",
      },
      text: "क्या सोलर और टेक्निकल कोर्स लड़कियों के लिए सुरक्षित हैं? आने-जाने की क्या व्यवस्था है?",
      timestamp: "10:20 AM",
      status: "read",
      isRead: true,
    },
    botReplies: [
      {
        id: "b_safe_v",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:25",
        waveform: [30, 55, 75, 90, 100, 80, 65, 85, 95, 70, 60, 80, 90, 75, 60, 45, 30],
        textBi: {
          en: "The Government Women's ITI in Meerut has 100% CCTV surveillance and direct safe government bus service from Mawana and Sardhana blocks under the UP Mission Shakti scheme. Students like Pooja Verma are currently working at Tata Power earning ₹23,500 per month.",
          hi: "मेरठ में राजकीय महिला आईटीआई में 100% सीसीटीवी निगरानी है और यूपी मिशन शक्ति के तहत मवाना और सरधना ब्लॉक से सीधी सुरक्षित सरकारी बस सेवा उपलब्ध है। पूजा वर्मा जैसी छात्राएं आज टाटा पावर में ₹23,500/माह पर कार्यरत हैं।",
          mr: "मेरठ येथील राजकीय महिला आयटीआयमध्ये 100% सीसीटीव्ही निगराणी आहे आणि यूपी मिशन शक्ती अंतर्गत मवाना आणि सरधना ब्लॉकमधून थेट सुरक्षित सरकारी बस सेवा उपलब्ध आहे. पूजा वर्मा सारख्या विद्यार्थिनी आज टाटा पॉवरमध्ये ₹23,500/महिना कमावत आहेत.",
          bn: "মিরাটের সরকারি মহিলা আইটিআইতে ১০০% সিসিটিভি নজরদারি আছে এবং ইউপি মিশন শক্তি প্রকল্পের অধীনে মাওয়ানা ও সারধানা ব্লক থেকে সরাসরি নিরাপদ সরকারি বাস চলাচল করে। পূজা ভার্মার মতো ছাত্রীরা আজ টাটা পাওয়ারে মাসে ₹২৩,৫০০ বেতনে কাজ করছে।",
          ta: "மீரட்டின் அரசு மகளிர் ஐடிஐயில் 100% சிசிடிவி கண்காணிப்பு உள்ளது, மேலும் உ.பி. மிஷன் ஷக்தி திட்டத்தின் கீழ் மவானா மற்றும் சர்தானா தொகுதிகளிலிருந்து நேரடி பாதுகாப்பான அரசு பேருந்து சேவை உள்ளது. பூஜா வர்மா போன்ற மாணவிகள் இன்று டாடா பவரில் மாதம் ₹23,500 சம்பாதிக்கிறார்கள்.",
        },
        text: "मेरठ में राजकीय महिला आईटीआई में 100% सीसीटीवी निगरानी है और यूपी मिशन शक्ति के तहत मवाना और सरधना ब्लॉक से सीधी सुरक्षित सरकारी बस सेवा उपलब्ध है। पूजा वर्मा जैसी छात्राएं आज टाटा पावर में ₹23,500/माह पर कार्यरत हैं।",
        timestamp: "10:20 AM",
        status: "read",
        isRead: true,
      },
    ],
  },
];

export const WHATSAPP_PROMPT_CHIPS = SCENARIO_CHIPS;

// ────────────────────────────────────────────────────────────────────
// DEFAULT FALLBACK RESPONSE (for free-text input)
// ────────────────────────────────────────────────────────────────────

export const FALLBACK_RESPONSE_BI: Bi = {
  en: "Thank you Ramesh-ji. We have verified data for your question. You can press the quick buttons (Chips) above to see official figures on salary, social standing, and safety.",
  hi: "धन्यवाद रमेश जी। आपके प्रश्न के लिए हमारे पास सत्यापित डेटा उपलब्ध है। आप ऊपर दिए गए त्वरित बटनों (Chips) को दबाकर वेतन, प्रतिष्ठा और सुरक्षा के अधिकृत आंकड़े देख सकते हैं।",
  mr: "धन्यवाद रमेशजी. तुमच्या प्रश्नासाठी आमच्याकडे सत्यापित डेटा उपलब्ध आहे. तुम्ही वरील त्वरित बटणे (Chips) दाबून वेतन, प्रतिष्ठा आणि सुरक्षेचे अधिकृत आकडे पाहू शकता.",
  bn: "ধন্যবাদ রমেশ বাবু। আপনার প্রশ্নের জন্য আমাদের কাছে যাচাইকৃত তথ্য আছে। উপরের দ্রুত বোতামগুলো (Chips) টিপে বেতন, সামাজিক মর্যাদা এবং নিরাপত্তার সরকারি তথ্য দেখতে পারেন।",
  ta: "நன்றி ரமேஷ் அவர்களே. உங்கள் கேள்விக்கு எங்களிடம் சரிபார்க்கப்பட்ட தரவு உள்ளது. மேலே உள்ள குறுக்கு பொத்தான்களை (Chips) அழுத்தி ஊதியம், சமூக அந்தஸ்து மற்றும் பாதுகாப்பு பற்றிய அதிகாரப்பூர்வ தகவல்களைப் பார்க்கலாம்.",
};
