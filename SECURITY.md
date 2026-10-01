# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for a security vulnerability.

Instead, use GitHub's private reporting:
[Report a vulnerability](https://github.com/Zarrock77/NidalheimVoiceTurnPipelineBackendNodejs/security/advisories/new)
(Security tab → "Report a vulnerability"). This opens a private advisory visible only
to the maintainer until it's resolved.

If that isn't available to you, contact the maintainer directly via GitHub
([@Zarrock77](https://github.com/Zarrock77)).

## What to include

- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a minimal proof of concept.
- The affected version/commit.
- Your assessment of severity, if you have one.

## Response

This is a small, part-time-maintained open source project — there is no SLA. As a
guideline: an initial acknowledgment within **7 days**, and a plan (fix, timeline, or
explanation) within **30 days** of a confirmed report. Credit is given to reporters in
the advisory/release notes unless you ask to stay anonymous.

## Supported versions

Pre-1.0 (`0.x`): only the latest published version is supported. There is no long-term
support branch at this stage.

## Scope

This policy covers the code in this repository. It does not cover vulnerabilities in
third-party dependencies (Deepgram SDK, `ws`, etc.) — report those to their own
maintainers — nor in services you connect this package to (Cartesia, ElevenLabs, your
own backend).
