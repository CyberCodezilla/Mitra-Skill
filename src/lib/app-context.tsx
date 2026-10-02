import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";
export type SessionMode = "JOINT" | "STUDENT" | "PARENT";

const STRINGS = {
  subtitle: { en: "National Skilling & Family Guidance Initiative", hi: "राष्ट्रीय कौशल एवं पारिवारिक मार्गदर्शन पहल" },
  counsellor: { en: "Live ITI Counsellor", hi: "लाइव ITI परामर्शदाता" },
  steps: {
    en: ["Onboarding", "Dyadic Dialogue", "Degree Mobility", "Family Accord"],
    hi: ["शुरुआत", "संवाद", "डिग्री अवसर", "पारिवारिक सहमति"],
  },
  heroTitle: { en: "Ek Nayi Shuruaat, Parivaar Ke Saath", hi: "एक नई शुरुआत, परिवार के साथ" },
  heroTag: {
    en: "Guiding Technical Careers Together: Grounded in Verified Ministry Data",
    hi: "कौशल शिक्षा में परिवार की सहमति और सुरक्षित भविष्य",
  },
  district: { en: "District", hi: "जिला" },
  level: { en: "Student academic level", hi: "छात्र की शैक्षिक योग्यता" },
  levels: {
    en: ["Class 8 Pass", "Class 10 Pass", "Class 12 Pass", "Early Dropout / RPL"],
    hi: ["कक्षा 8 पास", "कक्षा 10 पास", "कक्षा 12 पास", "पढ़ाई छूटी / RPL"],
  },
  student: { en: "Student", hi: "छात्र" },
  parent: { en: "Parent / Guardian", hi: "अभिभावक" },
  qualification: { en: "Qualification", hi: "योग्यता" },
  aptitude: { en: "Aptitude", hi: "रुचि" },
  hesitation: { en: "Core hesitation", hi: "मुख्य चिंता" },
  wage: { en: "Reservation wage", hi: "न्यूनतम अपेक्षित वेतन" },
  cta: { en: "Start Joint Family Counselling Session", hi: "संयुक्त पारिवारिक परामर्श शुरू करें" },
  ctaSub: {
    en: "Recommended: Engages student aspirations and parental objections together.",
    hi: "अनुशंसित: छात्र की आकांक्षाएँ और अभिभावक की चिंताएँ एक साथ।",
  },
  studentOnly: { en: "Explore as Student Only", hi: "केवल छात्र के रूप में देखें" },
  parentOnly: { en: "Explore as Parent Only", hi: "केवल अभिभावक के रूप में देखें" },
  audio: { en: "Listen to 1-minute intro in Hindi", hi: "एक मिनट में समझें" },
  playing: { en: "Playing… tap to stop", hi: "चल रहा है… रोकने के लिए दबाएँ" },
} as const;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  mode: SessionMode;
  setMode: (m: SessionMode) => void;
  t: typeof STRINGS;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<SessionMode>("JOINT");
  return <AppCtx.Provider value={{ lang, setLang, mode, setMode, t: STRINGS }}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
