"use client";

import { clsx } from "clsx";

type PlaybackPanelProps = {
  audioUrl?: string | null;
  isGenerating: boolean;
  transcript?: string;
};

const PlaybackPanel = ({ audioUrl, isGenerating, transcript }: PlaybackPanelProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-widest text-brand-200/70">Playback</span>
        <h2 className="text-xl font-semibold text-white">Listen to your creation</h2>
      </header>
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 p-6",
          !audioUrl && "min-h-[160px]"
        )}
      >
        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full" preload="metadata">
            Your browser does not support embedded audio.
          </audio>
        ) : (
          <p className="text-sm text-slate-400 text-center">
            {isGenerating
              ? "Crafting your audio with ElevenLabs…"
              : "Generate speech to preview it instantly."}
          </p>
        )}
      </div>
      {transcript ? (
        <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
          <p className="font-medium text-white/90">Transcript</p>
          <p className="mt-2 leading-relaxed text-slate-300">{transcript}</p>
        </div>
      ) : null}
    </section>
  );
};

export default PlaybackPanel;
