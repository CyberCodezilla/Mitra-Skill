import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Camera,
  Check,
  CheckCheck,
  Lock,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import {
  WHATSAPP_PROMPT_CHIPS,
  type PromptChip,
  type WAMessage,
} from "@/data/mockWhatsAppFlow";
import type { Lang } from "@/lib/app-context";
import { WhatsAppHeader } from "./WhatsAppHeader";
import { WhatsAppVoiceBubble } from "./WhatsAppVoiceBubble";
import { WhatsAppCardBubble } from "./WhatsAppCardBubble";
import { getWhatsAppDoodlePattern, type WAThemeTokens } from "./whatsappTheme";

interface WhatsAppChatInterfaceProps {
  lang: Lang;
  theme: WAThemeTokens;
  isDark: boolean;
  onReset: number;
  externalTrigger?: { chipId: string; timestamp: number } | null;
}

const getInitialMessages = (hi: boolean): WAMessage[] => [
  {
    id: "init_1",
    sender: "bot",
    type: "text",
    text: hi
      ? "नमस्ते रमेश जी! 🙏\nमैं MitraSkill का आधिकारिक डिजिटल सहायक हूँ। ITI ट्रेड्स, शुरुआती वेतन, कैंपस सुरक्षा और करियर के रास्तों के बारे में आप नीचे दिए गए किसी भी प्रश्न पर टैप कर सकते हैं।"
      : "Hello Ramesh ji! 🙏\nI am the official MitraSkill Digital Assistant. You can tap any question below to explore verified ITI trades, starting salaries, campus safety, and career pathways.",
    timestamp: "10:13 AM",
  },
];

export function WhatsAppChatInterface({
  lang,
  theme,
  isDark,
  onReset,
  externalTrigger,
}: WhatsAppChatInterfaceProps) {
  const hi = lang === "hi";
  const [messages, setMessages] = useState<WAMessage[]>(() => getInitialMessages(hi));
  const [isTyping, setIsTyping] = useState(false);
  const [typingState, setTypingState] = useState<"typing" | "recording" | "online">("online");
  const [input, setInput] = useState("");
  const [activeChipIndex, setActiveChipIndex] = useState(0);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const chatFeedRef = useRef<HTMLDivElement>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const showNotice = (text: string) => {
    if (noticeTimerRef.current !== null) clearTimeout(noticeTimerRef.current);
    setBannerNotice(text);
    noticeTimerRef.current = window.setTimeout(() => {
      setBannerNotice(null);
      noticeTimerRef.current = null;
    }, 3200);
  };

  // Reset state when reset button in parent is clicked
  useEffect(() => {
    setMessages(getInitialMessages(hi));
    setIsTyping(false);
    setTypingState("online");
    setInput("");
    setActiveChipIndex(0);
    setBannerNotice(null);
    if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
    if (noticeTimerRef.current !== null) clearTimeout(noticeTimerRef.current);
  }, [onReset, hi]);

  // Smooth scroll down upon any message append or typing indicator update
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, typingState]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
      if (noticeTimerRef.current !== null) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const handleChipClick = (chip: PromptChip) => {
    if (isTyping) return;

    const chipIdx = WHATSAPP_PROMPT_CHIPS.findIndex((c) => c.id === chip.id);
    setActiveChipIndex((chipIdx + 1) % WHATSAPP_PROMPT_CHIPS.length);

    // 1. Append user message initially with gray ticks
    const userMsgWithGrayTicks: WAMessage = {
      ...chip.userMessage,
      id: `user-${Date.now()}`,
      isRead: false,
    };

    setMessages((prev) => [...prev, userMsgWithGrayTicks]);

    // 2. Transition ticks to blue after 350ms
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMsgWithGrayTicks.id ? { ...msg, isRead: true } : msg)),
      );
    }, 350);

    // 3. Trigger typing / recording indicator
    setIsTyping(true);
    setTypingState(chip.botReply[0]?.type === "voice" ? "recording" : "typing");

    // 4. Simulate response arrival after 1.2s
    typingTimerRef.current = window.setTimeout(() => {
      const now = new Date().toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const replies = chip.botReply.map((reply, i) => ({
        ...reply,
        id: `bot-${Date.now()}-${i}`,
        timestamp: now,
      }));

      setMessages((prev) => [...prev, ...replies]);
      setIsTyping(false);
      setTypingState("online");
      typingTimerRef.current = null;
    }, 1200);
  };

  // Trigger scenario if triggered from side evaluator panel
  useEffect(() => {
    if (!externalTrigger) return;
    const targetChip = WHATSAPP_PROMPT_CHIPS.find((c) => c.id === externalTrigger.chipId);
    if (targetChip) {
      handleChipClick(targetChip);
    }
  }, [externalTrigger]);

  const handleSendText = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const now = new Date().toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: WAMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      type: "text",
      text,
      timestamp: now,
      isRead: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Blue tick transition after 350ms
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, isRead: true } : msg)),
      );
    }, 350);

    setIsTyping(true);
    setTypingState("typing");

    typingTimerRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: "bot",
          type: "text",
          text: hi
            ? "यह एक इंटरैक्टिव डेमो सिमुलेशन है। कृपया नीचे दिए गए त्वरित प्रश्नों (Chips) में से चुनें ताकि आप सत्यापित डेटा, वॉइस नोट्स और DGT ऑडिट कार्ड्स का अनुभव कर सकें।"
            : "This is an interactive demo simulation. Please tap one of the suggested scenario chips below to experience verified tracer audit data, audio voice notes, and official template cards.",
          timestamp: now,
        },
      ]);
      setIsTyping(false);
      setTypingState("online");
      typingTimerRef.current = null;
    }, 1200);
  };

  const handleMicButtonClick = () => {
    const nextChip = WHATSAPP_PROMPT_CHIPS[activeChipIndex] ?? WHATSAPP_PROMPT_CHIPS[0];
    if (nextChip) {
      handleChipClick(nextChip);
    }
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: theme.chatBg,
        color: theme.botBubbleText,
      }}
    >
      {/* 1. Official WhatsApp Business Profile Header */}
      <WhatsAppHeader
        theme={theme}
        isDark={isDark}
        isTyping={isTyping}
        typingState={typingState}
        onActionNotice={showNotice}
      />

      {/* 2. Chat Canvas Background with Authentic WhatsApp Doodle Pattern */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            backgroundImage: getWhatsAppDoodlePattern(isDark),
            opacity: theme.doodleOpacity,
            backgroundRepeat: "repeat",
          }}
        />

        {/* 3. Messages Feed */}
        <div
          ref={chatFeedRef}
          className="relative z-10 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-2.5 [scrollbar-width:thin]"
        >
          {/* Top End-to-End Encryption Banner */}
          <div className="mx-auto my-1 max-w-[92%] select-none">
            <div
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-center text-[10px] leading-snug shadow-2xs"
              style={{
                backgroundColor: isDark ? "rgba(31, 44, 52, 0.9)" : "rgba(255, 244, 200, 0.95)",
                color: isDark ? "#8696A0" : "#54656F",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
              }}
            >
              <Lock className="h-3 w-3 shrink-0 text-[#00A884]" />
              <span>
                🔒 Messages are end-to-end encrypted under MSDE Privacy Framework. No one outside
                this chat can read or listen.
              </span>
            </div>
          </div>

          {/* Render All Messages */}
          {messages.map((msg) => {
            if (msg.type === "voice") {
              return (
                <WhatsAppVoiceBubble
                  key={msg.id}
                  message={msg}
                  theme={theme}
                  isDark={isDark}
                />
              );
            }
            if (msg.type === "card") {
              return (
                <WhatsAppCardBubble
                  key={msg.id}
                  message={msg}
                  theme={theme}
                  isDark={isDark}
                  onActionTrigger={showNotice}
                />
              );
            }

            // Plain Text Bubble with Corner Tails
            const isUser = msg.sender === "user";
            const bubbleBg = isUser ? theme.userBubbleBg : theme.botBubbleBg;
            const bubbleText = isUser ? theme.userBubbleText : theme.botBubbleText;

            return (
              <div
                key={msg.id}
                className={`relative max-w-[85%] select-none rounded-2xl px-3 py-2 shadow-sm transition-colors duration-150 ${
                  isUser ? "self-end rounded-tr-none" : "self-start rounded-tl-none"
                }`}
                style={{
                  backgroundColor: bubbleBg,
                  color: bubbleText,
                }}
              >
                {/* SVG Corner Tail */}
                {isUser ? (
                  <svg
                    viewBox="0 0 8 13"
                    height="13"
                    width="8"
                    className="pointer-events-none absolute -right-2 top-0"
                    style={{ color: bubbleBg }}
                  >
                    <path
                      d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 8 13"
                    height="13"
                    width="8"
                    className="pointer-events-none absolute -left-2 top-0"
                    style={{ color: bubbleBg }}
                  >
                    <path
                      d="M2.812 1H8v11.193L1.533 3.568C.474 2.156 1.042 1 2.812 1z"
                      fill="currentColor"
                    />
                  </svg>
                )}

                <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed font-normal">
                  {msg.text}
                </p>

                <div className="mt-1 flex items-center justify-end gap-1 text-[9.5px] font-medium leading-none">
                  <span style={{ color: theme.timestampText }}>{msg.timestamp}</span>
                  {isUser && (
                    <span>
                      {msg.isRead ? (
                        <CheckCheck className="h-3.5 w-3.5" style={{ color: theme.readTickColor }} />
                      ) : (
                        <Check className="h-3.5 w-3.5" style={{ color: theme.timestampText }} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div
              className="relative max-w-[78%] self-start rounded-2xl rounded-tl-none px-3 py-2 shadow-sm transition-colors duration-150 animate-in fade-in"
              style={{
                backgroundColor: theme.botBubbleBg,
                color: theme.botBubbleText,
              }}
            >
              {/* Corner Tail */}
              <svg
                viewBox="0 0 8 13"
                height="13"
                width="8"
                className="pointer-events-none absolute -left-2 top-0"
                style={{ color: theme.botBubbleBg }}
              >
                <path
                  d="M2.812 1H8v11.193L1.533 3.568C.474 2.156 1.042 1 2.812 1z"
                  fill="currentColor"
                />
              </svg>

              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00A884]"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </span>
                <span className="italic" style={{ color: theme.timestampText }}>
                  {typingState === "recording"
                    ? hi
                      ? "वॉइस नोट रिकॉर्ड हो रहा है..."
                      : "recording voice note..."
                    : hi
                      ? "MitraSkill लिख रहा है..."
                      : "MitraSkill is typing..."}
                </span>
              </div>
            </div>
          )}

          <div ref={feedEndRef} className="h-1" />
        </div>

        {/* 4. Action Banner / Notification Toast inside chassis */}
        {bannerNotice && (
          <div
            role="status"
            className="absolute bottom-20 left-4 right-4 z-40 rounded-xl bg-slate-900/95 px-3 py-2 text-center text-xs text-slate-100 shadow-2xl backdrop-blur-xs border border-emerald-500/30 animate-in slide-in-from-bottom-2 duration-150"
          >
            {bannerNotice}
          </div>
        )}

        {/* 5. Interactive Quick-Prompt Carousel (Fixed above input bar) */}
        <div
          className="relative z-20 shrink-0 border-t pt-2 transition-colors duration-200"
          style={{
            backgroundColor: theme.inputBarBg,
            borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
          }}
        >
          <div
            className="flex gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Suggested prompt chips"
          >
            {WHATSAPP_PROMPT_CHIPS.map((chip, idx) => {
              const isSelected = activeChipIndex === idx;
              return (
                <button
                  key={chip.id}
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleChipClick(chip)}
                  className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-xs transition-all duration-150 hover:brightness-105 active:scale-95 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.quickChipBg,
                    border: `1px solid ${isSelected ? "#00A884" : theme.quickChipBorder}`,
                    color: theme.quickChipText,
                  }}
                >
                  {hi ? chip.label_hi : chip.label_en}
                </button>
              );
            })}
          </div>

          {/* 6. Native WhatsApp Input Dock Bar */}
          <form onSubmit={handleSendText} className="flex items-center gap-1.5 px-2 pb-2">
            <div
              className="flex min-h-[42px] min-w-0 flex-1 items-center gap-1.5 rounded-full px-2.5 shadow-sm transition-colors duration-200"
              style={{
                backgroundColor: theme.inputFieldBg,
                color: theme.inputFieldText,
              }}
            >
              <button
                type="button"
                aria-label="Emoji Picker"
                onClick={() => showNotice("😊 Emoji keyboard simulation")}
                className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600 transition"
              >
                <Smile className="h-5 w-5" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hi ? "संदेश लिखें (Type a message)..." : "Type a message..."}
                className="min-w-0 flex-1 bg-transparent py-2 text-[13px] outline-none placeholder:text-slate-400 font-normal"
                aria-label="Type message input"
              />

              <button
                type="button"
                aria-label="Attach Document"
                onClick={() => showNotice("📎 Document attachment picker")}
                className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600 transition -rotate-45"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Open Camera"
                onClick={() => showNotice("📸 Camera preview simulation")}
                className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600 transition"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Send or Voice Note Record Button */}
            {input.trim() ? (
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00A884] text-white shadow-md transition hover:bg-[#008f70] active:scale-95"
              >
                <Send className="ml-0.5 h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMicButtonClick}
                disabled={isTyping}
                aria-label="Play next sample voice prompt"
                title="Send next high-impact prompt note"
                className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00A884] text-white shadow-md transition hover:bg-[#008f70] active:scale-95 disabled:opacity-50"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
