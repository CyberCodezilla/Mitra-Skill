import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Laptop,
} from "lucide-react";
import { DEMO_CREDENTIALS } from "@/hooks/useAdminAuth";

interface AdminLoginPortalProps {
  onLogin: (username: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  onQuickDemoLogin: () => Promise<{ success: boolean; error?: string }>;
  lockoutRemaining: number;
  lang?: string;
}

export function AdminLoginPortal({
  onLogin,
  onQuickDemoLogin,
  lockoutRemaining,
  lang = "en",
}: AdminLoginPortalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [justAutofilled, setJustAutofilled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both Administrator ID and Passcode.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await onLogin(username, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setErrorMsg("An unexpected authentication error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillAndLogin = async () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setJustAutofilled(true);
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(async () => {
      try {
        const res = await onQuickDemoLogin();
        if (!res.success) {
          setErrorMsg(res.error || "Failed to log in with demo credentials.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const isLockedOut = lockoutRemaining > 0;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-slate-900 via-navy to-slate-950 opacity-95" />
      
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-xl overflow-hidden rounded-3xl border-2 border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl text-white"
      >
        {/* National Tricolor Institutional Accent Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Header Header */}
        <div className="p-6 sm:p-8 pb-5 text-center border-b border-slate-800/80 bg-slate-950/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-400/60 bg-navy shadow-lg ring-4 ring-amber-500/20 text-amber-300 mb-3.5">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 px-3 py-0.5 text-[11px] font-black tracking-wider uppercase text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Government of India · MSDE Official Portal
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2.5">
            Administrator Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto mt-1">
            Directorate General of Training (DGT) · National ITI Telemetry & Scheme Governance
          </p>
        </div>

        {/* Demo Credentials Notice Placard (Prominently Shown for Evaluators) */}
        <div className="p-5 sm:p-6 pb-2">
          <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-slate-900/80 to-emerald-500/10 p-4 sm:p-5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/30 text-amber-300 text-xs font-bold">
                  ⚡
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Demo Evaluator Credentials
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                Pre-authorized Demo Access
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Admin User ID</div>
                <div className="font-mono font-black text-amber-200 text-xs sm:text-sm select-all">
                  {DEMO_CREDENTIALS.username}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Passcode</div>
                <div className="font-mono font-black text-amber-200 text-xs sm:text-sm select-all">
                  {DEMO_CREDENTIALS.password}
                </div>
              </div>
            </div>

            {/* Quick 1-Click Fill & Login Button */}
            <button
              type="button"
              onClick={handleAutofillAndLogin}
              disabled={isSubmitting || isLockedOut}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>1-Click Autofill Demo Credentials & Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Standard Manual Login Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 pt-2 space-y-4">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 p-3 text-xs text-rose-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="font-semibold leading-relaxed">{errorMsg}</div>
              </motion.div>
            )}

            {isLockedOut && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl border border-amber-500/60 bg-amber-950/50 p-3 text-xs text-amber-200"
              >
                <Clock className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-bold">Security Lockout Active</div>
                  <div className="text-[11px] text-amber-300/90 mt-0.5">
                    Multiple failed authentication attempts detected. Please wait{" "}
                    <strong className="font-mono font-black text-amber-100">{lockoutRemaining}s</strong> before retrying.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User ID Field */}
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Administrator ID / Official Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting || isLockedOut}
                placeholder="e.g. admin@msde.gov.in"
                className="w-full rounded-xl border-2 border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Passcode
              </label>
              {isCapsLockOn && (
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ⚠️ Caps Lock is ON
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyDown}
                disabled={isSubmitting || isLockedOut}
                placeholder="Enter passcode"
                className="w-full rounded-xl border-2 border-slate-700 bg-slate-950/80 pl-10 pr-10 py-2.5 text-sm font-semibold text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400/40"
              />
              <span className="text-xs font-semibold text-slate-300">
                Remember session on this device
              </span>
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              8-Hour Session Duration
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLockedOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 ring-2 ring-emerald-500/20"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Cryptographic Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Authenticate & Access Console</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Sandbox Privacy Assurance Strip */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 text-slate-400 text-[11px] space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Browser-Scoped Sandbox Assurance:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Any telemetry edits, threshold updates, or filter overrides made in this admin session are stored
            <strong className="text-slate-200"> strictly within your local browser storage</strong>. They will never alter or pollute the public deployment for other users.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[10px] text-slate-500">
            <span>• SHA-256 Hashed Verification</span>
            <span>• Zero Server-Side Secret Storage</span>
            <span>• Sandboxed localStorage Isolation</span>
          </div>
        </div>

        {/* Footer Navigation Back to Family Guidance */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <Link
            to="/counsel"
            className="inline-flex items-center gap-1.5 font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Family Guidance Portal</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-500">v2.4-GovDemo</span>
        </div>
      </motion.div>
    </div>
  );
}
