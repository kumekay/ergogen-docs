---
sidebar_position: 11
---

# CLI cheatsheet

A one-page quick reference for running the generator. For the narrative version (install
options, development setup) see [Usage](./usage.md).

## The command

```shell
npx --yes ergogen@latest ./config.yaml -o output --clean --debug
```

| Piece | Why it's there |
| --- | --- |
| `./config.yaml` | **Required.** The config to build — a `.yaml`/`.json`/`.js` file, a KLE raw file, or a `.zip`/`.ekb` bundle (or folder). Forgetting it is the #1 mistake. |
| `-o output` | Output folder (alias `--output`, default `./output`). |
| `--clean` | Empty the output folder first. Use it on **every** regenerate so stale files don't linger. |
| `--debug` | Emit troubleshooting output (points/demo, raw + canonical config, SVGs, and `_private` items). |
| `--svg` | SVG outline renders without full debug (`--generate-svg`; DXF is always produced). |

`npx --yes ergogen@latest` needs no install. Installed globally (`npm i -g ergogen`) it's just
`ergogen …`; from a source checkout it's `node src/cli.js …`.

## Output layout

```text
output/
  points/     # (debug only) parsed points + demo visualization
  outlines/   # <name>.dxf always; <name>.svg with --svg or --debug
  cases/      # <name>.jscad
  pcbs/       # <name>.kicad_pcb  (un-routed)
```

## When something's off

- **Nothing/empty output** → did you pass the config filename? Is there a top-level `points:`?
- **A change didn't apply** → add `--clean`; inspect the **canonical** config under `--debug` to
  see how your `$extends`/units/dot-notation expanded.
- **Unexpected geometry** → open `output/points/demo.svg` (debug) to check point placement first.
- **"does not name a valid outline"** → a part references an undefined (or `_private`, non-debug)
  outline name.

## Using ergogen with an AI agent

This repo ships an [agent skill](https://github.com/kumekay/ergogen-docs/blob/main/ergogen/SKILL.md)
that teaches coding agents (Claude Code, etc.) to drive the CLI correctly — the same
config-filename / `--clean` / `--debug` guidance above, in a form agents pick up automatically.
Install it with the [`skills`](https://github.com/vercel-labs/skills) CLI:

```shell
npx skills add git@github.com:kumekay/ergogen-docs.git --skill ergogen
```
