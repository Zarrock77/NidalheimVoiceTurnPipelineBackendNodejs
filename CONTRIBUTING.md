# Contributing

Thanks for considering a contribution to `nidalheim-voice-turn-pipeline`.

## Setup

```bash
git clone https://github.com/Zarrock77/NidalheimVoiceTurnPipelineBackendNodejs.git
cd NidalheimVoiceTurnPipelineBackendNodejs
pnpm install
```

Requires Node.js 22+ and [pnpm](https://pnpm.io/).

## Development workflow

- `pnpm run build` — compile `src/` to `dist/` with `tsc`.
- `pnpm run typecheck` — type-check without emitting.
- `pnpm test` — run the Jest suite (`pnpm run test:watch` to iterate).

Run `pnpm run typecheck` and `pnpm test` before opening a pull request; both also run
in CI on every push and pull request.

## Branches and commits

- Work off a feature branch, not `main` directly.
- Commit messages: a short, descriptive summary line is enough (no strict format
  enforced). Explain *why* in the body if the change isn't self-evident from the diff.

## Pull requests

- Keep them small and focused — one logical change per PR.
- Describe what changed and why; link any related issue.
- A PR that changes behavior should update `README.md` if the public API or usage
  changed.
- A maintainer reviews before merging.

## Reporting bugs / proposing features

Open a GitHub issue. For a bug, include: what you expected, what happened instead,
and the smallest reproduction you can manage (ideally a failing test).

## Contact

Open an issue, or reach out via GitHub ([@Zarrock77](https://github.com/Zarrock77)).
See [SECURITY.md](SECURITY.md) instead for vulnerability reports.
