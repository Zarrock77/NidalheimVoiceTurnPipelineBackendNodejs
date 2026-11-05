import { ElevenLabsStreamingTTS } from "../src/elevenlabs.js";

test("exposes the sample rate of a PCM output format, undefined for others", () => {
  const rate = (outputFormat?: string) => new ElevenLabsStreamingTTS("fake-key", { voiceId: "v", outputFormat }).sampleRate;
  expect(rate()).toBe(24000);
  expect(rate("pcm_16000")).toBe(16000);
  expect(rate("mp3_44100_128")).toBeUndefined();
});
