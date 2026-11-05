import { ElevenLabsStreamingTTS } from "../src/elevenlabs.js";

test("exposes the sample rate of its PCM output format and rejects other formats", () => {
  const make = (outputFormat?: string) => new ElevenLabsStreamingTTS("fake-key", { voiceId: "v", outputFormat });
  expect(make().sampleRate).toBe(24000);
  expect(make("pcm_16000").sampleRate).toBe(16000);
  expect(() => make("mp3_44100_128")).toThrow("only pcm_<rate> output formats are supported");
});
