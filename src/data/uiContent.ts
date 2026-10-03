import { SupportedLanguage } from "../context/LanguageVoiceContext";

export interface PageContent {
  nav: {
    brandSubtitle: string;
    appGuide: string;
    liveCounselor: string;
    adminConsole: string;
    familyFlow: string;
    whatsappDemo: string;
  };
  home: {
    badge: string;
    headline: string;
    subheadline: string;
    audioBtn: string;
    districtFilterLabel: string;
    classFilterLabel: string;
    studentCard: {
      role: string;
      name: string;
      tag: string;
      schooling: string;
      interests: string;
      aptitudeBtn: string;
    };
    parentCard: {
      role: string;
      name: string;
      tag: string;
      occupation: string;
      concerns: string;
      status: string;
    };
    startBtn: string;
    studentOnlyLink: string;
    parentOnlyLink: string;
  };
  counsel: {
    stepBadge: string;
    divergenceBadge: string;
    districtTag: string;
    studentMessage: string;
    parentMessage: string;
    arbiterTitle: string;
    verifiedAuditTag: string;
    arbiterReassurance: string;
    salaryCardTitle: string;
    salaryCardValue: string;
    salaryCardSource: string;
    placementCardTitle: string;
    placementCardValue: string;
    placementCardRecruiters: string;
    audioBtn: string;
    mobilityBtn: string;
    roiBtn: string;
    alumniBtn: string;
    facilityBtn: string;
    seatsBtn: string;
    mathBtn: string;
    chips: {
      salary: string;
      stigma: string;
      safety: string;
    };
    studentMicBtn: string;
    parentMicBtn: string;
  };
  mobility: {
    stepBadge: string;
    title: string;
    subtitle: string;
    listenBtn: string;
    stages: {
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
    };
    creditMathTitle: string;
    creditMathFormula: string;
    creditMathDesc: string;
    matrixTitle: string;
    backBtn: string;
    generateAccordBtn: string;
  };
  accord: {
    stepBadge: string;
    officialTitle: string;
    subTitle: string;
    docIdLabel: string;
    partiesTitle: string;
    candidateLabel: string;
    parentLabel: string;
    tradeLabel: string;
    centerLabel: string;
    termsTitle: string;
    term1: string;
    term2: string;
    term3: string;
    term4: string;
    verifiedSeal: string;
    downloadBtn: string;
    shareBtn: string;
    adminLink: string;
  };
  admin: {
    title: string;
    subtitle: string;
    kpiSessions: string;
    kpiConsensus: string;
    kpiShift: string;
    kpiTopFriction: string;
    exportBtn: string;
    heatmapTitle: string;
    breakdownTitle: string;
  };
}

export const UI_CONTENT: Record<SupportedLanguage, PageContent> = {
  en: {
    nav: {
      brandSubtitle: "AI Vocational Arbiter & Family Decision Support",
      appGuide: "App Guide",
      liveCounselor: "Live ITI Counsellor",
      adminConsole: "Admin Console",
      familyFlow: "Family Flow",
      whatsappDemo: "WhatsApp Demo"
    },
    home: {
      badge: "Skill India Mission • MSDE Pilot Hub",
      headline: "Resolve Vocational Career Hesitation Together as a Family",
      subheadline: "Empowering student aspiration while reassuring parent socio-economic concerns with verified Ministry administrative data.",
      audioBtn: "Listen to 1-Min Audio Overview",
      districtFilterLabel: "District Focus:",
      classFilterLabel: "Education Level:",
      studentCard: {
        role: "Student (Candidate)",
        name: "Aman Sharma (Age 17)",
        tag: "Technical & Diagnostic Aspirant",
        schooling: "Class 10th Pass (58% Aggregate)",
        interests: "Passionate about modern automotive electronics, robotics, and EV batteries.",
        aptitudeBtn: "🎧 Discover Practical Aptitude (Voice Quiz)"
      },
      parentCard: {
        role: "Parent / Guardian",
        name: "Ramesh Sharma (Father, 48)",
        tag: "Primary Family Decision-Maker",
        occupation: "Agricultural Worker & Retail Shopkeeper",
        concerns: "Worried about starting pay, roadside repair stigma, and marriage perception.",
        status: "Reservation Wage: ₹20,000 / month"
      },
      startBtn: "Start Joint Family Counselling Session",
      studentOnlyLink: "Student-Only Exploration",
      parentOnlyLink: "Parent-Only Reassurance Room"
    },
    counsel: {
      stepBadge: "Step 2: Dyadic Dialogue (Dual-Perspective Arbitration)",
      divergenceBadge: "Family Divergence (Δ_dyad)",
      districtTag: "District: Meerut, UP (Audited Industrial Corridor)",
      studentMessage: "Papa, I want to join ITI Automotive Mechatronics. I like modern vehicle electronics and EV computer diagnostics.",
      parentMessage: "Car repair is roadside mechanic work with no social standing. Relatives will mock us. You should do a regular BA degree and sit for government clerk exams.",
      arbiterTitle: "MitraSkill Career Arbiter",
      verifiedAuditTag: "Verified DGT 2024 Tracer Audit",
      arbiterReassurance: "Ramesh-ji, your concern about social respect and income is completely natural. However, modern Automotive Mechatronics is NOT roadside mechanic work; it is cleanroom computerized diagnostics for electric vehicles.",
      salaryCardTitle: "Starting Salary Range",
      salaryCardValue: "₹18,500 - ₹24,500 / month",
      salaryCardSource: "DGT Graduate Tracer Study",
      placementCardTitle: "Verified Campus Placement",
      placementCardValue: "88.4%",
      placementCardRecruiters: "Top Recruiters: Tata Motors, Uno Minda",
      audioBtn: "Listen Guidance",
      mobilityBtn: "View Degree Mobility (NCrF Ladder) →",
      roiBtn: "📊 Parent ROI Calculator (BA vs ITI)",
      alumniBtn: "🎬 Local Alumni Stories (Reels)",
      facilityBtn: "🏢 Verify Center & Safety",
      seatsBtn: "📍 Nearby Seats & Apprenticeships",
      mathBtn: "Consensus Math Inspector 🔬",
      chips: {
        salary: "Salary Concern (वेतन की चिंता)",
        stigma: "Social Stigma / Relatives (सामाजिक प्रतिष्ठा)",
        safety: "Workplace Safety & Transit (सुरक्षा)"
      },
      studentMicBtn: "Speak as Aman (Student)",
      parentMicBtn: "Speak as Ramesh (Father)"
    },
    mobility: {
      stepBadge: "Step 3: Academic Mobility (Degree Equivalence)",
      title: "National Credit Framework (NCrF) Educational Mobility Pathway",
      subtitle: "Vocational training is not a dead end. Credits earned in ITI legally transfer toward University Engineering Degrees under NEP 2020.",
      listenBtn: "Listen to NCrF Rules",
      stages: {
        step1Title: "Class 10th Pass",
        step1Desc: "NSQF Level 2 • Baseline School Credential",
        step2Title: "ITI Automotive Mechatronics (2 Years)",
        step2Desc: "NSQF Level 4 • 80 NCrF Credits Earned • Exemption from Year-1 Polytechnic",
        step3Title: "Polytechnic Diploma in Engineering",
        step3Desc: "NSQF Level 5 • Direct Lateral Entry (LEET) into 2nd Year • Supervisory Role",
        step4Title: "Bachelor of Technology (B.Tech / B.Voc)",
        step4Desc: "NSQF Level 6/7 • Full Technical University Graduate • UPSC/RRB Exam Eligible"
      },
      creditMathTitle: "NCrF Credit Equivalence Formula",
      creditMathFormula: "30 Notional Learning Hours = 1 Academic Credit",
      creditMathDesc: "2-Year ITI (2,400 Hours) = 80 Credits = 100% Exemption from Polytechnic 1st Year under Government Gazette.",
      matrixTitle: "Perception vs. Legal Reality Matrix",
      backBtn: "← Back to Dialogue",
      generateAccordBtn: "Generate Parivaar Rozgar Patra (Family Accord) →"
    },
    accord: {
      stepBadge: "Step 4: Certified Family Accord",
      officialTitle: "PARIVAAR ROZGAR PATRA (परिवार रोज़गार पत्र)",
      subTitle: "Ministry of Skill Development & Entrepreneurship (MSDE) | Skill India Mission",
      docIdLabel: "Document ID:",
      partiesTitle: "Parties to Consensus",
      candidateLabel: "Candidate / Learner:",
      parentLabel: "Parent / Guardian:",
      tradeLabel: "Selected Vocation:",
      centerLabel: "Accredited Center:",
      termsTitle: "Agreed Commitments & Legal Safeguards",
      term1: "Student undertakes 24 months of specialized EV Diagnostics training with 85%+ mandatory attendance.",
      term2: "Guardian supports technical vocational skilling over conventional non-technical graduation.",
      term3: "National Credit Framework guarantees 80 credits transferable for direct Year-2 Polytechnic Diploma lateral entry.",
      term4: "Verified base compensation benchmark of ₹18,500 - ₹24,500/month as verified by DGT 2024 Regional Tracer Audit.",
      verifiedSeal: "NCVET Accredited • Skill India Official Milestone",
      downloadBtn: "Download PDF Certificate",
      shareBtn: "Share via WhatsApp",
      adminLink: "View Scheme Admin Telemetry →"
    },
    admin: {
      title: "MSDE Scheme Administrator Telemetry Console",
      subtitle: "District-level telemetry tracking family objection taxonomy, divergence indices, and resource allocation mandates.",
      kpiSessions: "Total Dyad Sessions",
      kpiConsensus: "Consensus Rate",
      kpiShift: "Net Sentiment Shift",
      kpiTopFriction: "Primary Friction Point",
      exportBtn: "Export District Skill Plan Report (CSV)",
      heatmapTitle: "District Resistance Heatmap & Intervention Recommendations",
      breakdownTitle: "Household Objection Taxonomy Distribution"
    }
  },
  hi: {
    nav: {
      brandSubtitle: "एआई करियर मध्यस्थता एवं पारिवारिक सहमति मंच",
      appGuide: "मार्गदर्शिका",
      liveCounselor: "लाइव आईटीआई परामर्शदाता",
      adminConsole: "प्रशासन कंसोल",
      familyFlow: "पारिवारिक संवाद",
      whatsappDemo: "व्हाट्सएप डेमो"
    },
    home: {
      badge: "स्किल इंडिया मिशन • एमएसडीई पायलट हब",
      headline: "परिवार के साथ मिलकर चुनें सुरक्षित तकनीकी भविष्य",
      subheadline: "छात्र की रुचि और माता-पिता के सम्मान की सुरक्षा—कौशल विकास एवं उद्यमशीलता मंत्रालय के सत्यापित आंकड़ों के साथ।",
      audioBtn: "1 मिनट में मंच का उद्देश्य सुनें",
      districtFilterLabel: "चयनित जिला:",
      classFilterLabel: "शैक्षणिक स्तर:",
      studentCard: {
        role: "छात्र (उम्मीदवार)",
        name: "अमन शर्मा (आयु 17 वर्ष)",
        tag: "तकनीकी व डायग्नोस्टिक में रुचि",
        schooling: "कक्षा 10वीं उत्तीर्ण (58% अंक)",
        interests: "आधुनिक ऑटोमोटिव इलेक्ट्रॉनिक्स, रोबोटिक्स और ईवी बैटरी तकनीक में गहरी रुचि।",
        aptitudeBtn: "🎧 व्यावहारिक योग्यता जांचें (Voice Quiz)"
      },
      parentCard: {
        role: "अभिभावक / पिता",
        name: "रमेश शर्मा (पिता, 48 वर्ष)",
        tag: "परिवार के मुख्य निर्णयकर्ता",
        occupation: "कृषि कार्य एवं ग्रामीण दुकान संचालक",
        concerns: "वेतन की अनिश्चितता, मैकेनिक कार्य की सामाजिक प्रतिष्ठा और विवाह बाजार की चिंता।",
        status: "अपेक्षित न्यूनतम वेतन: ₹20,000 / माह"
      },
      startBtn: "संयुक्त पारिवारिक परामर्श सत्र प्रारंभ करें",
      studentOnlyLink: "केवल छात्र हेतु जानकारी",
      parentOnlyLink: "केवल अभिभावक हेतु शंका-समाधान"
    },
    counsel: {
      stepBadge: "चरण 2: द्विपक्षीय संवाद (छात्र-अभिभावक मध्यस्थता)",
      divergenceBadge: "पारिवारिक मतभेद सूचकांक (Δ_dyad)",
      districtTag: "जिला: मेरठ, उत्तर प्रदेश (ऑडिटेड औद्योगिक गलियारा)",
      studentMessage: "पापा, मैं आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स करना चाहता हूँ। मुझे आधुनिक कारों और ईवी इलेक्ट्रॉनिक्स का काम पसंद है।",
      parentMessage: "गाड़ी सुधारना सड़क किनारे मैकेनिक का काम है, इसमें कोई इज़्ज़त नहीं है। रिश्तेदार क्या कहेंगे? तुम सामान्य बीए करो और सरकारी क्लर्क की तैयारी करो।",
      arbiterTitle: "मित्रस्किल करियर मध्यस्थ (AI Arbiter)",
      verifiedAuditTag: "डीजीटी 2024 सरकारी ऑडिट प्रमाणित",
      arbiterReassurance: "रमेश जी, आपका सामाजिक सम्मान और आय की चिंता करना बिल्कुल स्वाभाविक है। लेकिन आधुनिक ऑटोमोटिव मेकाट्रॉनिक्स सड़क किनारे का काम नहीं है; यह इलेक्ट्रिक वाहनों की कंप्यूटर जांच का तकनीकी पेशा है।",
      salaryCardTitle: "शुरुआती मासिक वेतन",
      salaryCardValue: "₹18,500 - ₹24,500 / माह",
      salaryCardSource: "डीजीटी ग्रेजुएट ट्रेसर स्टडी",
      placementCardTitle: "सत्यापित कैंपस प्लेसमेंट",
      placementCardValue: "88.4%",
      placementCardRecruiters: "प्रमुख भर्तीकर्ता: टाटा मोटर्स, उनो मिंडा",
      audioBtn: "मध्यस्थता संदेश सुनें",
      mobilityBtn: "डिग्री की सीढ़ी देखें (NCrF Ladder) →",
      roiBtn: "📊 अभिभावक वित्तीय लाभ (BA बनाम ITI)",
      alumniBtn: "🎬 सफल पूर्व-छात्र रील (मेरठ)",
      facilityBtn: "🏢 कैंपस व सुरक्षा जांचें",
      seatsBtn: "📍 निकटवर्ती सीटें व अप्रेंटिसशिप",
      mathBtn: "सहमति गणितीय विश्लेषक 🔬",
      chips: {
        salary: "वेतन की चिंता (Salary Concern)",
        stigma: "सामाजिक प्रतिष्ठा / रिश्तेदार (Social Stigma)",
        safety: "कार्यस्थल सुरक्षा व बस (Safety & Transit)"
      },
      studentMicBtn: "बोलें: अमन (छात्र)",
      parentMicBtn: "बोलें: रमेश (पिता)"
    },
    mobility: {
      stepBadge: "चरण 3: शैक्षणिक गतिशीलता (डिग्री समकक्षता)",
      title: "राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) शैक्षणिक प्रगति मार्ग",
      subtitle: "व्यावसायिक शिक्षा कोई बंद रास्ता नहीं है। एनईपी 2020 के तहत आईटीआई में अर्जित क्रेडिट सीधे विश्वविद्यालय इंजीनियरिंग डिग्री में ट्रांसफर होते हैं।",
      listenBtn: "एनसीआरएफ नियम ऑडियो में समझें",
      stages: {
        step1Title: "कक्षा 10वीं उत्तीर्ण",
        step1Desc: "NSQF लेवल 2 • बुनियादी स्कूली योग्यता",
        step2Title: "आईटीआई ऑटोमोटिव मेकाट्रॉनिक्स (2 वर्ष)",
        step2Desc: "NSQF लेवल 4 • 80 एनसीआरएफ क्रेडिट्स • पॉलिटेक्निक प्रथम वर्ष से पूर्ण छूट",
        step3Title: "राजकीय पॉलिटेक्निक इंजीनियरिंग डिप्लोमा",
        step3Desc: "NSQF लेवल 5 • द्वितीय वर्ष में सीधा लेटरल प्रवेश (LEET) • सुपरवाइजर पद",
        step4Title: "बैचलर ऑफ टेक्नोलॉजी (B.Tech / B.Voc)",
        step4Desc: "NSQF लेवल 6/7 • पूर्ण डिग्री इंजीनियर • यूपीएससी व रेलवे अधिकारी परीक्षाओं हेतु पात्र"
      },
      creditMathTitle: "एनसीआरएफ क्रेडिट समकक्षता गणित",
      creditMathFormula: "30 घंटे का प्रशिक्षण = 1 शैक्षणिक क्रेडिट",
      creditMathDesc: "2 वर्षीय आईटीआई (2,400 घंटे) = 80 क्रेडिट = सरकारी गजट के तहत पॉलिटेक्निक प्रथम वर्ष में 100% छूट।",
      matrixTitle: "सामाजिक भ्रम बनाम कानूनी वास्तविकता",
      backBtn: "← संवाद पर वापस जाएं",
      generateAccordBtn: "परिवार रोज़गार पत्र तैयार करें →"
    },
    accord: {
      stepBadge: "चरण 4: आधिकारिक पारिवारिक सहमति पत्र",
      officialTitle: "परिवार रोज़गार पत्र (PARIVAAR ROZGAR PATRA)",
      subTitle: "कौशल विकास एवं उद्यमशीलता मंत्रालय (MSDE) | स्किल इंडिया मिशन",
      docIdLabel: "दस्तावेज़ क्रमांक:",
      partiesTitle: "सहमति के पक्षकार",
      candidateLabel: "उम्मीदवार / छात्र:",
      parentLabel: "अभिभावक / पिता:",
      tradeLabel: "चयनित तकनीकी ट्रेड:",
      centerLabel: "मान्यता प्राप्त संस्थान:",
      termsTitle: "पारस्परिक प्रतिबद्धताएं एवं वैधानिक सुरक्षा",
      term1: "छात्र 85%+ उपस्थिति के साथ 24 महीने का आधुनिक ईवी डायग्नोस्टिक प्रशिक्षण पूर्ण करने का संकल्प लेता है।",
      term2: "अभिभावक सामान्य बीए की तुलना में तकनीकी कौशल शिक्षा का पूर्ण समर्थन करने पर सहमत हैं।",
      term3: "राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) 80 क्रेडिट के आधार पर पॉलिटेक्निक डिप्लोमा द्वितीय वर्ष में सीधे प्रवेश की कानूनी गारंटी देता है।",
      term4: "डीजीटी 2024 रीजनल ट्रेसर ऑडिट द्वारा ₹18,500 से ₹24,500 प्रति माह के आधार वेतन की पुष्टि की गई है।",
      verifiedSeal: "एनसीवीईटी मान्यता प्राप्त • स्किल इंडिया आधिकारिक प्रमाणपत्र",
      downloadBtn: "प्रमाणपत्र पीडीएफ डाउनलोड करें",
      shareBtn: "व्हाट्सएप पर साझा करें",
      adminLink: "प्रशासन टेलीमेट्री देखें →"
    },
    admin: {
      title: "एमएसडीई योजना प्रशासक टेलीमेट्री कंसोल",
      subtitle: "जिला स्तरीय टेलीमेट्री: पारिवारिक आपत्ति वर्गीकरण, मतभेद सूचकांक एवं संसाधन आवंटन योजना।",
      kpiSessions: "कुल परामर्श सत्र",
      kpiConsensus: "पारिवारिक सहमति दर",
      kpiShift: "सकारात्मक धारणा बदलाव",
      kpiTopFriction: "प्रमुख सामाजिक अवरोध",
      exportBtn: "जिला कौशल कार्ययोजना रिपोर्ट (CSV) डाउनलोड करें",
      heatmapTitle: "जिला प्रतिरोध हीटमैप एवं अनुशंसित नीतियां",
      breakdownTitle: "घरेलू आपत्ति वर्गीकरण वितरण"
    }
  },
  mr: {
    nav: {
      brandSubtitle: "एआय करिअर मध्यस्थी व कौटुंबिक निर्णय मंच",
      appGuide: "मार्गदर्शिका",
      liveCounselor: "थेट आयटीआय समुपदेशक",
      adminConsole: "प्रशासन कक्ष",
      familyFlow: "कौटुंबिक संवाद",
      whatsappDemo: "व्हॉट्सॲप डेमो"
    },
    home: {
      badge: "स्किल इंडिया मिशन • एमएसडीई केंद्र",
      headline: "कुटुंबासोबत मिळून निवडा उज्ज्वल तांत्रिक भविष्य",
      subheadline: "विद्यार्थ्याची आवड आणि पालकांची सामाजिक प्रतिष्ठा—कौशल्य विकास मंत्रालयाच्या अधिकृत माहितीसह.",
      audioBtn: "१ मिनिटात संपूर्ण माहिती ऐका",
      districtFilterLabel: "निवडलेला जिल्हा:",
      classFilterLabel: "शैक्षणिक स्तर:",
      studentCard: {
        role: "विद्यार्थी (उमेदवार)",
        name: "अमन शर्मा (वय १७ वर्षे)",
        tag: "तांत्रिक व डायग्नोस्टिक आवड",
        schooling: "इयत्ता १० वी उत्तीर्ण (५८% गुण)",
        interests: "आधुनिक ऑटोमोटिव्ह इलेक्ट्रॉनिक्स, रोबोटिक्स आणि ईव्ही बॅटरी तंत्रज्ञानाची आवड.",
        aptitudeBtn: "🎧 व्यावहारिक कल चाचणी (Voice Quiz)"
      },
      parentCard: {
        role: "पालक / वडील",
        name: "रमेश शर्मा (वडील, ४८ वर्षे)",
        tag: "कुटुंबाचे मुख्य निर्णयकर्ते",
        occupation: "शेती व ग्रामीण दुकान व्यवसाय",
        concerns: "वेतनाची अनिश्चितता, गॅरेजच्या कामाची प्रतिष्ठा आणि नातेवाईकांची भीती.",
        status: "अपेक्षित किमान वेतन: ₹२०,००० / महिना"
      },
      startBtn: "संयुक्त कौटुंबिक समुपदेशन सुरू करा",
      studentOnlyLink: "केवळ विद्यार्थ्यांसाठी माहिती",
      parentOnlyLink: "केवळ पालकांसाठी शंका निरसन"
    },
    counsel: {
      stepBadge: "टप्पा २: द्विपक्षीय संवाद (विद्यार्थी-पालक मध्यस्थी)",
      divergenceBadge: "कौटुंबिक मतभेद निर्देशांक (Δ_dyad)",
      districtTag: "जिल्हा: मेरठ (ऑडिट केलेला औद्योगिक कॉरिडॉर)",
      studentMessage: "बाबा, मला आयटीआय ऑटोमोटिव्ह मेकॅट्रॉनिक्स करायचे आहे. मला आधुनिक गाड्या आणि ईव्ही संगणकीय चाचणीचे काम आवडते.",
      parentMessage: "गाड्या दुरुस्त करणे म्हणजे रस्त्यावरच्या गॅरेजचे काम, यात कसली प्रतिष्ठा? नातेवाईक काय म्हणतील? तू साधी बीए पदवी कर आणि सरकारी परीक्षा दे.",
      arbiterTitle: "मित्रस्किल करिअर लवाद (AI Arbiter)",
      verifiedAuditTag: "डीजीटी २०२४ अधिकृत ऑडिट प्रमाणित",
      arbiterReassurance: "रमेशजी, सामाजिक सन्मानाची काळजी असणे स्वाभाविक आहे. मात्र आधुनिक ऑटोमोटिव्ह मेकॅट्रॉनिक्स हे रस्त्यावरील काम नसून संगणकीकृत इलेक्ट्रिक वाहनांचे तंत्रज्ञान आहे.",
      salaryCardTitle: "सुरुवातीचे मासिक वेतन",
      salaryCardValue: "₹१८,५०० - ₹२४,५०० / महिना",
      salaryCardSource: "डीजीटी ग्रॅज्युएट ट्रेसर अभ्यास",
      placementCardTitle: "अधिकृत कॅम्पस प्लेसमेंट",
      placementCardValue: "८८.४%",
      placementCardRecruiters: "प्रमुख कंपन्या: टाटा मोटर्स, उनो मिंडा",
      audioBtn: "मध्यस्थी संदेश ऐका",
      mobilityBtn: "पदवीची शिडी पहा (NCrF Ladder) →",
      roiBtn: "📊 पालक नफा-तोटा हिशोब (BA वि ITI)",
      alumniBtn: "🎬 यशस्वी माजी विद्यार्थी (Reels)",
      facilityBtn: "🏢 परिसर व सुरक्षा खात्री",
      seatsBtn: "📍 जवळचे केंद्र व शिकाऊ जागा",
      mathBtn: "गणितीय विश्लेषक 🔬",
      chips: {
        salary: "वेतनाची काळजी (Salary Concern)",
        stigma: "सामाजिक प्रतिष्ठा (Social Stigma)",
        safety: "सुरक्षा व बस सोय (Safety & Transit)"
      },
      studentMicBtn: "बोला: अमन (विद्यार्थी)",
      parentMicBtn: "बोला: रमेश (पालक)"
    },
    mobility: {
      stepBadge: "टप्पा ३: शैक्षणिक प्रगती मार्ग (पदवी समकक्षता)",
      title: "राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) शैक्षणिक शिडी",
      subtitle: "व्यावसायिक शिक्षण हे शेवटचे टोक नाही. एनईपी २०२० अंतर्गत आयटीआयमधील क्रेडिट्स थेट इंजिनिअरिंग पदवीसाठी ग्राह्य धरले जातात.",
      listenBtn: "क्रेडिट नियम ऐका",
      stages: {
        step1Title: "इयत्ता १० वी उत्तीर्ण",
        step1Desc: "NSQF स्तर २ • प्राथमिक शालेय पात्रता",
        step2Title: "आयटीआय ऑटोमोटिव्ह मेकॅट्रॉनिक्स (२ वर्षे)",
        step2Desc: "NSQF स्तर ४ • ८० क्रेडिट्स • पॉलिटेक्निकच्या पहिल्या वर्षातून पूर्ण सूट",
        step3Title: "शासकीय पॉलिटेक्निक इंजिनिअरिंग डिप्लोमा",
        step3Desc: "NSQF स्तर ५ • थेट दुसऱ्या वर्षात प्रवेश (LEET) • सुपरवायझर पद",
        step4Title: "बॅचलर ऑफ टेक्नॉलॉजी (B.Tech / B.Voc)",
        step4Desc: "NSQF स्तर ६/७ • पदवीधर इंजिनिअर • एमपीएससी व रेल्वे अधिकारी परीक्षांसाठी पात्र"
      },
      creditMathTitle: "एनसीआरएफ क्रेडिट समकक्षता गणित",
      creditMathFormula: "३० तास प्रशिक्षण = १ शैक्षणिक क्रेडिट",
      creditMathDesc: "२ वर्षांचे आयटीआय (२,४०० तास) = ८० क्रेडिट्स = शासकीय नियमानुसार पॉलिटेक्निक १ल्या वर्षातून १००% सूट.",
      matrixTitle: "सामाजिक समज विरुद्ध कायदेशीर वास्तव",
      backBtn: "← संवादावर परत जा",
      generateAccordBtn: "परिवार रोजगार पत्र तयार करा →"
    },
    accord: {
      stepBadge: "टप्पा ४: अधिकृत कौटुंबिक करार",
      officialTitle: "परिवार रोजगार पत्र (PARIVAAR ROZGAR PATRA)",
      subTitle: "कौशल्य विकास व उद्योजकता मंत्रालय (MSDE) | कौशल्य भारत अभियान",
      docIdLabel: "दस्तऐवज क्रमांक:",
      partiesTitle: "करारातील घटक",
      candidateLabel: "उमेदवार / विद्यार्थी:",
      parentLabel: "पालक / वडील:",
      tradeLabel: "निवडलेला तांत्रिक ट्रेड:",
      centerLabel: "मान्यताप्राप्त संस्था:",
      termsTitle: "परस्पर जबाबदाऱ्या आणि कायदेशीर संरक्षण",
      term1: "विद्यार्थी ८५%+ उपस्थितीसह २४ महिन्यांचे आधुनिक ईव्ही डायग्नोस्टिक प्रशिक्षण पूर्ण करेल.",
      term2: "पालक सामान्य बीए पदवीऐवजी तांत्रिक कौशल्य शिक्षणाला पूर्ण पाठिंबा देतील.",
      term3: "राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) ८० क्रेडिट्सच्या आधारे पॉलिटेक्निक डिप्लोमाच्या दुसऱ्या वर्षात थेट प्रवेशाची हमी देते.",
      term4: "डीजीटी २०२४ ऑडिटनुसार ₹१८,५०० ते ₹२४,५०० मासिक वेतन मानकाची पुष्टी केली आहे.",
      verifiedSeal: "एनसीव्हीत मान्यताप्राप्त • कौशल्य भारत अधिकृत प्रमाणपत्र",
      downloadBtn: "प्रमाणपत्र डाउनलोड करा (PDF)",
      shareBtn: "व्हॉट्सॲपवर पाठवा",
      adminLink: "प्रशासन आकडेवारी पहा →"
    },
    admin: {
      title: "एमएसडीई योजना प्रशासक डॅशबोर्ड",
      subtitle: "जिल्हास्तरीय माहिती: पालकांच्या अडचणींचे विश्लेषण आणि संसाधन वाटप नियोजन.",
      kpiSessions: "एकूण समुपदेशन सत्रे",
      kpiConsensus: "कौटुंबिक सहमती दर",
      kpiShift: "सकारात्मक बदल",
      kpiTopFriction: "मुख्य सामाजिक अडचण",
      exportBtn: "जिल्हा कौशल्य आराखडा (CSV) डाउनलोड करा",
      heatmapTitle: "जिल्हावार अडथळे आणि शिफारसी",
      breakdownTitle: "पालकांच्या शंकांचे वर्गीकरण"
    }
  },
  bn: {
    nav: {
      brandSubtitle: "এআই ক্যারিয়ার মধ্যস্থতাকারী ও পারিবারিক সিদ্ধান্ত মঞ্চ",
      appGuide: "ব্যবহার বিধি",
      liveCounselor: "লাইভ আইটিআই পরামর্শদাতা",
      adminConsole: "প্রশাসনিক প্যানেল",
      familyFlow: "পারিবারিক কথোপকথন",
      whatsappDemo: "হোয়াটসঅ্যাপ ডেমো"
    },
    home: {
      badge: "স্কিল ইন্ডিয়া মিশন • এমএসডিই নোডাল হাব",
      headline: "পরিবারের সাথে মিলে বেছে নিন সুরক্ষিত কারিগরি ভবিষ্যৎ",
      subheadline: "ছাত্রের আগ্রহ এবং অভিভাবকের সামাজিক সম্মান—দক্ষতা উন্নয়ন মন্ত্রণালয়ের যাচাইকৃত তথ্যের সাথে।",
      audioBtn: "১ মিনিটে প্ল্যাটফর্মের উদ্দেশ্য শুনুন",
      districtFilterLabel: "নির্বাচিত জেলা:",
      classFilterLabel: "শিক্ষাগত স্তর:",
      studentCard: {
        role: "ছাত্র (প্রার্থী)",
        name: "আমান শর্মা (বয়স ১৭ বছর)",
        tag: "প্রযুক্তি ও ডায়াগনস্টিক্সে আগ্রহী",
        schooling: "দশম শ্রেণী উত্তীর্ণ (৫৮% নম্বর)",
        interests: "আধুনিক অটোমোটিভ ইলেকট্রনিক্স, রোবোটিক্স এবং ইভি ব্যাটারিতে গভীর আগ্রহ।",
        aptitudeBtn: "🎧 ব্যবহারিক দক্ষতা যাচাই (Voice Quiz)"
      },
      parentCard: {
        role: "অভিভাবক / পিতা",
        name: "রমেশ শর্মা (বাবা, ৪৮ বছর)",
        tag: "পরিবারের প্রধান সিদ্ধান্ত গ্রহণকারী",
        occupation: "কৃষি ও গ্রামীণ ব্যবসায়ী",
        concerns: "বেতনের নিশ্চয়তা, মেকানিক কাজের সামাজিক মর্যাদা ও আত্মীয়দের মতামত।",
        status: "প্রত্যাশিত ন্যূনতম বেতন: ₹২০,০০০ / মাস"
      },
      startBtn: "যৌথ পারিবারিক কাউন্সেলিং শুরু করুন",
      studentOnlyLink: "শুধুমাত্র ছাত্রদের জন্য তথ্য",
      parentOnlyLink: "শুধুমাত্র অভিভাবকদের জন্য সমাধান"
    },
    counsel: {
      stepBadge: "পর্যায় ২: দ্বিপাক্ষিক আলোচনা ও মধ্যস্থতা",
      divergenceBadge: "পারিবারিক মতভেদ সূচক (Δ_dyad)",
      districtTag: "জেলা: মিরাট (নিরীক্ষিত শিল্প করিডোর)",
      studentMessage: "বাবা, আমি আইটিআই অটোমোটিভ মেকাট্রনিক্স পড়তে চাই। আমার আধুনিক গাড়ি এবং ইভি ডায়াগনস্টিক্সে আগ্রহ আছে।",
      parentMessage: "গাড়ি মেরামত করা রাস্তার কাজ, এতে সমাজে কোনো সম্মান নেই। আত্মীয়স্বজন কী বলবে? তুমি সাধারণ বিএ পাস করে সরকারি চাকরির চেষ্টা করো।",
      arbiterTitle: "মিত্রস্কিল ক্যারিয়ার মধ্যস্থতাকারী (AI Arbiter)",
      verifiedAuditTag: "ডিজিটি ২০২৪ সরকারি অডিট দ্বারা যাচাইকৃত",
      arbiterReassurance: "রমেশ বাবু, সামাজিক মর্যাদা নিয়ে আপনার উদ্বেগ স্বাভাবিক। তবে আধুনিক অটোমোটিভ মেকাট্রনিক্স রাস্তার কাজ নয়, এটি শীতাতপ নিয়ন্ত্রিত ল্যাবে ইলেকট্রিক গাড়ির সফটওয়্যার পরীক্ষা।",
      salaryCardTitle: "প্রাথমিক মাসিক বেতন",
      salaryCardValue: "₹১৮,৫০০ - ₹২৪,৫০০ / মাস",
      salaryCardSource: "ডিজিটি গ্র্যাজুয়েট ট্রেসার স্টাডি",
      placementCardTitle: "ক্যাম্পাস প্লেসমেন্ট হার",
      placementCardValue: "৮৮.৪%",
      placementCardRecruiters: "শীর্ষ কোম্পানি: টাটা মোটরস, উনো মিন্ডা",
      audioBtn: "পরামর্শ বার্তা শুনুন",
      mobilityBtn: "ডিগ্রি লাভের ধাপ দেখুন (NCrF Ladder) →",
      roiBtn: "📊 পারিবারিক খরচের হিসাব (BA বনাম ITI)",
      alumniBtn: "🎬 প্রাক্তন ছাত্রদের সাফল্য রিল (Reels)",
      facilityBtn: "🏢 ক্যাম্পাস ও নিরাপত্তা যাচাই",
      seatsBtn: "📍 কাছাকাছি আসন ও শিক্ষানবিশী",
      mathBtn: "অ্যালগরিদম বিশ্লেষক 🔬",
      chips: {
        salary: "বেতনের চিন্তা (Salary Concern)",
        stigma: "সামাজিক মর্যাদা (Social Stigma)",
        safety: "নিরাপত্তা ও যাতায়াত (Safety & Transit)"
      },
      studentMicBtn: "বলুন: আমান (ছাত্র)",
      parentMicBtn: "বলুন: রমেশ (পিতা)"
    },
    mobility: {
      stepBadge: "পর্যায় ৩: উচ্চশিক্ষার সরাসরি পথ (ডিগ্রি সমমান)",
      title: "জাতীয় ক্রেডিট কাঠামো (NCrF) শিক্ষা মই",
      subtitle: "কারিগরি শিক্ষা কোনো সমাপ্তি নয়। এনইপি ২০২০-এর অধীনে আইটিআই-এর ক্রেডিট সরাসরি ইঞ্জিনিয়ারিং ডিগ্রিতে স্থানান্তর করা যায়।",
      listenBtn: "ক্রেডিট নিয়মাবলী শুনুন",
      stages: {
        step1Title: "দশম শ্রেণী উত্তীর্ণ",
        step1Desc: "NSQF স্তর ২ • মৌলিক বিদ্যালয় যোগ্যতা",
        step2Title: "আইটিআই অটোমোটিভ মেকাট্রনিক্স (২ বছর)",
        step2Desc: "NSQF স্তর ৪ • ৮০টি ক্রেডিট • পলিটেকনিক প্রথম বর্ষ থেকে সম্পূর্ণ ছাড়",
        step3Title: "সরকারি পলিটেকনিক ইঞ্জিনিয়ারিং ডিপ্লোমা",
        step3Desc: "NSQF স্তর ৫ • দ্বিতীয় বর্ষে সরাসরি ল্যাটারাল এন্ট্রি (LEET) • সুপারভাইজার পদ",
        step4Title: "ব্যাচেলর অফ টেকনোলজি (B.Tech / B.Voc)",
        step4Desc: "NSQF স্তর ৬/৭ • সম্পূর্ণ ডিগ্রি ইঞ্জিনিয়ার • ইউপিএসসি ও সরকারি পরীক্ষায় আবেদনের যোগ্য"
      },
      creditMathTitle: "এনসিআরএফ ক্রেডিট হিসাব",
      creditMathFormula: "৩০ ঘণ্টার প্রশিক্ষণ = ১টি ক্রেডিট",
      creditMathDesc: "২ বছরের আইটিআই (২,৪০০ ঘণ্টা) = ৮০ ক্রেডিট = সরকারি গেজেট অনুযায়ী পলিটেকনিক প্রথম বর্ষ থেকে ১০০% ছাড়।",
      matrixTitle: "সামাজিক ভুল ধারণা বনাম আইনি বাস্তবতা",
      backBtn: "← সংলাপে ফিরে যান",
      generateAccordBtn: "পরিবার রোজগার পত্র তৈরি করুন →"
    },
    accord: {
      stepBadge: "পর্যায় ৪: আনুষ্ঠানিক পারিবারিক চুক্তিপত্র",
      officialTitle: "পরিবার রোজগার পত্র (PARIVAAR ROZGAR PATRA)",
      subTitle: "দক্ষতা উন্নয়ন ও উদ্যোক্তা মন্ত্রক (MSDE) | স্কিল ইন্ডিয়া মিশন",
      docIdLabel: "নথি নম্বর:",
      partiesTitle: "চুক্তির পক্ষসমূহ",
      candidateLabel: "প্রার্থী / ছাত্র:",
      parentLabel: "অভিভাবক / পিতা:",
      tradeLabel: "নির্বাচিত কারিগরি ট্রেড:",
      centerLabel: "অনুমোদিত প্রতিষ্ঠান:",
      termsTitle: "পারস্পরিক প্রতিশ্রুতি ও আইনি সুরক্ষা",
      term1: "ছাত্র ৮৫%+ উপস্থিতির সাথে ২৪ মাসের আধুনিক ইভি ডায়াগনস্টিক প্রশিক্ষণ সম্পন্ন করবে।",
      term2: "অভিভাবক সাধারণ বিএ কোর্সের পরিবর্তে কারিগরি শিক্ষার সম্পূর্ণ সমর্থন করবেন।",
      term3: "জাতীয় ক্রেডিট কাঠামো (NCrF) ৮০ ক্রেডিটের ভিত্তিতে পলিটেকনিক দ্বিতীয় বর্ষে সরাসরি ভর্তির আইনি নিশ্চয়তা দেয়।",
      term4: "ডিজিটি ২০২৪ অডিট অনুযায়ী প্রতি মাসে ₹১৮,৫০০ থেকে ₹২৪,৫০০ প্রারম্ভিক বেতনের নিশ্চয়তা।",
      verifiedSeal: "এনসিভিইটি স্বীকৃত • স্কিল ইন্ডিয়া অফিসিয়াল সার্টিফিকেট",
      downloadBtn: "সার্টিফিকেট ডাউনলোড করুন (PDF)",
      shareBtn: "হোয়াটসঅ্যাপে শেয়ার করুন",
      adminLink: "প্রশাসনিক ডেটা দেখুন →"
    },
    admin: {
      title: "এমএসডিই স্কিম অ্যাডমিনিস্ট্রেটর পোর্টাল",
      subtitle: "জেলা ভিত্তিক ডেটা: পারিবারিক আপত্তির বিশ্লেষণ ও সম্পদ বরাদ্দ পরিকল্পনা।",
      kpiSessions: "মোট কাউন্সেলিং সেশন",
      kpiConsensus: "পারিবারিক ঐকমত্যের হার",
      kpiShift: "ইতিবাচক মনোভাবের পরিবর্তন",
      kpiTopFriction: "প্রধান সামাজিক বাধা",
      exportBtn: "জেলা দক্ষতা পরিকল্পনা রিপোর্ট (CSV) ডাউনলোড করুন",
      heatmapTitle: "জেলা ভিত্তিক বাধার হিটম্যাপ ও সুপারিশ",
      breakdownTitle: "পারিবারিক আপত্তির শ্রেণিবিভাগ"
    }
  },
  ta: {
    nav: {
      brandSubtitle: "ஏஐ தொழில் மத்தியஸ்தர் மற்றும் குடும்ப வழிகாட்டி",
      appGuide: "பயன்பாட்டு வழிகாட்டி",
      liveCounselor: "நேரடி ஐடிஐ ஆலோசகர்",
      adminConsole: "நிர்வாக பலகை",
      familyFlow: "குடும்ப உரையாடல்",
      whatsappDemo: "வாட்ஸ்அப் மாதிரி"
    },
    home: {
      badge: "ஸ்கில் இந்தியா திட்டம் • மத்திய அரசு மையம்",
      headline: "குடும்பத்துடன் இணைந்து சிறந்த தொழில்நுட்ப பாதையை தேர்வு செய்யுங்கள்",
      subheadline: "மாணவரின் ஆர்வம் மற்றும் பெற்றோரின் கௌரவம்—மத்திய அரசின் சரிபார்க்கப்பட்ட புள்ளிவிவரங்களுடன்.",
      audioBtn: "1 நிமிட அறிமுக ஆடியோ கேளுங்கள்",
      districtFilterLabel: "தேர்ந்தெடுக்கப்பட்ட மாவட்டம்:",
      classFilterLabel: "கல்வித் தகுதி:",
      studentCard: {
        role: "மாணவர் (விண்ணப்பதாரர்)",
        name: "அமன் சர்மா (வயது 17)",
        tag: "தொழில்நுட்ப ஆர்வம் கொண்டவர்",
        schooling: "10-ஆம் வகுப்பு தேர்ச்சி (58% மதிப்பெண்)",
        interests: "நவீன ஆட்டோமோட்டிவ் எலக்ட்ரானிக்ஸ், ரோபோட்டிக்ஸ் மற்றும் இவி பேட்டரி தொழில்நுட்பத்தில் ஆர்வம்.",
        aptitudeBtn: "🎧 செய்முறை திறன் தேர்வு (Voice Quiz)"
      },
      parentCard: {
        role: "பெற்றோர் / தந்தை",
        name: "ரமேஷ் சர்மா (தந்தை, 48)",
        tag: "குடும்பத்தின் முக்கிய முடிவெடுப்பவர்",
        occupation: "விவசாயம் மற்றும் சிறு வணிகம்",
        concerns: "வருமான உத்தரவாதம், சமூக அந்தஸ்து மற்றும் உறவினர்களின் ஏளனம் குறித்த கவலை.",
        status: "எதிர்பார்க்கும் தொடக்க ஊதியம்: ₹20,000 / மாதம்"
      },
      startBtn: "கூட்டு குடும்ப ஆலோசனை அமர்வைத் தொடங்குங்கள்",
      studentOnlyLink: "மாணவர்களுக்கான பிரத்யேக தகவல்",
      parentOnlyLink: "பெற்றோருக்கான விளக்க அறை"
    },
    counsel: {
      stepBadge: "படி 2: இருவழி உரையாடல் (மாணவர்-பெற்றோர் மத்தியஸ்தம்)",
      divergenceBadge: "குடும்ப கருத்து வேறுபாடு (Δ_dyad)",
      districtTag: "மாவட்டம்: மீரட் (சரிபார்க்கப்பட்ட தொழில்துறை மண்டலம்)",
      studentMessage: "அப்பா, நான் ஐடிஐ ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் படிக்க விரும்புகிறேன். எனக்கு நவீன கார்கள் மற்றும் இவி கணினி பரிசோதனை மிகவும் பிடிக்கும்.",
      parentMessage: "வண்டி பழுதுபார்ப்பது சாலையோர மெக்கானிக் வேலை, இதில் என்ன சமூக அந்தஸ்து இருக்கிறது? சொந்தக்காரர்கள் என்ன சொல்வார்கள்? நீ பி.ஏ படித்து அரசு தேர்வுக்கு முயற்சி செய்.",
      arbiterTitle: "மித்ராஸ்கில் தொழில் மத்தியஸ்தர் (AI Arbiter)",
      verifiedAuditTag: "டிஜிடி 2024 தணிக்கை சரிபார்க்கப்பட்டது",
      arbiterReassurance: "ரமேஷ் அவர்களே, உங்கள் சமூக அந்தஸ்து மற்றும் வருமானம் பற்றிய கவலை நியாயமானது. ஆனால் நவீன ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் என்பது சாலையோர வேலை அல்ல, ஏசி ஆய்வகத்தில் எலக்ட்ரிக் வாகனங்களை கணினியில் பரிசோதிக்கும் உயர் தொழில்நுட்ப பணி.",
      salaryCardTitle: "தொடக்க மாத ஊதியம்",
      salaryCardValue: "₹18,500 - ₹24,500 / மாதம்",
      salaryCardSource: "டிஜிடி பட்டதாரி கண்காணிப்பு ஆய்வு",
      placementCardTitle: "சரிபார்க்கப்பட்ட வேலைவாய்ப்பு விகிதம்",
      placementCardValue: "88.4%",
      placementCardRecruiters: "முக்கிய நிறுவனங்கள்: டாடா மோட்டார்ஸ், யூனோ மிண்டா",
      audioBtn: "மத்தியஸ்த ஆடியோ கேளுங்கள்",
      mobilityBtn: "பட்டப்படிப்பு பாதை (NCrF Ladder) →",
      roiBtn: "📊 குடும்ப கல்வி முதலீட்டு பலன் (BA vs ITI)",
      alumniBtn: "🎬 முன்னாள் மாணவர் வெற்றிக் கதைகள் (Reels)",
      facilityBtn: "🏢 வளாக பாதுகாப்பு சரிபார்ப்பு",
      seatsBtn: "📍 அருகிலுள்ள சேர்க்கை இடங்கள்",
      mathBtn: "கணித அல்காரிதம் ஆய்வு 🔬",
      chips: {
        salary: "வருமான கவலை (Salary Concern)",
        stigma: "சமூக அந்தஸ்து (Social Stigma)",
        safety: "பாதுகாப்பு & போக்குவரத்து (Safety & Transit)"
      },
      studentMicBtn: "பேசுக: அமன் (மாணவர்)",
      parentMicBtn: "பேசுக: ரமேஷ் (பெற்றோர்)"
    },
    mobility: {
      stepBadge: "படி 3: உயர்கல்வி முன்னேற்றப் பாதை (பட்டப்படிப்பு சமநிலை)",
      title: "தேசிய கிரெடிட் கட்டமைப்பு (NCrF) கல்வி முன்னேற்ற ஏணி",
      subtitle: "தொழிற்கல்வி என்பது முட்டுச்சந்து அல்ல. புதிய கல்விக் கொள்கையின்படி ஐடிஐ கிரெடிட்கள் நேரடியாக பல்கலைக்கழக பொறியியல் பட்டப்படிப்புக்கு மாற்றப்படும்.",
      listenBtn: "கிரெடிட் விதிகளை கேளுங்கள்",
      stages: {
        step1Title: "10-ஆம் வகுப்பு தேர்ச்சி",
        step1Desc: "NSQF நிலை 2 • அடிப்படை பள்ளி தகுதி",
        step2Title: "ஐடிஐ ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ் (2 ஆண்டுகள்)",
        step2Desc: "NSQF நிலை 4 • 80 கிரெடிட்கள் • பாலிடெக்னிக் முதல் ஆண்டிலிருந்து முழு விலக்கு",
        step3Title: "அரசு பாலிடெக்னிக் பொறியியல் பட்டயம்",
        step3Desc: "NSQF நிலை 5 • 2ம் ஆண்டில் நேரடி சேர்க்கை (LEET) • மேற்பார்வையாளர் பணி",
        step4Title: "பி.டெக் / பி.வோக் பொறியியல் பட்டம் (B.Tech)",
        step4Desc: "NSQF நிலை 6/7 • முழு பட்டதாரி பொறியாளர் • யுபிஎஸ்சி மற்றும் அரசு தேர்வுகளுக்கு தகுதி"
      },
      creditMathTitle: "என்சிஆர்எஃப் கிரெடிட் கணக்கீடு",
      creditMathFormula: "30 மணிநேர பயிற்சி = 1 கல்வி கிரெடிட்",
      creditMathDesc: "2 ஆண்டு ஐடிஐ (2,400 மணிநேரம்) = 80 கிரெடிட்கள் = பாலிடெக்னிக் முதல் ஆண்டுக்கு 100% அரசு விலக்கு.",
      matrixTitle: "சமூக தவறான கருத்து vs சட்டப்பூர்வ உண்மை",
      backBtn: "← உரையாடலுக்கு திரும்பு",
      generateAccordBtn: "குடும்ப வேலைவாய்ப்பு பத்திரம் பெறுக →"
    },
    accord: {
      stepBadge: "படி 4: சான்றளிக்கப்பட்ட குடும்ப ஒப்பந்தம்",
      officialTitle: "குடும்ப வேலைவாய்ப்பு பத்திரம் (PARIVAAR ROZGAR PATRA)",
      subTitle: "திறன் மேம்பாடு மற்றும் தொழில்முனைவோர் அமைச்சகம் (MSDE) | ஸ்கில் இந்தியா திட்டம்",
      docIdLabel: "ஆவண எண்:",
      partiesTitle: "ஒப்பந்தத்தின் தரப்பினர்",
      candidateLabel: "விண்ணப்பதாரர் / மாணவர்:",
      parentLabel: "பெற்றோர் / தந்தை:",
      tradeLabel: "தேர்ந்தெடுக்கப்பட்ட தொழிற்பிரிவு:",
      centerLabel: "அங்கீகரிக்கப்பட்ட மையம்:",
      termsTitle: "பரஸ்பர கடமைகள் மற்றும் சட்டப் பாதுகாப்புகள்",
      term1: "மாணவர் 85%+ வருகையுடன் 24 மாத நவீன இவி பரிசோதனை பயிற்சியை நிறைவு செய்ய உறுதியளிக்கிறார்.",
      term2: "வழக்கமான பி.ஏ படிப்பை விட தொழில்நுட்ப தொழிற்கல்விக்கு பெற்றோர் முழு ஆதரவு அளிக்க ஒப்புக்கொள்கிறார்கள்.",
      term3: "தேசிய கிரெடிட் கட்டமைப்பு (NCrF) 80 கிரெடிட்களின் அடிப்படையில் பாலிடெக்னிக் 2ம் ஆண்டில் நேரடி சேர்க்கையை உறுதி செய்கிறது.",
      term4: "டிஜிடி 2024 தணிக்கையின்படி மாதத்திற்கு ₹18,500 முதல் ₹24,500 வரை தொடக்க ஊதியம் சரிபார்க்கப்பட்டுள்ளது.",
      verifiedSeal: "என்சிவிஇடி அங்கீகரிக்கப்பட்டது • ஸ்கில் இந்தியா சான்றிதழ்",
      downloadBtn: "சான்றிதழ் பதிவிறக்கம் (PDF)",
      shareBtn: "வாட்ஸ்அப்பில் பகிர்க",
      adminLink: "நிர்வாக தரவுகளை காண்க →"
    },
    admin: {
      title: "எம்எஸ்டிஇ திட்ட நிர்வாக கட்டுப்பாட்டு பலகை",
      subtitle: "மாவட்ட அளவிலான தரவு: குடும்ப எதிர்ப்பு காரணங்களின் பகுப்பாய்வு மற்றும் நிதி ஒதுக்கீட்டு வழிகாட்டுதல்.",
      kpiSessions: "மொத்த ஆலோசனை அமர்வுகள்",
      kpiConsensus: "குடும்ப ஒப்புதல் விகிதம்",
      kpiShift: "நேர்மறை கருத்து மாற்றம்",
      kpiTopFriction: "முக்கிய சமூக எதிர்ப்பு",
      exportBtn: "மாவட்ட திறன் திட்ட அறிக்கையை பதிவிறக்குக (CSV)",
      heatmapTitle: "மாவட்ட வாரியான தடைகள் மற்றும் பரிந்துரைகள்",
      breakdownTitle: "குடும்ப ஆட்சேபனைகளின் வகைப்பாடு"
    }
  }
};
