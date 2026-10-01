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

1. Open an issue and a release-preparation PR. Update the version in `package.json`
   and move the relevant changelog entries from `Unreleased` into the new version.
2. Merge only after the required CI checks pass and the branch is up to date.
3. Create and publish a stable GitHub release targeting the merged commit, with a
   tag matching `v<package.json version>`.
4. Check the **Publish to npm** workflow and verify the published version with
   `npm view nidalheim-voice-turn-pipeline version`.

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
