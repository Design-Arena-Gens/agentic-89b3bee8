"use client";

import { useEffect, useMemo, useState } from "react";
import TextToSpeechForm, { type GenerateValues } from "@/components/TextToSpeechForm";
import VoicePicker from "@/components/VoicePicker";
import PlaybackPanel from "@/components/PlaybackPanel";
import type { ElevenLabsVoice } from "@/types/elevenlabs";
import { featuredVoices } from "@/lib/voices";
import { clsx } from "clsx";

const Page = () => {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>(featuredVoices);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | undefined>(featuredVoices[0]?.voice_id);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadVoices = async () => {
      setInitializing(true);

      try {
        const response = await fetch("/api/voices", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load voices");
        }

        const payload = (await response.json()) as { voices: ElevenLabsVoice[] };
        if (!isCancelled && payload?.voices?.length) {
          setVoices(payload.voices);
          setSelectedVoiceId(payload.voices[0].voice_id);
        }
      } catch (err) {
        console.error("Failed to load voices", err);
        if (!isCancelled) {
          setVoices(featuredVoices);
          setError("Using featured voices because live voices could not be fetched.");
        }
      } finally {
        if (!isCancelled) {
          setInitializing(false);
        }
      }
    };

    loadVoices();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.voice_id === selectedVoiceId),
    [voices, selectedVoiceId]
  );

  const handleGenerate = async (values: GenerateValues) => {
    if (!selectedVoice) return;

    setIsGenerating(true);

    try {
      setError(null);
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: values.text,
          voiceId: selectedVoice.voice_id,
          modelId: values.modelId,
          optimizeStreamingLatency: values.optimizeStreamingLatency,
          voiceSettings: {
            stability: values.voiceSettings.stability,
            similarity_boost: values.voiceSettings.similarityBoost,
            style: values.voiceSettings.style,
            use_speaker_boost: values.voiceSettings.useSpeakerBoost
          }
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Failed to generate." }));
        throw new Error(payload?.error ?? "Unable to generate speech");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
      setTranscript(values.text);
    } catch (err) {
      console.error("Generation error", err);
      setError(err instanceof Error ? err.message : "Unexpected error generating speech.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:py-16">
      <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/30 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-200">ElevenLabs Studio</p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Bring lifelike voices to your stories in seconds.
        </h1>
        <p className="max-w-2xl text-base text-slate-300 md:text-lg">
          Select from a curated library of ElevenLabs voices, fine-tune their delivery, and generate polished audio
          without leaving your browser. Perfect for narrated explainers, podcast intros, and product marketing.
        </p>
        {error ? (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <VoicePicker
          voices={voices}
          selectedVoiceId={selectedVoiceId}
          onSelectVoice={(voice) => setSelectedVoiceId(voice.voice_id)}
        />
        <div className="flex flex-col gap-6">
          <TextToSpeechForm
            onGenerate={handleGenerate}
            selectedVoiceId={selectedVoice?.voice_id}
            selectedVoiceName={selectedVoice?.name}
            isGenerating={isGenerating}
          />
          <PlaybackPanel audioUrl={audioUrl} transcript={transcript} isGenerating={isGenerating || initializing} />
        </div>
      </div>

      <footer className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/20 p-6 text-sm text-slate-400">
        <p>
          Set the <code className="rounded bg-white/10 px-1">ELEVENLABS_API_KEY</code> environment variable to connect your
          ElevenLabs account. API responses stay on this server and audio is streamed back to your browser.
        </p>
        <p>
          For production deployments, ensure the key is configured as a secure environment variable (never expose it in the
          client). You can enrich this experience further by persisting projects or uploading custom voices.
        </p>
      </footer>
    </main>
  );
};

export default Page;
