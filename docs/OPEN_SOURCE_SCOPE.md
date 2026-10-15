# Open source scope

This page says what this repository opens, what it does not, and under which license.

## What this repository is

`nidalheim-voice-turn-pipeline` is a small, reusable piece extracted from the voice conversation
system of the Nidalheim game: streaming speech-to-text, a reply callback you provide, and streaming
text-to-speech, orchestrated per voice turn. It has no knowledge of any game, prompt, quest or
database. The host supplies the speech providers, the transport and the reply logic.

It has an Unreal Engine 5 counterpart, which speaks the same wire protocol:
[NidalheimVoiceTurnPipelinePluginUE5](https://github.com/Zarrock77/NidalheimVoiceTurnPipelinePluginUE5).

## What is open

| In this repository (MIT) | Why |
|---|---|
| The voice-turn state machine and TTS turn lifecycle | Generic: usable by any real-time voice agent |
| The Deepgram, Cartesia and ElevenLabs provider adapters | Optional; the `StreamingSTT` / `StreamingTTS` interfaces let you bring your own |
| The wire protocol (documented in the README) | Needed to write a compatible client or server |
| Tests and CI configuration | So changes can be reviewed and verified |

## What is not part of this repository

The Nidalheim game itself, its quest system, its character content and its server infrastructure
are closed-source and are not published here. They are not needed to use this package, and nothing
in this repository depends on them.

## License

MIT. See [LICENSE](../LICENSE).

In practice, MIT lets you use, modify, merge, publish, distribute, sublicense and sell the code,
including inside a commercial product. The conditions are that the copyright and license notice stay
with copies of the code, and that it is provided without warranty.

## Dependencies

| Dependency | License | Kind |
|---|---|---|
| `@deepgram/sdk` | MIT | Runtime dependency |
| `ws` | MIT | Peer dependency (you install it) |

The runtime dependency tree was checked on 2026-10-15 and contains permissive licenses only (MIT,
BSD-2-Clause). Development tooling is not distributed with the package. Dependencies keep their own
licenses; re-check them if you update versions.

## Contributing and security

See [CONTRIBUTING.md](../CONTRIBUTING.md) and [SECURITY.md](../SECURITY.md).
