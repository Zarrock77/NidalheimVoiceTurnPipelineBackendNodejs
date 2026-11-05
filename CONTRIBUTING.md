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

`tests/sessionRelease.test.ts` checks that sessions are released after `shutdown()`: it
creates 200 `VoiceTurnSession`s (some after a full turn, some shut down in the middle of a reply), shuts them all down, then asserts
that no timer is left and that every session is garbage-collected (via `WeakRef`). The GC
assertion uses `--expose-gc` when available, enables it at runtime otherwise, and is
skipped with a visible "skipped" test if neither works.

Run `pnpm run typecheck` and `pnpm test` before opening a pull request; both also run
in CI on every push and pull request.

## Branches and commits

The repository has two long-lived branches:

| Branch | Holds | Receives |
| --- | --- | --- |
| `dev` | Integrated work, not released yet | Squash-merged pull requests from work branches |
| `main` | Released code only | Release branches, with a merge commit |

```text
feat/… ─┐ squash and merge
fix/…  ─┼──────────────────▶ dev ──▶ release/vX.Y.Z ──merge commit──▶ main
docs/… ─┘                     ▲                                        │
                              └──────── merge main back into dev ──────┘
```

- Cut a short-lived branch from an up-to-date `dev` and name it after the kind of
  change: `feat/…`, `fix/…`, `test/…`, `docs/…`, `chore/…`.
- Open the pull request **into `dev`**, never into `main`. It is merged with
  **Squash and merge**: `dev` gets one commit per pull request, titled after the PR
  (`<PR title> (#<number>)`). The work branch is deleted after the merge.
- Never push to `main` or `dev` directly. `main` is protected: a direct `git push`
  is rejected by GitHub, including for the maintainer.
- `dev` into `main` only happens through a release branch: see
  [Subsequent releases](#subsequent-releases).
- Commit messages: a short, descriptive summary line is enough (no strict format
  enforced). Explain *why* in the body if the change isn't self-evident from the diff.

## Pull requests

Dependabot pull requests for npm dependencies and GitHub Actions follow the same
contribution workflow and require green CI checks before merging.

- Keep them small and focused — one logical change per PR.
- Describe what changed and why; link any related issue.
- A PR that changes behavior should update `README.md` if the public API or usage
  changed.
- Target `dev`. The only pull requests into `main` are release pull requests.
- Branch protection on `main` requires the `test` and `Scan git history` (gitleaks)
  checks to pass and be up to date with `main` before a PR is mergeable. Pull requests
  into `dev` run the same checks; merge them only once they are green.
- If `dev` moved since you opened your pull request, merge `dev` into your branch and
  resolve the conflicts there (a squash merge then folds that merge commit away). No human approval is
  required by GitHub (solo-maintainer project), but the maintainer may still comment
  or ask for changes before merging.

## Publishing to npm (maintainers)

The npm package name is `nidalheim-voice-turn-pipeline`. GitHub releases and npm
versions must match: release tag `v0.1.1` requires `"version": "0.1.1"` in
`package.json`. An existing npm version cannot be overwritten.

### First publication

An npm maintainer must create the package once before its trusted publisher can
be configured. Use the merged `main` branch, an npm account with 2FA enabled, and
Node.js 24 with npm 11.9.0 or newer:

```bash
git switch main
git pull --ff-only
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm run build
npm pack --dry-run
npm login --registry=https://registry.npmjs.org/
npm publish --access public --registry=https://registry.npmjs.org/
```

Inspect the package contents before publishing: `dist/` must contain JavaScript
and TypeScript declarations; `package.json`, `README.md`, and `LICENSE` must be
included. Do not ship credentials, local configuration, or test fixtures.
The existing `v0.1.0` GitHub release predates the publishing workflow and does not
need to be recreated for this initial local publication.

Then open the npm package's **Settings > Trusted Publisher**, choose **GitHub
Actions**, and configure:

| Field | Value |
| --- | --- |
| Organization or user | `Zarrock77` |
| Repository | `NidalheimVoiceTurnPipelineBackendNodejs` |
| Workflow filename | `npm-publish.yml` |
| Environment name | Leave empty |
| Allowed actions | Enable direct publishing with `npm publish` |

No `NPM_TOKEN` or `NODE_AUTH_TOKEN` secret is needed. See the official
[npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

### Subsequent releases

Releases go from `dev` to `main` through a temporary release branch:

1. Open an issue for the release.
2. From an up-to-date `dev`, create `release/vX.Y.Z`. On that branch only, update
   the version in `package.json` and move the changelog entries from `Unreleased`
   into the new version. A fix found while preparing the release goes on this branch
   too.
3. Open a pull request from `release/vX.Y.Z` into `main` and merge it with
   **Create a merge commit**, never with squash: `main` then keeps every squashed
   commit from `dev`, and Git sees `dev` as merged, so the next release does not
   conflict. Merge only after the required CI checks pass and the branch is up to
   date.
4. Create and publish a stable GitHub release targeting that merge commit on `main`,
   with a tag matching `v<package.json version>`.
5. Check the **Publish to npm** workflow and verify the published version with
   `npm view nidalheim-voice-turn-pipeline version`.
6. Bring the release back into `dev`: open a pull request from `main` into `dev` and
   merge it with **Create a merge commit** (not squash), so `dev` gets the version
   bump and the changelog. Then delete `release/vX.Y.Z`.

The workflow checks the release version, typechecks, runs tests, builds, and packs
the distribution. A separate job publishes that exact tarball using OIDC. Pull
requests affecting packaging and manual workflow runs validate without publishing;
prereleases are skipped. Publication permissions are granted only to the release
publication job.

If an npm version already exists (including after a successful local publication),
do not rerun publication for that version. Prepare a new version instead. A draft
GitHub release does not publish anything until it is published.

## Reporting bugs / proposing features

Open a GitHub issue. For a bug, include: what you expected, what happened instead,
and the smallest reproduction you can manage (ideally a failing test). Check the
[project board](https://github.com/users/Zarrock77/projects/8) first — it might
already be tracked.

## Contact

Open an issue, or reach out via GitHub ([@Zarrock77](https://github.com/Zarrock77)).
See [SECURITY.md](SECURITY.md) instead for vulnerability reports.


## What we accept, and what we keep control of

**Welcome without asking first:** Bug fixes, tests, documentation and examples; new speech-to-text or text-to-speech providers behind the `StreamingSTT` and `StreamingTTS` interfaces; logging and packaging improvements.

**Please open an issue before writing code for:**

- a change to the wire protocol: both this repository and
  [NidalheimVoiceTurnPipelinePluginUE5](https://github.com/Zarrock77/NidalheimVoiceTurnPipelinePluginUE5) implement it, so it has to stay compatible or be made in both;
- the license, the release process or the repository configuration;
- anything that ties the project to one specific game or backend.

**We will decline:** changes that add game-specific logic, secrets or credentials, or code you do not have
the right to contribute.

## How fast we reply

We aim to look at an issue or a pull request **within about a week**. This is a student team working
part-time: it is a best-effort aim, not a guarantee. If nobody has answered after two weeks, comment on the
thread to bring it back up.

## Credit

Every accepted contribution is credited in [CONTRIBUTORS.md](CONTRIBUTORS.md) and in the CHANGELOG entry of
the release that ships it.

## Governance and roadmap

See [GOVERNANCE.md](GOVERNANCE.md) for how decisions are made and releases cut, and [ROADMAP.md](ROADMAP.md)
for what is planned.
