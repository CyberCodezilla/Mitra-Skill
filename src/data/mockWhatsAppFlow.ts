export interface WAMessage {
  id: string;
  sender: "user" | "bot";
  type: "text" | "voice" | "card";
  text?: string;
  voiceDuration?: string;
  waveform?: number[];
  cardData?: {
    tradeTitle: string;
    metrics: { label: string; value: string; icon: string }[];
    auditTag: string;
    actionButtons: string[];
  };
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isRead?: boolean;
}

export interface ScenarioChip {
  id: string;
  label_hi: string;
  label_en: string;
  userMessage: WAMessage;
  botReplies: WAMessage[];
}

export type PromptChip = ScenarioChip;

export const DEFAULT_INITIAL_MESSAGES: WAMessage[] = [
  {
    id: "m_init_1",
    sender: "bot",
    type: "text",
    text: "नमस्ते रमेश जी! मैं मित्रास्किल (MitraSkill) करियर सहायक हूँ। मुझे ज्ञात हुआ है कि आप अमन के आईटीआई (ITI) करियर को लेकर चिंतित हैं। आप बेझिझक बोलकर या लिखकर अपना प्रश्न पूछ सकते हैं।",
    timestamp: "10:12 AM",
    status: "read",
    isRead: true,
  },
];

export const SCENARIO_CHIPS: ScenarioChip[] = [
  {
    id: "CHIP_SALARY",
    label_hi: "💰 वेतन कितना मिलेगा? (Salary Doubt)",
    label_en: "💰 What is the starting salary?",
    userMessage: {
      id: "u_sal",
      sender: "user",
      type: "voice",
      voiceDuration: "0:08",
      waveform: [35, 60, 45, 80, 95, 65, 40, 75, 90, 85, 50, 70, 40, 30],
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
          metrics: [
            { label: "सत्यापित प्लेसमेंट", value: "88.4% (Campus Placed)", icon: "CheckCircle2" },
            { label: "शुरुआती वेतन", value: "₹18,500 - ₹24,500 / माह", icon: "TrendingUp" },
            { label: "शीर्ष भर्तीकर्ता", value: "Tata Motors, Uno Minda, Hero", icon: "Building2" },
          ],
          auditTag: "🟢 सत्यापित DGT व NCVET ऑडिट 2024 (मेरठ कॉरिडोर)",
          actionButtons: ["📞 नोडल अधिकारी से बात करें", "📄 वेतन प्रमाण पत्र देखें"],
        },
        timestamp: "10:15 AM",
        status: "read",
        isRead: true,
      },
    ],
  },
  {
    id: "CHIP_STIGMA",
    label_hi: "👔 सड़क किनारे मैकेनिक का काम है? (Social Stigma)",
    label_en: "👔 Is it roadside mechanic work?",
    userMessage: {
      id: "u_stigma",
      sender: "user",
      type: "voice",
      voiceDuration: "0:11",
      waveform: [40, 70, 85, 60, 90, 100, 75, 55, 80, 95, 65, 50, 35],
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
        text: "यह सोचना स्वाभाविक है, लेकिन आधुनिक मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है। छात्र वातानुकूलित कंप्यूटर लैब में डिजिटल स्कैनर और लैपटॉप से इलेक्ट्रिक वाहनों की जांच करते हैं। इसे जूनियर डायग्नोस्टिक स्पेशलिस्ट कहा जाता है।",
        timestamp: "10:16 AM",
        status: "read",
        isRead: true,
      },
    ],
  },
  {
    id: "CHIP_DEGREE",
    label_hi: "🎓 क्या आगे डिग्री मिल सकती है? (NCrF Degree)",
    label_en: "🎓 Can he get a university degree?",
    userMessage: {
      id: "u_deg",
      sender: "user",
      type: "text",
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
        text: "जी हाँ! राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) के तहत 2 वर्ष की आईटीआई से 80 क्रेडिट मिलते हैं। इससे छात्र को राजकीय पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में सीधे लेटरल एंट्री मिलती है, और उसके बाद B.Tech में प्रवेश मिल सकता है।",
        timestamp: "10:18 AM",
        status: "read",
        isRead: true,
      },
    ],
  },
  {
    id: "CHIP_SAFETY",
    label_hi: "🛡️️ लड़कियों के लिए सुरक्षा व बस? (Female Safety)",
    label_en: "🛡️ Safety and transit for female students?",
    userMessage: {
      id: "u_safe",
      sender: "user",
      type: "text",
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
        text: "मेरठ में राजकीय महिला आईटीआई में 100% सीसीटीवी निगरानी है और यूपी मिशन शक्ति के तहत मवाना और सरधना ब्लॉक से सीधी सुरक्षित सरकारी बस सेवा उपलब्ध है। पूजा वर्मा जैसी छात्राएं आज टाटा पावर में ₹23,500/माह पर कार्यरत हैं।",
        timestamp: "10:20 AM",
        status: "read",
        isRead: true,
      },
    ],
  },
];

export const WHATSAPP_PROMPT_CHIPS = SCENARIO_CHIPS;
