export interface FacilityAudit {
  center_id: string;
  center_name: string;
  center_name_hi: string;
  affiliation_code: string;
  ncvet_grade: string;
  district: string;
  address: string;
  safety_score: number;
  cctv_coverage_percent: number;
  biometric_attendance: boolean;
  faculty_cits_certified_percent: number;
  female_transit: {
    available: boolean;
    routes: string[];
    escort_support: boolean;
    free_pass_scheme: string;
  };
  modern_labs: {
    name: string;
    scheme_funded: string;
    equipment: string[];
    environment: string;
  }[];
  active_industry_mous: {
    company: string;
    intake_per_year: number;
    stipend_during_training: string;
  }[];
  audit_timestamp: string;
  audited_by: string;
  data_notice: string;
}

// These values were supplied in a prototype brief and have not been independently verified.
// Replace with source-linked, institution-approved records before any public deployment.
export const MOCK_FACILITY_DATA: Record<string, FacilityAudit> = {
  AUTO_MECH_01: {
    center_id: "DEMO-ITI-MRT-001",
    center_name: "Government ITI Saket, Meerut Node (sample record)",
    center_name_hi: "राजकीय आईटीआई साकेत, मेरठ (नमूना रिकॉर्ड)",
    affiliation_code: "DEMO-DGT-NCVET-UP-088",
    ncvet_grade: "Sample grade: A+",
    district: "Meerut, Uttar Pradesh",
    address: "Saket Industrial Area, Mawana Road, Meerut, UP 250001 (sample address)",
    safety_score: 9.4,
    cctv_coverage_percent: 100,
    biometric_attendance: true,
    faculty_cits_certified_percent: 100,
    female_transit: {
      available: true,
      routes: [
        "Sardhana Block Express Route (sample)",
        "Mawana Feeder Line (sample)",
        "Meerut Sadar Hub (sample)",
      ],
      escort_support: true,
      free_pass_scheme: "Sample transit-pass scheme; availability unconfirmed",
    },
    modern_labs: [
      {
        name: "EV & Computerized Diagnostic Bay (sample)",
        scheme_funded: "MSDE STRIVE Modernization Grant 2024 (unverified sample attribution)",
        equipment: [
          "Automotive OBD-II digital scanner",
          "EV battery diagnostic rig",
          "Sensor calibration workbench",
        ],
        environment: "Air-conditioned diagnostic laboratory (sample description)",
      },
      {
        name: "Mechatronics PLC Simulation Center (sample)",
        scheme_funded: "Industry 4.0 Center of Excellence (unverified sample attribution)",
        equipment: ["PLC workstations", "Pneumatic and hydraulic test benches"],
        environment: "Digital control room (sample description)",
      },
    ],
    active_industry_mous: [
      {
        company: "Tata Motors Commercial (sample listing)",
        intake_per_year: 45,
        stipend_during_training: "₹9,500/month (sample; not a confirmed offer)",
      },
      {
        company: "Uno Minda EV Systems (sample listing)",
        intake_per_year: 30,
        stipend_during_training: "₹10,200/month (sample; not a confirmed offer)",
      },
      {
        company: "Maruti Suzuki Service Hubs (sample listing)",
        intake_per_year: 25,
        stipend_during_training: "₹9,000/month (sample; not a confirmed offer)",
      },
    ],
    audit_timestamp: "October 2024 (sample date; unverified)",
    audited_by: "Sample attribution from prototype brief; no audit document supplied",
    data_notice:
      "Illustrative prototype values only. No independent audit evidence or institution approval is attached.",
  },
  SOLAR_TECH_02: {
    center_id: "DEMO-ITI-MRT-002",
    center_name: "PM Surya Ghar Regional Skilling Center (sample record)",
    center_name_hi: "पीएम सूर्य घर क्षेत्रीय कौशल केंद्र (नमूना रिकॉर्ड)",
    affiliation_code: "DEMO-MNRE-MSDE-SOLAR-04",
    ncvet_grade: "Sample grade: A",
    district: "Meerut, Uttar Pradesh",
    address: "Baghpat Bypass Skilling Complex, Meerut, UP 250002 (sample address)",
    safety_score: 9.1,
    cctv_coverage_percent: 95,
    biometric_attendance: true,
    faculty_cits_certified_percent: 94,
    female_transit: {
      available: true,
      routes: ["Baghpat Feeder Bus (sample)", "Rohta Road Shuttle (sample)"],
      escort_support: false,
      free_pass_scheme: "Sample green-skilling transit voucher; availability unconfirmed",
    },
    modern_labs: [
      {
        name: "Rooftop PV Simulation Grid Lab (sample)",
        scheme_funded: "National Green Hydrogen & Solar Mission (unverified sample attribution)",
        equipment: ["Micro-inverter test benches", "Solar irradiation simulators"],
        environment: "Safety-harnessed high-bay lab (sample description)",
      },
    ],
    active_industry_mous: [
      {
        company: "Tata Power Solar (sample listing)",
        intake_per_year: 60,
        stipend_during_training: "₹10,500/month (sample; not a confirmed offer)",
      },
      {
        company: "Adani Solar Vendors (sample listing)",
        intake_per_year: 40,
        stipend_during_training: "₹10,000/month (sample; not a confirmed offer)",
      },
    ],
    audit_timestamp: "November 2024 (sample date; unverified)",
    audited_by: "Sample attribution from prototype brief; no audit document supplied",
    data_notice:
      "Illustrative prototype values only. No independent audit evidence or institution approval is attached.",
  },
};
