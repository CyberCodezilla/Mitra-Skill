import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { ChatItem } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { AiArbiterCard } from "./AiArbiterCard";

type Props = {
  items: ChatItem[];
  lang: Lang;
  endRef: React.RefObject<HTMLDivElement | null>;
  onRoi: () => void;
  onAlumni: () => void;
};

export function DyadicChatFeed({ items, lang, endRef, onRoi, onAlumni }: Props) {
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
      <div ref={endRef} />
    </div>
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
