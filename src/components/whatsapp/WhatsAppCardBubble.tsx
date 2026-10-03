import { useState } from "react";
import { BadgeCheck, Download, ExternalLink, PhoneCall, ShieldCheck } from "lucide-react";
import type { WACardAction, WAMessage } from "@/data/mockWhatsAppFlow";
import type { WAThemeTokens } from "./whatsappTheme";

interface WhatsAppCardBubbleProps {
  message: WAMessage;
  theme: WAThemeTokens;
  isDark: boolean;
  onActionTrigger?: (notice: string) => void;
}

export function WhatsAppCardBubble({
  message,
  theme,
  isDark: _isDark,
  onActionTrigger,
}: WhatsAppCardBubbleProps) {
  const card = message.cardData;
  const [clickedActionId, setClickedActionId] = useState<string | null>(null);

  if (!card) return null;

  const handleActionClick = (action: WACardAction) => {
    setClickedActionId(action.id);
    setTimeout(() => setClickedActionId(null), 1500);

    if (action.type === "call") {
      onActionTrigger?.(`📞 नोडल अधिकारी संपर्क: ${action.payload}`);
    } else if (action.type === "download") {
      onActionTrigger?.("📜 परिवार सहमति पत्र (PDF) डाउनलोड शुरू हुआ! (Demo File Generated)");
      // Simulate downloading or copying link
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(action.payload).catch(() => {});
      }
    } else {
      onActionTrigger?.(`🔗 खोला गया: ${action.payload}`);
    }
  };

  return (
    <div
      className="relative max-w-[94%] select-none self-start rounded-2xl rounded-tl-none shadow-sm transition-colors duration-150 overflow-hidden"
      style={{
        backgroundColor: theme.botBubbleBg,
        color: theme.botBubbleText,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      {/* Authentic Corner Triangle Tail anchored top-left */}
      <svg
        viewBox="0 0 8 13"
        height="13"
        width="8"
        className="pointer-events-none absolute -left-2 top-0"
        style={{ color: theme.botBubbleBg }}
      >
        <path
          d="M2.812 1H8v11.193L1.533 3.568C.474 2.156 1.042 1 2.812 1z"
          fill="currentColor"
        />
      </svg>

      {/* Card Header with Verified Badge & Verification Pill */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 border-b"
        style={{
          borderColor: theme.cardDivider,
          backgroundColor: _isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 128, 105, 0.04)",
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <BadgeCheck className="h-4 w-4 shrink-0 text-[#00A884]" />
          <span className="text-[11px] font-bold tracking-tight text-[#00A884] truncate">
            {card.subtitle ?? "MSDE • DGT Verified Trade Guide"}
          </span>
        </div>
        {card.badge && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[8.5px] font-bold shadow-2xs"
            style={{
              backgroundColor: _isDark ? "rgba(0, 168, 132, 0.2)" : "#E1F2EC",
              color: "#00A884",
            }}
          >
            {card.badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3">
        {/* Trade Title */}
        <h4 className="text-[13px] font-bold leading-snug tracking-tight text-inherit">
          {card.title}
        </h4>

        {/* Bulleted Key Metrics */}
        <div className="mt-2.5 space-y-2 text-[11px] leading-relaxed">
          {card.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg p-1.5 transition-colors"
              style={{
                backgroundColor: _isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
              }}
            >
              <div className="min-w-0 flex-1 font-medium">{metric}</div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        {card.footer && (
          <div
            className="mt-2 flex items-center gap-1 text-[9.5px] italic leading-tight"
            style={{ color: theme.timestampText }}
          >
            <ShieldCheck className="h-3 w-3 shrink-0 text-[#00A884]" />
            <span className="truncate">{card.footer}</span>
          </div>
        )}

        {/* Message Timestamp */}
        <div
          className="mt-1 flex justify-end text-[9px] font-medium"
          style={{ color: theme.timestampText }}
        >
          {message.timestamp}
        </div>
      </div>

      {/* Card Divider */}
      <div className="h-[1px] w-full" style={{ backgroundColor: theme.cardDivider }} />

      {/* Quick-Action Buttons (Native WhatsApp Cloud API Template Style) */}
      <div className="flex flex-col divide-y" style={{ borderColor: theme.cardDivider }}>
        {card.actions && card.actions.length > 0 ? (
          card.actions.map((action) => {
            const isClicked = clickedActionId === action.id;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 py-2.5 px-3 text-[12px] font-semibold transition active:bg-black/10 hover:bg-black/5"
                style={{
                  color: isClicked ? "#25D366" : "#00A884",
                }}
              >
                {action.type === "call" ? (
                  <PhoneCall className="h-3.5 w-3.5 transition group-hover:scale-110" />
                ) : action.type === "download" ? (
                  <Download className="h-3.5 w-3.5 transition group-hover:scale-110" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5 transition group-hover:scale-110" />
                )}
                <span>{isClicked ? "चयनित (Selected) ✓" : action.label}</span>
              </button>
            );
          })
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                handleActionClick({
                  id: "default_call",
                  label: "📞 नोडल अधिकारी से बात करें",
                  type: "call",
                  payload: "+91 98765 43210 (मेरठ ITI)",
                })
              }
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[#00A884] transition active:bg-black/10 hover:bg-black/5"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>📞 नोडल अधिकारी से बात करें</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleActionClick({
                  id: "default_download",
                  label: "📜 परिवार सहमति पत्र डाउनलोड",
                  type: "download",
                  payload: "https://mitraskill.msde.gov.in/docs/family-consent-form-hi.pdf",
                })
              }
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[#00A884] transition active:bg-black/10 hover:bg-black/5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>📜 परिवार सहमति पत्र डाउनलोड</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
