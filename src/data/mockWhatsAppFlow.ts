export interface WACardAction {
  id: string;
  label: string;
  type: "call" | "download" | "link";
  payload: string;
}

export interface WACardData {
  title: string;
  badge: string;
  subtitle?: string;
  metrics: string[];
  actions?: WACardAction[];
  footer?: string;
}

export interface WAMessage {
  id: string;
  sender: "user" | "bot";
  type: "text" | "voice" | "card";
  text?: string;
  text_en?: string;
  voiceDuration?: string;
  cardData?: WACardData;
  timestamp: string;
  isRead?: boolean;
}

export interface PromptChip {
  id: string;
  label_hi: string;
  label_en: string;
  userMessage: WAMessage;
  botReply: WAMessage[];
}

export const WHATSAPP_PROMPT_CHIPS: PromptChip[] = [
  {
    id: "CHIP_SALARY",
    label_hi: "💰 वेतन कितना मिलेगा?",
    label_en: "💰 What is the starting salary?",
    userMessage: {
      id: "u_sal",
      sender: "user",
      type: "voice",
      voiceDuration: "0:09",
      text: "नमस्ते, क्या ऑटोमोटिव मेकाट्रॉनिक्स करने के बाद अच्छी नौकरी और पक्का वेतन मिलता है?",
      timestamp: "10:14 AM",
      isRead: true,
    },
    botReply: [
      {
        id: "b_sal_voice",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:24",
        text: "नमस्ते रमेश जी। ऑटोमोटिव मेकाट्रॉनिक्स में पिछले वर्ष का DGT ऑडिट प्लेसमेंट 88.4% रहा है। शुरुआती वेतन ₹18,500 से ₹24,500 प्रति माह रहता है। नीचे दिए गए सत्यापित विवरण कार्ड में आप प्रमुख भर्तीकर्ताओं की सूची देख सकते हैं।",
        timestamp: "10:14 AM",
      },
      {
        id: "b_sal_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "ऑटोमोटिव मेकाट्रॉनिक्स (NSQF Level 4)",
          badge: "DGT Audit 2024 Verified",
          subtitle: "सरकारी औद्योगिक प्रशिक्षण संस्थान (ITI मेरठ)",
          metrics: [
            "🟢 सत्यापित प्लेसमेंट: 88.4% (DGT Audit 2024)",
            "💵 शुरुआती वेतन: ₹18,500 – ₹24,500 / माह",
            "🏢 प्रमुख भर्तीकर्ता: Tata Motors, Uno Minda, Hero MotoCorp",
          ],
          actions: [
            {
              id: "act_call_nodal",
              label: "📞 नोडल अधिकारी से बात करें",
              type: "call",
              payload: "श्री आर. के. शर्मा (नोडल प्लेसमेंट अधिकारी): +91 98765 43210",
            },
            {
              id: "act_download_consent",
              label: "📜 परिवार सहमति पत्र डाउनलोड",
              type: "download",
              payload: "https://mitraskill.msde.gov.in/docs/family-consent-form-hi.pdf",
            },
          ],
          footer: "DGT डेटाबेस ट्रैकर संख्या: MSDE-2024-TR-9941",
        },
        timestamp: "10:15 AM",
      },
    ],
  },
  {
    id: "CHIP_STIGMA",
    label_hi: "👔 सड़क किनारे मैकेनिक का काम है?",
    label_en: "👔 Is there social respect in this trade?",
    userMessage: {
      id: "u_stigma",
      sender: "user",
      type: "voice",
      voiceDuration: "0:11",
      text: "रिश्तेदार कहते हैं कि मैकेनिक का काम सड़क किनारे होता है और इसमें इज्जत नहीं है।",
      timestamp: "10:16 AM",
      isRead: true,
    },
    botReply: [
      {
        id: "b_stigma_voice",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:28",
        text: "आपकी चिंता पूरी तरह स्वाभाविक है रमेश जी। आधुनिक मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है। छात्र हाई-टेक एसी लैब्स में कंप्यूटराइज्ड OBD-II स्कैनर और इलेक्ट्रिक वाहन डायग्नोस्टिक्स सीखते हैं। उन्हें कॉर्पोरेट सर्विस सेंटर्स में 'डायग्नोस्टिक स्पेशलिस्ट' पद मिलता है।",
        timestamp: "10:16 AM",
      },
      {
        id: "b_stigma_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "आधुनिक कार्यस्थल व सम्मान (Industry 4.0)",
          badge: "Industry 4.0 Certified",
          subtitle: "हाई-टेक वर्कशॉप व डायग्नोस्टिक लैब",
          metrics: [
            "🔬 कार्यस्थल: फुली एयर-कंडीशंड डायग्नोस्टिक लैब व EV रोबोटिक्स वर्कशॉप",
            "👔 पदनाम: सर्टिफाइड ऑटोमोटिव डायग्नोस्टिक स्पेशलिस्ट (NSQF Level 4)",
            "🏢 प्रमुख भर्तीकर्ता: Maruti Suzuki Arena, MG Motors, Mahindra Auto",
          ],
          actions: [
            {
              id: "act_call_nodal",
              label: "📞 नोडल अधिकारी से बात करें",
              type: "call",
              payload: "श्री आर. के. शर्मा (नोडल प्लेसमेंट अधिकारी): +91 98765 43210",
            },
            {
              id: "act_download_consent",
              label: "📜 परिवार सहमति पत्र डाउनलोड",
              type: "download",
              payload: "https://mitraskill.msde.gov.in/docs/family-consent-form-hi.pdf",
            },
          ],
          footer: "Industry 4.0 मानकीकृत लैब व आधुनिक उपकरण युक्त परिसर",
        },
        timestamp: "10:17 AM",
      },
    ],
  },
  {
    id: "CHIP_DEGREE",
    label_hi: "🎓 क्या आगे डिग्री मिल सकती है?",
    label_en: "🎓 Can he study for a degree later?",
    userMessage: {
      id: "u_degree",
      sender: "user",
      type: "text",
      text: "क्या ITI के बाद मेरा बेटा डिप्लोमा या डिग्री कर सकता है?",
      timestamp: "10:18 AM",
      isRead: true,
    },
    botReply: [
      {
        id: "b_degree_voice",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:22",
        text: "बिल्कुल! राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) के तहत ITI के 40 क्रेडिट सीधे पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में लेटरल एंट्री के लिए मान्य हैं। इसके बाद B.Tech या B.Voc डिग्री भी पूरी की जा सकती है। पढ़ाई का रास्ता कभी बंद नहीं होता।",
        timestamp: "10:18 AM",
      },
      {
        id: "b_degree_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "NCrF क्रेडिट मोबिलिटी (डिप्लोमा व डिग्री पाथवे)",
          badge: "NCrF Vertical Mobility",
          subtitle: "DGT & AICTE संयुक्त शैक्षणिक मान्यता",
          metrics: [
            "🎓 वर्टिकल पाथवे: ITI (Level 4) ➔ डिप्लोमा 2nd Year ➔ B.Tech / B.Voc",
            "🔢 क्रेडिट ट्रांसफर: 40 NCrF एकेडमिक क्रेडिट्स सीधे ट्रांसफर योग्य",
            "🏛️ संबद्ध बोर्ड: AICTE व राज्य तकनीकी शिक्षा बोर्ड द्वारा अनुमोदित",
          ],
          actions: [
            {
              id: "act_call_nodal",
              label: "📞 नोडल अधिकारी से बात करें",
              type: "call",
              payload: "श्री आर. के. शर्मा (नोडल प्लेसमेंट अधिकारी): +91 98765 43210",
            },
            {
              id: "act_download_consent",
              label: "📜 परिवार सहमति पत्र डाउनलोड",
              type: "download",
              payload: "https://mitraskill.msde.gov.in/docs/family-consent-form-hi.pdf",
            },
          ],
          footer: "National Credit Framework (NCrF) दिशा-निर्देश 2023 के तहत अधिकृत",
        },
        timestamp: "10:19 AM",
      },
    ],
  },
  {
    id: "CHIP_SAFETY",
    label_hi: "🛡️ लड़कियों के लिए सुरक्षा व बस?",
    label_en: "🛡️ What about safety for girls?",
    userMessage: {
      id: "u_safety",
      sender: "user",
      type: "text",
      text: "क्या तकनीकी कोर्स लड़कियों के लिए सुरक्षित हैं? आने-जाने की क्या व्यवस्था है?",
      timestamp: "10:20 AM",
      isRead: true,
    },
    botReply: [
      {
        id: "b_safety_voice",
        sender: "bot",
        type: "voice",
        voiceDuration: "0:26",
        text: "लड़कियों की सुरक्षा हमारी सर्वोच्च प्राथमिकता है। ITI कैंपस में 24 घंटे CCTV निगरानी और समर्पित महिला सुरक्षा सेल है। इसके अलावा जिला प्रशासन द्वारा छात्राओं के लिए सुरक्षित परिवहन बस सेवा और ₹1,000 प्रति माह अतिरिक्त कन्या कौशल वजीफा भी उपलब्ध है।",
        timestamp: "10:20 AM",
      },
      {
        id: "b_safety_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "महिला सुरक्षा व विशेष सुविधाएं (Campus Safety)",
          badge: "Women-First Campus Initiative",
          subtitle: "सुरक्षित वातावरण व समर्पित सहायता",
          metrics: [
            "🚌 सुरक्षित परिवहन: निःशुल्क जिला परिवहन पास व सुरक्षित बस स्टॉप पिक-अप",
            "🛡️ सुरक्षित परिसर: 24x7 CCTV निगरानी व समर्पित महिला शिकायत निवारण सेल",
            "🎁 कन्या प्रोत्साहन: ₹1,000 / माह अतिरिक्त कन्या कौशल वजीफा (DBT)",
          ],
          actions: [
            {
              id: "act_call_nodal",
              label: "📞 नोडल अधिकारी से बात करें",
              type: "call",
              payload: "श्रीमती सुनीता वर्मा (महिला समन्वय अधिकारी): +91 98765 43215",
            },
            {
              id: "act_download_consent",
              label: "📜 परिवार सहमति पत्र डाउनलोड",
              type: "download",
              payload: "https://mitraskill.msde.gov.in/docs/family-consent-form-hi.pdf",
            },
          ],
          footer: "MSDE महिला कौशल विकास नीति 2024 के अंतर्गत संरक्षित",
        },
        timestamp: "10:21 AM",
      },
    ],
  },
];
