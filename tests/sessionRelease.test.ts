import { jest } from "@jest/globals";
import v8 from "node:v8";
import vm from "node:vm";
import { VoiceTurnSession } from "../src/voiceTurnSession.js";
import type { StreamingTTS } from "../src/speechTurn.js";
import type { StreamingSTT, FinalTranscriptInfo } from "../src/types.js";

class FakeTTS implements StreamingTTS {
  onAudio: (pcm: string) => void = () => {};
  onFinal: () => void = () => {};
  onError: (err: Error) => void = () => {};
  start = jest.fn(async () => {});
  beginUtterance = jest.fn();
  sendText = jest.fn();
  flush = jest.fn();
  close = jest.fn();
}

class FakeSTT implements StreamingSTT {
  onFinal: (text: string, final: boolean, info: FinalTranscriptInfo) => void = () => {};
  onInterim = () => {}; onError = () => {}; onUtteranceEnd = () => {};
  sampleRate = 48000; audioSecondsSent = 0; finalAudioSeconds = 0;
  start = async () => {};
  sendAudio = (b: Buffer) => { this.audioSecondsSent += b.length / 96000; };
  finalize = () => true;
  keepAlive = () => {}; close = () => {};
  reconfigure = async () => {};
}

const SESSIONS = 200;
const FULL_TURNS = 50;
const UNFINISHED_TTS = 20; // shut down while the TTS has not sent its final audio
const HUNG_REPLY = 20; // shut down while onUtterance never resolves

const idle = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
const macrotask = () => new Promise<void>((resolve) => setImmediate(resolve));

// `gc` needs --expose-gc; try to enable it at runtime when the flag was not passed.
function findGc(): (() => void) | undefined {
  if (typeof global.gc === "function") return global.gc;
  try {
    v8.setFlagsFromString("--expose-gc");
    const gc = vm.runInNewContext("gc") as unknown;
    return typeof gc === "function" ? (gc as () => void) : undefined;
  } catch { return undefined; }
}
const gc = findGc();

// Returns only weak references: no strong reference to a session survives this function.
async function runSessions(): Promise<{ refs: WeakRef<VoiceTurnSession>[]; repliesDelivered: number }> {
  const refs: WeakRef<VoiceTurnSession>[] = [];
  const sessions: VoiceTurnSession[] = [];
  let repliesDelivered = 0; // onTurnComplete fires after the reply, before the TTS final
  for (let i = 0; i < SESSIONS; i++) {
    const stt = new FakeSTT();
    const tts = new FakeTTS();
    const session = new VoiceTurnSession({
      send: () => {},
      close: () => {},
      stt,
      ttsRoute: { persistent: true, instance: tts },
      onUtterance: async (_userText, onDelta) => {
        if (i >= FULL_TURNS + UNFINISHED_TTS) return new Promise<string>(() => {});
        onDelta("Bonjour."); return "Bonjour.";
      },
      onTurnComplete: async () => { repliesDelivered++; },
    });
    await session.start();
    await session.onClientAudioConfig({ sample_rate: 48000 });
    if (i < FULL_TURNS + UNFINISHED_TTS + HUNG_REPLY) {
      session.onClientAudio(Buffer.alloc(96000)); session.onClientCommit();
      stt.onFinal("Une demande", true, { fromFinalize: true, end: stt.audioSecondsSent });
      await idle();
      tts.onAudio(Buffer.alloc(4800).toString("base64"));
      if (i < FULL_TURNS) { tts.onFinal(); await idle(); }
    }
    sessions.push(session);
    refs.push(new WeakRef(session));
  }
  for (const session of sessions) session.shutdown();
  return { refs, repliesDelivered };
}

beforeEach(() => { jest.spyOn(console, "log").mockImplementation(() => {}); });
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

test("shutdown leaves no timer behind on any session", async () => {
  jest.useFakeTimers({ doNotFake: ["setImmediate", "nextTick"] });
  const { repliesDelivered } = await runSessions();
  expect(repliesDelivered).toBe(FULL_TURNS + UNFINISHED_TTS);
  expect(jest.getTimerCount()).toBe(0);
});

// Skipped, not flaky, when the runtime cannot expose gc (run with `node --expose-gc` to force it).
(gc ? test : test.skip)("sessions are garbage-collected after shutdown (needs gc)", async () => {
  const { refs, repliesDelivered } = await runSessions();
  expect(repliesDelivered).toBe(FULL_TURNS + UNFINISHED_TTS);
  for (let i = 0; i < 10 && refs.some((r) => r.deref()); i++) {
    await macrotask();
    gc!();
  }
  expect(refs.filter((r) => r.deref())).toHaveLength(0);
});
