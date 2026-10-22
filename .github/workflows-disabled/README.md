# Inherited workflows (disabled)

These are BitChord's original GitHub Actions. They were moved out of
`.github/workflows/` so GitHub no longer runs them, because on this fork they:

- fail without BitChord's secrets (signing keys, Last.fm, Oracle VM deploy),
- and `release.yml` would build BitChord desktop packages and draft a
  "BitChord" release whenever a `v*.*.*` tag is pushed.

Muvora releases are cut locally with `scripts/release.ps1`. To re-enable any
of these, move it back into `.github/workflows/` and add the secrets it needs.
