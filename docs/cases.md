---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StlViewer from '@site/src/components/StlViewer';

# Cases

## Overview

Cases add a pretty basic and minimal 3D aspect to the generation process.
In this phase, we take different outlines (defined in the previous section, even the "private" ones), extrude and position them in space, and combine them into one 3D-printable object.
That's it.
Declarations might look something like the following:

```yaml
cases:
    case_name:
        - what: outline # default option
          name: <outline ref>
          extrude: num # default = 1
          shift: [x, y, z] # default = [0, 0, 0]
          rotate: [ax, ay, az] # default = [0, 0, 0]
          operation: add | subtract | intersect # default = add
        - what: case
          name: <case_ref>
          # extrude makes no sense here...
          shift: # same as above
          rotate: # same as above
          operation: # same as above
        - ...
    ...
```

:::note
Individual case parts can be both arrays or objects, just like with outline parts previously.
Use whichever is more convenient.
:::

When the `what` is `outline`, `name` specifies which outline to import onto the xy plane, while `extrude` specifies how much it should be extruded along the z axis.
When the `what` is `case`, `name` specifies which previously defined case to use (and `extrude` must not be set, as it makes no sense here).
After having established our base 3D object, it is (relatively!) `rotate`d, `shift`ed, and combined with what we have so far according to `operation`.
If we only want to use an object as a building block for further objects, we can employ the same "start with an underscore" trick we learned at the outlines section to make it "private".

Individual case parts can again be listed as an object instead of an array, if that's more comfortable for inheritance/reuse (just like for outlines).
And speaking of outline similarities, the `[+, -, ~]` plus name shorthand is available again.
First it will try to look up cases, and then outlines by the name given.
Stacking (the `^` shorthand) is omitted as it makes no sense here.

## Examples

<details>
<summary>Simple Extrusion</summary>

The most basic case is a single outline pushed up along the z axis.
Here we take a 3&times;1 board outline and `extrude` it 3mm into a flat plate.

<Tabs>
<TabItem value="config" label="Config" default>

```yaml
points:
  zones:
    matrix:
      columns:
        left:
        middle:
        right:
      rows:
        home:
outlines:
  board:
    - what: rectangle
      where: true
      size: [18, 18]
      corner: 2
cases:
  plate:
    - what: outline
      name: board
      extrude: 3
```

</TabItem>
<TabItem value="visualization" label="Visualization">

<StlViewer model="/models/cases_simple.plate.stl" />

<div style={{textAlign: 'center'}}>

The extruded `plate` case (drag to orbit, scroll to zoom).

</div>
</TabItem>
</Tabs>

</details>

<details>
<summary>Unibody Case</summary>

To build up something more useful, we combine parts with `operation`s and reuse a previous case via `what: case`.
Here `bottom` extrudes the board 5mm, then `shell` reuses `bottom` and `subtract`s a slightly raised, smaller pocket to hollow it out into a tray.
Note the pocket outline starts with an underscore, so it stays "private" and is never exported on its own.

<Tabs>
<TabItem value="config" label="Config" default>

```yaml
points:
  zones:
    matrix:
      columns:
        left:
        middle:
        right:
      rows:
        home:
outlines:
  board:
    - what: rectangle
      where: true
      size: [18, 18]
      corner: 2
  _pocket:
    - what: rectangle
      where: true
      size: [14, 14]
cases:
  bottom:
    - what: outline
      name: board
      extrude: 5
  shell:
    - what: case
      name: bottom
    - what: outline
      name: _pocket
      extrude: 4
      shift: [0, 0, 1]
      operation: subtract
```

</TabItem>
<TabItem value="visualization" label="Visualization">

<StlViewer model="/models/cases_unibody.shell.stl" />

<div style={{textAlign: 'center'}}>

The final `shell` case, hollowed into a tray (drag to orbit, scroll to zoom).

</div>
</TabItem>
</Tabs>

</details>
