import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { Bi, ChatItem, Topic } from "@/data/dialogueScripts";
import type { Lang } from "@/lib/app-context";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";
import type { ArbiterTopic } from "@/data/arbiterEvidence";
import { AiArbiterCard } from "./AiArbiterCard";

type Activity =
  | { id: string; kind: "student" | "parent"; tradeId?: never; text: Bi; thinkingMs: number; topic?: Topic | undefined }
  | { id: string; kind: "arbiter"; tradeId: string; text: Bi; thinkingMs: number; topic?: ArbiterTopic | undefined }
  | null;

type Props = {
  items: ChatItem[];
  lang: SupportedLanguage | Lang;
  activity: Activity;
  endRef: React.RefObject<HTMLDivElement | null>;
  onRoi: () => void;
  onAlumni: () => void;
  onEscalate: () => void;
};

const SPEAKER_NAMES: Record<SupportedLanguage, { student: string; parent: string }> = {
  en: { student: "Aman (Student)", parent: "Ramesh (Father)" },
  hi: { student: "अमन (छात्र)", parent: "रमेश (पिता)" },
  mr: { student: "अमन (विद्यार्थी)", parent: "रमेश (वडील)" },
  bn: { student: "আমান (ছাত্র)", parent: "রমেশ (পিতা)" },
  ta: { student: "அமன் (மாணவர்)", parent: "ரமேஷ் (தந்தை)" },
};

const TYPING_INDICATORS: Record<SupportedLanguage, { student: string; parent: string }> = {
  en: { student: "Aman is typing…", parent: "Ramesh is typing…" },
  hi: { student: "अमन कुछ कह रहे हैं…", parent: "रमेश कुछ कह रहे हैं…" },
  mr: { student: "अमन संदेश लिहीत आहेत…", parent: "रमेश संदेश लिहीत आहेत…" },
  bn: { student: "আমান বার্তা লিখছেন…", parent: "রমেশ বার্তা লিখছেন…" },
  ta: { student: "அமன் கருத்து தெரிவிக்கிறார்…", parent: "ரமேஷ் கருத்து தெரிவிக்கிறார்…" },
};

export function DyadicChatFeed({
  items,
  lang,
  activity,
  endRef,
  onRoi,
  onAlumni,
  onEscalate,
}: Props) {
  const { language } = useLanguageVoice();
  const activeLang: SupportedLanguage =
    (language as SupportedLanguage) || (lang as SupportedLanguage) || "hi";

  return (
    <div
      data-tour="tour-chat-feed"
      className="mx-auto max-w-5xl space-y-5 px-4 py-6"
      aria-live="off"
    >
      <AnimatePresence initial={false}>
        {items.map((message) => {
          const messageText =
            message.text[activeLang] || message.text.hi || message.text.en || "";
          return (
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
                  topic={message.topic}
                  lang={activeLang}
                  onRoi={onRoi}
                  onAlumni={onAlumni}
                  onEscalate={onEscalate}
                />
              ) : (
                <ChatBubble kind={message.kind} text={messageText} lang={activeLang} />
              )}
            </motion.div>
          );
        })}
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
                topic={activity.topic}
                isGenerating
                lang={activeLang}
                onRoi={onRoi}
                onAlumni={onAlumni}
                onEscalate={onEscalate}
              />
            ) : (
              <ChatBubble
                kind={activity.kind}
                text={activity.text[activeLang] || activity.text.hi || activity.text.en || ""}
                lang={activeLang}
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
  lang: SupportedLanguage;
  isSending?: boolean;
}) {
  const student = kind === "student";
  const speaker = SPEAKER_NAMES[lang] || SPEAKER_NAMES.hi;
  const typing = TYPING_INDICATORS[lang] || TYPING_INDICATORS.hi;
  const name = student ? speaker.student : speaker.parent;
  const typingText = student ? typing.student : typing.parent;

  return (
    <div className={`flex items-start gap-3 ${student ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-xs ${
          student ? "bg-student-soft text-student" : "bg-parent-soft text-parent"
        }`}
      >
        {student ? <GraduationCap className="h-6 w-6" /> : <Users className="h-6 w-6" />}
      </div>
      <article
        className={`w-full max-w-xl rounded-2xl p-4 sm:p-5 text-slate-800 shadow-sm leading-relaxed break-words overflow-hidden ${
          student
            ? "rounded-tl-sm border-l-4 border-blue-500 bg-blue-50/80"
            : "ml-auto rounded-tr-sm border-r-4 border-amber-600 bg-amber-50/80"
        }`}
      >
        <div
          className={`mb-1.5 text-xs sm:text-sm font-bold ${
            student ? "text-blue-600" : "text-parent"
          }`}
        >
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
              className="flex min-h-7 items-center gap-2 text-xs sm:text-sm font-medium text-slate-600"
            >
              <span>{typingText}</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-current"
                    animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: 0.7,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: dot * 0.13,
                    }}
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
              className="text-sm sm:text-base leading-relaxed text-slate-800 break-words"
            >
              {text}
            </motion.p>
          )}
        </AnimatePresence>
      </article>
    </div>
  );
}
