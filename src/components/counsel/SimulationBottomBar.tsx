import { Send } from "lucide-react";
import { TOPIC_LABELS, type Topic } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";

export function SimulationBottomBar({
  lang,
  busy,
  onSimulate,
}: {
  lang: Lang;
  busy: boolean;
  onSimulate: (who: "student" | "parent", topic?: Topic) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 shadow-[0_-8px_28px_rgba(15,41,66,0.1)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
            {lang === "hi" ? "अभिभावक की चिंता:" : "Parent asks:"}
          </span>
          {(Object.keys(TOPIC_LABELS) as Topic[]).map((topic) => (
            <button
              key={topic}
              disabled={busy}
              onClick={() => onSimulate("parent", topic)}
              className="shrink-0 rounded-full border border-parent/35 bg-parent-soft px-3 py-1 text-xs font-medium text-navy transition hover:border-parent hover:bg-parent/15 disabled:cursor-wait disabled:opacity-50"
            >
              {TOPIC_LABELS[topic][lang]}
            </button>
          ))}
        </div>
        <div data-tour="tour-mic-bar" className="grid grid-cols-2 gap-2">
          <button
            disabled={busy}
            onClick={() => onSimulate("student")}
            className="mic-ripple-blue flex items-center justify-center gap-2 rounded-xl bg-student px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-student/90 disabled:cursor-wait disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {lang === "hi" ? "छात्र का जवाब भेजें" : "Send student reply"}
          </button>
          <button
            disabled={busy}
            onClick={() => onSimulate("parent")}
            className="mic-ripple-parent flex items-center justify-center gap-2 rounded-xl bg-parent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-parent/90 disabled:cursor-wait disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {lang === "hi" ? "अभिभावक का जवाब भेजें" : "Send parent reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
