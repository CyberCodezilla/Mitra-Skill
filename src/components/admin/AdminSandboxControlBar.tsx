import React, { useState } from "react";
import {
  ShieldCheck,
  LogOut,
  Sliders,
  RotateCcw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import type { AdminSession } from "@/hooks/useAdminAuth";
import type { AdminSandboxState, AdminPolicySettings, AdminKpiData } from "@/hooks/useAdminSandbox";

interface AdminSandboxControlBarProps {
  session: AdminSession;
  onLogout: () => void;
  sandbox: AdminSandboxState;
  isSandboxModified: boolean;
  onResetBaseline: () => void;
  onUpdateKpis: (updates: Partial<AdminKpiData>) => void;
  onUpdatePolicies: (updates: Partial<AdminPolicySettings>) => void;
  onAddIncident: (place: string, text: string, type: string) => void;
  lang?: string;
}

export function AdminSandboxControlBar({
  session,
  onLogout,
  sandbox,
  isSandboxModified,
  onResetBaseline,
  onUpdateKpis,
  onUpdatePolicies,
  onAddIncident,
}: AdminSandboxControlBarProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newPlace, setNewPlace] = useState("");
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState("Consensus");

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.trim() || !newText.trim()) return;
    onAddIncident(newPlace.trim(), newText.trim(), newType);
    setNewPlace("");
    setNewText("");
  };

  return (
    <>
      {/* Top Floating / Pinned Administrative Bar */}
      <div className="mb-5 rounded-2xl border-2 border-slate-700/80 bg-slate-950 p-3 sm:p-4 text-white shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Officer Credential Dossier */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/25 border border-emerald-400/50 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-white">{session.user.name}</span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.2 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                Active Session
              </span>
              {isSandboxModified && (
                <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-2 py-0.2 text-[10px] font-black text-amber-300">
                  Local Sandbox Active
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
              <span>{session.user.email}</span>
              <span>•</span>
              <span>{session.user.designation}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
            <span>Customize Sandbox Data</span>
          </button>

          {isSandboxModified && (
            <button
              type="button"
              onClick={onResetBaseline}
              className="flex items-center gap-1.5 rounded-xl border border-amber-700/40 bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition active:scale-95 cursor-pointer shadow-xs"
              title="Restores factory demo baseline in this browser"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Baseline</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-rose-800/40 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sandbox Customization Drawer / Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 shadow-2xl text-white">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    Administrator Sandbox Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Edits persist in this browser only and will not affect the deployed site.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Divergence Triage Policy Threshold Slider */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    AI Arbiter Consensus Cutoff Threshold (τ)
                  </span>
                  <span className="rounded-md bg-amber-500 text-slate-950 font-mono font-black px-2 py-0.5 text-xs">
                    τ = {sandbox.policies.divergenceCutoff.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  When parent-student divergence exceeds this threshold, the algorithm automatically escalates to a certified District ITI counselor.
                </p>
                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={sandbox.policies.divergenceCutoff}
                  onChange={(e) =>
                    onUpdatePolicies({ divergenceCutoff: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1 font-mono">
                  <span>0.10 (Strict Escalation)</span>
                  <span>Default: 0.35</span>
                  <span>0.80 (Permissive)</span>
                </div>
              </div>

              {/* Quick KPI Target Tuner */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider block">
                  Quick Benchmark Adjuster
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Consensus Success Rate
                    </label>
                    <input
                      type="text"
                      value={sandbox.kpis.consensusRate}
                      onChange={(e) => onUpdateKpis({ consensusRate: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-bold text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Reassurance Shift Index
                    </label>
                    <input
                      type="text"
                      value={sandbox.kpis.reassuranceShift}
                      onChange={(e) => onUpdateKpis({ reassuranceShift: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-bold text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Add Live Telemetry Incident */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-2">
                  Inject Custom Live Telemetry Event
                </span>
                <form onSubmit={handleAddIncident} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Location / Block
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hastinapur (Meerut)"
                        value={newPlace}
                        onChange={(e) => setNewPlace(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Event Category
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Consensus">Consensus (Accord Formed)</option>
                        <option value="Counselor referral">Counselor Referral</option>
                        <option value="Family accord">Family Accord</option>
                        <option value="Wage resolution">Wage Resolution</option>
                        <option value="Hostel Safety">Hostel & Transit Safety</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Telemetry Incident Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Parivaar Rozgar Patra generated for EV diagnostics track..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Incident to Telemetry Feed</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={onResetBaseline}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-amber-300 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Official Baseline</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
