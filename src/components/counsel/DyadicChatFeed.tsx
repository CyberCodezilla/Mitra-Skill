import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { ChatItem } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { AiArbiterCard } from "./AiArbiterCard";

type Props = {
  items: ChatItem[];
  lang: Lang;
  activity: "student" | "parent" | "arbiter" | null;
  endRef: React.RefObject<HTMLDivElement | null>;
  onRoi: () => void;
  onAlumni: () => void;
};

export function DyadicChatFeed({ items, lang, activity, endRef, onRoi, onAlumni }: Props) {
  return (
    <div
      data-tour="tour-chat-feed"
      className="mx-auto max-w-5xl space-y-5 px-4 py-6"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {items.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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

function TypingIndicator({
  activity,
  lang,
}: {
  activity: "student" | "parent" | "arbiter";
  lang: Lang;
}) {
  const arbiter = activity === "arbiter";
  const label = arbiter
    ? lang === "hi" ? "MitraSkill Arbiter" : "MitraSkill Arbiter"
    : activity === "student" ? "Aman · Student" : "Ramesh · Parent";
  const detail = arbiter
    ? lang === "hi"
      ? "आपकी बात समझ रहा है और सत्यापित ट्रेड जानकारी जाँच रहा है"
      : "Understanding the concern and checking verified trade data"
    : lang === "hi" ? "संदेश लिख रहे हैं" : "is typing";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      role="status"
      aria-live="polite"
      className={`flex ${activity === "parent" ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex max-w-[min(88%,36rem)] items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${arbiter ? "border-indigo-200 bg-indigo-50/80 text-indigo-950" : activity === "student" ? "border-blue-200 bg-blue-50/90 text-blue-950" : "border-amber-200 bg-amber-50/90 text-amber-950"}`}
      >
        {!arbiter && (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity === "student" ? "bg-student-soft text-student" : "bg-parent-soft text-parent"}`}>
            {activity === "student" ? <GraduationCap className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          </div>
        )}
        <div>
          <div className="text-xs font-bold">{label}</div>
          <div className="mt-1 flex items-center gap-2 text-xs opacity-80">
            <span>{detail}</span>
            <span className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-current"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                  transition={{ duration: 0.85, repeat: Infinity, delay: dot * 0.15 }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChatBubble({
  kind,
  text,
  lang,
}: {
  kind: "student" | "parent";
  text: string;
  lang: Lang;
}) {
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
