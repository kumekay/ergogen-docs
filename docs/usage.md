---
sidebar_position: 10
---

# Usage

## Web

The quickest way to get going is the browser-based UI - no install required. There are two deployments:

- [ergogen.xyz](https://ergogen.xyz) - the official, stable web UI.
- [ergogen.ceoloide.com](https://ergogen.ceoloide.com) - an unofficial, nightly build that tracks the latest development features (and is likely to become official).

The workflow is the same in both: paste (or type) your config into the editor on the left, and Ergogen re-processes it live. You can inspect the generated **Points**, **Outlines**, **Cases**, and **PCBs** in the preview panes, then download the individual outputs (DXF/SVG outlines, JSCAD cases, `.kicad_pcb` files) or grab everything as a zip. It's the ideal place to prototype, tinker with someone else's config, and see changes instantly.

## CLI

### For end users

:::info
Requires Node.js 18+ (and the bundled npm). The current dependencies - most notably `mathjs@^15` - no longer support the older Node 14 line.
:::

If command line is more your thing, you can install the latest ergogen release by issuing:

```shell
npm i -g ergogen
```

After this, you will be able to use the `ergogen` command - for example, by specifying an input config and an output folder like so:

```shell
ergogen input.yaml -o output_folder
```

Prefer not to install anything? `npx` fetches and runs the current release on the fly - handy for a one-off build or the essentials on a single line:

```shell
npx --yes ergogen@latest ./config.yaml -o output --clean --debug
```

#### Command line options

The general shape of an invocation is:

```shell
ergogen <config_file> [options]
```

where `<config_file>` is a YAML/JSON/JS config, or a `.zip`/`.ekb` bundle (or a folder) containing a `config.*` plus custom footprints/templates. Passing it is **required** - forgetting the config filename is the most common mistake. The available options are:

| Option | Alias | Default | Description |
| --- | --- | --- | --- |
| `--output` | `-o` | `./output` | Output folder to write results into. |
| `--debug` | `-d` | `false` | Debug mode - also emits the raw/canonical source, points data, demo visualization, intermediate `.yaml` models, and the underscore-prefixed (`_`) "private" outlines/cases/pcbs that are otherwise skipped. |
| `--clean` | | `false` | Empty the output folder before writing. Use it on every regenerate so stale files don't linger. |
| `--svg` | `--generate-svg` | `false` | Also generate SVG renders of the outlines (DXF is always produced). |

Since the CLI is built on [yargs](https://yargs.js.org/), `--help` and `--version` are available for free:

```shell
ergogen --help
ergogen --version
```

### For development

If you want to sneak a peek of the features being developed on the cutting edge, or would like to contribute stuff, you can clone the repo locally by:

```shell
git clone https://github.com/ergogen/ergogen.git
cd ergogen
npm install
```

To use this local copy, you would call `node src/cli.js` instead of the global `ergogen` command.
So the above example would change to:

```shell
node src/cli.js input.yaml -o output_folder
```

### Output layout

A build writes each output type into its own subfolder:

```text
output/
  points/     # (debug only) parsed points + demo visualization
  outlines/   # <name>.dxf always; <name>.svg with --svg or --debug
  cases/      # <name>.jscad
  pcbs/       # <name>.kicad_pcb  (un-routed)
```

### Troubleshooting

- **Nothing / empty output** - did you pass the config filename? Is there a top-level `points:`?
- **A change didn't apply** - add `--clean`; inspect the **canonical** config under `--debug` to see how your `$extends`/units/dot-notation expanded.
- **Unexpected geometry** - open `output/points/demo.svg` (debug) to check point placement first.
- **"does not name a valid outline"** - a part references an undefined (or `_private`, non-debug) outline name.

### Using ergogen with an AI agent

This repo ships an [agent skill](https://github.com/kumekay/ergogen-docs/blob/main/skills/ergogen/SKILL.md) that teaches coding agents (Claude Code, etc.) to drive the CLI correctly - the same config-filename / `--clean` / `--debug` guidance above, in a form agents pick up automatically. Install it with the [`skills`](https://github.com/vercel-labs/skills) CLI:

```shell
npx skills add git@github.com:kumekay/ergogen-docs.git --skill ergogen
```
