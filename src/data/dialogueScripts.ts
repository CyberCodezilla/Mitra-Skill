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
        parent: { en: "How much will he really earn? I need at least ₹18,000 a month for him to be settled.", hi: "असल में कितना कमाएगा? कम से कम ₹18,000 महीना चाहिए तभी वो सेटल होगा।" },
        arbiter: { en: "Ramesh-ji, audited data from the Meerut–NCR corridor shows starting pay of ₹17,000–₹24,500, averaging ₹19,500 — above your ₹18,000 threshold. Apprentices also earn a NAPS stipend while training.", hi: "रमेश जी, मेरठ–एनसीआर क्षेत्र के सत्यापित आंकड़ों में शुरुआती वेतन ₹17,000–₹24,500 है, औसत ₹19,500 — आपकी ₹18,000 की अपेक्षा से अधिक। प्रशिक्षण के दौरान NAPS स्टाइपेंड भी मिलता है।" },
      },
      stigma: {
        parent: { en: "What will relatives say? A BA graduate gets more respect than an ITI boy.", hi: "रिश्तेदार क्या कहेंगे? बीए वाले की इज़्ज़त आईटीआई वाले से ज़्यादा होती है।" },
        arbiter: { en: "A natural worry. But 80 NCrF credits let Aman enter the 2nd year of a Polytechnic Diploma, and later a B.Tech. He keeps the degree path open while earning earlier than a BA student.", hi: "यह चिंता स्वाभाविक है। लेकिन 80 NCrF क्रेडिट से अमन सीधे पॉलिटेक्निक डिप्लोमा के दूसरे वर्ष में और बाद में बी.टेक में जा सकता है। डिग्री का रास्ता खुला रहता है, और कमाई बीए से पहले शुरू होती है।" },
      },
      safety: {
        parent: { en: "Workshops are dirty and dangerous. Will he be safe there?", hi: "वर्कशॉप गंदे और खतरनाक होते हैं। क्या वो वहाँ सुरक्षित रहेगा?" },
        arbiter: { en: "Placements are in modern diagnostic centres — cleanroom, non-roadside environments — with a verified workplace safety score of 9.2 / 10.", hi: "नियुक्तियाँ आधुनिक डायग्नोस्टिक सेंटरों में होती हैं — साफ़-सुथरे, सड़क से दूर — जिनका सत्यापित सुरक्षा स्कोर 9.2 / 10 है।" },
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
        parent: { en: "Will it pay at least ₹18,000 a month?", hi: "क्या इसमें कम से कम ₹18,000 महीना मिलेगा?" },
        arbiter: { en: "Yes. Audited starting pay is ₹18,000–₹26,000, averaging ₹21,000, with 92.1% placement across Tata Power Solar, Adani vendors and State Discoms.", hi: "हाँ। सत्यापित शुरुआती वेतन ₹18,000–₹26,000 है, औसत ₹21,000, और टाटा पावर सोलर, अदाणी वेंडर्स व राज्य डिस्कॉम में 92.1% प्लेसमेंट है।" },
      },
      stigma: {
        parent: { en: "People will call him a panel-fitter, not an engineer.", hi: "लोग उसे पैनल लगाने वाला कहेंगे, इंजीनियर नहीं।" },
        arbiter: { en: "40 NCrF credits open the way to a Diploma in Electrical & Renewable Energy and then a B.Tech in Renewable Energy Systems. Green-energy engineers are a respected, growing profession.", hi: "40 NCrF क्रेडिट से इलेक्ट्रिकल व रिन्यूएबल एनर्जी डिप्लोमा और फिर बी.टेक का रास्ता खुलता है। ग्रीन-एनर्जी इंजीनियर एक सम्मानित और बढ़ता पेशा है।" },
      },
      safety: {
        parent: { en: "Rooftops and electricity — isn't it risky?", hi: "छत और बिजली — क्या यह जोखिम भरा नहीं है?" },
        arbiter: { en: "Certified training covers fall-protection and grid-safety protocols. The verified workplace safety score for this trade is 8.9 / 10.", hi: "प्रमाणित प्रशिक्षण में गिरने से बचाव और ग्रिड-सुरक्षा नियम शामिल हैं। इस ट्रेड का सत्यापित सुरक्षा स्कोर 8.9 / 10 है।" },
      },
    },
  },
};

export const ROI_ROWS = [
  { path: { en: "3-Year General BA", hi: "3 वर्षीय सामान्य बीए" }, cost: "₹65,000", stipend: "₹0", start: "Month 42", total: "₹2.8 Lakhs" },
  { path: { en: "2-Year ITI Mechatronics", hi: "2 वर्षीय आईटीआई मेकाट्रॉनिक्स" }, cost: "₹3,500", stipend: "₹9,500/mo (NAPS)", start: "Month 14", total: "₹8.6 Lakhs" },
];
