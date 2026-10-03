import React from "react";
import { CheckCircle2, TrendingUp, Building2, ExternalLink } from "lucide-react";
import type { WAThemeTokens } from "./whatsappTheme";

interface WhatsAppCardBubbleProps {
  cardData: {
    tradeTitle: string;
    metrics: { label: string; value: string; icon: string }[];
    auditTag: string;
    actionButtons: string[];
  };
  timestamp: string;
  theme: WAThemeTokens;
  onActionClick: (action: string) => void;
}

const renderMetricIcon = (iconName: string) => {
  if (iconName === "CheckCircle2") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />;
  if (iconName === "TrendingUp") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />;
  if (iconName === "Building2") return <Building2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />;
  return <span className="text-emerald-500 font-bold mt-0.5 shrink-0">•</span>;
};

export const WhatsAppCardBubble: React.FC<WhatsAppCardBubbleProps> = ({
  cardData,
  timestamp,
  theme,
  onActionClick,
}) => {
  return (
    <div className="flex w-full my-1.5 justify-start select-none">
      <div
        className="relative max-w-[88%] sm:max-w-[330px] rounded-2xl shadow-sm overflow-hidden text-xs transition-colors duration-150"
        style={{
          backgroundColor: theme.botBubbleBg,
          color: theme.botBubbleText,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >
        {/* Native Bubble Corner Tail */}
        <div
          className="absolute top-0 w-3 h-3 pointer-events-none"
          style={{
            left: "-6px",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
            backgroundColor: theme.botBubbleBg,
          }}
        />

        {/* Header Ribbon */}
        <div className="p-3 border-b" style={{ borderColor: theme.cardDivider }}>
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            MitraSkill Verified Advisory
          </span>
          <h4 className="font-bold text-sm mt-0.5 leading-snug">{cardData.tradeTitle}</h4>
        </div>

        {/* Metrics List */}
        <div className="p-3 space-y-2">
          {cardData.metrics.map((m, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              {renderMetricIcon(m.icon)}
              <div>
                <span className="opacity-75 block text-[10px]">{m.label}</span>
                <span className="font-bold text-[11.5px] leading-tight">{m.value}</span>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
            {cardData.auditTag}
          </p>
        </div>

        {/* Interactive Action Buttons */}
        <div className="border-t" style={{ borderColor: theme.cardDivider }}>
          {cardData.actionButtons.map((btn, bIdx) => (
            <button
              key={bIdx}
              type="button"
              onClick={() => onActionClick(btn)}
              className="w-full py-2.5 px-3 text-center text-xs font-bold transition-colors border-b last:border-b-0 hover:bg-black/5 active:bg-black/10 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                color: theme.cardBtnText,
                borderColor: theme.cardDivider,
              }}
            >
              <span>{btn}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          ))}
        </div>

        <div
          className="px-3 pb-1 text-right text-[9px] font-mono opacity-60"
          style={{ color: theme.timestampText }}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};
