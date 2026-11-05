import { jest } from "@jest/globals";
import { EventEmitter } from "node:events";

const sockets: FakeSocket[] = [];
class FakeSocket extends EventEmitter {
  static OPEN = 1;
  readyState = 0;
  sent: Record<string, unknown>[] = [];
  constructor() { super(); sockets.push(this); }
  send(s: string) { this.sent.push(JSON.parse(s)); }
  close() { this.readyState = 3; this.emit("close"); }
  terminate() { this.close(); }
  open() { this.readyState = 1; this.emit("open"); }
  message(msg: Record<string, unknown>) { this.emit("message", Buffer.from(JSON.stringify(msg))); }
}
jest.unstable_mockModule("ws", () => ({ default: FakeSocket }));
const { ElevenLabsStreamingTTS } = await import("../src/elevenlabs.js");
beforeEach(() => { sockets.length = 0; });

async function started() {
  const tts = new ElevenLabsStreamingTTS("fake-key", { voiceId: "test-voice" });
  const opened = tts.start(); sockets[0].open(); await opened;
  return tts;
}

test("isFinal calls onFinal once, closes the socket and the close is not an error", async () => {
  const tts = await started();
  const done = jest.fn(); const failed = jest.fn(); tts.onFinal = done; tts.onError = failed;
  sockets[0].message({ isFinal: true });
  expect(done).toHaveBeenCalledTimes(1);
  expect(sockets[0].readyState).toBe(3);
  expect(failed).not.toHaveBeenCalled();
});

test("a close before isFinal reports an error once", async () => {
  const tts = await started();
  const failed = jest.fn(); tts.onError = failed;
  sockets[0].close();
  expect(failed).toHaveBeenCalledTimes(1);
  expect(failed.mock.calls[0][0]).toEqual(new Error("ElevenLabs closed before final audio"));
});

test("an error message calls onError", async () => {
  const tts = await started();
  const failed = jest.fn(); tts.onError = failed;
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    sockets[0].message({ error: "Test failure" });
    expect(failed).toHaveBeenCalledTimes(1);
    expect(failed.mock.calls[0][0]).toEqual(new Error("Test failure"));
  } finally { log.mockRestore(); tts.close(); }
});

test("audio messages are forwarded to onAudio", async () => {
  const tts = await started();
  const audio = jest.fn(); tts.onAudio = audio;
  sockets[0].message({ audio: "AAAA" });
  sockets[0].message({ audio: "AQAB" });
  expect(audio.mock.calls).toEqual([["AAAA"], ["AQAB"]]);
  tts.close();
});

test("events from a closed socket are ignored", async () => {
  const tts = await started();
  const audio = jest.fn(); const done = jest.fn(); const failed = jest.fn();
  tts.onAudio = audio; tts.onFinal = done; tts.onError = failed;
  tts.close();
  sockets[0].message({ audio: "AAAA" }); sockets[0].message({ isFinal: true });
  sockets[0].emit("close");
  expect(audio).not.toHaveBeenCalled(); expect(done).not.toHaveBeenCalled();
  expect(failed).not.toHaveBeenCalled();
});

test("a second start() replaces the old socket and ignores its events", async () => {
  const tts = new ElevenLabsStreamingTTS("fake-key", { voiceId: "test-voice" });
  const audio = jest.fn(); const failed = jest.fn();
  tts.onAudio = audio; tts.onError = failed;
  const first = tts.start(); sockets[0].open(); await first;
  const restarted = tts.start(); sockets[1].open(); await restarted;
  sockets[0].message({ audio: "OLD" }); sockets[0].emit("close");
  sockets[1].message({ audio: "NEW" });
  expect(audio.mock.calls).toEqual([["NEW"]]);
  expect(failed).not.toHaveBeenCalled();
  tts.close();
});

test("sendText appends a trailing space, flush sends empty text, both throw when not connected", async () => {
  const tts = new ElevenLabsStreamingTTS("fake-key", { voiceId: "test-voice" });
  expect(() => tts.sendText("Bonjour")).toThrow("not connected");
  expect(() => tts.flush()).toThrow("not connected");
  const opened = tts.start(); sockets[0].open(); await opened;
  tts.sendText(""); tts.sendText("Bonjour"); tts.sendText("Salut "); tts.flush();
  expect(sockets[0].sent.slice(1)).toEqual([{ text: "Bonjour " }, { text: "Salut " }, { text: "" }]);
  tts.close();
  expect(() => tts.sendText("x")).toThrow("not connected");
  expect(() => tts.flush()).toThrow("not connected");
});

test("sendText and flush throw while the socket is not open yet", () => {
  const tts = new ElevenLabsStreamingTTS("fake-key", { voiceId: "test-voice" });
  void tts.start().catch(() => {});
  expect(() => tts.sendText("Bonjour")).toThrow("not connected");
  expect(() => tts.flush()).toThrow("not connected");
  tts.close();
});

test("exposes the sample rate of its PCM output format and rejects other formats", () => {
  const make = (outputFormat?: string) => new ElevenLabsStreamingTTS("fake-key", { voiceId: "v", outputFormat });
  expect(make().sampleRate).toBe(24000);
  expect(make("pcm_16000").sampleRate).toBe(16000);
  expect(() => make("mp3_44100_128")).toThrow("only pcm_<rate> output formats are supported");
});
