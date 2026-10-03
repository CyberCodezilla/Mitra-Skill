export type PersonaId = "student_aman" | "parent_ramesh" | "arbiter" | "counselor_officer";

export interface PersonaAcousticConfig {
  id: PersonaId;
  displayName: string;
  age: number;
  role: string;
  pitch: number;
  rate: number;
  preferredGender: "male" | "female";
  description: string;
}

export const PERSONA_PROFILES: Record<PersonaId, PersonaAcousticConfig> = {
  student_aman: {
    id: "student_aman",
    displayName: "Aman Sharma (Student)",
    age: 17,
    role: "Candidate",
    pitch: 1.22, // Youthful, energetic, higher resonance
    rate: 1.04, // Eager, enthusiastic tempo
    preferredGender: "male",
    description: "17-year-old high-school graduate passionate about EV technology",
  },
  parent_ramesh: {
    id: "parent_ramesh",
    displayName: "Ramesh Sharma (Father)",
    age: 48,
    role: "Guardian",
    pitch: 0.78, // Deep, mature, grave masculine timbre
    rate: 0.86, // Deliberate, cautious, hesitant rural elder cadence
    preferredGender: "male",
    description: "48-year-old father concerned with family prestige and financial security",
  },
  arbiter: {
    id: "arbiter",
    displayName: "MitraSkill Arbiter",
    age: 32,
    role: "AI Mediator",
    pitch: 1.08, // Clear, empathetic, objective frequency
    rate: 0.94, // Accessible, supportive pacing
    preferredGender: "female",
    description: "Official MSDE dyadic consensus mediator",
  },
  counselor_officer: {
    id: "counselor_officer",
    displayName: "Nodal Officer Sharma",
    age: 52,
    role: "District Placement Head",
    pitch: 0.82, // Authoritative, reassuring institutional voice
    rate: 0.88, // Reassuring administrative guidance
    preferredGender: "male",
    description: "Senior placement official at Government ITI Saket, Meerut",
  },
};
