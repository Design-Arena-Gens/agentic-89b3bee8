"use client";

import { useMemo, useState } from "react";
import type { ElevenLabsVoice } from "@/types/elevenlabs";
import VoiceCard from "./VoiceCard";
import { clsx } from "clsx";

type VoicePickerProps = {
  voices: ElevenLabsVoice[];
  selectedVoiceId?: string;
  onSelectVoice: (voice: ElevenLabsVoice) => void;
};

const VoicePicker = ({ voices, selectedVoiceId, onSelectVoice }: VoicePickerProps) => {
  const [search, setSearch] = useState("");

  const filteredVoices = useMemo(() => {
    const lowerQuery = search.trim().toLowerCase();

    if (!lowerQuery) return voices;

    return voices.filter((voice) => {
      const tokens = [voice.name, voice.category, voice.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return tokens.includes(lowerQuery);
    });
  }, [voices, search]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="voice-search">
          Find a voice
        </label>
        <input
          id="voice-search"
          className={clsx(
            "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
            "placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
          )}
          placeholder="Search by name, style, or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {filteredVoices.map((voice) => (
          <VoiceCard
            key={voice.voice_id}
            voice={voice}
            isSelected={voice.voice_id === selectedVoiceId}
            onClick={onSelectVoice}
          />
        ))}
        {filteredVoices.length === 0 ? (
          <p className="col-span-full rounded-xl border border-white/5 bg-white/5 p-6 text-sm text-slate-300">
            No voices matched your search. Try adjusting your filters.
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default VoicePicker;
