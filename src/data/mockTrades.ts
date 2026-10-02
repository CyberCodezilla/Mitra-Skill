export interface TradeRecord {
  trade_id: string;
  trade_name: string;
  hindi_title: string;
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
  parent_reassurance_script: { en: string; hi: string };
}

export const MOCK_TRADES: TradeRecord[] = [
  {
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics",
    hindi_title: "ऑटोमोटिव मेक्ट्रोनिक्स",
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
    },
  },
  {
    trade_id: "SOLAR_TECH_02",
    trade_name: "Solar PV Rooftop Technician",
    hindi_title: "सोलर पीवी इंस्टॉलेशन तकनीशियन",
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
    },
  },
];
