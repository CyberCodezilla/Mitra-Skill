import { useEffect, useState, type ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import type { WAThemeTokens } from "./whatsappTheme";

interface PhoneMockupFrameProps {
  children: ReactNode;
  theme: WAThemeTokens;
  isDark: boolean;
}

export function PhoneMockupFrame({ children, theme, isDark: _isDark }: PhoneMockupFrameProps) {
  const [timeString, setTimeString] = useState("9:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* Smartphone Chassis - Realistic Bezel with Titanium Edge & Gloss Ring */}
      <div className="relative h-[790px] w-[350px] sm:w-[390px] md:w-[410px] shrink-0 rounded-[52px] border-[10px] border-slate-800 bg-slate-950 p-[5px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black">
        {/* Hardware side button accents (Volume & Power) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[13px] top-[115px] h-11 w-[3px] rounded-l-sm bg-slate-700 shadow-xs"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[13px] top-[175px] h-11 w-[3px] rounded-l-sm bg-slate-700 shadow-xs"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[13px] top-[140px] h-16 w-[3px] rounded-r-sm bg-slate-700 shadow-xs"
        />

        {/* Screen Bezel & Display Area */}
        <div
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[40px] select-none transition-colors duration-200"
          style={{ backgroundColor: theme.chatBg }}
        >
          {/* Native Status Bar with Dynamic Island */}
          <div
            className="relative z-30 flex h-[34px] shrink-0 items-center justify-between px-6 pt-1 transition-colors duration-200"
            style={{
              backgroundColor: theme.appBarBg,
              color: theme.appBarText,
            }}
          >
            {/* Clock Time */}
            <span className="text-[12px] font-semibold tracking-tight tabular-nums">
              {timeString}
            </span>

            {/* Dynamic Island Pill with Camera Reflection */}
            <div
              aria-label="Dynamic Island"
              className="pointer-events-none absolute left-1/2 top-1.5 z-40 flex h-[22px] w-28 -translate-x-1/2 items-center justify-end rounded-full bg-black px-2 shadow-inner"
            >
              {/* Camera Lens Reflection Dot */}
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#08121a] ring-1 ring-slate-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#03070b] ring-1 ring-slate-800/80 shadow-2xs">
                  <span className="block h-1 w-1 rounded-full bg-blue-900/60 ml-0.5 mt-0.5" />
                </span>
              </div>
            </div>

            {/* Mobile Indicators: 5G Signal, Wi-Fi, 100% Battery */}
            <div
              className="flex items-center gap-1.5 text-[11px]"
              aria-label="Signal 5G, Wi-Fi, battery 100%"
            >
              <div className="flex items-center gap-0.5">
                <Signal className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold tracking-tighter opacity-90">5G</span>
              </div>
              <Wifi className="h-3.5 w-3.5" />
              <BatteryFull className="h-4 w-4" />
            </div>
          </div>

          {/* Phone Display Content (WhatsApp UI) */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>

          {/* Bottom Home Indicator Gesture Bar */}
          <div
            className="flex h-6 shrink-0 items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: theme.inputBarBg }}
          >
            <div className="h-1 w-32 rounded-full bg-slate-400/80 shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
