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

#### Command line options

The general shape of an invocation is:

```shell
ergogen <config_file> [options]
```

where `<config_file>` is a YAML/JSON/JS config, or a `.zip`/`.ekb` bundle (or a folder) containing a `config.*` plus custom footprints/templates. The available options are:

| Option | Alias | Default | Description |
| --- | --- | --- | --- |
| `--output` | `-o` | `./output` | Output folder to write results into. |
| `--debug` | `-d` | `false` | Debug mode - also emits the raw/canonical source, points data, demo visualization, intermediate `.yaml` models, and the underscore-prefixed (`_`) "private" outlines/cases/pcbs that are otherwise skipped. |
| `--clean` | | `false` | Empty the output folder before writing. |
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
