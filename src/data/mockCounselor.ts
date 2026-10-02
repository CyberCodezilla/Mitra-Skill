export interface CounselorProfile {
  id: string;
  name: string;
  title: string;
  designation_hi: string;
  center: string;
  district: string;
  phone_masked: string;
  status: "available" | "busy" | "offline";
  experience_years: number;
  certifications: string[];
}

// Prototype fixture only. Do not present this sample profile as a verified officer.
export const MOCK_COUNSELOR: CounselorProfile = {
  id: "COUNSELOR_MEERUT_DEMO",
  name: "Virendra Kumar Sharma",
  title: "District Nodal Placement & Career Officer (sample profile)",
  designation_hi: "जिला नोडल प्लेसमेंट एवं करियर अधिकारी (नमूना प्रोफ़ाइल)",
  center: "Government ITI Saket, Meerut Node",
  district: "Meerut, Uttar Pradesh",
  phone_masked: "+91 9837X-XXXXX",
  status: "available",
  experience_years: 14,
  certifications: [
    "Sample DGT career assessor credential",
    "Sample vocational mediation credential",
  ],
};

export const COUNSELOR_GREETING_AUDIO_SCRIPT = {
  en: "Namaste Ramesh-ji and Aman. This is a sample counselor introduction for the MitraSkill demo. I can see your session summary. Let's talk through your concerns about career options and the selected trade together.",
  hi: "नमस्ते रमेश जी और अमन। यह MitraSkill डेमो के लिए एक नमूना परामर्श परिचय है। मैं आपके सत्र का सार देख रहा हूँ। आइए करियर विकल्पों और चुने गए ट्रेड पर आपकी चिंताओं पर साथ में बात करें।",
} as const;
