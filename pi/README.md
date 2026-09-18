# Mellea Skills Compiler — pi extension

Run the [Mellea Skills Compiler](../README.md) `compile` and `certify` commands
from inside a [pi](https://pi.dev) session.

## Prerequisites

This extension shells out to the `mellea-skills` CLI — it does not bundle or
install it. Before using `/compile` or `/certify`, install the compiler
following the [main README's Install section](../README.md#installation)
(`pip install -e .` from a clone of this repo), and confirm `mellea-skills`
resolves on your `PATH`:

```bash
mellea-skills version
```

Claude Code and an inference engine (Ollama or vLLM) are also required by the
underlying CLI — see the main README for setup. This extension does not
install any of these for you; if a command isn't found, it reports which one
and points back here.

## Install

```bash
pi install ./pi
```

(from a local clone of this repo — see pi's package docs for git/npm source
options once this package is published to a registry).

## Commands

- `/compile <path-to-spec.md> [flags...]` — runs `mellea-skills compile`.
  Flags are passed through as-is; see `mellea-skills compile --help` for the
  full list (`--backend`, `--model`, `--timeout`, `--repair-mode`, etc.).
- `/certify <compiled-skill-dir> [flags...]` — runs `mellea-skills certify`.
  Flags are passed through as-is; see `mellea-skills certify --help`
  (`--enforce`, `--inference-engine`, `--risk-model`, `--guardian-model`, etc.).

## Known limitations

- No auto-install: missing `mellea-skills`, Claude Code, or an inference
  engine surfaces as an error with a pointer to setup docs, not an automatic
  fix.
- No cancellation: pi's per-command abort signal (`ctx.signal`) is only
  populated while the agent is actively streaming a turn, not during a
  command handler — so a long-running `/compile` or `/certify` cannot
  currently be cancelled from within the extension. Use pi's own
  process-level interrupt if you need to stop one early.
