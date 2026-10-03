import type { SupportedLanguage } from "../context/LanguageVoiceContext";

export type { SupportedLanguage };

export type Bi = { en: string; hi: string };
export type Topic = "salary" | "stigma" | "safety";

export type ChatItem =
  | { id: string; kind: "student"; text: Bi }
  | { id: string; kind: "parent"; text: Bi }
  | { id: string; kind: "arbiter"; tradeId: string; text: Bi };

type TradeScript = {
  opening: { student: Bi; parent: Bi; arbiter: Bi };
  studentFollowUp: Bi;
  parentDefault: Topic;
  objections: Record<Topic, { parent: Bi; arbiter: Bi }>;
};

export const TOPIC_LABELS: Record<Topic, Bi> = {
  salary: { en: "Salary Concern", hi: "वेतन की चिंता" },
  stigma: { en: "Social Stigma / Relatives", hi: "सामाजिक प्रतिष्ठा" },
  safety: { en: "Safety & Workplace", hi: "कार्यस्थल सुरक्षा" },
};

export const SCRIPTS: Record<string, TradeScript> = {
  AUTO_MECH_01: {
    opening: {
      student: {
        en: "Papa, I want to join ITI Automotive Mechatronics. I like engine electronics and EV diagnostics.",
        hi: "पापा, मैं आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स करना चाहता हूँ। मुझे आधुनिक कारों और ईवी इलेक्ट्रॉनिक्स का काम पसंद है।",
      },
      parent: {
        en: "Car repair is roadside mechanic work with no social standing. Relatives will mock us. You should do a regular BA degree and sit for government clerk exams.",
        hi: "गाड़ी सुधारना सड़क किनारे मैकेनिक का काम है, इसमें कोई इज़्ज़त नहीं है। रिश्तेदार क्या कहेंगे? तुम सामान्य बीए करो और सरकारी क्लर्क की तैयारी करो।",
      },
      arbiter: {
        en: "Ramesh-ji, your concern about social respect and income is completely natural. However, modern Automotive Mechatronics is NOT roadside mechanic work; it is cleanroom computer diagnostics for electric vehicles.",
        hi: "रमेश जी, आपका बेटे के भविष्य और समाज में सम्मान की चिंता करना बिल्कुल स्वाभाविक है। लेकिन आधुनिक ऑटोमोटिव मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है; यह इलेक्ट्रिक वाहनों की कंप्यूटर जांच का तकनीकी पेशा है।",
      },
    },
    studentFollowUp: {
      en: "Papa, Tata Motors and Hero hire directly from ITI campuses. I will work on diagnostic laptops, not on the roadside.",
      hi: "पापा, टाटा मोटर्स और हीरो सीधे आईटीआई कैंपस से भर्ती करते हैं। मैं डायग्नोस्टिक लैपटॉप पर काम करूँगा, सड़क पर नहीं।",
    },
    parentDefault: "salary",
    objections: {
      salary: {
        parent: {
          en: "How much will he really earn? I need at least ₹18,000 a month for him to be settled.",
          hi: "असल में कितना कमाएगा? कम से कम ₹18,000 महीना चाहिए तभी वो सेटल होगा।",
        },
        arbiter: {
          en: "Ramesh-ji, audited data from the Meerut–NCR corridor shows starting pay of ₹17,000–₹24,500, averaging ₹19,500 — above your ₹18,000 threshold. Apprentices also earn a NAPS stipend while training.",
          hi: "रमेश जी, मेरठ–एनसीआर क्षेत्र के सत्यापित आंकड़ों में शुरुआती वेतन ₹17,000–₹24,500 है, औसत ₹19,500 — आपकी ₹18,000 की अपेक्षा से अधिक। प्रशिक्षण के दौरान NAPS स्टाइपेंड भी मिलता है।",
        },
      },
      stigma: {
        parent: {
          en: "What will relatives say? A BA graduate gets more respect than an ITI boy.",
          hi: "रिश्तेदार क्या कहेंगे? बीए वाले की इज़्ज़त आईटीआई वाले से ज़्यादा होती है।",
        },
        arbiter: {
          en: "A natural worry. But 80 NCrF credits let Aman enter the 2nd year of a Polytechnic Diploma, and later a B.Tech. He keeps the degree path open while earning earlier than a BA student.",
          hi: "यह चिंता स्वाभाविक है। लेकिन 80 NCrF क्रेडिट से अमन सीधे पॉलिटेक्निक डिप्लोमा के दूसरे वर्ष में और बाद में बी.टेक में जा सकता है। डिग्री का रास्ता खुला रहता है, और कमाई बीए से पहले शुरू होती है।",
        },
      },
      safety: {
        parent: {
          en: "Workshops are dirty and dangerous. Will he be safe there?",
          hi: "वर्कशॉप गंदे और खतरनाक होते हैं। क्या वो वहाँ सुरक्षित रहेगा?",
        },
        arbiter: {
          en: "Placements are in modern diagnostic centres — cleanroom, non-roadside environments — with a verified workplace safety score of 9.2 / 10.",
          hi: "नियुक्तियाँ आधुनिक डायग्नोस्टिक सेंटरों में होती हैं — साफ़-सुथरे, सड़क से दूर — जिनका सत्यापित सुरक्षा स्कोर 9.2 / 10 है।",
        },
      },
    },
  },
  SOLAR_TECH_02: {
    opening: {
      student: {
        en: "Papa, I want to become a Solar PV Rooftop Technician. Every village is installing solar panels now.",
        hi: "पापा, मैं सोलर पीवी रूफटॉप तकनीशियन बनना चाहता हूँ। अब हर गाँव में सोलर पैनल लग रहे हैं।",
      },
      parent: {
        en: "Climbing rooftops is labourer's work. Is there even steady demand? A government exam is safer.",
        hi: "छत पर चढ़ना मज़दूरी का काम है। क्या इसकी पक्की माँग है भी? सरकारी परीक्षा ज़्यादा सुरक्षित है।",
      },
      arbiter: {
        en: "Ramesh-ji, wanting security for Aman is completely right. Solar is a national priority sector: PM Surya Ghar Yojana needs lakhs of certified technicians over the next five years.",
        hi: "रमेश जी, अमन के लिए सुरक्षा चाहना बिल्कुल सही है। सोलर राष्ट्रीय प्राथमिकता क्षेत्र है: पीएम सूर्य घर योजना को अगले पाँच वर्षों में लाखों प्रमाणित तकनीशियन चाहिए।",
      },
    },
    studentFollowUp: {
      en: "Papa, it's only a 12-month course, and I can even start my own installation business with a subsidy.",
      hi: "पापा, यह सिर्फ़ 12 महीने का कोर्स है, और सब्सिडी से मैं अपना इंस्टॉलेशन व्यवसाय भी शुरू कर सकता हूँ।",
    },
    parentDefault: "salary",
    objections: {
      salary: {
        parent: {
          en: "Will it pay at least ₹18,000 a month?",
          hi: "क्या इसमें कम से कम ₹18,000 महीना मिलेगा?",
        },
        arbiter: {
          en: "Certified solar technicians earn ₹16,500–₹22,000 to start, and rooftop installation contracting pays significantly higher during peak seasons.",
          hi: "प्रमाणित सोलर तकनीशियन शुरू में ₹16,500–₹22,000 कमाते हैं, और पीक सीज़न में रूफटॉप इंस्टॉलेशन अनुबंध से इससे कहीं अधिक आय होती है।",
        },
      },
      stigma: {
        parent: {
          en: "Is it a permanent skill or just temporary trend?",
          hi: "क्या यह पक्का हुनर है या बस थोड़े दिन का चलन?",
        },
        arbiter: {
          en: "Clean-energy skilling is recognized under the National Green Skills framework with continuous grid-integration pathways.",
          hi: "स्वच्छ-ऊर्जा कौशल को राष्ट्रीय ग्रीन स्किल फ्रेमवर्क के तहत मान्यता प्राप्त है जिसमें ग्रिड-एकीकरण के निरंतर रास्ते हैं।",
        },
      },
      safety: {
        parent: {
          en: "Rooftops and electricity — isn't that hazardous?",
          hi: "छत और बिजली — क्या यह जोखिम भरा नहीं है?",
        },
        arbiter: {
          en: "Certified training covers fall-protection and grid-safety protocols. The verified workplace safety score for this trade is 8.9 / 10.",
          hi: "प्रमाणित प्रशिक्षण में गिरने से बचाव और ग्रिड-सुरक्षा नियम शामिल हैं। इस ट्रेड का सत्यापित सुरक्षा स्कोर 8.9 / 10 है।",
        },
      },
    },
  },
};

export const ROI_ROWS = [
  {
    path: { en: "3-Year General BA", hi: "3 वर्षीय सामान्य बीए" },
    cost: "₹65,000",
    stipend: "₹0",
    start: "Month 42",
    total: "₹2.8 Lakhs",
  },
  {
    path: { en: "2-Year ITI Mechatronics", hi: "2 वर्षीय आईटीआई मेकाट्रॉनिक्स" },
    cost: "₹3,500",
    stipend: "₹9,500/mo (NAPS)",
    start: "Month 14",
    total: "₹8.6 Lakhs",
  },
];

export interface DyadicTurn {
  studentText: string;
  studentAudioDuration: string;
  parentText: string;
  parentAudioDuration: string;
  arbiterRebuttal: string;
  arbiterAudioDuration: string;
}

export const DYADIC_DIALOGUES: Record<SupportedLanguage, DyadicTurn> = {
  hi: {
    studentText:
      "पापा, मैं आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स करना चाहता हूँ। मुझे आधुनिक कारों, इलेक्ट्रिक वाहनों और कंप्यूटर डायग्नोस्टिक्स का काम बहुत पसंद है।",
    studentAudioDuration: "0:09",
    parentText:
      "गाड़ी सुधारना सड़क किनारे मैकेनिक का काम है, इसमें कोई इज़्ज़त नहीं है। रिश्तेदार क्या कहेंगे? तुम सामान्य बीए करो और सरकारी क्लर्क की तैयारी करो।",
    parentAudioDuration: "0:12",
    arbiterRebuttal:
      "रमेश जी, आपका सामाजिक सम्मान और आय की चिंता करना बिल्कुल स्वाभाविक है। लेकिन आधुनिक ऑटोमोटिव मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है; यह इलेक्ट्रिक वाहनों की कंप्यूटर जांच का तकनीकी पेशा है जिसमें ₹18,500 से ₹24,500 शुरुआती वेतन मिलता है।",
    arbiterAudioDuration: "0:22",
  },
  mr: {
    studentText:
      "बाबा, मला आयटीआय ऑटोमोटिव्ह मेकॅट्रॉनिक्स करायचे आहे. मला आधुनिक गाड्या, ईव्ही बॅटरी आणि संगणकीय चाचणीचे काम खूप आवडते.",
    studentAudioDuration: "0:09",
    parentText:
      "गाड्या दुरुस्त करणे म्हणजे रस्त्यावरच्या गॅरेजचे काम, यात समाजात कसली प्रतिष्ठा? नातेवाईक काय म्हणतील? तू साधी बीए पदवी कर आणि सरकारी परीक्षेची तयारी कर.",
    parentAudioDuration: "0:13",
    arbiterRebuttal:
      "रमेशजी, सामाजिक सन्मानाची काळजी असणे स्वाभाविक आहे. मात्र आधुनिक ऑटोमोटिव्ह मेकॅट्रॉनिक्स हे रस्त्यावरील गॅरेजचे काम नसून वातानुकूलित लॅबमधील इलेक्ट्रिक वाहनांचे तंत्रज्ञान आहे, ज्यामध्ये ₹१८,५०० ते ₹२४,५०० मासिक वेतन मिळते.",
    arbiterAudioDuration: "0:23",
  },
  bn: {
    studentText:
      "বাবা, আমি আইটিআই অটোমোটিভ মেকাট্রনিক্স শিখতে চাই। আমার আধুনিক গাড়ি, ইলেকট্রিক ভেহিকল এবং কম্পিউটার ডায়াগনস্টিক্সে খুব আগ্রহ আছে।",
    studentAudioDuration: "0:10",
    parentText:
      "গাড়ি মেরামত করা রাস্তার মেকানিকের কাজ, এতে সমাজে কোনো সম্মান নেই। আত্মীয়স্বজন কী বলবে? তুমি সাধারণ বিএ পাস করো আর সরকারি চাকরির চেষ্টা করো।",
    parentAudioDuration: "0:13",
    arbiterRebuttal:
      "রমেশ বাবু, সামাজিক মর্যাদা নিয়ে আপনার উদ্বেগ স্বাভাবিক। তবে আধুনিক অটোমোটিভ মেকাট্রনিক্স রাস্তার কাজ নয়, এটি শীতাতপ নিয়ন্ত্রিত ল্যাবে ইলেকট্রিক গাড়ির সফটওয়্যার পরীক্ষা, যেখানে শুরুতে ₹১৮,৫০০ থেকে ₹২৪,৫০০ বেতন পাওয়া যায়।",
    arbiterAudioDuration: "0:24",
  },
  ta: {
    studentText:
      "அப்பா, நான் ஐடிஐ ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் படிக்க விரும்புகிறேன். எனக்கு நவீன கார்கள், எலக்ட்ரிக் வாகனங்கள் மற்றும் கணினி பரிசோதனை மிகவும் பிடிக்கும்.",
    studentAudioDuration: "0:10",
    parentText:
      "வண்டி பழுதுபார்ப்பது சாலையோர மெக்கானிக் வேலை, இதில் என்ன சமூக அந்தஸ்து இருக்கிறது? சொந்தக்காரர்கள் என்ன சொல்வார்கள்? நீ வழக்கமான பி.ஏ படித்து அரசு தேர்வுக்கு முயற்சி செய்.",
    parentAudioDuration: "0:14",
    arbiterRebuttal:
      "ரமேஷ் அவர்களே, உங்கள் சமூக அந்தஸ்து பற்றிய கவலை நியாயமானது. நவீன ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் என்பது சாலையோர வேலை அல்ல, ஏசி ஆய்வகத்தில் எலக்ட்ரிக் வாகனங்களை பரிசோதிக்கும் உயர் தொழில்நுட்ப பணி, இதில் தொடக்க ஊதியம் ₹18,500 முதல் ₹24,500 வரை கிடைக்கிறது.",
    arbiterAudioDuration: "0:24",
  },
  en: {
    studentText:
      "Papa, I want to join ITI Automotive Mechatronics. I am passionate about modern electric vehicles, sensor systems, and computer diagnostics.",
    studentAudioDuration: "0:08",
    parentText:
      "Car repair is roadside mechanic work with no social standing. Relatives will mock us. You should complete a regular BA degree and prepare for government clerical exams.",
    parentAudioDuration: "0:11",
    arbiterRebuttal:
      "Ramesh-ji, your concern about social prestige and income is completely natural. However, modern Automotive Mechatronics is cleanroom computerized diagnostics for electric vehicles, not roadside repair, offering ₹18,500 to ₹24,500 starting pay.",
    arbiterAudioDuration: "0:20",
  },
};
