# Contributing

Thanks for considering a contribution to `nidalheim-voice-turn-pipeline`.

## Setup

```bash
git clone https://github.com/Zarrock77/NidalheimVoiceTurnPipelineBackendNodejs.git
cd NidalheimVoiceTurnPipelineBackendNodejs
pnpm install
./scripts/install-git-hooks.sh
```

Requires Node.js 22+ and [pnpm](https://pnpm.io/). The last step enables a pre-commit
hook that scans staged changes for secrets with [gitleaks](https://github.com/gitleaks/gitleaks)
(falls back to Docker if the binary isn't installed, warns instead of blocking if
neither is available). CI also rescans the full history on every push/PR.

## Development workflow

- `pnpm run build` — compile `src/` to `dist/` with `tsc`.
- `pnpm run typecheck` — type-check without emitting.
- `pnpm test` — run the Jest suite (`pnpm run test:watch` to iterate).

Run `pnpm run typecheck` and `pnpm test` before opening a pull request; both also run
in CI on every push and pull request.

## Branches and commits

- Work off a feature branch, not `main` directly — `main` is protected, a direct
  `git push` to it is rejected by GitHub, including for the maintainer.
- Commit messages: a short, descriptive summary line is enough (no strict format
  enforced). Explain *why* in the body if the change isn't self-evident from the diff.

## Pull requests

Dependabot pull requests for npm dependencies and GitHub Actions follow the same
contribution workflow and require green CI checks before merging.

- Keep them small and focused — one logical change per PR.
- Describe what changed and why; link any related issue.
- A PR that changes behavior should update `README.md` if the public API or usage
  changed.
- Branch protection requires the `test` and `Scan git history` (gitleaks) checks to
  pass and be up to date with `main` before a PR is mergeable. No human approval is
  required by GitHub (solo-maintainer project), but the maintainer may still comment
  or ask for changes before merging.

## Reporting bugs / proposing features

Open a GitHub issue. For a bug, include: what you expected, what happened instead,
and the smallest reproduction you can manage (ideally a failing test). Check the
[project board](https://github.com/users/Zarrock77/projects/8) first — it might
already be tracked.

## Contact

Open an issue, or reach out via GitHub ([@Zarrock77](https://github.com/Zarrock77)).
See [SECURITY.md](SECURITY.md) instead for vulnerability reports.
