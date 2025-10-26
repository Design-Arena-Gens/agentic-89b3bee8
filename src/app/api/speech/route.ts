import type { GenerateSpeechPayload, VoiceSettings } from "@/types/elevenlabs";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

type ElevenLabsRequestBody = {
  text: string;
  model_id?: string;
  optimize_streaming_latency?: number;
  voice_settings?: VoiceSettings;
};

function createRequestBody(payload: GenerateSpeechPayload): ElevenLabsRequestBody {
  const body: ElevenLabsRequestBody = {
    text: payload.text
  };

  if (payload.modelId) {
    body.model_id = payload.modelId;
  }

  if (typeof payload.optimizeStreamingLatency === "number") {
    body.optimize_streaming_latency = payload.optimizeStreamingLatency;
  }

  if (payload.voiceSettings) {
    body.voice_settings = payload.voiceSettings;
  }

  return body;
}

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Missing ELEVENLABS_API_KEY environment variable." }, { status: 500 });
  }

  let payload: GenerateSpeechPayload;

  try {
    payload = (await request.json()) as GenerateSpeechPayload;
  } catch (error) {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload?.voiceId || !payload.text?.trim()) {
    return Response.json({ error: "voiceId and text are required." }, { status: 400 });
  }

  const targetUrl = `${ELEVENLABS_BASE_URL}/text-to-speech/${payload.voiceId}`;

  try {
    const elevenResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify(createRequestBody(payload))
    });

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();
      console.error("ElevenLabs API error", errorText);
      return Response.json({ error: "Failed to generate speech." }, { status: 502 });
    }

    const audioBuffer = await elevenResponse.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Unable to generate speech", error);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
