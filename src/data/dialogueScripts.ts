import type { SupportedLanguage } from "../context/LanguageVoiceContext";

import type { ArbiterTopic } from "./arbiterEvidence";

export type { SupportedLanguage };

export type Bi = Record<SupportedLanguage, string>;
export type Topic = "salary" | "stigma" | "safety";

export type ChatItem =
  | { id: string; kind: "student"; text: Bi; topic?: Topic | undefined; balancedScenario?: BalancedDyadicTurn | undefined }
  | { id: string; kind: "parent"; text: Bi; topic?: Topic | undefined; balancedScenario?: BalancedDyadicTurn | undefined }
  | { id: string; kind: "arbiter"; tradeId: string; text: Bi; topic?: ArbiterTopic | undefined; balancedScenario?: BalancedDyadicTurn | undefined };

type TradeScript = {
  opening: { student: Bi; parent: Bi; arbiter: Bi };
  studentFollowUp: Bi;
  parentDefault: Topic;
  objections: Record<Topic, { parent: Bi; arbiter: Bi }>;
};

export const TOPIC_LABELS: Record<Topic, Bi> = {
  salary: {
    en: "Salary Concern",
    hi: "वेतन की चिंता",
    mr: "वेतनाची काळजी",
    bn: "বেতনের চিন্তা",
    ta: "சம்பளம் பற்றிய கவலை",
  },
  stigma: {
    en: "Social Stigma / Relatives",
    hi: "सामाजिक प्रतिष्ठा",
    mr: "सामाजिक प्रतिष्ठा / नातेवाईक",
    bn: "সামাজিক মর্যাদা / আত্মীয়স্বজন",
    ta: "சமூக அந்தஸ்து / சொந்தக்காரர்கள்",
  },
  safety: {
    en: "Safety & Workplace",
    hi: "कार्यस्थल सुरक्षा",
    mr: "कार्यस्थळ सुरक्षा",
    bn: "কর্মক্ষেত্রের নিরাপত্তা",
    ta: "பணிப்பாதுகாப்பு",
  },
};

export const SCRIPTS: Record<string, TradeScript> = {
  AUTO_MECH_01: {
    opening: {
      student: {
        en: "Papa, I want to join ITI Automotive Mechatronics. I like engine electronics and EV diagnostics.",
        hi: "पापा, मैं आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स करना चाहता हूँ। मुझे आधुनिक कारों और ईवी इलेक्ट्रॉनिक्स का काम पसंद है।",
        mr: "बाबा, मला आयटीआय ऑटोमोटिव्ह मेकॅट्रॉनिक्स करायचे आहे. मला आधुनिक गाड्या, ईव्ही बॅटरी आणि संगणकीय चाचणीचे काम खूप आवडते.",
        bn: "বাবা, আমি আইটিআই অটোমোটিভ মেকাট্রনিক্স শিখতে চাই। আমার আধুনিক গাড়ি, ইলেকট্রিক ভেহিকল এবং কম্পিউটার ডায়াগনস্টিক্সে খুব আগ্রহ আছে।",
        ta: "அப்பா, நான் ஐடிஐ ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் படிக்க விரும்புகிறேன். எனக்கு நவீன கார்கள், எலக்ட்ரிக் வாகனங்கள் மற்றும் கணினி பரிசோதனை மிகவும் பிடிக்கும்.",
      },
      parent: {
        en: "Car repair is roadside mechanic work with no social standing. Relatives will mock us. You should do a regular BA degree and sit for government clerk exams.",
        hi: "गाड़ी सुधारना सड़क किनारे मैकेनिक का काम है, इसमें कोई इज़्ज़त नहीं है। रिश्तेदार क्या कहेंगे? तुम सामान्य बीए करो और सरकारी क्लर्क की तैयारी करो।",
        mr: "गाड्या दुरुस्त करणे म्हणजे रस्त्यावरच्या गॅरेजचे काम, यात समाजात कसली प्रतिष्ठा? नातेवाईक काय म्हणतील? तू साधी बीए पदवी कर आणि सरकारी परीक्षेची तयारी कर.",
        bn: "গাড়ি মেরামত করা রাস্তার মেকানিকের কাজ, এতে সমাজে কোনো সম্মান নেই। আত্মীয়স্বজন কী বলবে? তুমি সাধারণ বিএ পাস করো আর সরকারি চাকরির চেষ্টা করো।",
        ta: "வண்டி பழுதுபார்ப்பது சாலையோர மெக்கானிக் வேலை, இதில் என்ன சமூக அந்தஸ்து இருக்கிறது? சொந்தக்காரர்கள் என்ன சொல்வார்கள்? நீ வழக்கமான பி.ஏ படித்து அரசு தேர்வுக்கு முயற்சி செய்.",
      },
      arbiter: {
        en: "Ramesh-ji, your concern about social respect and income is completely natural. However, modern Automotive Mechatronics is NOT roadside mechanic work; it is cleanroom computer diagnostics for electric vehicles with verified starting pay of ₹18,500 to ₹24,500.",
        hi: "रमेश जी, आपका बेटे के भविष्य और समाज में सम्मान की चिंता करना बिल्कुल स्वाभाविक है। लेकिन आधुनिक ऑटोमोटिव मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है; यह इलेक्ट्रिक वाहनों की कंप्यूटर जांच का तकनीकी पेशा है जिसमें ₹18,500 से ₹24,500 शुरुआती वेतन मिलता है।",
        mr: "रमेशजी, सामाजिक सन्मानाची काळजी असणे स्वाभाविक आहे. मात्र आधुनिक ऑटोमोटिव्ह मेकॅट्रॉनिक्स हे रस्त्यावरील गॅरेजचे काम नसून वातानुकूलित लॅबमधील इलेक्ट्रिक वाहनांचे तंत्रज्ञान आहे, ज्यामध्ये ₹१८,५०० ते ₹२४,५०० मासिक वेतन मिळते.",
        bn: "রমেশ বাবু, সামাজিক মর্যাদা নিয়ে আপনার উদ্বেগ স্বাভাবিক। তবে আধুনিক অটোমোটিভ মেকাট্রনিক্স রাস্তার কাজ নয়, এটি শীতাতপ নিয়ন্ত্রিত ল্যাবে ইলেকট্রিক গাড়ির সফটওয়্যার পরীক্ষা, যেখানে শুরুতে ₹১৮,৫০০ থেকে ₹২৪,৫০০ বেতন পাওয়া যায়।",
        ta: "ரமேஷ் அவர்களே, உங்கள் சமூக அந்தஸ்து பற்றிய கவலை நியாயமானது. நவீன ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் என்பது சாலையோர வேலை அல்ல, ஏசி ஆய்வகத்தில் எலக்ட்ரிக் வாகனங்களை பரிசோதிக்கும் உயர் தொழில்நுட்ப பணி, இதில் தொடக்க ஊதியம் ₹18,500 முதல் ₹24,500 வரை கிடைக்கிறது.",
      },
    },
    studentFollowUp: {
      en: "Papa, Tata Motors and Hero hire directly from ITI campuses. I will work on diagnostic laptops, not on the roadside.",
      hi: "पापा, टाटा मोटर्स और हीरो सीधे आईटीआई कैंपस से भर्ती करते हैं। मैं डायग्नोस्टिक लैपटॉप पर काम करूँगा, सड़क पर नहीं।",
      mr: "बाबा, टाटा मोटर्स आणि हिरो थेट आयटीआय कॅम्पसमधून भरती करतात. मी लॅपटॉपवर डिजिटल चाचणीचे काम करणार आहे, रस्त्यावर नाही.",
      bn: "বাবা, টাটা মোটরস এবং হিরো সরাসরি আইটিআই ক্যাম্পাস থেকে নিয়োগ করে। আমি ল্যাপটপে ডায়াগনস্টিক কাজ করব, রাস্তায় নয়।",
      ta: "அப்பா, டாடா மோட்டார்ஸ் மற்றும் ஹீரோ நிறுவனங்கள் ஐடிஐ வளாகத்திலிருந்தே நேரடியாக வேலைக்கு எடுக்கின்றன. நான் கணினி லேப்டாப்பில் தான் வேலை செய்வேன், சாலையில் அல்ல.",
    },
    parentDefault: "salary",
    objections: {
      salary: {
        parent: {
          en: "How much will he really earn? I need at least ₹18,000 a month for him to be settled.",
          hi: "असल में कितना कमाएगा? कम से कम ₹18,000 महीना चाहिए तभी वो सेटल होगा।",
          mr: "तो खरंच किती कमवेल? तो स्थिर होण्यासाठी त्याला दरमहा किमान ₹१८,००० ची गरज आहे.",
          bn: "আসল আয় কত হবে? সংসারে দাঁড়াতে গেলে ওর মাসে অন্তত ₹১৮,০০০ দরকার।",
          ta: "அவன் உண்மையில் எவ்வளவு சம்பாதிப்பான்? அவன் குடும்பத்தை நடத்த மாதம் குறைந்தது ₹18,000 தேவை.",
        },
        arbiter: {
          en: "Ramesh-ji, audited data from the Meerut–NCR corridor shows starting pay of ₹17,000–₹24,500, averaging ₹19,500 — above your ₹18,000 threshold. Apprentices also earn a NAPS stipend while training.",
          hi: "रमेश जी, मेरठ–एनसीआर क्षेत्र के सत्यापित आंकड़ों में शुरुआती वेतन ₹17,000–₹24,500 है, औसत ₹19,500 — आपकी ₹18,000 की अपेक्षा से अधिक। प्रशिक्षण के दौरान NAPS स्टाइपेंड भी मिलता है।",
          mr: "रमेशजी, मेरठ-एनसीआर पट्ट्यातील अधिकृत आकडेवारीनुसार सुरुवातीचे वेतन ₹१७,००० ते ₹२४,५०० आहे, सरासरी ₹१९,५०० — तुमच्या ₹१८,००० च्या अपेक्षेपेक्षा जास्त. प्रशिक्षणादरम्यान NAPS विद्यावेतनही मिळते.",
          bn: "রমেশ বাবু, মিরাট-এনসিআর অঞ্চলের নিরীক্ষিত তথ্যে প্রাথমিক বেতন ₹১৭,০০০–₹২৪,৫০০, গড় ₹১৯,৫০০ — আপনার ₹১৮,০০০ চাহিদার চেয়ে বেশি। প্রশিক্ষণের সময় NAPS বৃত্তিও মেলে।",
          ta: "ரமேஷ் அவர்களே, மீரட்-என்சிஆர் பகுதியின் தணிக்கை செய்யப்பட்ட தரவுகளின்படி ஆரம்ப ஊதியம் ₹17,000–₹24,500, சராசரியாக ₹19,500 — இது உங்கள் ₹18,000 எதிர்பார்ப்பை விட அதிகம். பயிற்சியின் போது NAPS உதவித்தொகையும் உண்டு.",
        },
      },
      stigma: {
        parent: {
          en: "What will relatives say? A BA graduate gets more respect than an ITI boy.",
          hi: "रिश्तेदार क्या कहेंगे? बीए वाले की इज़्ज़त आईटीआई वाले से ज़्यादा होती है।",
          mr: "नातेवाईक काय म्हणतील? साध्या बीए पदवीधराला आयटीआयपेक्षा समाजात जास्त मान असतो.",
          bn: "আত্মীয়রা কী বলবে? আইটিআই করার চেয়ে বিএ পাস করা ছেলের সমাজে বেশি সম্মান থাকে।",
          ta: "சொந்தக்காரர்கள் என்ன சொல்வார்கள்? ஐடிஐ படிப்பதை விட பி.ஏ படித்தவருக்கு தான் அதிக மரியாதை இருக்கும்.",
        },
        arbiter: {
          en: "A natural worry. But 80 NCrF credits let Aman enter the 2nd year of a Polytechnic Diploma, and later a B.Tech. He keeps the degree path open while earning earlier than a BA student.",
          hi: "यह चिंता स्वाभाविक है। लेकिन 80 NCrF क्रेडिट से अमन सीधे पॉलिटेक्निक डिप्लोमा के दूसरे वर्ष में और बाद में बी.टेक में जा सकता है। डिग्री का रास्ता खुला रहता है, और कमाई बीए से पहले शुरू होती है।",
          mr: "चिंता असणे स्वाभाविक आहे. पण ८० NCrF क्रेडिट्समुळे अमन थेट पॉलिटेक्निक पदविकाच्या दुसऱ्या वर्षात आणि नंतर बी.टेक करू शकतो. पदवीचा मार्ग खुला राहतो आणि बीए आधीच कमाई सुरू होते.",
          bn: "উদ্বেগটা স্বাভাবিক। কিন্তু ৮০টি NCrF ক্রেডিট নিয়ে আমান সরাসরি পলিটেকনিক ডিপ্লোমার দ্বিতীয় বর্ষে এবং পরে বি.টেকে ভর্তি হতে পারবে। ডিগ্রির পথ খোলা রেখেই সে বিএ পাসদের চেয়ে আগে উপার্জন শুরু করবে।",
          ta: "இது இயல்பான கவலைதான். ஆனால் 80 NCrF கிரெடிட்கள் மூலம் அமன் நேரடியாக பாலிடெக்னிக் டிப்ளமோவின் 2-ஆம் ஆண்டிலும், பின்னர் பி.டெக்கிலும் சேர முடியும். பட்டப்படிப்புக்கான பாதை திறந்தே இருக்கும், பி.ஏ மாணவரை விட முன்னரே சம்பாதிக்கலாம்.",
        },
      },
      safety: {
        parent: {
          en: "Workshops are dirty and dangerous. Will he be safe there?",
          hi: "वर्कशॉप गंदे और खतरनाक होते हैं। क्या वो वहाँ सुरक्षित रहेगा?",
          mr: "वर्कशॉप अस्वच्छ आणि धोकादायक असतात. तिथे तो सुरक्षित राहील का?",
          bn: "ওয়ার্কশপ নোংরা আর বিপজ্জনক হয়। সেখানে ও কি নিরাপদ থাকবে?",
          ta: "பட்டறைகள் அழுக்காகவும் ஆபத்தாகவும் இருக்கும். அவன் அங்கே பாதுகாப்பாக இருப்பானா?",
        },
        arbiter: {
          en: "Placements are in modern diagnostic centres — cleanroom, non-roadside environments — with a verified workplace safety score of 9.2 / 10.",
          hi: "नियुक्तियाँ आधुनिक डायग्नोस्टिक सेंटरों में होती हैं — साफ़-सुथरे, सड़क से दूर — जिनका सत्यापित सुरक्षा स्कोर 9.2 / 10 है।",
          mr: "प्लेसमेंट आधुनिक डिजिटल तपासणी केंद्रांमध्ये होतात — स्वच्छ, रस्त्यापासून दूर — ज्यांचा प्रमाणित कामाच्या ठिकाणचा सुरक्षा स्कोअर ९.२ / १० आहे.",
          bn: "নিয়োগ হয় আধুনিক ডায়াগনস্টিক সেন্টারে — পরিচ্ছন্ন, রাস্তা থেকে দূরে — যার যাচাইকৃত কর্মক্ষেত্রের নিরাপত্তা স্কোর ৯.২ / ১০।",
          ta: "வேலைவாய்ப்புகள் நவீன கணினி பரிசோதனை மையங்களில் தான் அமையும் — தூய்மையான, சாலையோரமற்ற சூழல் — இதன் சரிபார்க்கப்பட்ட பணிப்பாதுகாப்பு மதிப்பீடு 9.2 / 10 ஆகும்.",
        },
      },
    },
  },
  SOLAR_TECH_02: {
    opening: {
      student: {
        en: "Papa, I want to become a Solar PV Rooftop Technician. Every village is installing solar panels now.",
        hi: "पापा, मैं सोलर पीवी रूफटॉप तकनीशियन बनना चाहता हूँ। अब हर गाँव में सोलर पैनल लग रहे हैं।",
        mr: "बाबा, मला सोलर पीव्ही रूफटॉप तंत्रज्ञ व्हायचे आहे. आता प्रत्येक गावात आणि शहरात सौर पॅनेल बसवले जात आहेत.",
        bn: "বাবা, আমি সোলার পিভি রুফটপ টেকনিশিয়ান হতে চাই। এখন প্রতিটি গ্রামে ও শহরে সৌর প্যানেল বসানো হচ্ছে।",
        ta: "அப்பா, நான் சூரிய மின்சக்தி (சோலார்) ரூஃப்டாப் டெக்னீஷியனாக ஆக விரும்புகிறேன். இப்போது எல்லா கிராமங்களிலும் சோலார் பேனல்கள் பொருத்தப்படுகின்றன.",
      },
      parent: {
        en: "Climbing rooftops is labourer's work. Is there even steady demand? A government exam is safer.",
        hi: "छत पर चढ़ना मज़दूरी का काम है। क्या इसकी पक्की माँग है भी? सरकारी परीक्षा ज़्यादा सुरक्षित है।",
        mr: "छतावर चढणे हे मजुरांचे काम आहे. याला कायमस्वरूपी मागणी आहे का? सरकारी परीक्षा देणे जास्त सुरक्षित आहे.",
        bn: "ছাদে ওঠা তো শ্রমিকের কাজ। এর কি স্থায়ী কোনো চাহিদা আছে? সরকারি চাকরির পরীক্ষা অনেক বেশি নিরাপদ।",
        ta: "கூரை மீது ஏறுவது தொழிலாளி வேலை போன்றது. இதற்கு நிரந்தர வேலை வாய்ப்பு உள்ளதா? அரசுத் தேர்வு எழுதுவதே பாதுகாப்பானது.",
      },
      arbiter: {
        en: "Ramesh-ji, wanting security for Aman is completely right. Solar is a national priority sector: PM Surya Ghar Yojana needs lakhs of certified technicians over the next five years.",
        hi: "रमेश जी, अमन के लिए सुरक्षा चाहना बिल्कुल सही है। सोलर राष्ट्रीय प्राथमिकता क्षेत्र है: पीएम सूर्य घर योजना को अगले पाँच वर्षों में लाखों प्रमाणित तकनीशियन चाहिए।",
        mr: "रमेशजी, अमनच्या सुरक्षित भविष्याची काळजी योग्यच आहे. सौर ऊर्जा हे राष्ट्रीय प्राधान्य क्षेत्र आहे: पीएम सूर्य घर योजनेला पुढील ५ वर्षांत लाखो प्रमाणित तंत्रज्ञांची गरज आहे.",
        bn: "রমেশ বাবু, আমানের ভবিষ্যৎ নিরাপত্তা চাওয়া একদম সঠিক। সৌর শক্তি জাতীয় অগ্রাধিকারের ক্ষেত্র: পিএম সূর্য ঘর যোজনায় আগামী ৫ বছরে লক্ষাধিক দক্ষ টেকনিশিয়ান প্রয়োজন।",
        ta: "ரமேஷ் அவர்களே, அமனின் பாதுகாப்பான எதிர்காலத்தை விரும்புவது முற்றிலும் சரியானது. சூரிய சக்தி துறை தேசிய முன்னுரிமை பெற்ற துறை: பிரதமரின் சூர்ய கர் யோஜனா திட்டத்திற்கு அடுத்த 5 ஆண்டுகளில் லட்சக்கணக்கான சான்றிதழ் பெற்ற டெக்னீஷியன்கள் தேவை.",
      },
    },
    studentFollowUp: {
      en: "Papa, it's only a 12-month course, and I can even start my own installation business with a subsidy.",
      hi: "पापा, यह सिर्फ़ 12 महीने का कोर्स है, और सब्सिडी से मैं अपना इंस्टॉलेशन व्यवसाय भी शुरू कर सकता हूँ।",
      mr: "बाबा, हा फक्त १२ महिन्यांचा कोर्स आहे, आणि शासकीय अनुदानाने मी स्वतःचा इन्स्टॉलेशन व्यवसायही सुरू करू शकतो.",
      bn: "বাবা, এটা মাত্র ১২ মাসের কোর্স, এবং সরকারি অনুদানে আমি নিজের ইনস্টলেশন ব্যবসাও শুরু করতে পারি।",
      ta: "அப்பா, இது வெறும் 12 மாத கால படிப்புதான், மானிய உதவியுடன் நான் சொந்தமாக சோலார் நிறுவும் தொழிலையும் தொடங்க முடியும்.",
    },
    parentDefault: "salary",
    objections: {
      salary: {
        parent: {
          en: "Will it pay at least ₹18,000 a month?",
          hi: "क्या इसमें कम से कम ₹18,000 महीना मिलेगा?",
          mr: "यात किमान ₹१८,००० दरमहा मिळतील का?",
          bn: "এতে কি মাসে অন্তত ₹১৮,০০০ পাওয়া যাবে?",
          ta: "இதில் மாதம் குறைந்தது ₹18,000 கிடைக்குமா?",
        },
        arbiter: {
          en: "Certified solar technicians earn ₹16,500–₹22,000 to start, and rooftop installation contracting pays significantly higher during peak seasons.",
          hi: "प्रमाणित सोलर तकनीशियन शुरू में ₹16,500–₹22,000 कमाते हैं, और पीक सीज़न में रूफटॉप इंस्टॉलेशन अनुबंध से इससे कहीं अधिक आय होती है।",
          mr: "प्रमाणित सौर तंत्रज्ञ सुरुवातीला ₹१६,५०० ते ₹२२,००० कमावतात आणि मुख्य हंगामात रूफटॉप कंत्राटातून याहून अधिक उत्पन्न मिळते.",
          bn: "প্রত্যয়িত সৌর টেকনিশিয়ানরা শুরুতে ₹১৬,৫০০–₹২২,০০০ উপার্জন করেন এবং ইনস্টলেশন চুক্তির মাধ্যমে আরও বেশি আয় সম্ভব।",
          ta: "சான்றிதழ் பெற்ற சோலார் டெக்னீஷியன்கள் ஆரம்பத்தில் ₹16,500–₹22,000 சம்பாதிக்கிறார்கள், சீசன் காலங்களில் ஒப்பந்தப் பணிகள் மூலம் இதைவிட அதிக வருமானம் ஈட்ட முடியும்.",
        },
      },
      stigma: {
        parent: {
          en: "Is it a permanent skill or just temporary trend?",
          hi: "क्या यह पक्का हुनर है या बस थोड़े दिन का चलन?",
          mr: "हे कायमचे कौशल्य आहे की केवळ तात्पुरता ट्रेंड?",
          bn: "এটা কি দীর্ঘস্থায়ী কোনো পেশা নাকি সাময়িক ট্রেন্ড?",
          ta: "இது நிலையான திறமையா அல்லது தற்காலிகமான ஒரு அலையா?",
        },
        arbiter: {
          en: "Clean-energy skilling is recognized under the National Green Skills framework with continuous grid-integration pathways.",
          hi: "स्वच्छ-ऊर्जा कौशल को राष्ट्रीय ग्रीन स्किल फ्रेमवर्क के तहत मान्यता प्राप्त है जिसमें ग्रिड-एकीकरण के निरंतर रास्ते हैं।",
          mr: "हरित ऊर्जा कौशल्याला राष्ट्रीय ग्रीन स्किल्स चौकटीत मान्यता आहे, ज्यामध्ये ग्रिड व्यवस्थापनातील निरंतर प्रगतीचे मार्ग उपलब्ध आहेत.",
          bn: "পরিচ্ছন্ন জ্বালানি দক্ষতা জাতীয় গ্রিন স্কিলস কাঠামোর অধীনে স্বীকৃত, যার মাধ্যমে গ্রিড ইন্টিগ্রেশনের দীর্ঘস্থায়ী সুযোগ রয়েছে।",
          ta: "சுத்தமான எரிசக்தி திறன் தேசிய பசுமை திறன் கட்டமைப்பின் கீழ் அங்கீகரிக்கப்பட்டுள்ளது, இதில் தொடர்ச்சியான வளர்ச்சி வாய்ப்புகள் உள்ளன.",
        },
      },
      safety: {
        parent: {
          en: "Rooftops and electricity — isn't that hazardous?",
          hi: "छत और बिजली — क्या यह जोखिम भरा नहीं है?",
          mr: "उंच छते आणि उच्च वीज — हा धोकादायक प्रकार नाही का?",
          bn: "ছাদ আর বিদ্যুৎ — এটা কি অত্যন্ত ঝুঁকিপূর্ণ নয়?",
          ta: "கூரை மற்றும் மின்சாரம் — இதில் அதிக ஆபத்து இல்லையா?",
        },
        arbiter: {
          en: "Certified training covers fall-protection and grid-safety protocols. The verified workplace safety score for this trade is 8.9 / 10.",
          hi: "प्रमाणित प्रशिक्षण में गिरने से बचाव और ग्रिड-सुरक्षा नियम शामिल हैं। इस ट्रेड का सत्यापित सुरक्षा स्कोर 8.9 / 10 है।",
          mr: "प्रमाणित प्रशिक्षणात उंचावरून पडण्यापासून सुरक्षा आणि ग्रिड सुरक्षिततेचे कडक नियम शिकवले जातात. या क्षेत्राचा प्रमाणित सुरक्षा स्कोअर ८.९ / १० आहे.",
          bn: "প্রত্যয়িত প্রশিক্ষণে পতন-সুরক্ষা ও গ্রিড সুরক্ষার সম্পূর্ণ নিয়ম শেখানো হয়। এই ট্রেডের যাচাইকৃত নিরাপত্তা স্কোর ৮.৯ / ১০।",
          ta: "சான்றிதழ் பயிற்சியில் பாதுகாப்பு கயிறு மற்றும் மின்-பாதுகாப்பு நெறிமுறைகள் முழுமையாக கற்பிக்கப்படுகின்றன. இதன் பணிப்பாதுகாப்பு மதிப்பீடு 8.9 / 10 ஆகும்.",
        },
      },
    },
  },
};

export const ROI_ROWS = [
  {
    path: {
      en: "3-Year General BA",
      hi: "3 वर्षीय सामान्य बीए",
      mr: "३ वर्षांचे सामान्य बीए",
      bn: "৩ বছরের সাধারণ বিএ",
      ta: "3 ஆண்டு பொது பி.ஏ",
    },
    cost: "₹65,000",
    stipend: "₹0",
    start: "Month 42",
    total: "₹2.8 Lakhs",
  },
  {
    path: {
      en: "2-Year ITI Mechatronics",
      hi: "2 वर्षीय आईटीआई मेकाट्रॉनिक्स",
      mr: "२ वर्षांचे आयटीआय मेकॅट्रॉनिक्स",
      bn: "২ বছরের আইটিআই মেকাট্রনিক্স",
      ta: "2 ஆண்டு ஐடிஐ மெக்கட்ரானிக்ஸ்",
    },
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

export interface BalancedDyadicTurn {
  id: string;
  category: "PARENT_WAGE" | "STUDENT_EFFORT" | "PARENT_STIGMA" | "STUDENT_UNREALISTIC_EXPECTATION";
  initiator: "student" | "parent";
  promptChipLabel_hi: string;
  promptChipLabel_en: string;
  promptChipLabel_mr?: string;
  promptChipLabel_bn?: string;
  promptChipLabel_ta?: string;
  userMessage: {
    sender: "student_aman" | "parent_ramesh";
    speakerName: string;
    text_hi: string;
    text_en: string;
    text_mr?: string;
    text_bn?: string;
    text_ta?: string;
    audioDuration: string;
  };
  arbiterResponse: {
    speakerName: string;
    // Reality check delivered to the child
    childRealityCheck_hi: string;
    childRealityCheck_en: string;
    childRealityCheck_mr?: string;
    childRealityCheck_bn?: string;
    childRealityCheck_ta?: string;
    // Validation & reassurance delivered to the parent
    parentValidation_hi: string;
    parentValidation_en: string;
    parentValidation_mr?: string;
    parentValidation_bn?: string;
    parentValidation_ta?: string;
    // Unified synthesis
    fullText_hi: string;
    fullText_en: string;
    fullText_mr?: string;
    fullText_bn?: string;
    fullText_ta?: string;
    audioDuration: string;
    verifiedFactMetric?: {
      label: string;
      value: string;
      auditRef: string;
      label_hi?: string;
      label_en?: string;
      label_mr?: string;
      label_bn?: string;
      label_ta?: string;
      value_hi?: string;
      value_en?: string;
      value_mr?: string;
      value_bn?: string;
      value_ta?: string;
      auditRef_hi?: string;
      auditRef_en?: string;
      auditRef_mr?: string;
      auditRef_bn?: string;
      auditRef_ta?: string;
    };
  };
}

export const BALANCED_DYADIC_SCENARIOS: BalancedDyadicTurn[] = [
  {
    id: "SCENARIO_STUDENT_WORKLOAD",
    category: "STUDENT_EFFORT",
    initiator: "student",
    promptChipLabel_hi: "🧑🔧 अमन: क्या मुझे सिर्फ लैपटॉप चलाना होगा या भारी काम भी है?",
    promptChipLabel_en: "🧑🔧 Aman: Is it just laptop work or heavy manual labor?",
    promptChipLabel_mr: "🧑🔧 अमन: मला फक्त लॅपटॉप चालवायचा आहे की जड शारीरिक कामही आहे?",
    promptChipLabel_bn: "🧑🔧 আমান: আমাকে কি শুধু ল্যাপটপ চালাতে হবে নাকি ভারী কাজও করতে হবে?",
    promptChipLabel_ta: "🧑🔧 அமன்: நான் கணினியில் மட்டுமே வேலை செய்ய வேண்டுமா அல்லது கடின உழைப்பும் உள்ளதா?",
    userMessage: {
      sender: "student_aman",
      speakerName: "Aman Sharma (Student, 17)",
      text_hi: "सर, मुझे कारों का शौक है। लेकिन क्या मेकाट्रॉनिक्स में मुझे सिर्फ वातानुकूलित लैब में लैपटॉप से स्कैनिंग करनी होगी, या गियर और ग्रीस का भारी काम भी करना पड़ेगा?",
      text_en: "Sir, I like cars. But in mechatronics, will I only work on laptops in AC labs, or will I also have to handle heavy grease, gears, and physical shopfloor work?",
      text_mr: "सर, मला गाड्यांची आवड आहे. पण मेकॅट्रॉनिक्समध्ये मला फक्त एसी लॅबमध्ये लॅपटॉपने स्कॅनिंग करावी लागेल, की गियर आणि ग्रीसचे जड कामही करावे लागेल?",
      text_bn: "স্যার, আমার গাড়ির প্রতি আগ্রহ আছে। কিন্তু মেकाট্রনিক্সে কি শুধু এসি ল্যাবে ল্যাপটপ স্ক্যানিং করতে হবে, নাকি গিয়ার ও গ্রীসের ভারী কাজও করতে হবে?",
      text_ta: "சார், எனக்கு கார்கள் பிடிக்கும். ஆனால் மெக்கட்ரானிக்ஸில் ஏசி ஆய்வகத்தில் லேப்டாப் மூலம் மட்டுமே ஸ்கேன் செய்ய வேண்டுமா, அல்லது கியர் மற்றும் கிரீஸ் போன்ற கடினமான வேலையும் செய்ய வேண்டுமா?",
      audioDuration: "0:10"
    },
    arbiterResponse: {
      speakerName: "MitraSkill Arbiter (निष्पक्ष मध्यस्थ)",
      childRealityCheck_hi: "अमन, सच्चाई यह है कि यह केवल कंप्यूटर गेमिंग जैसा काम नहीं है। पहले वर्ष में आपको भारी वायरिंग हार्नेस, 400V हाई-वोल्टेज बैटरी की सुरक्षा, गियरबॉक्स और चेसिस पर पसीना बहाना होगा। यदि आप शारीरिक मेहनत और कड़े सुरक्षा नियमों के लिए तैयार नहीं हैं, तो यह ट्रेड कठिन लगेगा।",
      childRealityCheck_en: "Aman, here is the honest reality: this is not pure software work. In Year 1, you will sweat on physical chassis, handle 400V high-voltage battery safety protocols, and route heavy wiring. If you aren't ready for physical discipline, this trade will be tough.",
      childRealityCheck_mr: "अमन, सत्य हे आहे की हे फक्त कॉम्प्युटर गेमिंगसारखे काम नाही. पहिल्या वर्षी तुम्हाला चेसिस, ४००V हाय-व्होल्टेज बॅटरी सुरक्षा आणि वायरिंगवर घाम गाळावा लागेल. शारीरिक मेहनत आणि कठोर नियमांची तयारी नसेल, तर हे कठीण जाईल.",
      childRealityCheck_bn: "আমান, বাস্তবতা হলো এটা কেবল কম্পিউটারে কাজ নয়। প্রথম বছরে তোমাকে চ্যাসিস, ৪০০ ভোল্ট হাই-ভোল্টেজ ব্যাটারি নিরাপত্তা এবং ভারী ওয়্যারিংয়ে ঘাম ঝরাতে হবে। কঠোর নিয়ম ও শারীরিক পরিশ্রমের জন্য প্রস্তুত না হলে এটা কঠিন লাগবে।",
      childRealityCheck_ta: "அமன், உண்மை என்னவென்றால் இது வெறும் கணினி வேலை அல்ல. முதல் ஆண்டில் சேசிஸ், 400V உயர் மின்னழுத்த பேட்டரி பாதுகாப்பு மற்றும் வயரிங் ஆகியவற்றில் உடல் உழைப்பு தேவைப்படும். இதற்கு நீங்கள் தயாராக இல்லையெனில், இது கடினமாக இருக்கும்.",
      parentValidation_hi: "रमेश जी, आपकी यह चिंता बिल्कुल सही थी कि बच्चा सिर्फ हवा-हवाई सपने न देखे। तकनीकी कौशल में मेहनत और अनुशासन अनिवार्य है।",
      parentValidation_en: "Ramesh-ji, your instinct was spot-on: Aman must understand that technical engineering requires grounded discipline, not just glamor.",
      parentValidation_mr: "रमेशजी, मुलाने फक्त हवेत स्वप्ने पाहू नयेत ही तुमची चिंता रास्त होती. तांत्रिक कौशल्यात शिस्त आणि मेहनत आवश्यक आहे.",
      parentValidation_bn: "রমেশ বাবু, আপনার এই চিন্তা একদম সঠিক ছিল যে ছেলে যেন শুধু অলীক স্বপ্ন না দেখে। কারিগরি দক্ষতায় শৃঙ্খলা ও পরিশ্রম অপরিহার্য।",
      parentValidation_ta: "ரமேஷ் அவர்களே, உங்கள் மகன் வெறும் கற்பனைக் கனவுகளை மட்டுமே காணக்கூடாது என்ற உங்கள் அக்கறை மிகவும் சரியானது. தொழில்நுட்ப திறன்களுக்கு ஒழுக்கமும் கடின உழைப்பும் மிக அவசியம்.",
      fullText_hi: "अमन, हकीकत यह है कि यह सिर्फ लैपटॉप का काम नहीं है; 60% समय आपको वर्कशॉप में टूल्स, हाई-वोल्टेज बैटरी सुरक्षा और भारी वायरिंग पर पसीना बहाना होगा। रमेश जी, आपका संशय सही था—तकनीकी काम में अनुशासन जरूरी है। लेकिन यही व्यावहारिक मेहनत 2 साल बाद अमन को एक सक्षम प्लांट स्पेशलिस्ट बनाती है।",
      fullText_en: "Aman, the reality is that 60% of your training involves physical tools, high-voltage battery safety, and shopfloor sweat—not just laptops. Ramesh-ji, your skepticism was completely valid. But this rigorous practical grounding is exactly what transforms Aman into a capable plant specialist in 2 years.",
      fullText_mr: "अमन, वस्तुस्थिती अशी आहे की ६०% वेळ तुम्हाला वर्कशॉपमध्ये टूल्स, हाय-व्होल्टेज बॅटरी सुरक्षा आणि वायरिंगवर घाम गाळावा लागेल. रमेशजी, तुमचा संशय योग्य होता—तांत्रिक कामात शिस्त आवश्यक आहे. पण हीच व्यावहारिक मेहनत २ वर्षांनंतर अमनला सक्षम प्लांट स्पेशलिस्ट बनवते.",
      fullText_bn: "আমান, বাস্তবতা হলো প্রশিক্ষণের ৬০% সময় ওয়ার্কশপে যন্ত্রপাতি, হাই-ভোল্টেজ ব্যাটারি নিরাপত্তা ও ভারী ওয়্যারিংয়ে পরিশ্রম করতে হবে। রমেশ বাবু, আপনার সন্দেহ সঠিক ছিল—কারিগরি কাজে শৃঙ্খলা জরুরি। তবে এই বাস্তব অভিজ্ঞতাই ২ বছর পর আমানকে দক্ষ স্পেশালিস্টে রূপান্তর করবে।",
      fullText_ta: "அமன், உண்மையிலேயே 60% நேரம் நீங்கள் பணிமனையில் கருவிகள், உயர் மின்னழுத்த பேட்டரி பாதுகாப்பு மற்றும் வயரிங்கில் உழைக்க வேண்டும். ரமேஷ் அவர்களே, உங்கள் சந்தேகம் சரியானது—தொழில்நுட்ப வேலையில் ஒழுக்கம் அவசியம். ஆனால் இந்த நடைமுறை உழைப்பே 2 ஆண்டுகளுக்குப் பிறகு அமனை ஒரு சிறந்த நிபுணராக்குகிறது.",
      audioDuration: "0:25",
      verifiedFactMetric: {
        label: "प्रैक्टिकल वर्कशॉप अनुपात",
        label_hi: "प्रैक्टिकल वर्कशॉप अनुपात",
        label_en: "Practical Workshop Ratio",
        label_mr: "प्रात्यक्षिक कार्यशाळा प्रमाण",
        label_bn: "ব্যবহারিক ওয়ার্কশপ অনুপাত",
        label_ta: "செய்முறை பணிமனை விகிதம்",
        value: "70% प्रैक्टिकल + 30% थ्योरी (कठोर उपस्थिति अनिवार्य)",
        value_hi: "70% प्रैक्टिकल + 30% थ्योरी (कठोर उपस्थिति अनिवार्य)",
        value_en: "70% Practical + 30% Theory (Strict Attendance Mandatory)",
        value_mr: "७०% प्रात्यक्षिक + ३०% थिअरी (कठोर उपस्थिती अनिवार्य)",
        value_bn: "৭০% প্র্যাকটিক্যাল + ৩০% থিওরি (কঠোর উপস্থিতি বাধ্যতামূলক)",
        value_ta: "70% செய்முறை + 30% கோட்பாடு (கட்டாய வருகை பதிவு)",
        auditRef: "DGT NCVET Curriculum Standard 2024",
        auditRef_hi: "DGT NCVET पाठ्यचर्या मानक 2024",
        auditRef_en: "DGT NCVET Curriculum Standard 2024",
        auditRef_mr: "DGT NCVET अभ्यासक्रम मानक २०२४",
        auditRef_bn: "DGT NCVET কারিকুলাম স্ট্যান্ডার্ড ২০২৪",
        auditRef_ta: "DGT NCVET பாடத்திட்ட தரநிலை 2024",
      }
    }
  },
  {
    id: "SCENARIO_PARENT_FINANCE",
    category: "PARENT_WAGE",
    initiator: "parent",
    promptChipLabel_hi: "👨🦳 रमेश: 2 साल पढ़ाई के दौरान घर का खर्च और पक्की आय का क्या?",
    promptChipLabel_en: "👨🦳 Ramesh: What about family expenses and income stability?",
    promptChipLabel_mr: "👨🦳 रमेश: २ वर्षांच्या शिक्षणादरम्यान घरचा खर्च आणि स्थिर उत्पन्नाचे काय?",
    promptChipLabel_bn: "👨🦳 রমেশ: ২ বছর পড়াশোনার সময় ঘরের খরচ ও স্থায়ী আয়ের কী হবে?",
    promptChipLabel_ta: "👨🦳 ரமேஷ்: 2 ஆண்டு படிப்பின் போது குடும்பச் செலவு மற்றும் நிலையான வருமானம் என்னவாகும்?",
    userMessage: {
      sender: "parent_ramesh",
      speakerName: "Ramesh Sharma (Father, 48)",
      text_hi: "मेरी कमाई सीमित है। अगर अमन 2 साल आईटीआई में लगा दे और फिर भी कोई पक्की आमदनी न हो, तो परिवार कर्ज में डूब जाएगा। मुझे कोई हवाई दावा नहीं, ठोस हिसाब चाहिए।",
      text_en: "My earnings are limited. If Aman spends 2 years in ITI without reliable income, our household will fall into debt. I need realistic math, not tall promises.",
      text_mr: "माझी कमाई मर्यादित आहे. जर अमनने आयटीआयमध्ये २ वर्षे घालवली आणि तरीही निश्चित उत्पन्न नसेल, तर कुटुंब कर्जात बुडेल. मला ठोस हिशोब हवा आहे.",
      text_bn: "আমার আয় সীমিত। আমান যদি আইটিআই-তে ২ বছর দেয় এবং তারপরও কোনো নিশ্চিত আয় না হয়, তবে পরিবার ঋণে ডুবে যাবে। আমার ফাঁকা প্রতিশ্রুতি নয়, বাস্তব হিসাব চাই।",
      text_ta: "என் வருமானம் குறைவு. அமன் 2 வருடங்கள் ஐடிஐ படித்து எந்தவொரு உறுதியான வருமானமும் இல்லாவிட்டால், குடும்பம் கடனில் மூழ்கிவிடும். எனக்கு வெற்று வாக்குறுதிகள் வேண்டாம், தெளிவான கணக்கு வேண்டும்.",
      audioDuration: "0:12"
    },
    arbiterResponse: {
      speakerName: "MitraSkill Arbiter (निष्पक्ष मध्यस्थ)",
      childRealityCheck_hi: "अमन, ध्यान से सुनें: आपके पिता दिन-रात मेहनत करके परिवार चलाते हैं। आप पहले दिन से बड़ी तनख्वाह की उम्मीद नहीं कर सकते। पहले वर्ष कोई बड़ी कमाई नहीं होगी, और दूसरे वर्ष का वजीफा तभी मिलेगा जब आप हर परीक्षा पास करेंगे।",
      childRealityCheck_en: "Aman, listen carefully: your father bears real financial weight. You will not earn big money on day one. Year 1 has zero commercial earnings, and Year 2 stipends require passing all semester tests without backlogs.",
      childRealityCheck_mr: "अमन, लक्षपूर्वक ऐका: तुमचे वडील रात्रंदिवस कष्ट करून कुटुंब चालवतात. पहिल्या दिवसापासून मोठ्या पगाराची अपेक्षा ठेवू नका. पहिल्या वर्षी कोणतीही कमाई होणार नाही, आणि दुसऱ्या वर्षाचे विद्यावेतन सर्व परीक्षा उत्तीर्ण झाल्यावरच मिळेल.",
      childRealityCheck_bn: "আমান, মনোযোগ দিয়ে শোনো: তোমার বাবা অনেক পরিশ্রমে পরিবার চালান। প্রথম দিন থেকেই বড় বেতনের আশা করা যাবে না। প্রথম বছরে কোনো আয় নেই, আর দ্বিতীয় বছরের স্টাইপেন্ড পেতে হলে প্রতিটি পরীক্ষায় পাস করতে হবে।",
      childRealityCheck_ta: "அமன், கவனமாகக் கேளுங்கள்: உங்கள் தந்தை குடும்பத்தை நடத்த கஷ்டப்படுகிறார். முதல் நாளிலிருந்தே பெரிய சம்பளத்தை எதிர்பார்க்க முடியாது. முதல் வருடத்தில் வருமானம் இல்லை, இரண்டாம் ஆண்டு உதவித்தொகை பெற அனைத்து தேர்வுகளிலும் தேர்ச்சி பெற வேண்டும்.",
      parentValidation_hi: "रमेश जी, आपका एक-एक रुपये का हिसाब मांगना और परिवार की सुरक्षा सोचना एक जिम्मेदार पिता का कर्तव्य है।",
      parentValidation_en: "Ramesh-ji, demanding strict financial accountability is your absolute right and duty as the head of the family.",
      parentValidation_mr: "रमेशजी, पै न पैचा हिशोब मागणे आणि कुटुंबाची सुरक्षा तपासणे हे जबाबदार वडिलांचे कर्तव्य आहे.",
      parentValidation_bn: "রমেশ বাবু, প্রতিটা টাকার হিসাব চাওয়া এবং পরিবারের নিরাপত্তা নিশ্চিত করা একজন দায়িত্বশীল পিতার কর্তব্য।",
      parentValidation_ta: "ரமேஷ் அவர்களே, குடும்பத்தின் பாதுகாப்பு மற்றும் நிதிக் கணக்குகளைக் கேட்பது ஒரு பொறுப்பான தந்தையின் கடமையாகும்.",
      fullText_hi: "रमेश जी, परिवार के बजट और जोखिम को लेकर आपकी फिक्र 100% जायज है। अमन, आपको समझना होगा कि पहले साल कोई कमाई नहीं होगी; पूरी लगन से पढ़ना होगा। दूसरे साल NAPS के तहत ₹9,500/माह अप्रेंटिसशिप वजीफा मिलता है, और कोर्स पूरा होने पर मेरठ में शुरुआती वेतन ₹18,500 से ₹24,500 है। यह रातोंरात अमीर बनने का जरिया नहीं, बल्कि एक सुरक्षित सीढ़ी है।",
      fullText_en: "Ramesh-ji, your financial vigilance is 100% justified. Aman, understand that Year 1 offers zero income; you must study diligently. In Year 2, NAPS apprenticeships offer ₹9,500/month, leading to audited starting wages of ₹18,500 - ₹24,500 in Meerut. This is not get-rich-quick; it is a stable, stepwise career.",
      fullText_mr: "रमेशजी, कुटुंबाचे बजेट आणि धोक्याबद्दल तुमची काळजी १००% रास्त आहे. अमन, तुम्हाला समजून घ्यावे लागेल की पहिल्या वर्षी कोणतीही कमाई होणार नाही; दुसऱ्या वर्षी NAPS अंतर्गत ₹९,५००/महिना विद्यावेतन मिळेल आणि मेरठमध्ये सुरुवातीचा पगार ₹१८,५०० ते ₹२४,५०० आहे. ही एक सुरक्षित आणि स्थिर शिडी आहे.",
      fullText_bn: "রমেশ বাবু, পরিবারের বাজেট নিয়ে আপনার চিন্তা শতভাগ যৌক্তিক। আমান, তোমাকে বুঝতে হবে প্রথম বছর কোনো আয় নেই; দ্বিতীয় বছর NAPS-এর অধীনে মাসে ₹৯,৫০০ ভাতা এবং কোর্স শেষে শুরুতে ₹১৮,৫০০ থেকে ₹২৪,৫০০ বেতন মিলবে। এটি রাতারাতি ধনী হওয়ার নয়, একটি সুরক্ষিত ভবিষ্যৎ গড়ার পথ।",
      fullText_ta: "ரமேஷ் அவர்களே, குடும்ப பட்ஜெட் பற்றிய உங்கள் அக்கறை 100% நியாயமானது. அமன், முதல் ஆண்டில் வருமானம் இல்லை என்பதை உணருங்கள். இரண்டாம் ஆண்டில் NAPS மூலம் மாதம் ₹9,500 உதவித்தொகையும், படிப்பு முடிந்ததும் தொடக்க ஊதியமாக ₹18,500 முதல் ₹24,500 வரையும் கிடைக்கும். இது படிப்படியாக உயரும் பாதுகாப்பான பாதை.",
      audioDuration: "0:28",
      verifiedFactMetric: {
        label: "सत्यापित वित्तीय समयरेखा",
        label_hi: "सत्यापित वित्तीय समयरेखा",
        label_en: "Audited Financial Timeline",
        label_mr: "सत्यापित आर्थिक वेळापत्रक",
        label_bn: "যাচাইকৃত আর্থিক সময়সীমা",
        label_ta: "சரிபார்க்கப்பட்ட நிதி காலவரிசை",
        value: "वर्ष 1: ₹0 आय | वर्ष 2: ₹9,500/माह वजीफा | प्लेसमेंट: ₹19,500 मध्यिका",
        value_hi: "वर्ष 1: ₹0 आय | वर्ष 2: ₹9,500/माह वजीफा | प्लेसमेंट: ₹19,500 मध्यिका",
        value_en: "Year 1: ₹0 Income | Year 2: ₹9,500/mo Stipend | Placement: ₹19,500 Median",
        value_mr: "वर्ष १: ₹० उत्पन्न | वर्ष २: ₹९,५००/महिना विद्यावेतन | प्लेसमेंट: ₹१९,५०० मध्यम",
        value_bn: "১ম বছর: ₹০ আয় | ২য় বছর: ₹৯,৫০০/মাস ভাতা | প্লেসমেন্ট: ₹১৯,৫০০ গড়",
        value_ta: "ஆண்டு 1: ₹0 வருமானம் | ஆண்டு 2: ₹9,500/மாத உதவித்தொகை | வேலைவாய்ப்பு: ₹19,500 இடைநிலை",
        auditRef: "DGT Meerut Saket Tracer Study 2024",
        auditRef_hi: "DGT मेरठ साकेत ट्रेसर अध्ययन 2024",
        auditRef_en: "DGT Meerut Saket Tracer Study 2024",
        auditRef_mr: "DGT मेरठ साकेत ट्रेसर अभ्यास २०२४",
        auditRef_bn: "DGT মিরাট সাকেত ট্র্যাকার স্টাডি ২০২৪",
        auditRef_ta: "DGT மீரட் சாகேத் ஆய்வு 2024",
      }
    }
  },
  {
    id: "SCENARIO_STUDENT_EXPECTATION",
    category: "STUDENT_UNREALISTIC_EXPECTATION",
    initiator: "student",
    promptChipLabel_hi: "🧑🔧 अमन: क्या मैं 2 साल बाद सीधे ₹50,000 कमा सकता हूँ?",
    promptChipLabel_en: "🧑🔧 Aman: Can I earn ₹50,000 right after 2 years?",
    promptChipLabel_mr: "🧑🔧 अमन: २ वर्षांनंतर मला थेट ₹५०,००० पगार मिळू शकतो का?",
    promptChipLabel_bn: "🧑🔧 আমান: আমি কি ২ বছর পর সরাসরি ৫০,০০০ টাকা আয় করতে পারব?",
    promptChipLabel_ta: "🧑🔧 அமன்: 2 வருடங்களுக்குப் பிறகு உடனடியாக ₹50,000 சம்பாதிக்க முடியுமா?",
    userMessage: {
      sender: "student_aman",
      speakerName: "Aman Sharma (Student, 17)",
      text_hi: "मेरे कुछ दोस्त कहते हैं कि ईवी और ऑटोमोबाइल में भारी पैसा है। क्या आईटीआई पूरा होते ही मुझे ₹50,000 या सीनियर इंजीनियर का पद मिल सकता है?",
      text_en: "Some friends claim EV tech pays huge money. Can I get ₹50,000/month or a Senior Engineer title immediately after graduating from ITI?",
      text_mr: "माझे काही मित्र म्हणतात की ईव्ही आणि ऑटोमोबाईलमध्ये खूप पैसा आहे. आयटीआय पूर्ण झाल्यावर मला लगेच ₹५०,००० किंवा सिनिअर इंजिनिअरचे पद मिळू शकेल का?",
      text_bn: "আমার বন্ধুরা বলে ইভি প্রযুক্তিতে প্রচুর টাকা। আইটিআই পাস করলেই কি আমি মাসে ₹৫০,০০০ বা সিনিয়র ইঞ্জিনিয়ার পদ পেতে পারি?",
      text_ta: "ஈவி மற்றும் ஆட்டோமொபைல் துறையில் நிறைய பணம் இருப்பதாக நண்பர்கள் கூறுகிறார்கள். ஐடிஐ முடித்ததும் மாதம் ₹50,000 அல்லது சீனியர் இன்ஜினியர் பதவி கிடைக்குமா?",
      audioDuration: "0:09"
    },
    arbiterResponse: {
      speakerName: "MitraSkill Arbiter (निष्पक्ष मध्यस्थ)",
      childRealityCheck_hi: "अमन, यह कोरी अफवाह है। आईटीआई के तुरंत बाद कोई ₹50,000 नहीं देता। आपकी शुरुआत 'जूनियर तकनीशियन' या 'ट्रेनी' के रूप में ₹18,500 से ₹24,500 के बीच होगी। ₹50,000 तक पहुँचने के लिए कम से कम 4-5 साल का अनुभव, प्लांट ओवरटाइम और NCrF के तहत पॉलिटेक्निक डिप्लोमा पूरा करना होगा।",
      childRealityCheck_en: "Aman, that is completely unrealistic. No plant pays an ITI fresher ₹50,000. You start as a Junior Technician at ₹18,500 - ₹24,500. Reaching ₹50,000 requires 4-5 years of real plant performance and finishing your lateral Polytechnic Diploma under NCrF.",
      childRealityCheck_mr: "अमन, ही निव्वळ अफवा आहे. आयटीआय पूर्ण झाल्यावर लगेच कुणीही ₹५०,००० देत नाही. तुमची सुरुवात 'ज्युनिअर टेक्निशियन' म्हणून ₹१८,५०० ते ₹२४,५०० दरम्यान होईल. ₹५०,००० पर्यंत पोहोचण्यासाठी ४-५ वर्षांचा अनुभव आणि NCrF अंतर्गत पॉलिटेक्निक डिप्लोमा पूर्ण करावा लागेल.",
      childRealityCheck_bn: "আমান, এটা অবাস্তব কথা। আইটিআই-এর পরেই কেউ ₹৫০,০০০ দেয় না। জুনিয়র টেকনিশিয়ান হিসেবে শুরু হবে ₹১৮,৫০০ থেকে ₹২৪,৫০০-তে। ₹৫০,০০০ পৌঁছাতে ৪-৫ বছরের প্ল্যান্ট অভিজ্ঞতা এবং NCrF-এর অধীনে পলিটেকনিক ডিপ্লোমা লাগবে।",
      childRealityCheck_ta: "அமன், இது உண்மைக்கு புறம்பானது. ஐடிஐ முடிந்த உடனேயே ₹50,000 யாரும் தர மாட்டார்கள். நீங்கள் ஜூனியர் டெக்னீஷியனாக ₹18,500 முதல் ₹24,500 வரை தொடங்குவீர்கள். ₹50,000 அடைய 4-5 வருட அனுபவமும் NCrF மூலம் டிப்ளமோவும் தேவை.",
      parentValidation_hi: "रमेश जी, आपके बेटे को ऐसे भ्रामक दावों से बचाना जरूरी था। इसलिए आपके द्वारा पूछे गए सवाल बहुत महत्वपूर्ण थे।",
      parentValidation_en: "Ramesh-ji, grounding Aman against internet hype is essential, and your skepticism was entirely accurate.",
      parentValidation_mr: "रमेशजी, मुलाला अशा भ्रामक दाव्यांपासून सावध ठेवणे गरजेचे होते, त्यामुळे तुमचे प्रश्न अत्यंत महत्त्वाचे होते.",
      parentValidation_bn: "রমেশ বাবু, ছেলেকে ইন্টারনেটের মিথ্যা প্রচার থেকে মুক্ত রাখা জরুরি ছিল, আপনার প্রশ্ন অত্যন্ত সময়োপযোগী ছিল।",
      parentValidation_ta: "ரமேஷ் அவர்களே, அமனை போலி விளம்பரங்களிலிருந்து காப்பாற்ற உங்கள் சந்தேகங்கள் மிகவும் அவசியமானவை.",
      fullText_hi: "अमन, सीधे ₹50,000 मिलना नामुमकिन है। शुरुआती पद जूनियर तकनीशियन का होता है जिसका वेतन ₹18,500 से ₹24,500 है। वहाँ तक पहुँचने के लिए आपको 4 साल का कड़ा अनुभव और NCrF के जरिए पॉलिटेक्निक डिप्लोमा पूरा करना पड़ेगा। रमेश जी, आपका बेटे को जमीनी हकीकत दिखाना बिल्कुल सही निर्णय था।",
      fullText_en: "Aman, expecting ₹50,000 immediately is impossible. You start as an entry-level technician earning ₹18,500 to ₹24,500. Reaching higher income demands 4 years of proven plant track record and lateral diploma completion. Ramesh-ji, keeping your son anchored in ground reality was the right move.",
      fullText_mr: "अमन, थेट ₹५०,००० मिळणे अशक्य आहे. सुरुवातीचे पद ज्युनिअर टेक्निशियनचे असते ज्याचा पगार ₹१८,५०० ते ₹२४,५०० आहे. तिथपर्यंत पोहोचण्यासाठी ४ वर्षांचा प्रत्यक्ष अनुभव आणि NCrF द्वारे पॉलिटेक्निक डिप्लोमा पूर्ण करावा लागेल. रमेशजी, मुलाला जमिनीवरील वास्तव दाखवणे अगदी योग्य होते.",
      fullText_bn: "আমান, সরাসরি ₹৫০,০০০ পাওয়া অসম্ভব। এন্ট্রি লেভেল টেকনিশিয়ান হিসেবে বেতন হবে ₹১৮,৫০০ থেকে ₹২৪,৫০০। উচ্চ বেতনে পৌঁছাতে ৪ বছরের প্রমাণিত অভিজ্ঞতা ও ডিপ্লোমা লাগবে। রমেশ বাবু, ছেলেকে বাস্তববাদী রাখা সঠিক সিদ্ধান্ত ছিল।",
      fullText_ta: "அமன், உடனடியாக ₹50,000 சம்பளம் சாத்தியமில்லை. தொடக்க சம்பளம் ₹18,500 முதல் ₹24,500 வரை இருக்கும். உயர் வருமானத்தை எட்ட 4 வருட அனுபவமும் லேட்டரல் டிப்ளமோவும் தேவை. ரமேஷ் அவர்களே, மகனை தரைமட்ட எதார்த்தத்தில் வைத்திருப்பது மிகச் சரி.",
      audioDuration: "0:26",
      verifiedFactMetric: {
        label: "वास्तविक वेतन प्रगति",
        label_hi: "वास्तविक वेतन प्रगति",
        label_en: "Realistic Wage Trajectory",
        label_mr: "वास्तविक वेतन प्रगती",
        label_bn: "বাস্তবসম্মত বেতন কাঠামো",
        label_ta: "எதார்த்த ஊதிய உயர்வு",
        value: "प्रवेश: ₹18.5k–₹24.5k | 3 वर्ष बाद: ₹32k–₹38k | 5 वर्ष (डिप्लोमा बाद): ₹50k+",
        value_hi: "प्रवेश: ₹18.5k–₹24.5k | 3 वर्ष बाद: ₹32k–₹38k | 5 वर्ष (डिप्लोमा बाद): ₹50k+",
        value_en: "Entry: ₹18.5k–₹24.5k | Year 3: ₹32k–₹38k | Year 5 (Post-Diploma): ₹50k+",
        value_mr: "प्रवेश: ₹१८.५k–₹२४.५k | ३ वर्षांनंतर: ₹३२k–₹३८k | ५ वर्षे (डिप्लोमानंतर): ₹५०k+",
        value_bn: "শুরুতে: ₹১৮.৫k–₹২৪.৫k | ৩ বছর পর: ₹৩২k–₹৩৮k | ৫ বছর (ডিপ্লোমার পর): ₹৫০k+",
        value_ta: "தொடக்க நிலை: ₹18.5k–₹24.5k | 3 ஆண்டுகளுக்குப் பின்: ₹32k–₹38k | 5 ஆண்டுகள் (டிப்ளமோவுக்குப் பின்): ₹50k+",
        auditRef: "Automotive Skills Development Council (ASDC) Trajectory",
        auditRef_hi: "ASDC ऑटोमोटिव स्किल काउंसिल डेटा 2024",
        auditRef_en: "ASDC Automotive Skill Council Data 2024",
        auditRef_mr: "ASDC ऑटोमोटिव्ह स्किल कौन्सिल डेटा २०२४",
        auditRef_bn: "ASDC অটোমোটিভ স্কিল কাউন্সিল ডেটা ২০২৪",
        auditRef_ta: "ASDC ஆட்டோமோட்டிவ் ஸ்கில் கவுன்சில் தரவு 2024",
      }
    }
  },
  {
    id: "SCENARIO_PARENT_STIGMA",
    category: "PARENT_STIGMA",
    initiator: "parent",
    promptChipLabel_hi: "👨🦳 रमेश: रिश्तेदार इसे छोटा काम कहेंगे, इज्जत का क्या?",
    promptChipLabel_en: "👨🦳 Ramesh: Relatives will call this inferior work, what about respect?",
    promptChipLabel_mr: "👨🦳 रमेश: नातेवाईक याला लहान काम म्हणतील, प्रतिष्ठेचे काय?",
    promptChipLabel_bn: "👨🦳 রমেশ: আত্মীয়রা বলবে মেকানিকের কাজ, সম্মানের কী হবে?",
    promptChipLabel_ta: "👨🦳 ரமேஷ்: சொந்தக்காரர்கள் இதை தாழ்வான வேலை என்பார்கள், கௌரவம் என்னவாகும்?",
    userMessage: {
      sender: "parent_ramesh",
      speakerName: "Ramesh Sharma (Father, 48)",
      text_hi: "हमारे खानदान में सब बीए करते हैं। अगर अमन आईटीआई जाएगा, तो लोग कहेंगे कि लड़का मैकेनिक बन गया, शादी-ब्याह में भी बात बिगड़ेगी।",
      text_en: "Everyone in our community does a BA. If Aman goes to ITI, people will say he became a mechanic, affecting his standing in the marriage market.",
      text_mr: "आमच्या कुटुंबात सगळे बीए करतात. जर अमन आयटीआयला गेला, तर लोक म्हणतील की मुलगा मेकॅनिक झाला, लग्नाच्या वेळीही अडचण येईल.",
      text_bn: "আমাদের বংশে সবাই বিএ পাস করে। আমান আইটিআই-তে গেলে লোকে বলবে মেকানিক হয়েছে, বিয়ের বাজারেও সমস্যা হবে।",
      text_ta: "எங்கள் குடும்பத்தில் அனைவரும் பி.ஏ படிக்கிறார்கள். அமன் ஐடிஐ சென்றால் மெக்கானிக் ஆகிவிட்டான் என்பார்கள், திருமண வரனிலும் சிக்கல் வரும்.",
      audioDuration: "0:11"
    },
    arbiterResponse: {
      speakerName: "MitraSkill Arbiter (निष्पक्ष मध्यस्थ)",
      childRealityCheck_hi: "अमन, समाज में सम्मान सिर्फ डिग्री के नाम से नहीं, बल्कि आपके आचरण, हुनर और परिवार की आर्थिक जिम्मेदारी उठाने से मिलता है। आपको अपने काम पर गर्व करना होगा और साबित करना होगा।",
      childRealityCheck_en: "Aman, dignity comes from real competence, self-reliance, and supporting your family—not an unemployed degree. You have to take pride in precision technical work.",
      childRealityCheck_mr: "अमन, समाजात मान फक्त पदवीच्या नावाने नव्हे, तर तुमच्या कौशल्याने आणि कुटुंबाची जबाबदारी पेलल्याने मिळतो. कामाचा अभिमान बाळगावा लागेल.",
      childRealityCheck_bn: "আমান, সমাজে সম্মান কেবল ডিগ্রির নামে মেলে না, নিজের কর্মদক্ষতা এবং পরিবারের দায়িত্ব গ্রহণের মাধ্যমে আসে। কারিগরি দক্ষতায় গর্বিত হতে হবে।",
      childRealityCheck_ta: "அமன், கௌரவம் என்பது வெற்று பட்டத்தால் வருவதில்லை, உங்கள் நிஜமான திறமை மற்றும் குடும்பத்தை ஆதரிப்பதன் மூலமே வருகிறது.",
      parentValidation_hi: "रमेश जी, समाज और बिरादरी में प्रतिष्ठा की चिंता हर पिता को होती है; आपकी यह चिंता स्वाभाविक है।",
      parentValidation_en: "Ramesh-ji, caring about your family's social standing and your son's marriage prospects is natural for any father.",
      parentValidation_mr: "रमेशजी, नातेवाईक आणि समाजात प्रतिष्ठेची काळजी प्रत्येक वडिलांना असते; तुमची ही चिंता स्वाभाविक आहे.",
      parentValidation_bn: "রমেশ বাবু, পরিবার ও সমাজে সম্মানের চিন্তা প্রতিটি অভিভাবকের থাকে; আপনার উদ্বেগ স্বাভাবিক।",
      parentValidation_ta: "ரமேஷ் அவர்களே, சமூக அந்தஸ்து மற்றும் திருமணம் பற்றிய உங்கள் கவலை முற்றிலும் இயல்பானது.",
      fullText_hi: "रमेश जी, सामाजिक प्रतिष्ठा और विवाह की चिंता हर अभिभावक को होती है। लेकिन बिना नौकरी की बीए डिग्री की तुलना में टाटा मोटर्स या हीरो में वर्दी, आई-कार्ड और पीएफ/ईएसआई के साथ ₹22,000 कमाने वाले तकनीशियन की इज्जत आज कहीं ज्यादा है। अमन, आपको भी सड़क किनारे के ढर्रे से अलग, आधुनिक प्रमाणित विशेषज्ञ बनकर अपने पिता का सिर गर्व से ऊंचा करना होगा।",
      fullText_en: "Ramesh-ji, caring about community standing is natural. But compared to an unemployed BA, a certified plant specialist with a company ID, uniform, and ₹22,000 salary carries far higher real respect today. Aman, you must conduct yourself with professional precision to make your father proud.",
      fullText_mr: "रमेशजी, सामाजिक प्रतिष्ठा आणि विवाहाची काळजी प्रत्येक पालकाला असते. पण नोकरी नसलेल्या बीए पदवीच्या तुलनेत नामांकित प्लांटमध्ये गणवेश, ओळखपत्र आणि पीएफ/ईएसआयसह ₹२२,००० कमावणाऱ्या तंत्रज्ञाचा आदर आज जास्त आहे. अमन, तुम्हालाही प्रमाणित तज्ज्ञ बनून वडिलांचा मान वाढवावा लागेल.",
      fullText_bn: "রমেশ বাবু, সামাজিক সম্মানের চিন্তা স্বাভাবিক। কিন্তু বেকার বিএ পাসের চেয়ে টাটা মোটরসে ইউনিফর্ম, পরিচয়পত্র ও ₹২২,০০০ বেতনের টেকনিশিয়ানের সম্মান আজ অনেক বেশি। আমান, তোমাকেও আধুনিক স্পেশালিস্ট হয়ে বাবার সম্মান উজ্জ্বল করতে হবে।",
      fullText_ta: "ரமேஷ் அவர்களே, சமூக மதிப்பு பற்றிய கவலை நியாயமானது. ஆனால் வேலையில்லாத பி.ஏ பட்டதாரியை விட, டாடா மோட்டார்ஸில் சீருடை மற்றும் ₹22,000 சம்பளம் பெறும் ஒரு சான்றளிக்கப்பட்ட தொழில்நுட்ப வல்லுநருக்கு இன்று அதிக மரியாதை உண்டு. அமன், உங்கள் தந்தையை பெருமைப்படுத்தும் வகையில் பணியாற்ற வேண்டும்.",
      audioDuration: "0:29",
      verifiedFactMetric: {
        label: "डिग्री समकक्षता",
        label_hi: "डिग्री समकक्षता",
        label_en: "Academic Degree Equivalence",
        label_mr: "पदवी सममूल्यता",
        label_bn: "ডিগ্রি সমতুল্যতা",
        label_ta: "கல்வித் தகுதி சமநிலை",
        value: "NCrF Level 4 (80 क्रेडिट्स) = सीधे पॉलिटेक्निक 2nd ईयर में लेटरल एंट्री",
        value_hi: "NCrF Level 4 (80 क्रेडिट्स) = सीधे पॉलिटेक्निक 2nd ईयर में लेटरल एंट्री",
        value_en: "NCrF Level 4 (80 Credits) = Direct Lateral Entry to Polytechnic 2nd Year",
        value_mr: "NCrF लेव्हल ४ (८० क्रेडिट्स) = थेट पॉलिटेक्निक दुसऱ्या वर्षात लॅटरल प्रवेश",
        value_bn: "NCrF লেভেল ৪ (৮০ ক্রেডিট) = সরাসরি পলিটেকনিক ২য় বর্ষে ল্যাটারাল এন্ট্রি",
        value_ta: "NCrF நிலை 4 (80 கிரெடிட்கள்) = பாலிடெக்னிக் 2-ஆம் ஆண்டில் நேரடி சேர்க்கை",
        auditRef: "NEP 2020 Gazette Notification",
        auditRef_hi: "NEP 2020 राजपत्र अधिसूचना",
        auditRef_en: "NEP 2020 Gazette Notification",
        auditRef_mr: "NEP २०२० राजपत्र अधिसूचना",
        auditRef_bn: "NEP ২০২০ গেজেট বিজ্ঞপ্তি",
        auditRef_ta: "NEP 2020 அரசிதழ் அறிவிப்பு",
      }
    }
  }
];

export function getScenarioPromptLabel(s: BalancedDyadicTurn, lang: SupportedLanguage): string {
  if (lang === "en") return s.promptChipLabel_en;
  if (lang === "mr") return s.promptChipLabel_mr || s.promptChipLabel_hi;
  if (lang === "bn") return s.promptChipLabel_bn || s.promptChipLabel_hi;
  if (lang === "ta") return s.promptChipLabel_ta || s.promptChipLabel_hi;
  return s.promptChipLabel_hi;
}

export function getScenarioUserText(s: BalancedDyadicTurn, lang: SupportedLanguage): string {
  if (lang === "en") return s.userMessage.text_en;
  if (lang === "mr") return s.userMessage.text_mr || s.userMessage.text_hi;
  if (lang === "bn") return s.userMessage.text_bn || s.userMessage.text_hi;
  if (lang === "ta") return s.userMessage.text_ta || s.userMessage.text_hi;
  return s.userMessage.text_hi;
}

export function getScenarioChildRealityCheck(s: BalancedDyadicTurn, lang: SupportedLanguage): string {
  if (lang === "en") return s.arbiterResponse.childRealityCheck_en;
  if (lang === "mr") return s.arbiterResponse.childRealityCheck_mr || s.arbiterResponse.childRealityCheck_hi;
  if (lang === "bn") return s.arbiterResponse.childRealityCheck_bn || s.arbiterResponse.childRealityCheck_hi;
  if (lang === "ta") return s.arbiterResponse.childRealityCheck_ta || s.arbiterResponse.childRealityCheck_hi;
  return s.arbiterResponse.childRealityCheck_hi;
}

export function getScenarioParentValidation(s: BalancedDyadicTurn, lang: SupportedLanguage): string {
  if (lang === "en") return s.arbiterResponse.parentValidation_en;
  if (lang === "mr") return s.arbiterResponse.parentValidation_mr || s.arbiterResponse.parentValidation_hi;
  if (lang === "bn") return s.arbiterResponse.parentValidation_bn || s.arbiterResponse.parentValidation_hi;
  if (lang === "ta") return s.arbiterResponse.parentValidation_ta || s.arbiterResponse.parentValidation_hi;
  return s.arbiterResponse.parentValidation_hi;
}

export function getScenarioFullText(s: BalancedDyadicTurn, lang: SupportedLanguage): string {
  if (lang === "en") return s.arbiterResponse.fullText_en;
  if (lang === "mr") return s.arbiterResponse.fullText_mr || s.arbiterResponse.fullText_hi;
  if (lang === "bn") return s.arbiterResponse.fullText_bn || s.arbiterResponse.fullText_hi;
  if (lang === "ta") return s.arbiterResponse.fullText_ta || s.arbiterResponse.fullText_hi;
  return s.arbiterResponse.fullText_hi;
}

export interface LocalizedFactMetric {
  label: string;
  value: string;
  auditRef: string;
}

export function getScenarioVerifiedFactMetric(
  s: BalancedDyadicTurn,
  lang: SupportedLanguage
): LocalizedFactMetric | undefined {
  const m = s.arbiterResponse.verifiedFactMetric;
  if (!m) return undefined;

  let label = m.label;
  let value = m.value;
  let auditRef = m.auditRef;

  if (lang === "en") {
    label = m.label_en || m.label;
    value = m.value_en || m.value;
    auditRef = m.auditRef_en || m.auditRef;
  } else if (lang === "mr") {
    label = m.label_mr || m.label_hi || m.label;
    value = m.value_mr || m.value_hi || m.value;
    auditRef = m.auditRef_mr || m.auditRef_hi || m.auditRef;
  } else if (lang === "bn") {
    label = m.label_bn || m.label_hi || m.label;
    value = m.value_bn || m.value_hi || m.value;
    auditRef = m.auditRef_bn || m.auditRef_hi || m.auditRef;
  } else if (lang === "ta") {
    label = m.label_ta || m.label_hi || m.label;
    value = m.value_ta || m.value_hi || m.value;
    auditRef = m.auditRef_ta || m.auditRef_hi || m.auditRef;
  } else {
    label = m.label_hi || m.label;
    value = m.value_hi || m.value;
    auditRef = m.auditRef_hi || m.auditRef;
  }

  return { label, value, auditRef };
}
