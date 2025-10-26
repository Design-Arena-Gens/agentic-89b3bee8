import { featuredVoices } from "@/lib/voices";
import type { VoicesResponse } from "@/types/elevenlabs";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

export const dynamic = "force-dynamic";

async function fetchVoices(): Promise<VoicesResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return { voices: featuredVoices };
  }

  const request = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "xi-api-key": apiKey
    },
    cache: "no-store"
  });

  if (!request.ok) {
    console.error("Failed to fetch ElevenLabs voices", await request.text());
    return { voices: featuredVoices };
  }

  const data = (await request.json()) as VoicesResponse;
  return data;
}

export async function GET() {
  try {
    const voices = await fetchVoices();
    return Response.json(voices);
  } catch (error) {
    console.error("Unexpected error retrieving voices", error);
    return Response.json(
      { voices: featuredVoices, error: "Unable to retrieve voices at this time." },
      { status: 200 }
    );
  }
}
