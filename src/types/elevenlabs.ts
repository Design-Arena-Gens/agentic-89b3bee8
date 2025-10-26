export type VoiceSample = {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash?: string | null;
};

export type VoiceSettings = {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
};

export type ElevenLabsVoice = {
  voice_id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  labels?: Record<string, string>;
  preview_url?: string | null;
  available_for_tiers?: string[];
  fine_tuning?: {
    language?: string | null;
  };
  settings?: VoiceSettings;
  samples?: VoiceSample[];
};

export type VoicesResponse = {
  voices: ElevenLabsVoice[];
};

export type GenerateSpeechPayload = {
  text: string;
  voiceId: string;
  modelId?: string;
  optimizeStreamingLatency?: number;
  voiceSettings?: VoiceSettings;
};
