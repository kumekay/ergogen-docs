---
name: ergogen
description: Generate ergonomic keyboard plates, outlines, cases, and KiCad PCBs from a YAML/JSON config using the ergogen CLI. Use when running, debugging, or iterating on an ergogen keyboard config. Covers the CLI (config filename, -o output, --clean to regenerate, --debug to troubleshoot), the input/output formats, and how to recover from common errors.
---

# Driving ergogen from the command line

[Ergogen](https://ergogen.xyz) turns a single declarative config (points → outlines →
cases → PCBs) into plates, DXF/SVG outlines, JSCAD cases, and un-routed KiCad PCBs.
This skill is about running the generator correctly and reading its output. For the full
config reference, see the docs at https://kumekay.github.io/ergogen-docs/.

## The one command to remember

```bash
npx --yes ergogen@latest ./config.yaml -o output --clean --debug
```

Break it down — each piece matters:

- **`./config.yaml`** — you MUST pass the config file as a positional argument. This is the
  single most common mistake: running `ergogen -o output` with no file does nothing useful.
  The path can be a `.yaml`, `.json`, or `.js` file, a KLE raw-data file, or a `.zip`/`.ekb`
  bundle (or a folder) containing a `config.*` plus custom `footprints/` and `templates/`.
- **`-o output`** (alias `--output`, default `./output`) — the folder results are written to.
- **`--clean`** — empties the output folder before writing. **Use this on every regenerate.**
  Without it, stale files from a previous run (an outline you renamed, a PCB you deleted from
  the config) linger in the output and cause confusion. If your last change "didn't take",
  the fix is almost always `--clean`.
- **`--debug`** — turns on troubleshooting output (see below). Cheap and safe; prefer it while
  iterating.

`npx --yes ergogen@latest` needs no install and always fetches the current release. If ergogen
is already installed globally (`npm i -g ergogen`) just call `ergogen …`; from a source
checkout, call `node src/cli.js …` with the same arguments.

## What `--debug` gives you (and why to use it)

Normal runs only write the "real" artifacts. `--debug` additionally emits:

- `points/` — the parsed points as data plus a `demo` visualization (the keycap layout). This
  is the fastest way to see whether your points/zones came out where you expected.
- the **raw** and **canonical** (fully preprocessed) config, so you can see what your
  `$extends` / dot-notation / units actually expanded to.
- intermediate `.yaml` models and **SVG** renders of outlines.
- **private** items — any outline/case/pcb whose name starts with `_` is normally skipped;
  debug mode emits them so you can inspect building blocks.

When a config errors or an output looks wrong, re-run with `--debug` and inspect
`output/points/demo.*` and the canonical config first.

Add `--svg` (alias `--generate-svg`) if you want SVG outline renders without full debug
(DXF outlines are always produced).

## Output layout

```
output/
  points/     # (debug) parsed points + demo visualization
  outlines/   # <name>.dxf always; <name>.svg with --svg or --debug
  cases/      # <name>.jscad  (3D; render/convert separately)
  pcbs/       # <name>.kicad_pcb  (un-routed — you still route it in KiCad)
```

Only sections present in the config are produced. A config needs at least a `points` clause.

## A minimal config to sanity-check the toolchain

```yaml
points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
        middle:
        index:
      rows:
        bottom:
        home:
        top:
outlines:
  board:
    - what: rectangle
      where: true
      bound: true
      size: 18
```

```bash
npx --yes ergogen@latest ./config.yaml -o output --clean --debug
# -> output/outlines/board.dxf (+ .svg), output/points/demo.svg
```

## Troubleshooting common errors

- **"Input does not contain a points clause!" / empty output** — you either didn't pass the
  config file, or the top-level `points:` key is missing/misspelled. Check the filename
  argument first.
- **A change didn't take effect** — re-run with `--clean` (stale output), and check the
  **canonical** config under `--debug` to confirm your `$extends`/units expanded as intended.
- **"Field … does not name a valid/existing outline!"** — an `outlines`/`cases`/`pcbs` part
  references an outline name that isn't defined (or is `_private` and you're not in debug).
- **YAML parse errors** — ergogen reads YAML; indentation and `key: value` spacing matter.
  Dot-notation keys (`points.zones.matrix.key.spread: 1`) are expanded by the preprocessor —
  a stray dot in a name can nest things unexpectedly; verify with the canonical output.
- **Math strings** — any string that parses as a formula (e.g. `2 u`, `cx - 7`) is evaluated
  as a number; a typo'd unit name yields a confusing "not defined" style error.

## When not to use the CLI

For quick, visual iteration a human can paste the same config into the web UI
(https://ergogen.xyz stable, https://ergogen.ceoloide.com nightly) and see points/outlines/
cases/PCBs live. The CLI is the right tool for scripting, automation, custom footprint/template
bundles, and reproducible builds.
