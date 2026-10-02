export interface TrainingCenterRecord {
  id: string;
  name: string;
  name_hi: string;
  type: "GOVT_ITI" | "WOMEN_ITI" | "PMKK";
  district: string;
  block: string;
  distance_km: number;
  ncvet_grade: string;
  total_trade_seats: number;
  available_vacant_seats: number;
  bus_connectivity: string;
  active_naps_apprenticeships: {
    company: string;
    vacancies: number;
    stipend_inr: string;
    role: string;
  }[];
}

// Prototype examples supplied for UI demonstration. These institutions, seat counts,
// grades, transport details and apprenticeship listings are not live or independently verified.
export const MOCK_CENTERS: TrainingCenterRecord[] = [
  {
    id: "CTR_01",
    name: "Government ITI Saket (Main Campus)",
    name_hi: "राजकीय औद्योगिक प्रशिक्षण संस्थान (साकेत, मुख्य परिसर)",
    type: "GOVT_ITI",
    district: "Meerut",
    block: "Meerut Sadar",
    distance_km: 6.2,
    ncvet_grade: "Grade A+",
    total_trade_seats: 120,
    available_vacant_seats: 18,
    bus_connectivity: "UPSRTC Route 4 & Mawana Feeder (Every 15 mins)",
    active_naps_apprenticeships: [
      {
        company: "Tata Motors Commercial",
        vacancies: 35,
        stipend_inr: "₹9,500/mo",
        role: "EV Diagnostic Trainee",
      },
      {
        company: "Uno Minda Mindarika",
        vacancies: 20,
        stipend_inr: "₹10,200/mo",
        role: "Wire Harness Specialist",
      },
    ],
  },
  {
    id: "CTR_02",
    name: "Government Women ITI Mawana Road",
    name_hi: "राजकीय महिला आईटीआई (मवाना रोड, मेरठ)",
    type: "WOMEN_ITI",
    district: "Meerut",
    block: "Mawana",
    distance_km: 14.8,
    ncvet_grade: "Grade A",
    total_trade_seats: 80,
    available_vacant_seats: 12,
    bus_connectivity: "Dedicated Mission Shakti Female Shuttle (Free Pass)",
    active_naps_apprenticeships: [
      {
        company: "Tata Power Solar Systems",
        vacancies: 25,
        stipend_inr: "₹10,500/mo",
        role: "Rooftop PV Commissioning",
      },
      {
        company: "Schneider Electric Vendors",
        vacancies: 15,
        stipend_inr: "₹9,800/mo",
        role: "Automation QA Trainee",
      },
    ],
  },
  {
    id: "CTR_03",
    name: "Pradhan Mantri Kaushal Kendra (Baghpat Bypass)",
    name_hi: "प्रधानमंत्री कौशल केंद्र (बागपत बाईपास, मेरठ)",
    type: "PMKK",
    district: "Meerut",
    block: "Rohta",
    distance_km: 18.5,
    ncvet_grade: "Grade A",
    total_trade_seats: 60,
    available_vacant_seats: 9,
    bus_connectivity: "Rohta-Meerut Rural Bus Service",
    active_naps_apprenticeships: [
      {
        company: "Adani Green Energy Vendors",
        vacancies: 18,
        stipend_inr: "₹10,000/mo",
        role: "Solar Farm Technician",
      },
    ],
  },
];
