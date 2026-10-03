import React, { useState, useRef, useEffect, type FormEvent } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Camera,
  Mic,
  Send,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type { WAThemeTokens } from "./whatsappTheme";
import {
  WAMessage,
  DEFAULT_INITIAL_MESSAGES,
  SCENARIO_CHIPS,
  type ScenarioChip,
} from "@/data/mockWhatsAppFlow";
import { WhatsAppVoiceBubble } from "./WhatsAppVoiceBubble";
import { WhatsAppCardBubble } from "./WhatsAppCardBubble";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";

const getChipLabel = (chip: ScenarioChip, lang: SupportedLanguage) => {
  if (lang === "mr") {
    if (chip.id === "CHIP_SALARY") return "💰 पगार किती मिळेल? (Salary)";
    if (chip.id === "CHIP_STIGMA") return "👔 गॅरेजचे काम आहे का? (Stigma)";
    if (chip.id === "CHIP_DEGREE") return "🎓 पुढे पदवी मिळेल का? (Degree)";
    if (chip.id === "CHIP_SAFETY") return "🛡️ मुलींसाठी सुरक्षित आहे? (Safety)";
  }
  if (lang === "bn") {
    if (chip.id === "CHIP_SALARY") return "💰 বেতন কত পাওয়া যাবে? (Salary)";
    if (chip.id === "CHIP_STIGMA") return "👔 রাস্তার মেকানিকের কাজ? (Stigma)";
    if (chip.id === "CHIP_DEGREE") return "🎓 পরে ডিগ্রি মিলবে কি? (Degree)";
    if (chip.id === "CHIP_SAFETY") return "🛡️ মেয়েদের জন্য নিরাপদ? (Safety)";
  }
  if (lang === "ta") {
    if (chip.id === "CHIP_SALARY") return "💰 தொடக்க ஊதியம் எவ்வளவு? (Salary)";
    if (chip.id === "CHIP_STIGMA") return "👔 மெக்கானிக் வேலையா? (Stigma)";
    if (chip.id === "CHIP_DEGREE") return "🎓 பட்டம் பெற முடியுமா? (Degree)";
    if (chip.id === "CHIP_SAFETY") return "🛡️ பெண்களுக்கு பாதுகாப்பானதா? (Safety)";
  }
  if (lang === "en") return chip.label_en;
  return chip.label_hi;
};

interface WhatsAppChatInterfaceProps {
  theme: WAThemeTokens;
  onBackToPortal: () => void;
  externalTrigger?: { chipId: string; timestamp: number } | null;
  onReset?: number;
}

export const WhatsAppChatInterface: React.FC<WhatsAppChatInterfaceProps> = ({
  theme,
  onBackToPortal,
  externalTrigger,
  onReset,
}) => {
  const { language } = useLanguageVoice();
  const [messages, setMessages] = useState<WAMessage[]>(DEFAULT_INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("typing...");
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle external reset
  useEffect(() => {
    setMessages(DEFAULT_INITIAL_MESSAGES);
    setIsTyping(false);
    setActiveToast(null);
    setInputText("");
    if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
    if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current);
  }, [onReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
      if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleChipClick = (chip: ScenarioChip) => {
    if (isTyping) return;

    // 1. Append user query
    setMessages((prev) => [...prev, chip.userMessage]);

    // 2. Set bot status to recording/typing
    setIsTyping(true);
    setTypingText(chip.botReplies[0]?.type === "voice" ? "recording audio..." : "typing...");

    // 3. Resolve reply after 1.2s delay
    if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, ...chip.botReplies]);
      typingTimerRef.current = null;
    }, 1200);
  };

  // Support side panel clicks
  useEffect(() => {
    if (!externalTrigger) return;
    const chip = SCENARIO_CHIPS.find((c) => c.id === externalTrigger.chipId);
    if (chip) {
      handleChipClick(chip);
    }
  }, [externalTrigger]);

  const handleActionClick = (actionName: string) => {
    if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current);
    setActiveToast(`✅ Action triggered: ${actionName}`);
    toastTimerRef.current = window.setTimeout(() => {
      setActiveToast(null);
      toastTimerRef.current = null;
    }, 3000);
  };

  const handleSendText = (e: FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isTyping) return;

    const userMsg: WAMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      type: "text",
      text: query,
      timestamp: "10:22 AM",
      status: "read",
      isRead: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setTypingText("typing...");

    if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b_resp_${Date.now()}`,
          sender: "bot",
          type: "text",
          text: "धन्यवाद रमेश जी। आपके प्रश्न के लिए हमारे पास सत्यापित डेटा उपलब्ध है। आप ऊपर दिए गए त्वरित बटनों (Chips) को दबाकर वेतन, प्रतिष्ठा और सुरक्षा के अधिकृत आंकड़े देख सकते हैं।",
          timestamp: "10:22 AM",
          status: "read",
          isRead: true,
        },
      ]);
      typingTimerRef.current = null;
    }, 1200);
  };

  return (
    <div
      className="flex flex-col h-full w-full select-none overflow-hidden relative transition-colors duration-200"
      style={{ backgroundColor: theme.chatBg }}
    >
      {/* 1. Official WhatsApp Top Bar */}
      <div
        className="h-14 px-3 flex items-center justify-between z-10 shadow-sm flex-shrink-0 transition-colors duration-200"
        style={{ backgroundColor: theme.appBarBg, color: theme.appBarText }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPortal}
            aria-label="Back to portal"
            className="p-1 -ml-1 text-inherit rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center font-black text-xs text-amber-400 shrink-0">
            MS
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm leading-tight truncate">MitraSkill Sahayak</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-500 shrink-0" />
            </div>
            <span
              className="text-[10px] leading-tight truncate transition-colors"
              style={{ color: theme.appBarSubtext }}
            >
              {isTyping ? typingText : "Official Business Account • online"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-inherit">
          <button
            type="button"
            onClick={() => handleActionClick("Video call connected to ITI Counselor")}
            aria-label="Video call"
            className="p-1 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <Video className="w-4 h-4 opacity-90" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick("Voice call connecting to Nodal Officer")}
            aria-label="Voice call"
            className="p-1 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4 opacity-90" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick("Business verified credentials view")}
            aria-label="More options"
            className="p-1 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <MoreVertical className="w-4 h-4 opacity-90" />
          </button>
        </div>
      </div>

      {/* 2. Messages Canvas */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-2 relative [scrollbar-width:thin]"
        style={{
          backgroundImage: theme.doodlePattern,
          backgroundSize: "18px 18px",
        }}
      >
        {/* End-to-End Encryption Banner */}
        <div className="flex justify-center my-2">
          <div
            className="flex items-center gap-1.5 py-1 px-3 rounded-lg text-[10px] max-w-[90%] text-center shadow-2xs leading-snug"
            style={{
              backgroundColor: theme.mode === "dark" ? "#182229" : "#FFEECD",
              color: theme.mode === "dark" ? "#FFD279" : "#54656F",
            }}
          >
            <Lock className="w-3 h-3 flex-shrink-0" />
            <span>Messages are end-to-end encrypted under MSDE Student Privacy Protocol.</span>
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          if (msg.type === "voice") {
            return (
              <WhatsAppVoiceBubble
                key={msg.id}
                sender={msg.sender}
                voiceDuration={msg.voiceDuration ?? "0:15"}
                waveform={msg.waveform}
                transcription={msg.text}
                timestamp={msg.timestamp}
                theme={theme}
              />
            );
          }

          if (msg.type === "card" && msg.cardData) {
            return (
              <WhatsAppCardBubble
                key={msg.id}
                cardData={msg.cardData}
                timestamp={msg.timestamp}
                theme={theme}
                onActionClick={handleActionClick}
              />
            );
          }

          // Plain Text Bubble
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex w-full my-1 ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className="relative max-w-[82%] sm:max-w-[300px] rounded-2xl px-3 py-2 text-xs shadow-sm transition-colors duration-150"
                style={{
                  backgroundColor: isUser ? theme.userBubbleBg : theme.botBubbleBg,
                  color: isUser ? theme.userBubbleText : theme.botBubbleText,
                }}
              >
                {/* Native Bubble Corner Tail */}
                <div
                  className="absolute top-0 w-3 h-3 pointer-events-none"
                  style={{
                    [isUser ? "right" : "left"]: "-6px",
                    clipPath: isUser
                      ? "polygon(0 0, 0 100%, 100% 0)"
                      : "polygon(100% 0, 100% 100%, 0 0)",
                    backgroundColor: isUser ? theme.userBubbleBg : theme.botBubbleBg,
                  }}
                />
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className="text-[9px] text-right mt-1 font-mono flex items-center justify-end gap-1 opacity-70"
                  style={{ color: theme.timestampText }}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex w-full my-1 justify-start">
            <div
              className="rounded-2xl px-4 py-2 text-xs shadow-sm flex items-center gap-1.5 transition-colors duration-150"
              style={{ backgroundColor: theme.botBubbleBg, color: theme.botBubbleText }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Action Toast */}
      {activeToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] px-3.5 py-1.5 rounded-full shadow-lg z-20 border border-emerald-500/30 animate-in fade-in duration-150">
          {activeToast}
        </div>
      )}

      {/* 4. Quick-Prompt Horizontal Chips */}
      <div
        className="px-2 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-shrink-0 transition-colors duration-200"
        style={{
          backgroundColor: theme.inputBarBg,
          borderColor: theme.cardDivider,
        }}
      >
        {SCENARIO_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={isTyping}
            onClick={() => handleChipClick(chip)}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50 hover:brightness-105"
            style={{
              backgroundColor: theme.quickChipBg,
              borderColor: theme.quickChipBorder,
              color: theme.quickChipText,
            }}
          >
            {getChipLabel(chip, language)}
          </button>
        ))}
      </div>

      {/* 5. Authentic WhatsApp Input Dock */}
      <form
        onSubmit={handleSendText}
        className="p-2 flex items-center gap-1.5 flex-shrink-0 transition-colors duration-200"
        style={{ backgroundColor: theme.inputBarBg }}
      >
        <div
          className="flex-1 h-10 rounded-full px-3 flex items-center gap-2 shadow-xs transition-colors duration-200"
          style={{ backgroundColor: theme.inputFieldBg }}
        >
          <Smile className="w-5 h-5 flex-shrink-0" style={{ color: theme.inputIconColor }} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="संदेश लिखें (Type a message)..."
            className="flex-1 bg-transparent border-none outline-none text-xs placeholder:text-slate-400"
            style={{ color: theme.inputFieldText }}
          />
          <Paperclip className="w-4 h-4 flex-shrink-0 -rotate-45" style={{ color: theme.inputIconColor }} />
          <Camera className="w-4 h-4 flex-shrink-0" style={{ color: theme.inputIconColor }} />
        </div>

        {/* Green Circular Mic / Send Button */}
        {inputText.trim() ? (
          <button
            type="submit"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
            style={{ backgroundColor: theme.voiceAccent }}
            title="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleChipClick(SCENARIO_CHIPS[0]!)}
            disabled={isTyping}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.voiceAccent }}
            title="Click to trigger sample prompt"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
};
