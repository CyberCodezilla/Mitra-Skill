import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  CheckCheck,
  CircleHelp,
  LockKeyhole,
  Mic,
  MoreVertical,
  Paperclip,
  Pause,
  Phone,
  Play,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { WHATSAPP_PROMPT_CHIPS, type PromptChip, type WAMessage } from "@/data/mockWhatsAppFlow";
import { useIndicVoice } from "@/utils/useIndicVoice";
import type { Lang } from "@/lib/app-context";

const initialMessage: WAMessage = {
  id: "hello",
  sender: "bot",
  type: "text",
  text: "नमस्ते रमेश जी! मैं MitraSkill Sahayak हूं। आप नीचे दिए गए सवाल चुन सकते हैं। यह एक डेमो सिमुलेशन है।",
  timestamp: "10:13 AM",
};

export function WhatsAppChatInterface({ lang, onReset }: { lang: Lang; onReset: number }) {
  const hi = lang === "hi";
  const [messages, setMessages] = useState<WAMessage[]>([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [micPromptIndex, setMicPromptIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMessages([initialMessage]);
    setIsTyping(false);
    setInput("");
    setMicPromptIndex(0);
    setNotice("");
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, [onReset]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const runReply = (chip: PromptChip) => {
    if (isTyping) return;
    setNotice("");
    setMessages((current) => [...current, chip.userMessage]);
    setIsTyping(true);
    setMicPromptIndex((WHATSAPP_PROMPT_CHIPS.indexOf(chip) + 1) % WHATSAPP_PROMPT_CHIPS.length);
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, ...chip.botReply]);
      setIsTyping(false);
      timerRef.current = null;
    }, 1200);
  };

  const sendText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;
    const now = new Date().toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        type: "text",
        text,
        timestamp: now,
        isRead: true,
      },
    ]);
    setInput("");
    setIsTyping(true);
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `fallback-${Date.now()}`,
          sender: "bot",
          type: "text",
          text: "यह डेमो केवल पहले से तैयार सवालों का जवाब देता है। कृपया नीचे कोई सवाल चुनें; वास्तविक चैट सेवा से कनेक्शन नहीं है।",
          timestamp: now,
        },
      ]);
      setIsTyping(false);
      timerRef.current = null;
    }, 1200);
  };

  const requestMicrophonePrompt = () => runReply(WHATSAPP_PROMPT_CHIPS[micPromptIndex]!);

  const showUnavailable = (label: string) => {
    setNotice(`${label} is not connected in this simulator.`);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#efeae2] text-slate-900">
      <div className="flex h-[62px] shrink-0 items-center gap-2 bg-[#008069] px-3 text-white shadow-sm">
        <button
          type="button"
          aria-label="Back"
          onClick={() => showUnavailable("Back navigation")}
          className="rounded-full p-1.5 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6e7ca] text-[11px] font-black text-[#075e54] ring-1 ring-white/40">
          MS
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#008069] bg-white text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5 fill-emerald-600 text-white" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold">MitraSkill Sahayak 🤖</div>
          <div className="truncate text-[10px] text-emerald-50/90">
            Demo Business Account · online
          </div>
        </div>
        <button
          type="button"
          aria-label="Voice call (demo)"
          onClick={() => showUnavailable("Calls")}
          className="rounded-full p-1.5 transition hover:bg-white/10"
        >
          <Phone className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Video call (demo)"
          onClick={() => showUnavailable("Video calls")}
          className="rounded-full p-1.5 transition hover:bg-white/10"
        >
          <Video className="h-[19px] w-[19px]" />
        </button>
        <button
          type="button"
          aria-label="More options"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full p-1 transition hover:bg-white/10"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      {menuOpen && (
        <div className="absolute right-5 top-[104px] z-30 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
          Demo account · no real messages
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.19]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%239c9487' stroke-width='1.2' stroke-linecap='round'%3E%3Cpath d='M15 20c10-10 20 10 30 0s20 10 30 0M80 58c0-10 18-10 18 0s-18 10-18 0zm-60 48 8-12 8 12-8 12zM54 63h15m-7-7v14M15 70c8 0 8 12 0 12s-8-12 0-12zM96 15c-9 5-10 15-2 20 6 4 13 0 13-6'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-[1] mx-auto mt-2 max-w-[90%] rounded-lg bg-[#fff4c8] px-3 py-2 text-center text-[9px] leading-snug text-[#53625e] shadow-sm">
          <LockKeyhole className="mr-1 inline h-3 w-3" />
          Demo only · no real account or end-to-end encrypted MSDE service is connected.
        </div>

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2.5 py-3 [scrollbar-width:thin]">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex max-w-[78%] items-center gap-2 self-start rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[10px] text-slate-600 shadow-sm">
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00a884]"
                    style={{ animationDelay: `${dot * 0.12}s` }}
                  />
                ))}
              </span>
              {hi
                ? "MitraSkill टाइप कर रहा है… वॉइस नोट तैयार कर रहा है"
                : "MitraSkill is typing… recording a voice reply"}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {notice && (
          <div
            role="status"
            className="relative z-[2] mx-3 mb-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-[10px] text-white"
          >
            {notice}
          </div>
        )}
        <div className="relative z-[2] shrink-0 border-t border-black/5 bg-[#f7f5f1] pt-1.5">
          <div
            className="flex gap-2 overflow-x-auto px-2.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={hi ? "त्वरित सवाल" : "Quick questions"}
          >
            {WHATSAPP_PROMPT_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                disabled={isTyping}
                onClick={() => runReply(chip)}
                className="shrink-0 cursor-pointer rounded-full border border-[#9ac8b8] bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#075e54] shadow-sm transition hover:border-[#008069] hover:bg-[#e7f5ef] disabled:cursor-wait disabled:opacity-50"
              >
                {hi ? chip.label_hi : chip.label_en}
              </button>
            ))}
          </div>
          <form onSubmit={sendText} className="flex items-center gap-1.5 px-2 pb-1.5">
            <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1 rounded-full bg-white px-2.5 shadow-sm">
              <button
                type="button"
                aria-label="Emoji (demo)"
                onClick={() => showUnavailable("Emoji picker")}
                className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <Smile className="h-[18px] w-[18px]" />
              </button>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={hi ? "Type a message / संदेश लिखें..." : "Type a message..."}
                className="min-w-0 flex-1 bg-transparent py-2 text-xs text-slate-800 outline-none placeholder:text-slate-500"
                aria-label="Type a message"
              />
              <button
                type="button"
                aria-label="Attach file (demo)"
                onClick={() => showUnavailable("Attachments")}
                className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <Paperclip className="h-[17px] w-[17px]" />
              </button>
              <button
                type="button"
                aria-label="Camera (demo)"
                onClick={() => showUnavailable("Camera")}
                className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <Camera className="h-[17px] w-[17px]" />
              </button>
            </div>
            {input.trim() ? (
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm transition hover:bg-[#008f70]"
              >
                <Send className="ml-0.5 h-[18px] w-[18px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={requestMicrophonePrompt}
                disabled={isTyping}
                aria-label="Play next demo voice prompt"
                title="Run next sample prompt"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm transition hover:bg-[#008f70] disabled:opacity-50"
              >
                <Mic className="h-[19px] w-[19px]" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: WAMessage }) {
  const isUser = message.sender === "user";
  if (message.type === "card") return <VerifiedSummaryCard message={message} />;
  const bubbleClass = isUser
    ? "self-end rounded-tr-sm bg-[#d9fdd3]"
    : "self-start rounded-tl-sm bg-white";
  return (
    <div className={`max-w-[88%] rounded-xl px-2.5 py-2 shadow-sm ${bubbleClass}`}>
      {message.type === "voice" ? (
        <VoicePlayer message={message} isUser={isUser} />
      ) : (
        <p className="whitespace-pre-wrap text-[12px] leading-[1.4] text-slate-900">
          {message.text}
        </p>
      )}
      <div className="mt-1 flex items-center justify-end gap-1 text-[9px] leading-none text-slate-500">
        <span>{message.timestamp}</span>
        {isUser &&
          (message.isRead ? (
            <CheckCheck className="h-3.5 w-3.5 text-sky-600" />
          ) : (
            <Check className="h-3 w-3" />
          ))}
      </div>
    </div>
  );
}

function VoicePlayer({ message, isUser }: { message: WAMessage; isUser: boolean }) {
  const { speak, stop, isSpeaking, isSupported } = useIndicVoice();
  const [simulated, setSimulated] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioTimer = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const durationSeconds = Math.max(8, Number(message.voiceDuration?.split(":")[1] ?? 18));
  const active = isSpeaking || simulated;

  useEffect(() => {
    if (!active) return;
    if (startedAt.current === null) startedAt.current = Date.now();
    audioTimer.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt.current!;
      const maxProgress = isSpeaking ? 96 : 100;
      const next = Math.min(maxProgress, (elapsed / (durationSeconds * 1000)) * 100);
      setProgress(next);
      if (next >= 100 && simulated) {
        setSimulated(false);
        startedAt.current = null;
        if (audioTimer.current !== null) window.clearInterval(audioTimer.current);
        audioTimer.current = null;
      }
    }, 80);
    return () => {
      if (audioTimer.current !== null) window.clearInterval(audioTimer.current);
      audioTimer.current = null;
    };
  }, [active, durationSeconds, isSpeaking, simulated]);

  useEffect(() => () => stop(), [stop]);

  const toggle = () => {
    if (active) {
      stop();
      setSimulated(false);
      setProgress(0);
      startedAt.current = null;
      return;
    }
    setProgress(0);
    startedAt.current = Date.now();
    if (isSupported && message.text) {
      speak(message.text, "hi", () => setProgress(100));
    } else {
      setSimulated(true);
    }
  };

  return (
    <div className="flex min-w-[210px] items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={active ? "Pause voice message" : "Play voice message"}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f70]"
      >
        {active ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div
          className="relative flex h-7 items-center gap-[2px] overflow-hidden"
          aria-label={active ? "Voice message playing" : "Voice message waveform"}
        >
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              className={`w-[2px] shrink-0 rounded-full ${active ? "bg-[#00a884]" : "bg-slate-400"} ${active ? "animate-pulse" : ""}`}
              style={{ height: `${5 + ((index * 11) % 17)}px`, animationDelay: `${index * 25}ms` }}
            />
          ))}
          <span
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#00a884] shadow"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-slate-500">
          <span>{message.voiceDuration ?? "0:18"}</span>
          <span>{active ? "Playing" : "Voice message"}</span>
        </div>
      </div>
      <div
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${isUser ? "bg-[#f0bc82] text-slate-800" : "bg-[#c5ded5] text-[#075e54]"}`}
      >
        {isUser ? "RS" : "MS"}
        <span className="absolute -bottom-1 -right-1 rounded-full bg-[#00a884] p-[2px] text-white">
          <Mic className="h-2 w-2" />
        </span>
      </div>
    </div>
  );
}

function VerifiedSummaryCard({ message }: { message: WAMessage }) {
  const card = message.cardData;
  if (!card) return null;
  return (
    <div className="max-w-[90%] self-start overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 bg-[#f3fbf6] px-3 py-2 text-[#075e54]">
        <span className="flex items-center gap-1.5 text-[10px] font-bold">
          <BadgeCheck className="h-4 w-4" /> MitraSkill · summary
        </span>
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-900">
          {card.badge}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <h3 className="text-[12px] font-bold leading-snug text-slate-900">{card.title}</h3>
        <ul className="mt-2 space-y-1.5">
          {card.metrics.map((metric) => (
            <li key={metric} className="flex gap-1.5 text-[10px] leading-snug text-slate-700">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
              {metric}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-2 text-[8px] text-slate-500">
          <CircleHelp className="h-3 w-3" /> Example data for simulator · validate before use
        </div>
        <div className="mt-1 flex justify-end text-[9px] text-slate-400">{message.timestamp}</div>
      </div>
    </div>
  );
}
