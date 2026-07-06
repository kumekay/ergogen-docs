---
sidebar_position: 9
---

# File formats

## Input

The primary input is a single **config**. Ergogen figures out its format automatically, trying each of the following in turn:

- **YAML** - the canonical, most readable format, and what the rest of these docs use.
- **JSON** - since valid JSON is also valid YAML, this "just works" through the same path.
- **JavaScript** - a snippet of code that, when evaluated, *returns* the config object. This is your escape hatch when the declarative config gets repetitive: you can use variables, loops, and functions to build the object procedurally. More generally, any language that can emit YAML/JSON works too - Ergogen only ever sees the produced data.
- **KLE** - raw [keyboard-layout-editor](http://www.keyboard-layout-editor.com/) data is auto-detected and converted to points. Because a KLE import usually only carries key positions, Ergogen automatically switches into debug mode for it (so you get the points and demo visualization out of the box).

### Bundles

For anything beyond a lone config file, you can hand Ergogen a **bundle**: a `.zip` (or `.ekb`) archive - or, on the CLI, a plain folder, which is zipped in memory for you. A bundle must contain exactly one `config.yaml`/`config.yml`/`config.json`/`config.js`, and may additionally provide:

- `footprints/*.js` - custom [footprints](./pcbs.md) injected before processing.
- `templates/*.js` - custom PCB templates.

## Output

What Ergogen emits mirrors the config's structure. Note that several artifacts are only produced in **debug mode** (`-d` on the CLI, always on for KLE input) - in normal mode you get just the "real" deliverables.

- **points** (debug only) - the computed key positions, dumped as `points.yaml`, the resolved `units.yaml`, the original `raw` source, the `canonical` (fully preprocessed) config, and a `demo` visualization of the layout.
- **outlines** - every named outline as a **DXF** (always). An **SVG** render is added when you pass `--svg` or run in debug mode. Outlines whose name starts with `_` are treated as intermediate helpers and only surface in debug mode.
- **cases** - each case as a **JSCAD** script (`.jscad`). That's the only case format for now; you run it through JSCAD yourself to get a mesh. As with outlines, `_`-prefixed cases are debug-only.
- **pcbs** - each PCB as a KiCad board file (`.kicad_pcb`). These are *unrouted* - Ergogen places and nets the footprints and draws the edge cuts, but leaves routing, schematics, and the surrounding KiCad project to you. `_`-prefixed PCBs are, again, debug-only.