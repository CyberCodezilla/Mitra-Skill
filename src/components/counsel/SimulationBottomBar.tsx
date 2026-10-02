import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import { TOPIC_LABELS, type Topic } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { Equalizer } from "./AiArbiterCard";

export function SimulationBottomBar({
  lang,
  listening,
  onSimulate,
}: {
  lang: Lang;
  listening: boolean;
  onSimulate: (who: "student" | "parent", topic?: Topic) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t bg-white/95 shadow-[0_-8px_28px_rgba(15,41,66,0.1)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-success/10 p-2 text-sm font-medium text-navy"
            >
              <Equalizer /> Recording voice in Hindi... /{" "}
              <span lang="hi">आवाज़ रिकॉर्ड हो रही है...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-sm text-muted-foreground">Quick objections:</span>
          {(Object.keys(TOPIC_LABELS) as Topic[]).map((topic) => (
            <button
              key={topic}
              disabled={listening}
              onClick={() => onSimulate("parent", topic)}
              className="rounded-full border border-parent/40 bg-parent-soft px-3 py-1.5 text-sm font-medium text-navy disabled:opacity-60"
            >
              {TOPIC_LABELS[topic][lang]}
            </button>
          ))}
        </div>
        <div data-tour="tour-mic-bar" className="grid grid-cols-2 gap-2">
          <button
            disabled={listening}
            onClick={() => onSimulate("student")}
            className="mic-ripple-blue relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-student px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Mic className="h-5 w-5" /> Speak as Student{" "}
            <span className="hidden sm:inline">(अमन)</span>
          </button>
          <button
            disabled={listening}
            onClick={() => onSimulate("parent")}
            className="mic-ripple-parent relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-parent px-3 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Mic className="h-5 w-5" /> Speak as Parent{" "}
            <span className="hidden sm:inline">(रमेश)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
