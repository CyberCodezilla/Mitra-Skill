import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { CheckCheck, Check, Mic, Pause, Play } from "lucide-react";
import type { WAMessage } from "@/data/mockWhatsAppFlow";
import type { WAThemeTokens } from "./whatsappTheme";

interface WhatsAppVoiceBubbleProps {
  message: WAMessage;
  theme: WAThemeTokens;
  isDark: boolean;
}

// 28 realistic vertical waveform amplitude percentages (20% to 100%)
const WAVEFORM_BARS = [
  28, 42, 62, 85, 48, 32, 76, 94, 58, 38, 80, 100, 72, 54, 84, 92, 66, 42, 70, 86, 62, 48, 74, 60,
  42, 34, 26, 20,
];

export function WhatsAppVoiceBubble({ message, theme, isDark: _isDark }: WhatsAppVoiceBubbleProps) {
  const isUser = message.sender === "user";
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5 | 2>(1);

  // Parse total duration in seconds from voiceDuration string (e.g. "0:24" -> 24)
  const totalDurationSeconds = useMemo(() => {
    if (!message.voiceDuration) return 18;
    const parts = message.voiceDuration.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0] ?? "0", 10) || 0;
      const secs = parseInt(parts[1] ?? "18", 10) || 18;
      return mins * 60 + secs;
    }
    return 18;
  }, [message.voiceDuration]);

  const animationFrameRef = useRef<number | null>(null);
  const playbackStartRef = useRef<{ timestamp: number; startProgress: number } | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Helper to format MM:SS
  const formatTime = (secs: number) => {
    const clamped = Math.max(0, Math.floor(secs));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const elapsedSeconds = (progress / 100) * totalDurationSeconds;

  const stopPlayback = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    playbackStartRef.current = null;
    setIsPlaying(false);
  }, []);

  // Update progress smoothly during playback
  useEffect(() => {
    if (!isPlaying) return;

    const effectiveDurationMs = (totalDurationSeconds * 1000) / speedMultiplier;

    const tick = () => {
      if (!playbackStartRef.current) return;
      const now = performance.now();
      const elapsedMs = now - playbackStartRef.current.timestamp;
      const addedProgress = (elapsedMs / effectiveDurationMs) * 100;
      const current = playbackStartRef.current.startProgress + addedProgress;

      if (current >= 100) {
        setProgress(100);
        stopPlayback();
      } else {
        setProgress(current);
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, speedMultiplier, totalDurationSeconds, stopPlayback]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  const startPlayback = (fromProgress: number = progress) => {
    const initialProgress = fromProgress >= 100 ? 0 : fromProgress;
    setProgress(initialProgress);
    setIsPlaying(true);
    playbackStartRef.current = {
      timestamp: performance.now(),
      startProgress: initialProgress,
    };

    // Trigger Speech Synthesis if browser supports it
    if (typeof window !== "undefined" && "speechSynthesis" in window && message.text) {
      try {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(message.text);
        utt.rate = Math.min(2.0, 0.95 * speedMultiplier);
        utt.lang = "hi-IN";

        // Try to pick Hindi or Indian English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => v.lang.toLowerCase() === "hi-in") ??
          voices.find((v) => v.lang.toLowerCase().startsWith("hi")) ??
          voices.find((v) => v.lang.toLowerCase().includes("-in"));
        if (preferred) utt.voice = preferred;

        utt.onend = () => {
          setProgress(100);
          stopPlayback();
        };
        utt.onerror = () => {
          // Handled gracefully by the animation timer fallback
        };
        utteranceRef.current = utt;
        window.speechSynthesis.speak(utt);
      } catch {
        // Fallback to pure visual scrubber
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Speed multiplier toggle (1x -> 1.5x -> 2x)
  const toggleSpeed = (e: MouseEvent) => {
    e.stopPropagation();
    const nextSpeed: 1 | 1.5 | 2 = speedMultiplier === 1 ? 1.5 : speedMultiplier === 1.5 ? 2 : 1;
    setSpeedMultiplier(nextSpeed);

    // If currently playing, adjust timestamp reference to prevent progress jumps
    if (isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window && message.text) {
        // Restart speech with new rate from current context
        stopPlayback();
        setTimeout(() => {
          setSpeedMultiplier(nextSpeed);
          startPlayback(progress);
        }, 50);
      } else {
        playbackStartRef.current = {
          timestamp: performance.now(),
          startProgress: progress,
        };
      }
    }
  };

  // Interactive scrubber clicking / dragging
  const handleScrubberClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clampedRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const newProgress = clampedRatio * 100;
    setProgress(newProgress);

    if (isPlaying) {
      playbackStartRef.current = {
        timestamp: performance.now(),
        startProgress: newProgress,
      };
    }
  };

  const bubbleBg = isUser ? theme.userBubbleBg : theme.botBubbleBg;
  const bubbleTextColor = isUser ? theme.userBubbleText : theme.botBubbleText;

  // Active bar index according to progress (0 to 28)
  const activeBarCount = Math.floor((progress / 100) * WAVEFORM_BARS.length);

  return (
    <div
      className={`relative max-w-[92%] select-none rounded-2xl p-2.5 shadow-sm transition-colors duration-150 ${
        isUser ? "self-end rounded-tr-none" : "self-start rounded-tl-none"
      }`}
      style={{
        backgroundColor: bubbleBg,
        color: bubbleTextColor,
      }}
    >
      {/* Authentic Corner Triangle Tails */}
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

      {/* Main 3-Column Voice Note Player Body */}
      <div className="flex items-center gap-2.5">
        {/* Left Column: Avatar with Microphone Overlay */}
        <div className="relative shrink-0">
          <div
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-full text-xs font-bold shadow-xs ${
              isUser
                ? "bg-[#D1E7DD] text-[#0F5132] ring-1 ring-emerald-600/20"
                : "bg-[#E1F2EC] text-[#008069] ring-1 ring-[#008069]/20"
            }`}
          >
            {isUser ? "RS" : "MS"}
          </div>
          {/* Small Green Mic Badge */}
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00A884] text-white shadow-xs"
            title="Voice Note"
          >
            <Mic className="h-2.5 w-2.5 stroke-[2.5]" />
          </span>
        </div>

        {/* Center Column: Play/Pause, 28 Waveform Bars, Scrubber & Controls */}
        <div className="min-w-0 flex-1">
          {/* Top Row: Play/Pause Button & Waveform */}
          <div className="flex items-center gap-2">
            {/* Native WhatsApp Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00A884] text-white shadow-sm transition hover:brightness-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-white stroke-none" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-white stroke-none" />
              )}
            </button>

            {/* 28 Discrete Waveform Bars with Interactive Scrubber */}
            <div
              ref={waveformRef}
              onClick={handleScrubberClick}
              role="slider"
              aria-label="Voice playback waveform"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative flex h-8 flex-1 cursor-pointer items-center justify-between gap-[1.5px] py-1 select-none"
            >
              {WAVEFORM_BARS.map((heightPercent, idx) => {
                const isElapsed = idx < activeBarCount;
                return (
                  <span
                    key={idx}
                    className="w-[2.2px] shrink-0 rounded-full transition-colors duration-100"
                    style={{
                      height: `${Math.max(4, Math.round((heightPercent / 100) * 26))}px`,
                      backgroundColor: isElapsed ? theme.voiceAccent : theme.voiceUnplayed,
                    }}
                  />
                );
              })}

              {/* Scrubber Ball Tracker */}
              <span
                className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-all duration-75"
                style={{
                  left: `calc(${progress}% - 6px)`,
                  backgroundColor: theme.voiceAccent,
                }}
              />
            </div>
          </div>

          {/* Bottom Row: Elapsed Time + Speed Multiplier Toggle */}
          <div className="mt-1 flex items-center justify-between px-0.5">
            <span
              className="font-mono text-[10px] font-semibold tabular-nums"
              style={{ color: theme.timestampText }}
            >
              {isPlaying || progress > 0
                ? formatTime(elapsedSeconds)
                : (message.voiceDuration ?? "0:18")}
            </span>

            {/* Native Speed Multiplier Pill (1x, 1.5x, 2x) */}
            <button
              type="button"
              onClick={toggleSpeed}
              className="rounded-full px-1.5 py-0.5 text-[9.5px] font-bold tracking-tight shadow-xs transition hover:opacity-85 active:scale-95"
              style={{
                backgroundColor: isUser ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 168, 132, 0.12)",
                color: theme.voiceAccent,
              }}
              title="Toggle playback speed"
            >
              {speedMultiplier}x
            </button>
          </div>
        </div>

        {/* Right Column: Timestamp & Blue Double Read Ticks */}
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch pt-0.5">
          <div className="flex items-center gap-1 text-[9.5px] font-medium leading-none">
            <span style={{ color: theme.timestampText }}>{message.timestamp}</span>
            {isUser && (
              <span title="Read receipt">
                {message.isRead ? (
                  <CheckCheck className="h-3.5 w-3.5" style={{ color: theme.readTickColor }} />
                ) : (
                  <Check className="h-3.5 w-3.5" style={{ color: theme.timestampText }} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
