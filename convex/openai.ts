import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const OPENAI_API_KEY =
  "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";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams["voice"],
      input,
    });

    const buffer = await mp3.arrayBuffer();

    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error("Error generating thumbnail");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});
