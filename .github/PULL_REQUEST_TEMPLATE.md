## What this PR changes

<!-- One to three sentences. The what and why, not the how. -->

Linked issue: <!-- #12, or "none" for a minor change -->

## Type

- [ ] `feat` -- new capability
- [ ] `fix` -- bug fix
- [ ] `refactor` -- reorganization, no behavior change
- [ ] `docs` -- documentation only
- [ ] `chore` / `test` / `perf` / `style`

## What was tested

<!-- Commands run, scenarios checked by hand. -->

- [ ] CI is green (typecheck, tests, build, secret scan)
- [ ] Tested locally against a real backend/provider if the change touches a provider
      (`CartesiaStreamingTTS`, `DeepgramStreamingSTT`, `ElevenLabsStreamingTTS`)

## Checklist

- [ ] **Public API changed** (`src/index.ts` exports) -- `README.md` updated to match
- [ ] **New dependency added** -- justified in the PR description
- [ ] No secrets, no real API keys anywhere in the diff
