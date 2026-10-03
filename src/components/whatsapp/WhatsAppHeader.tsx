import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Phone,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import type { WAThemeTokens } from "./whatsappTheme";

interface WhatsAppHeaderProps {
  theme: WAThemeTokens;
  isDark: boolean;
  isTyping: boolean;
  typingState?: "typing" | "recording" | "online";
  onActionNotice?: (msg: string) => void;
}

export function WhatsAppHeader({
  theme,
  isDark: _isDark,
  isTyping,
  typingState = "online",
  onActionNotice,
}: WhatsAppHeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCall = () => {
    onActionNotice?.("📞 WhatsApp Audio Call: Connecting to Nodal Counselor (+91 98765 43210)...");
  };

  const handleVideo = () => {
    onActionNotice?.("📹 WhatsApp Video Call: Counselor live stream queue (Position #1)");
  };

  return (
    <>
      <header
        className="relative z-20 flex h-[62px] shrink-0 items-center justify-between px-2.5 shadow-sm transition-colors duration-200 select-none"
        style={{
          backgroundColor: theme.appBarBg,
          color: theme.appBarText,
        }}
      >
        {/* Left: Back & Profile */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            aria-label="Back navigation"
            onClick={() => onActionNotice?.("Navigated back to Chats")}
            className="flex h-9 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left transition-opacity hover:opacity-95"
            title="View Business Profile"
          >
            {/* Avatar with Verified Badge Overlay */}
            <div className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#E1F2EC] text-[12px] font-black text-[#008069] ring-1 ring-white/30 shadow-inner">
              MS
              <span
                className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white text-[#00A884] shadow-sm"
                style={{ borderColor: theme.appBarBg }}
              >
                <BadgeCheck className="h-3 w-3 fill-[#00A884] text-white" />
              </span>
            </div>

            {/* Profile Name & Status Indicator */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[13.5px] font-bold leading-tight tracking-tight">
                <span className="truncate">MitraSkill Sahayak</span>
                <span className="shrink-0 text-xs">🤖</span>
              </div>
              <div
                className="truncate text-[10.5px] font-medium leading-tight transition-all duration-200"
                style={{
                  color:
                    isTyping && typingState === "recording"
                      ? "#25D366"
                      : isTyping
                        ? "#9AE6B4"
                        : theme.appBarSubtext,
                }}
              >
                {isTyping ? (
                  typingState === "recording" ? (
                    <span className="inline-flex items-center gap-1 font-semibold italic animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                      recording audio...
                    </span>
                  ) : (
                    <span className="font-semibold italic">typing...</span>
                  )
                ) : (
                  "Official Business Account • online"
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Voice Call"
            onClick={handleCall}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
          >
            <Phone className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Video Call"
            onClick={handleVideo}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
          >
            <Video className="h-[19px] w-[19px]" />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="More options"
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
            >
              <MoreVertical className="h-[18px] w-[18px]" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-1 top-10 z-40 w-48 rounded-xl border border-slate-700/40 bg-slate-900 py-1.5 text-xs text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-800"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Business info
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onActionNotice?.("Mute notifications enabled for 8 hours");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-800"
                  >
                    Mute notifications
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onActionNotice?.("Report & Block: Verified MSDE official account");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-300 hover:bg-slate-800"
                  >
                    Verify credentials
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Verified Business Profile Modal */}
      {showProfileModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
            <div className="relative flex flex-col items-center bg-slate-800/80 px-4 pb-4 pt-6 text-center">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="absolute right-3 top-3 rounded-full bg-slate-700/50 p-1 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 text-xl font-black text-emerald-300 ring-2 ring-emerald-500/50">
                MS
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00A884] text-white shadow">
                  <BadgeCheck className="h-4 w-4 fill-[#00A884] text-white" />
                </span>
              </div>

              <h3 className="mt-2.5 flex items-center gap-1.5 text-base font-bold">
                MitraSkill Sahayak
                <ShieldCheck className="h-4 w-4 text-[#25D366]" />
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">Official Business Account</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Ministry of Skill Development & Entrepreneurship (MSDE)
              </p>
            </div>

            <div className="space-y-3 p-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  DGT Tracer Audit Grounded
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Provides verified, regional-language ITI trade guidance, placement statistics, and
                  mobility pathways directly to rural guardians with zero LLM hallucination.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verified Category:</span>
                  <span className="font-semibold text-emerald-300">Education & Vocational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cloud API ID:</span>
                  <span className="font-mono text-slate-300">MSDE_WA_V2_26241</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Encryption:</span>
                  <span className="font-semibold text-emerald-300">256-bit TLS Gateway</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#00A884] py-2 font-bold text-white shadow-sm transition hover:bg-[#008f70]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
