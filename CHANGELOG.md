# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `silenceTimeoutMs` option on `VoiceTurnSession` (hands-free): commits the turn once the user
  has been silent that long after a `speech_final`. Off by default; push-to-talk is unchanged.
- Dependabot for npm and GitHub Actions
- npm release publication through GitHub Actions trusted publishing, with stable
  tag/version validation and package checks on pull requests and manual runs.
- Maintainer instructions for the first npm publication and subsequent releases.
- Test proving that `VoiceTurnSession`s are released (no timer left, garbage-collected) after
  `shutdown()`, including a disconnect in the middle of a reply.
- Tests for the ElevenLabs provider: final audio, unexpected close, error messages, audio
  forwarding, stale sockets and text framing.

### Fixed
- `VoiceTurnSession` no longer drops microphone audio while the STT connection is being
  reopened for a new sample rate, and two `audio_config` messages sent back to back no
  longer open two STT connections: they are now processed one at a time. A COMMIT received
  while the connection reopens is finalized once the buffered audio has been sent.
- `SpeechTurn` no longer hard-codes `sample_rate: 24000` in `audio_start`: it announces the rate
  exposed by the TTS provider (new optional `StreamingTTS.sampleRate`, set by `CartesiaStreamingTTS`
  and by `ElevenLabsStreamingTTS`), falling back to 24000. `ElevenLabsStreamingTTS` now throws at
  construction when `outputFormat` is not `pcm_<rate>`, since the audio is always announced as
  `pcm_s16le` and any other format would play as noise.
- `VoiceTurnSession` no longer writes the transcribed user speech to the console: the
  `stt final` log now reports only its length. The transcript is personal data and the
  library logs to the host's stdout.

### Removed
- Deepgram `vad_events` option, the catch-all console listener on unused Deepgram events,
  the `[dg Transcript empty]` log and the per-chunk "audio chunk #N" log of
  `VoiceTurnSession`. The "commit received" log no longer prints a chunk count.

## [0.1.0] - 2026-10-01

First public release, extracted from the voice pipeline of Nidalheim's `api-game`.

### Added
- `VoiceTurnSession`: push-to-talk state machine and TTS turn lifecycle (PCM16 in, `audio_config`,
  commit signal, serialized utterances, `user_transcript` / `text` / `audio_start` / `audio` /
  `audio_end` / `error` events).
- `DeepgramStreamingSTT`, `CartesiaStreamingTTS`, `ElevenLabsStreamingTTS` providers.
- `SpeechTurn`: one TTS context from first text to final audio, including failure, disconnect
  and timeout paths.
- `prepare` script so git-dependency installs build automatically.
- Open-source hygiene: MIT license, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue and PR
  templates, gitleaks secret scanning (pre-commit hook and CI), strict `main` branch protection.

[0.1.0]: https://github.com/Zarrock77/NidalheimVoiceTurnPipelineBackendNodejs/releases/tag/v0.1.0
