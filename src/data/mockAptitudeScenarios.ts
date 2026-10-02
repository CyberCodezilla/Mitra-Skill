export interface ScenarioOption {
  id: string;
  text_en: string;
  text_hi: string;
  icon_name: string;
  domain_scores: {
    mechanical: number;
    spatial: number;
    analytical: number;
    digital: number;
  };
}

export interface AptitudeScenario {
  id: string;
  step_number: number;
  title_en: string;
  title_hi: string;
  situation_en: string;
  situation_hi: string;
  audio_script_hi: string;
  duration_secs: number;
  category: "MECHANICAL" | "SPATIAL" | "ANALYTICAL";
  options: ScenarioOption[];
}

// Practice prompts and sample scoring only; this is not a validated psychometric assessment.
export const MOCK_APTITUDE_SCENARIOS: AptitudeScenario[] = [
  {
    id: "SCENARIO_01",
    step_number: 1,
    title_en: "The stalled electric delivery loader",
    title_hi: "रुक गया इलेक्ट्रिक डिलीवरी वाहन",
    situation_en:
      "An electric cargo three-wheeler stops accelerating while climbing a flyover. Its lights remain on, but the motor is silent. What would you check first?",
    situation_hi:
      "एक इलेक्ट्रिक मालवाहक तिपहिया फ्लाईओवर पर चढ़ते समय तेज़ चलना बंद कर देता है। इसकी लाइटें जल रही हैं, लेकिन मोटर शांत है। आप सबसे पहले क्या जाँचेंगे?",
    audio_script_hi:
      "मान लीजिए कि आप एक इलेक्ट्रिक मालवाहक वाहन के पास खड़े हैं। लाइटें जल रही हैं, पर गाड़ी आगे नहीं बढ़ रही। आप सबसे पहले क्या जाँचेंगे?",
    duration_secs: 14,
    category: "MECHANICAL",
    options: [
      {
        id: "OPT_1A",
        text_en:
          "Connect a diagnostic scanner and inspect throttle or motor-controller error codes.",
        text_hi: "डायग्नोस्टिक स्कैनर लगाकर थ्रॉटल या मोटर कंट्रोलर के त्रुटि कोड देखें।",
        icon_name: "Cpu",
        domain_scores: { mechanical: 0.7, spatial: 0.5, analytical: 0.85, digital: 0.95 },
      },
      {
        id: "OPT_1B",
        text_en: "Safely inspect the drive belt, axle, and thermal-overload fuse.",
        text_hi: "सुरक्षित तरीके से ड्राइव बेल्ट, एक्सल और ओवरलोड फ़्यूज़ की जाँच करें।",
        icon_name: "Wrench",
        domain_scores: { mechanical: 0.95, spatial: 0.6, analytical: 0.75, digital: 0.5 },
      },
      {
        id: "OPT_1C",
        text_en: "Check battery-terminal voltage and look for loose wiring connections.",
        text_hi: "बैटरी टर्मिनल का वोल्टेज जाँचें और ढीले तारों के कनेक्शन देखें।",
        icon_name: "Zap",
        domain_scores: { mechanical: 0.8, spatial: 0.7, analytical: 0.8, digital: 0.75 },
      },
    ],
  },
  {
    id: "SCENARIO_02",
    step_number: 2,
    title_en: "Rooftop solar layout challenge",
    title_hi: "छत पर सोलर पैनल की सही जगह",
    situation_en:
      "A village clinic has an uneven L-shaped roof. A water tank casts a long shadow over one side from 2 PM to 5 PM. How would you plan panel placement?",
    situation_hi:
      "एक ग्रामीण स्वास्थ्य केंद्र की छत L आकार की और असमतल है। पानी की टंकी दोपहर 2 से 5 बजे तक एक ओर लंबी छाया डालती है। आप पैनलों की जगह कैसे तय करेंगे?",
    audio_script_hi:
      "छत का आकार L जैसा है और पानी की टंकी दोपहर में छाया डालती है। पैनलों को ऐसी जगह लगाने के लिए आप क्या करेंगे जहाँ धूप अधिक मिले?",
    duration_secs: 15,
    category: "SPATIAL",
    options: [
      {
        id: "OPT_2A",
        text_en:
          "Map the roof and shade across the day, then orient panels toward the sunniest clear area.",
        text_hi: "छत और दिनभर की छाया का नक्शा बनाकर पैनल धूप वाली खुली जगह पर लगाएँ।",
        icon_name: "Compass",
        domain_scores: { mechanical: 0.6, spatial: 0.95, analytical: 0.9, digital: 0.7 },
      },
      {
        id: "OPT_2B",
        text_en:
          "Compare panel-level output options, such as micro-inverters, for partially shaded modules.",
        text_hi: "आंशिक छाया वाले पैनलों के लिए माइक्रो-इन्वर्टर जैसे विकल्पों की तुलना करें।",
        icon_name: "Layers",
        domain_scores: { mechanical: 0.65, spatial: 0.75, analytical: 0.85, digital: 0.9 },
      },
      {
        id: "OPT_2C",
        text_en: "Consider a raised frame only after checking structural safety, cost, and access.",
        text_hi: "ऊँचा ढाँचा लगाने से पहले इमारत की मजबूती, लागत और सुरक्षित पहुँच जाँचें।",
        icon_name: "Hammer",
        domain_scores: { mechanical: 0.9, spatial: 0.85, analytical: 0.6, digital: 0.4 },
      },
    ],
  },
  {
    id: "SCENARIO_03",
    step_number: 3,
    title_en: "The intermittent sensor warning",
    title_hi: "बार-बार आने वाली सेंसर चेतावनी",
    situation_en:
      "A workshop robot stops every 20 minutes with a warning beep, then works after restarting. How would you investigate the recurring fault?",
    situation_hi:
      "एक वर्कशॉप रोबोट हर 20 मिनट में चेतावनी की आवाज़ के साथ रुक जाता है और रीस्टार्ट के बाद फिर चलता है। आप बार-बार आने वाली खराबी की जाँच कैसे करेंगे?",
    audio_script_hi:
      "वर्कशॉप का रोबोट हर बीस मिनट में चेतावनी देकर रुक जाता है। रीस्टार्ट करने पर चलता है। बार-बार होने वाली समस्या का कारण जानने के लिए आप क्या देखेंगे?",
    duration_secs: 16,
    category: "ANALYTICAL",
    options: [
      {
        id: "OPT_3A",
        text_en: "Compare controller error timestamps with temperature and calibration logs.",
        text_hi: "कंट्रोलर त्रुटि के समय की तुलना तापमान और कैलिब्रेशन लॉग से करें।",
        icon_name: "FileSearch",
        domain_scores: { mechanical: 0.6, spatial: 0.5, analytical: 0.95, digital: 0.9 },
      },
      {
        id: "OPT_3B",
        text_en: "Inspect cooling airflow, heat sinks, and moving parts for signs of heat or wear.",
        text_hi: "कूलिंग हवा, हीट सिंक और चलने वाले हिस्सों में गर्मी या घिसाव की जाँच करें।",
        icon_name: "Fan",
        domain_scores: { mechanical: 0.9, spatial: 0.6, analytical: 0.8, digital: 0.6 },
      },
      {
        id: "OPT_3C",
        text_en:
          "Measure the supply while the fault occurs and review the controller's safety shutdown logs.",
        text_hi: "खराबी के समय बिजली की आपूर्ति मापें और कंट्रोलर के सुरक्षा लॉग देखें।",
        icon_name: "Activity",
        domain_scores: { mechanical: 0.7, spatial: 0.65, analytical: 0.9, digital: 0.85 },
      },
    ],
  },
];
