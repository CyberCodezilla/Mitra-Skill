import type { SupportedLanguage } from "@/context/LanguageVoiceContext";

export interface TradeRecord {
  trade_id: string;
  trade_name: string;
  hindi_title: string;
  localized_titles?: Record<SupportedLanguage, string>;
  nsqf_level: number;
  duration_months: number;
  curriculum_focus: string[];
  verified_metrics: {
    region: string;
    avg_starting_monthly_inr: number;
    salary_range_min: number;
    salary_range_max: number;
    placement_rate_percentage: number;
    top_employers: string[];
    work_environment: string;
    female_safety_score: number;
    audit_source: string;
  };
  ncrf_mobility: {
    credits_earned: number;
    next_academic_step: string;
    degree_eligibility: string;
  };
  parent_reassurance_script: Record<SupportedLanguage, string>;
}

export function getLocalizedTradeName(trade: TradeRecord, lang: SupportedLanguage): string {
  if (trade.localized_titles?.[lang]) return trade.localized_titles[lang];
  if (lang === "hi") return trade.hindi_title;
  return trade.trade_name;
}

export const MOCK_TRADES: TradeRecord[] = [
  {
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics",
    hindi_title: "ऑटोमोटिव मेक्ट्रोनिक्स",
    localized_titles: {
      en: "Automotive Mechatronics",
      hi: "ऑटोमोटिव मेक्ट्रोनिक्स",
      mr: "ऑटोमोटिव मेकॅट्रॉनिक्स",
      bn: "অটোমোটিভ মেকাট্রনিক্স",
      ta: "ஆட்டோமோட்டிவ் மெக்கட்ரானிக்ஸ்",
    },
    nsqf_level: 4,
    duration_months: 24,
    curriculum_focus: ["EV Powertrains", "Engine Diagnostics", "Automotive Microcontrollers"],
    verified_metrics: {
      region: "Northern Industrial Corridor (Meerut / NCR)",
      avg_starting_monthly_inr: 19500,
      salary_range_min: 17000,
      salary_range_max: 24500,
      placement_rate_percentage: 88.4,
      top_employers: ["Tata Motors", "Uno Minda", "Hero MotoCorp", "Maruti Service Hubs"],
      work_environment: "Modern Diagnostic Center (Cleanroom, Non-roadside)",
      female_safety_score: 9.2,
      audit_source: "DGT Annual Apprenticeship Tracer Study 2024",
    },
    ncrf_mobility: {
      credits_earned: 80,
      next_academic_step:
        "Direct 2nd Year Lateral Entry to Polytechnic Diploma in Mechanical/Auto Engg",
      degree_eligibility: "B.Tech in Automobile Systems (Post-Diploma)",
    },
    parent_reassurance_script: {
      en: "This is not roadside mechanical work. Trainees operate digital EV diagnostic computers with 88% verified campus placement.",
      hi: "रमेश जी, यह पुराने मैकेनिक का काम नहीं है। आपका बेटा आधुनिक कंप्यूटर से इलेक्ट्रिक वाहनों की जांच करेगा। सरकारी मान्यता प्राप्त संस्थानों में 88% पक्की नौकरी मिलती है।",
      mr: "रमेशजी, हे जुन्या पद्धतीचे मेकॅनिक काम नाही. तुमचा मुलगा संगणकावरून आधुनिक ईव्ही वाहनांची तपासणी करेल. ८८% प्रमाणित कॅम्पस प्लेसमेंटची खात्री आहे.",
      bn: "রমেশ বাবু, এটি সাধারণ মেকানিকের কাজ নয়। আপনার ছেলে আধুনিক কম্পিউটারের সাহায্যে বৈদ্যুতিক গাড়ি পরীক্ষা করবে। ৮৮% ক্যাম্পাস প্লেসমেন্ট নিশ্চিত।",
      ta: "ரமேஷ் அவர்களே, இது சாலையோர மெக்கானிக் வேலை அல்ல. உங்கள் மகன் அதிநவீன கணினிகள் மூலம் மின்சார வாகனங்களை பரிசோதிப்பார். 88% வேலைவாய்ப்பு உறுதி செய்யப்பட்டுள்ளது.",
    },
  },
  {
    trade_id: "SOLAR_TECH_02",
    trade_name: "Solar PV Rooftop Technician",
    hindi_title: "सोलर पीवी इंस्टॉलेशन तकनीशियन",
    localized_titles: {
      en: "Solar PV Rooftop Technician",
      hi: "सोलर पीवी इंस्टॉलेशन तकनीशियन",
      mr: "सोलर पीव्ही रूफटॉप तंत्रज्ञ",
      bn: "সোলার পিভি রুফটপ টেকনিশিয়ান",
      ta: "சூரிய மின்சக்தி ரூஃப்டாப் டெக்னீஷியன்",
    },
    nsqf_level: 4,
    duration_months: 12,
    curriculum_focus: [
      "Photovoltaic Inverters",
      "Grid Tie Installations",
      "PM Surya Ghar Operations",
    ],
    verified_metrics: {
      region: "All-India Priority Corridor",
      avg_starting_monthly_inr: 21000,
      salary_range_min: 18000,
      salary_range_max: 26000,
      placement_rate_percentage: 92.1,
      top_employers: ["Tata Power Solar", "Adani Solar Vendors", "State Discoms"],
      work_environment: "Green Energy Field Engineering",
      female_safety_score: 8.9,
      audit_source: "MNRE-MSDE Green Skilling Census 2024",
    },
    ncrf_mobility: {
      credits_earned: 40,
      next_academic_step: "Diploma in Electrical & Renewable Energy",
      degree_eligibility: "B.Tech in Renewable Energy Systems",
    },
    parent_reassurance_script: {
      en: "Solar is a sunrise national priority sector under PM Surya Ghar Yojana with guaranteed regional demand and self-employment subsidies.",
      hi: "सोलर का काम भविष्य का क्षेत्र है। पीएम सूर्य घर योजना के तहत अगले 5 वर्षों में लाखों तकनीशियनों की आवश्यकता है।",
      mr: "सौर ऊर्जा हे पीएम सूर्य घर योजनेअंतर्गत भविष्य घडवणारे क्षेत्र आहे, ज्यात हमखास प्रादेशिक मागणी आणि स्वयंरोजगार अनुदान मिळते.",
      bn: "সৌর শক্তি একটি জাতীয় অগ্রাধিকারের উদীয়মান ক্ষেত্র, যেখানে পিএম সূর্য ঘর যোজনার অধীনে ব্যাপক চাহিদা ও স্বরোজগার অনুদান রয়েছে।",
      ta: "சூரிய சக்தி என்பது பிரதமரின் சூர்ய கர் யோஜனா திட்டத்தின் கீழ் வளர்ந்து வரும் தேசிய முன்னுரிமைத் துறை, இதில் சுயதொழில் மானியமும் பெரும் தேவையும் உண்டு.",
    },
  },
];
