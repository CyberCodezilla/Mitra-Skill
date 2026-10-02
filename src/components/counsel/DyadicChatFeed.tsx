import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import type { Bi, ChatItem } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { AiArbiterCard } from "./AiArbiterCard";

type Activity =
  | {
  id: string;
  kind: "student" | "parent";
  text: Bi;
  thinkingMs: number;
  typingMs: number;
}
  | {
      id: string;
      kind: "arbiter";
      tradeId: string;
      text: Bi;
      thinkingMs: number;
      typingMs: number;
    };
type MaybeActivity = Activity | null;

type Props = {
  items: ChatItem[];
  lang: Lang;
  activity: MaybeActivity;
  endRef: React.RefObject<HTMLDivElement | null>;
  onRoi: () => void;
  onAlumni: () => void;
};

export function DyadicChatFeed({ items, lang, activity, endRef, onRoi, onAlumni }: Props) {
  const draftText = useRevealedText(activity, lang);
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
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 330, damping: 28, mass: 0.8 }}
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
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 330, damping: 28, mass: 0.8 }}
          >
            {activity.kind === "arbiter" ? (
              <AiArbiterCard
                tradeId={activity.tradeId}
                text={activity.text}
                visibleText={draftText}
                isGenerating
                lang={lang}
                onRoi={onRoi}
                onAlumni={onAlumni}
              />
            ) : (
              <ChatBubble kind={activity.kind} text={draftText} lang={lang} isSending />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}

function useRevealedText(activity: MaybeActivity, lang: Lang) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!activity) {
      setVisibleText("");
      return;
    }
    const characters = Array.from(activity.text[lang]);
    let start: number | undefined;
    let frame = 0;
    const reveal = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      const progress = Math.max(0, Math.min(1, (elapsed - activity.thinkingMs) / activity.typingMs));
      const count = Math.ceil(characters.length * progress);
      setVisibleText(characters.slice(0, count).join(""));
      if (elapsed < activity.thinkingMs + activity.typingMs) frame = window.requestAnimationFrame(reveal);
    };
    setVisibleText("");
    frame = window.requestAnimationFrame(reveal);
    return () => window.cancelAnimationFrame(frame);
  }, [activity?.id, activity?.text, activity?.thinkingMs, activity?.typingMs, lang]);

  return visibleText;
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
        <p lang={lang} className="whitespace-pre-wrap">
          {text}
          {isSending && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-text-bottom" aria-hidden="true" />}
        </p>
      </article>
    </div>
  );
}
