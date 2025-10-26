"use client";

import type { ElevenLabsVoice } from "@/types/elevenlabs";
import { clsx } from "clsx";

type VoiceCardProps = {
  voice: ElevenLabsVoice;
  isSelected?: boolean;
  onClick?: (voice: ElevenLabsVoice) => void;
};

const VoiceCard = ({ voice, isSelected = false, onClick }: VoiceCardProps) => {
  const { name, category, description, preview_url: previewUrl } = voice;

  return (
    <button
      type="button"
      onClick={() => onClick?.(voice)}
      className={clsx(
        "group flex w-full flex-col gap-3 rounded-2xl border border-white/10 p-4 text-left transition",
        "bg-white/5 hover:border-brand-400/60 hover:bg-brand-500/10",
        isSelected && "border-brand-400 bg-brand-500/20"
      )}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold text-white">{name}</span>
        <span
          className={clsx(
            "rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide",
            "text-brand-100"
          )}
        >
          {category ?? "General"}
        </span>
      </div>
      {description ? (
        <p className="text-sm text-slate-300/90">{description}</p>
      ) : (
        <p className="text-sm text-slate-400">Select to hear a preview.</p>
      )}
      {previewUrl ? (
        <audio
          className="mt-2 w-full"
          src={previewUrl}
          controls
          preload="none"
          aria-label={`Preview voice ${name}`}
        />
      ) : null}
    </button>
  );
};

export default VoiceCard;
