# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/).

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
