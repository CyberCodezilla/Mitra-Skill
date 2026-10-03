import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Mic, CheckCheck } from "lucide-react";
import type { WAThemeTokens } from "./whatsappTheme";
import { useIndicVoice } from "@/utils/useIndicVoice";
import { useLanguageVoice } from "@/context/LanguageVoiceContext";
import type { PersonaId } from "@/utils/voiceProfiles";

interface WhatsAppVoiceBubbleProps {
  sender: "user" | "bot";
  voiceDuration: string;
  waveform?: number[] | undefined;
  transcription?: string | undefined;
  timestamp: string;
  theme: WAThemeTokens;
}

const parseDurationSeconds = (dur: string, text?: string): number => {
  const parts = dur.split(":").map(Number);
  let parsedSec = 15;
  if (parts.length === 2 && !isNaN(parts[0]!) && !isNaN(parts[1]!)) {
    parsedSec = parts[0]! * 60 + parts[1]!;
  }
  if (text && text.trim().length > 0) {
    // Average speaking rate in Indic languages is ~11-13 chars per second
    const textSec = Math.max(4, Math.round(text.trim().length / 11));
    return Math.max(parsedSec, textSec);
  }
  return Math.max(4, parsedSec);
};

export const WhatsAppVoiceBubble: React.FC<WhatsAppVoiceBubbleProps> = ({
  sender,
  voiceDuration,
  waveform = [
    30, 60, 45, 90, 70, 100, 80, 60, 85, 70, 50, 40, 75, 90, 60, 45, 30, 55, 75, 90, 65, 45, 30,
    50, 70, 85, 60, 40,
  ],
  transcription,
  timestamp,
  theme,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const waveformRef = useRef<HTMLDivElement>(null);
  const { speak, stop } = useIndicVoice();
  const { language } = useLanguageVoice();

  const isUser = sender === "user";
  const bubbleBg = isUser ? theme.userBubbleBg : theme.botBubbleBg;
  const textColor = isUser ? theme.userBubbleText : theme.botBubbleText;

  const speedFactor = playbackSpeed === "2x" ? 2.0 : playbackSpeed === "1.5x" ? 1.5 : 1.0;
  const totalSeconds = parseDurationSeconds(voiceDuration, transcription);

  // Speech synthesis integration with persona calibration and zero-truncation guarantee
  useEffect(() => {
    if (!isPlaying) {
      stop();
      return;
    }

    if (transcription) {
      const persona: PersonaId = isUser ? "parent_ramesh" : "arbiter";
      speak(
        transcription,
        persona,
        language,
        () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        },
        speedFactor,
      );
    }
  }, [isPlaying, isUser, language, speak, stop, transcription, speedFactor]);

  // Smooth, non-truncating progress bar ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const effectiveSec = totalSeconds / speedFactor;
      // Step increment every 100ms
      const step = (0.1 / effectiveSec) * 100;
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          // Cap at 98% during active synthesis so speech completion callback (onEnd) triggers true 100%
          if (prev >= 98) {
            return 98;
          }
          return Math.min(98, prev + step);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedFactor, totalSeconds]);

  const togglePlay = () => {
    if (playbackProgress >= 100) {
      setPlaybackProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    if (playbackSpeed === "1x") setPlaybackSpeed("1.5x");
    else if (playbackSpeed === "1.5x") setPlaybackSpeed("2x");
    else setPlaybackSpeed("1x");
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setPlaybackProgress(ratio * 100);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const elapsedSec = Math.min(totalSeconds, Math.floor((playbackProgress / 100) * totalSeconds));
  const displayTime = isPlaying
    ? `0:${elapsedSec.toString().padStart(2, "0")}`
    : voiceDuration;

  return (
    <div className={`flex w-full my-1.5 select-none ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="relative max-w-[85%] sm:max-w-[330px] rounded-2xl p-2.5 shadow-sm text-xs flex flex-col gap-1.5 transition-colors duration-150"
        style={{ backgroundColor: bubbleBg, color: textColor }}
      >
        {/* Native Bubble Corner Tail */}
        <div
          className="absolute top-0 w-3 h-3 pointer-events-none"
          style={{
            [isUser ? "right" : "left"]: "-6px",
            clipPath: isUser
              ? "polygon(0 0, 0 100%, 100% 0)"
              : "polygon(100% 0, 100% 100%, 0 0)",
            backgroundColor: bubbleBg,
          }}
        />

        {/* Audio Player Row */}
        <div className="flex items-center gap-2.5">
          {/* Avatar with Mic Badge */}
          <div
            className={`relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold shadow-xs ${
              isUser
                ? "bg-[#D1E7DD] text-[#0F5132]"
                : "bg-[#E1F2EC] text-[#008069]"
            }`}
          >
            {isUser ? "RS" : "MS"}
            <span
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs"
              style={{ backgroundColor: theme.voiceAccent }}
            >
              <Mic className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio note" : "Play audio note"}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer hover:brightness-105"
            style={{ backgroundColor: theme.voiceAccent }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Waveform Bars */}
          <div
            ref={waveformRef}
            onClick={handleWaveformClick}
            role="slider"
            aria-label="Voice playback waveform"
            aria-valuenow={Math.round(playbackProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="flex-1 flex items-center gap-[2px] h-7 cursor-pointer py-1"
          >
            {waveform.map((height, i) => {
              const barPercent = (i / waveform.length) * 100;
              const isPlayed = barPercent <= playbackProgress;
              return (
                <span
                  key={i}
                  className="w-[2.5px] rounded-full transition-colors duration-150"
                  style={{
                    height: `${Math.max(25, height)}%`,
                    backgroundColor: isPlayed ? theme.voiceAccent : theme.voiceUnplayed,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Player Controls & Meta Info */}
        <div
          className="flex items-center justify-between pl-12 text-[10px]"
          style={{ color: theme.timestampText }}
        >
          <div className="flex items-center gap-2">
            <span className="tabular-nums font-mono">{displayTime}</span>
            <button
              type="button"
              onClick={toggleSpeed}
              className="px-1.5 py-0.5 rounded-full font-bold text-[9px] border transition-colors cursor-pointer hover:bg-black/5"
              style={{
                borderColor: theme.voiceUnplayed,
                color: theme.voiceAccent,
              }}
            >
              {playbackSpeed}
            </button>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <span>{timestamp}</span>
            {isUser && (
              <CheckCheck className="w-3.5 h-3.5" style={{ color: theme.readTickColor }} />
            )}
          </div>
        </div>

        {/* Spoken Transcription Collapsible/Italic */}
        {transcription && (
          <p
            className="mt-1 pt-1.5 border-t text-[11px] italic leading-relaxed opacity-90"
            style={{ borderColor: theme.cardDivider }}
          >
            "{transcription}"
          </p>
        )}
      </div>
    </div>
  );
};
