import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { Bi, ChatItem } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { AiArbiterCard } from "./AiArbiterCard";

type Activity =
  | { id: string; kind: "student" | "parent"; tradeId?: never; text: Bi }
  | { id: string; kind: "arbiter"; tradeId: string; text: Bi }
  | null;

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
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 330, damping: 30, mass: 0.85 }}
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
        {activity && (
          <motion.div
            key={activity.id}
            layout
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 330, damping: 30, mass: 0.85 }}
          >
            {activity.kind === "arbiter" ? (
              <AiArbiterCard
                tradeId={activity.tradeId}
                text={activity.text}
                isGenerating
                lang={lang}
                onRoi={onRoi}
                onAlumni={onAlumni}
              />
            ) : (
              <ChatBubble
                kind={activity.kind}
                text={activity.text[lang]}
                lang={lang}
                isSending
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}

function ChatBubble({
  kind,
  text,
  lang,
  isSending = false,
}: {
  kind: "student" | "parent";
  text: string;
  lang: Lang;
  isSending?: boolean;
}) {
  const student = kind === "student";
  const name = student ? "Aman (Student)" : "Ramesh (Father)";
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
          {name}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {isSending ? (
            <motion.div
              key="sending"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              role="status"
              aria-live="polite"
              className="flex min-h-7 items-center gap-2 text-sm text-slate-600"
            >
              <span>{lang === "hi" ? `${student ? "Aman" : "Ramesh"} कुछ कह रहे हैं…` : `${student ? "Aman" : "Ramesh"} is saying something…`}</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-current"
                    animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.7, ease: "easeInOut", repeat: Infinity, delay: dot * 0.13 }}
                  />
                ))}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="message"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              lang={lang}
            >
              {text}
            </motion.p>
          )}
        </AnimatePresence>
      </article>
    </div>
  );
}
