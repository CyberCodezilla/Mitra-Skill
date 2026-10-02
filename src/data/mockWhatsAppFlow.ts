export interface WAMessage {
  id: string;
  sender: "user" | "bot";
  type: "text" | "voice" | "card";
  text?: string;
  text_en?: string;
  voiceDuration?: string;
  cardData?: {
    title: string;
    metrics: string[];
    badge: string;
  };
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
        text: "नमस्ते रमेश जी। नौकरी और वेतन प्रशिक्षण, स्थान और नियोक्ता के अनुसार बदलते हैं। नीचे दिए गए आंकड़े केवल डेमो उदाहरण हैं—कृपया प्रवेश या नौकरी का निर्णय लेने से पहले संस्थान और नियोक्ता से वर्तमान जानकारी की पुष्टि करें।",
        timestamp: "10:14 AM",
      },
      {
        id: "b_sal_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "Automotive Mechatronics · Meerut (demo)",
          metrics: [
            "🟢 Sample placement indicator: 88.4% · unverified",
            "💵 Illustrative starting pay: ₹18,500–₹24,500/month",
            "🏢 Example employers: Tata Motors, Uno Minda, Hero",
          ],
          badge: "Demo figures · verify with source",
        },
        timestamp: "10:15 AM",
      },
    ],
  },
  {
    id: "CHIP_STIGMA",
    label_hi: "👔 समाज में इज्जत मिलेगी?",
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
        text: "आपकी चिंता समझ में आती है। आधुनिक मेकाट्रॉनिक्स में छात्र वर्कशॉप और लैब में डायग्नोस्टिक उपकरणों से काम सीखते हैं। अलग-अलग संस्थानों में सुविधाएं भिन्न हो सकती हैं, इसलिए परिसर देखकर और वर्तमान प्रशिक्षुओं से बात करके निर्णय लें।",
        timestamp: "10:16 AM",
      },
      {
        id: "b_stigma_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "काम की जगह और कौशल",
          metrics: [
            "लैब में वाहन डायग्नोस्टिक्स का अभ्यास",
            "इलेक्ट्रॉनिक्स और EV सिस्टम की ट्रेनिंग",
            "केंद्र की सुविधाएं सीधे जाकर जांचें",
          ],
          badge: "General guidance · center details vary",
        },
        timestamp: "10:17 AM",
      },
    ],
  },
  {
    id: "CHIP_DEGREE",
    label_hi: "🎓 आगे डिग्री कर सकते हैं?",
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
        text: "आगे पढ़ाई के रास्ते उपलब्ध हो सकते हैं। NCrF क्रेडिट और लेटरल एंट्री की पात्रता संबंधित संस्थान और लागू प्रवेश नियमों पर निर्भर करती है। आवेदन से पहले प्रवेश देने वाले कॉलेज से नियम लिखित रूप में जांचें।",
        timestamp: "10:18 AM",
      },
      {
        id: "b_degree_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "NCrF mobility · pathway overview",
          metrics: [
            "ITI से आगे की पढ़ाई के संभावित विकल्प",
            "क्रेडिट मान्यता संस्थान के नियमों पर निर्भर",
            "प्रवेश और छूट की पहले पुष्टि करें",
          ],
          badge: "Pathway information · admission not guaranteed",
        },
        timestamp: "10:19 AM",
      },
    ],
  },
  {
    id: "CHIP_SAFETY",
    label_hi: "🛡️ बेटियों की सुरक्षा कैसी है?",
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
        text: "यह पूछना बहुत जरूरी है। सुरक्षा और परिवहन की सुविधाएं हर केंद्र पर अलग होती हैं। प्रवेश से पहले केंद्र से महिला परिवहन, समय-सारणी, शिकायत व्यवस्था और परिसर सुरक्षा की पुष्टि करें; हमारी डेमो सूची को सत्यापित जानकारी न मानें।",
        timestamp: "10:20 AM",
      },
      {
        id: "b_safety_card",
        sender: "bot",
        type: "card",
        cardData: {
          title: "Campus visit checklist",
          metrics: [
            "महिला परिवहन और बस स्टॉप पूछें",
            "शिकायत अधिकारी और सुरक्षा प्रक्रिया जांचें",
            "केंद्र जाकर सुविधाओं का निरीक्षण करें",
          ],
          badge: "Verify locally · demo guidance",
        },
        timestamp: "10:21 AM",
      },
    ],
  },
];
