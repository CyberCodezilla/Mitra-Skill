import { BatteryFull, Signal, Wifi } from "lucide-react";
import type { ReactNode } from "react";

export function PhoneMockupFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[780px] w-[min(410px,calc(100vw-24px))] rounded-[52px] border-[5px] border-slate-700 bg-slate-950 p-[7px] shadow-[0_35px_90px_-25px_rgba(15,23,42,0.72)] ring-1 ring-white/10">
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[40px] bg-[#efeae2]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-black"
        />
        <div className="relative z-10 flex h-8 shrink-0 items-center justify-between px-6 pt-1 text-[11px] font-bold text-slate-950">
          <span>10:15</span>
          <div
            className="flex items-center gap-1.5"
            aria-label="Mobile signal, Wi-Fi, full battery"
          >
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-4 w-4" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <div className="flex h-7 shrink-0 items-center justify-center bg-[#f7f5f1]">
          <span className="h-1 w-32 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
