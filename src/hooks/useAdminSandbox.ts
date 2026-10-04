import { useState, useEffect, useCallback } from "react";

export interface AdminTelemetryEvent {
  id: string;
  time: string;
  place: string;
  text: string;
  type: string;
  resolved?: boolean;
}

export interface AdminKpiData {
  sessions: string;
  sessionsNote: string;
  consensusRate: string;
  consensusNote: string;
  reassuranceShift: string;
  shiftNote: string;
  topFrictionEn: string;
  topFrictionHi: string;
  frictionNote: string;
}

export interface AdminPolicySettings {
  divergenceCutoff: number; // default 0.35
  requireHumanCounselorOnSafety: boolean;
  autoDsdpExportEnabled: boolean;
  targetConsensusGoal: number; // default 75%
}

export interface AdminSandboxState {
  state: string;
  district: string;
  trade: string;
  kpis: AdminKpiData;
  events: AdminTelemetryEvent[];
  policies: AdminPolicySettings;
  lastModifiedAt?: number;
}

const STORAGE_KEY = "mitraskill_admin_sandbox_v1";

const BASELINE_KPIS: AdminKpiData = {
  sessions: "4,821",
  sessionsNote: "+18.4% this month",
  consensusRate: "74.2%",
  consensusNote: "Family Accord generated",
  reassuranceShift: "+41.8%",
  shiftNote: "Pre 68% hesitant → Post 74% reassured",
  topFrictionEn: "Social Prestige / Marriage Market",
  topFrictionHi: "सामाजिक प्रतिष्ठा एवं विवाह धारणा",
  frictionNote: "42% of sessions in Meerut district",
};

const BASELINE_EVENTS: AdminTelemetryEvent[] = [
  {
    id: "evt-1",
    time: "10 mins ago",
    place: "Mawana (Meerut)",
    text: "Dyadic divergence resolved for AUTO_MECH_01 after NCrF ladder projection.",
    type: "Consensus",
    resolved: false,
  },
  {
    id: "evt-2",
    time: "24 mins ago",
    place: "Sardhana",
    text: "Live counselor WebRTC call triggered due to persistent female transit objection.",
    type: "Counselor referral",
    resolved: false,
  },
  {
    id: "evt-3",
    time: "32 mins ago",
    place: "Meerut Sadar",
    text: "Parivaar Rozgar Patra generated for SOLAR_TECH_02.",
    type: "Family accord",
    resolved: false,
  },
  {
    id: "evt-4",
    time: "48 mins ago",
    place: "Daurala",
    text: "Reservation wage resistance bridged: Parent agreed to ₹18,500 stipend track.",
    type: "Wage resolution",
    resolved: false,
  },
];

const BASELINE_POLICIES: AdminPolicySettings = {
  divergenceCutoff: 0.35,
  requireHumanCounselorOnSafety: true,
  autoDsdpExportEnabled: true,
  targetConsensusGoal: 75,
};

const BASELINE_STATE: AdminSandboxState = {
  state: "Uttar Pradesh",
  district: "Meerut",
  trade: "All Trades",
  kpis: BASELINE_KPIS,
  events: BASELINE_EVENTS,
  policies: BASELINE_POLICIES,
};

export function useAdminSandbox() {
  const [sandbox, setSandbox] = useState<AdminSandboxState>(BASELINE_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSandboxModified, setIsSandboxModified] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AdminSandboxState = JSON.parse(raw);
        setSandbox(parsed);
        setIsSandboxModified(true);
      } else {
        setSandbox(BASELINE_STATE);
        setIsSandboxModified(false);
      }
    } catch {
      setSandbox(BASELINE_STATE);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSandbox = useCallback((updater: (prev: AdminSandboxState) => AdminSandboxState) => {
    setSandbox((prev) => {
      const updated = updater(prev);
      updated.lastModifiedAt = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore quota
      }
      setIsSandboxModified(true);
      return updated;
    });
  }, []);

  const resetToBaseline = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setSandbox(BASELINE_STATE);
    setIsSandboxModified(false);
  }, []);

  const updateFilters = useCallback(
    (updates: Partial<Pick<AdminSandboxState, "state" | "district" | "trade">>) => {
      saveSandbox((prev) => ({ ...prev, ...updates }));
    },
    [saveSandbox]
  );

  const updateKpis = useCallback(
    (kpiUpdates: Partial<AdminKpiData>) => {
      saveSandbox((prev) => ({
        ...prev,
        kpis: { ...prev.kpis, ...kpiUpdates },
      }));
    },
    [saveSandbox]
  );

  const updatePolicies = useCallback(
    (policyUpdates: Partial<AdminPolicySettings>) => {
      saveSandbox((prev) => ({
        ...prev,
        policies: { ...prev.policies, ...policyUpdates },
      }));
    },
    [saveSandbox]
  );

  const addIncident = useCallback(
    (place: string, text: string, type: string) => {
      const newEvent: AdminTelemetryEvent = {
        id: `evt-custom-${Date.now()}`,
        time: "Just now",
        place,
        text,
        type,
        resolved: false,
      };
      saveSandbox((prev) => ({
        ...prev,
        events: [newEvent, ...prev.events],
      }));
    },
    [saveSandbox]
  );

  const toggleResolveIncident = useCallback(
    (id: string) => {
      saveSandbox((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === id ? { ...e, resolved: !e.resolved } : e
        ),
      }));
    },
    [saveSandbox]
  );

  return {
    sandbox,
    isLoaded,
    isSandboxModified,
    updateFilters,
    updateKpis,
    updatePolicies,
    addIncident,
    toggleResolveIncident,
    resetToBaseline,
  };
}
