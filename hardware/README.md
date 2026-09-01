<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# SPARK hardware — sources and generated outputs

All files in this directory tree are part of the SPARK design and are licensed
under **CERN-OHL-S-2.0** (`../LICENSE`). Source Location:
<https://github.com/zcohen-nerd/SPARK>.

Generated outputs (fabrication archives, ODB++) are produced from the sources
below and inherit the same licence. They do not carry an embedded per-file
notice because they are tool output; this file is the notice that travels with
them. If you redistribute a manufacturing package, keep it with a copy of
`LICENSE` and this notice.

## Sources (Autodesk Fusion Electronics)

| Path | Contents | Tool needed |
|---|---|---|
| `schematic/SPARK Schematic.fsch` | V0.4 schematic | Autodesk Fusion (Electronics) |
| `pcb/SPARK PCB.fbrd` | V0.4 4-layer board layout | Autodesk Fusion (Electronics) |
| `pcb/Electronics Design.f3z` | Combined design archive | Autodesk Fusion |

These are the authoritative sources. Everything below is regenerated from them.

## Generated outputs

| Path | Contents | Format |
|---|---|---|
| `fabrication/SPARK PCB.zip` / `.tar` / `.tgz` | Manufacturing package | **ODB++** (same payload, three container formats) |
| `outputs/odb++/ODBFiles/spark_pcb/` | Unpacked ODB++ job | ODB++ |
| `outputs/assembly/`, `outputs/drill/` | *(empty placeholders)* | — |
| `3d/` | *(empty placeholder)* | — |

### Important: ODB++ only

There is **no RS-274X Gerber set and no Excellon drill file** in this
repository. Fab houses that require Gerbers will need them regenerated from the
Fusion source. When a Gerber/drill export is added it should live under
`outputs/drill/` and a new `outputs/gerbers/` directory, and this table should be
updated.

### Regenerating

1. Open `pcb/SPARK PCB.fbrd` in Autodesk Fusion.
2. Export the manufacturing package (ODB++ and/or Gerber+drill).
3. Replace the files under `fabrication/` and `outputs/`.
4. Note the change in `../CHANGELOG.md` with the date and the Fusion version
   used.

## Stackup / process (from the layout)

- 4-layer controlled-impedance stackup: JLC04161H-7628
- 12 mil typical trace width
- ENIG finish, ink-plugged vias
- 88.9 mm × 88.9 mm outline, reinforced mounting holes

These describe the design intent. They are not a fabrication certificate.
