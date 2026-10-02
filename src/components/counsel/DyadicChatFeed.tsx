import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GraduationCap, Sparkles, Users } from "lucide-react";
import type { ChatItem } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { AiArbiterCard } from "./AiArbiterCard";

type Activity = "student" | "parent" | "arbiter" | null;

type Props = {
  items: ChatItem[];
  lang: Lang;
  activity: Activity;
  endRef: React.RefObject<HTMLDivElement | null>;
  onRoi: () => void;
  onAlumni: () => void;
};

export function DyadicChatFeed({ items, lang, activity, endRef, onRoi, onAlumni }: Props) {
  return (
    <div
      data-tour="tour-chat-feed"
      className="mx-auto max-w-5xl space-y-5 px-4 py-6"
      aria-live="off"
    >
      <AnimatePresence initial={false}>
        {items.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 330, damping: 27, mass: 0.75 }}
          >
            {message.kind === "arbiter" ? (
              <AiArbiterCard
                tradeId={message.tradeId}
                text={message.text}
                lang={lang}
                onRoi={onRoi}
                onAlumni={onAlumni}
              />
            ) : (
              <ChatBubble kind={message.kind} text={message.text[lang]} lang={lang} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {activity && <TypingIndicator key={activity} activity={activity} lang={lang} />}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}

function TypingIndicator({ activity, lang }: { activity: Exclude<Activity, null>; lang: Lang }) {
  const arbiter = activity === "arbiter";
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    if (!arbiter) return;
    const timer = window.setInterval(() => setAnalysisStep((step) => (step + 1) % 3), 1100);
    return () => window.clearInterval(timer);
  }, [arbiter]);

  const analysis = lang === "hi"
    ? ["दोनों की बात समझ रहा है", "अभिभावक की चिंता पर विचार कर रहा है", "सोच-समझकर जवाब तैयार कर रहा है"][analysisStep]
    : ["Listening to both perspectives", "Considering the parent's concern", "Preparing a thoughtful response"][analysisStep];
  const speaker = activity === "student" ? "Aman" : "Ramesh";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      role="status"
      aria-live="polite"
      className={activity === "parent" ? "flex justify-end" : "flex justify-start"}
    >
      {arbiter ? (
        <div className="w-full max-w-xl rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-indigo-950 shadow-sm">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-white"
              animate={{ boxShadow: ["0 0 0 0 rgba(232,119,34,0)", "0 0 0 7px rgba(232,119,34,0.12)", "0 0 0 0 rgba(232,119,34,0)"] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold">MitraSkill Arbiter</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={analysisStep}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-0.5 text-sm text-indigo-900/75"
                >
                  {analysis}…
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex h-7 items-end gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1 rounded-full bg-indigo-500/75"
                  animate={{ height: [7, 20, 10, 16, 7], opacity: [0.45, 1, 0.6, 1, 0.45] }}
                  transition={{ duration: 1.05, repeat: Infinity, delay: bar * 0.12 }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-indigo-100">
            <motion.div
              className="h-full w-2/5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500"
              animate={{ x: ["-100%", "280%"] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </div>
      ) : (
        <div
          className={`flex max-w-[min(88%,36rem)] items-end gap-2.5 ${activity === "parent" ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity === "student" ? "bg-student-soft text-student" : "bg-parent-soft text-parent"}`}
          >
            {activity === "student" ? (
              <GraduationCap className="h-5 w-5" />
            ) : (
              <Users className="h-5 w-5" />
            )}
          </div>
          <div
            className={`rounded-2xl border px-4 py-2.5 shadow-sm ${activity === "student" ? "rounded-bl-sm border-blue-200 bg-blue-50/90 text-blue-950" : "rounded-br-sm border-amber-200 bg-amber-50/90 text-amber-950"}`}
          >
            <div className="mb-1 text-[11px] font-semibold opacity-70">
              {lang === "hi" ? `${speaker} कुछ कह रहे हैं…` : `${speaker} is saying something…`}
            </div>
            <div className="flex h-4 items-center gap-1.5 px-0.5" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-2 w-2 rounded-full bg-current opacity-60"
                  animate={{ y: [0, -5, 0], opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 0.72, ease: "easeInOut", repeat: Infinity, delay: dot * 0.14 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ChatBubble({ kind, text, lang }: { kind: "student" | "parent"; text: string; lang: Lang }) {
  const student = kind === "student";
  return (
    <div className={`flex items-start gap-3 ${student ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${student ? "bg-student-soft text-student" : "bg-parent-soft text-parent"}`}
      >
        {student ? <GraduationCap className="h-6 w-6" /> : <Users className="h-6 w-6" />}
      </div>
      <article
        className={`max-w-xl rounded-2xl p-4 text-slate-800 shadow-sm ${student ? "rounded-tl-sm border-l-4 border-blue-500 bg-blue-50/80" : "ml-auto rounded-tr-sm border-r-4 border-amber-600 bg-amber-50/80"}`}
      >
        <div className={`mb-1 text-sm font-semibold ${student ? "text-blue-600" : "text-parent"}`}>
          {student ? "Aman (Student)" : "Ramesh (Father)"}
        </div>
        <p lang={lang}>{text}</p>
      </article>
    </div>
  );
}
