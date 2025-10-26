"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";

type VoiceSettingsState = {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
};

type GenerateValues = {
  text: string;
  modelId: string;
  optimizeStreamingLatency: number;
  voiceSettings: VoiceSettingsState;
};

type TextToSpeechFormProps = {
  onGenerate: (values: GenerateValues) => Promise<void>;
  selectedVoiceName?: string;
  selectedVoiceId?: string;
  isGenerating: boolean;
};

const MAX_CHARACTERS = 2500;

const latencyOptions = [
  { value: 0, label: "Highest quality" },
  { value: 1, label: "Balanced" },
  { value: 2, label: "Lowest latency" }
];

const modelOptions = [
  { id: "eleven_monolingual_v1", label: "Monolingual v1 (English)" },
  { id: "eleven_multilingual_v2", label: "Multilingual v2" }
];

const TextToSpeechForm = ({
  onGenerate,
  selectedVoiceId,
  selectedVoiceName,
  isGenerating
}: TextToSpeechFormProps) => {
  const [text, setText] = useState("");
  const [modelId, setModelId] = useState(modelOptions[0].id);
  const [latency, setLatency] = useState(0);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsState>({
    stability: 0.55,
    similarityBoost: 0.6,
    style: 0.0,
    useSpeakerBoost: true
  });
  const [error, setError] = useState<string | null>(null);

  const charactersRemaining = useMemo(() => MAX_CHARACTERS - text.length, [text]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedVoiceId) {
      setError("Select a voice before generating audio.");
      return;
    }

    if (!text.trim()) {
      setError("Enter some text to generate speech.");
      return;
    }

    setError(null);
    await onGenerate({
      text,
      modelId,
      optimizeStreamingLatency: latency,
      voiceSettings
    });
  };

  const sliderClasses = clsx(
    "w-full appearance-none rounded-full bg-white/10 outline-none",
    "accent-brand-400 focus:accent-brand-300"
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/30 p-6">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-widest text-brand-200/70">Scripting</span>
        <h2 className="text-2xl font-semibold text-white">Create a voiceover</h2>
        <p className="text-sm text-slate-300">
          {selectedVoiceName ? `Using ${selectedVoiceName}` : "Pick a voice to unlock tailored delivery."}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="tts-text" className="text-sm font-medium text-slate-200">
          Script
        </label>
        <textarea
          id="tts-text"
          name="text"
          className={clsx(
            "min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
            "placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
          )}
          placeholder="Write your narration, promo copy, or podcast intro here..."
          maxLength={MAX_CHARACTERS}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{charactersRemaining} characters remaining</span>
          <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Model
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand-400 focus:outline-none"
            value={modelId}
            onChange={(event) => setModelId(event.target.value)}
          >
            {modelOptions.map((option) => (
              <option key={option.id} value={option.id} className="bg-slate-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Streaming priority
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand-400 focus:outline-none"
            value={latency}
            onChange={(event) => setLatency(Number(event.target.value))}
          >
            {latencyOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-3 text-sm text-slate-200">
          Stability
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={voiceSettings.stability}
            onChange={(event) =>
              setVoiceSettings((prev) => ({ ...prev, stability: Number(event.target.value) }))
            }
            className={sliderClasses}
          />
          <span className="text-xs text-slate-400">
            Higher values sound more consistent but less expressive.
          </span>
        </label>
        <label className="flex flex-col gap-3 text-sm text-slate-200">
          Similarity boost
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={voiceSettings.similarityBoost}
            onChange={(event) =>
              setVoiceSettings((prev) => ({ ...prev, similarityBoost: Number(event.target.value) }))
            }
            className={sliderClasses}
          />
          <span className="text-xs text-slate-400">
            Increase to stay closer to the original voice signature.
          </span>
        </label>
        <label className="flex flex-col gap-3 text-sm text-slate-200">
          Style
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={voiceSettings.style}
            onChange={(event) =>
              setVoiceSettings((prev) => ({ ...prev, style: Number(event.target.value) }))
            }
            className={sliderClasses}
          />
          <span className="text-xs text-slate-400">Add emphasis and flair with higher values.</span>
        </label>
        <label className="flex flex-row items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <div className="flex flex-col">
            <span className="font-medium text-white">Speaker boost</span>
            <span className="text-xs text-slate-400">Enhance presence and clarity for dialogue content.</span>
          </div>
          <input
            type="checkbox"
            checked={voiceSettings.useSpeakerBoost}
            onChange={(event) =>
              setVoiceSettings((prev) => ({ ...prev, useSpeakerBoost: event.target.checked }))
            }
            className="h-5 w-5 cursor-pointer accent-brand-400"
          />
        </label>
      </section>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold",
          "text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400",
          isGenerating && "cursor-not-allowed opacity-70"
        )}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating…" : "Generate speech"}
      </button>
    </form>
  );
};

export type { VoiceSettingsState, GenerateValues };
export default TextToSpeechForm;
