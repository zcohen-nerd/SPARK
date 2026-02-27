# SPARK

![Status](https://img.shields.io/badge/status-v0.4--in--progress-yellow)
![License](https://img.shields.io/badge/license-see%20LICENSE-blue)

**SPARK** is a hardened breakout and target interface board for [STLINK-V3MODS](https://www.st.com/en/development-tools/stlink-v3mods.html). The V0.4 architecture emphasizes fault containment, controlled target power distribution, and mixed-signal translation suitable for debug and bring-up in lab environments.

## Project Overview

- Hardened interface path between STLINK-V3MODS and target connectors
- Protected 5 V input path and switchable target power rails
- Hybrid level translation strategy matched to signal behavior
- Per-line ESD + series impedance at external interfaces
- 4-layer PCB and enclosure-constrained mechanical envelope for repeatable lab use

## V0.4 Power Architecture

SPARK separates debugger-side power conditioning, internal logic rails, and target power export:

- **5 V entry protection:** STLINK 5V_OUT enters through a TPS2596 eFuse before feeding SPARK master 5 V.
- **Internal logic rails:** dedicated low-noise LDOs generate internal 1.8 V and 3.3 V logic rails.
- **Target rail gating:** 1.8V_TARGET, 3.3V_TARGET, and 5V_TARGET are switched by TPS22919 load switches.
- **Default-safe startup:** TPS22919 EN pins are hardware-pulled down so target rails default OFF at startup/reset.
- **Fault/PG telemetry:** TPS2596 FAULT/PG signals are used if routed in the schematic implementation.

### 5V target power vs VTREF policy

- **5V_TARGET is power only.** It is not a declaration that interface I/O is 5 V tolerant.
- **VTREF/logic domain is separate from power export.**
- Unless explicit VTREF overvoltage protection is implemented in hardware, treat VTREF as **<= 3.6 V maximum**.
- **Warning:** VTREF must not exceed 3.6 V; 5V_TARGET does not permit 5 V logic on debug/data pins.

## Translation Architecture (Hybrid)

SPARK V0.4 uses two translator families based on bus behavior:

| Signal / Bus | Translator | Notes |
|---|---|---|
| I2C (minimum) | LSF0108 | Open-drain behavior; pull-ups on both sides; SPARK-side pull-ups DNI by default. |
| SWDIO | SN74AXC8T245 | Routed through AXC8T245 (not LSF0108). |
| SPI | SN74AXC8T245 | Push-pull/high-bandwidth path. |
| UART | SN74AXC8T245 | Push-pull path for robust edge control. |
| GPIO / SWO (as implemented) | SN74AXC8T245 | Applied to push-pull/high-bandwidth channels. |

## Protection Strategy (V0.4)

- TPS2596 eFuse on 5 V entry path
- TPS22919 target-rail gating with default-OFF hardware pulldowns
- 22 Ω series resistor on every external-facing signal line
- SP0503BAHTG ESD arrays on external signals, clamped to GND

## CAN Interface

- CAN FD transceiver: **TCAN1051**
- 120 Ω bus termination controlled by switch
- CAN TVS selection must be automotive-rated for expected surge/transient environment

## PCB and Mechanical Notes

- 4-layer controlled-impedance stackup: JLC04161H-7628
- Heavy ground flooding with via stitching
- Typical trace width: 12 mil
- ENIG finish with ink-plugged vias
- Board size: 88.9 mm x 88.9 mm (enclosure-driven), with reinforced mounting holes

## Status

| Phase | Status |
|---|---|
| Requirements | In progress |
| Schematic | Complete (source present) |
| PCB Layout | Complete (source present) |
| Fabrication Outputs | In progress (packages imported) |
| Validation | In progress |

## Repository Structure

```
SPARK/
├── hardware/
│   ├── schematic/
│   ├── pcb/
│   ├── fabrication/
│   ├── 3d/
│   └── outputs/
├── docs/
├── images/
├── validation/
├── bom/
├── manufacturing/
├── compliance/
└── archive/
```

## Additional Documentation

- Architecture details: [docs/architecture.md](docs/architecture.md)
- Interface behavior and expectations: [docs/interfaces.md](docs/interfaces.md)
- Bench validation plan: [validation/test_plan.md](validation/test_plan.md)

## Current Design Artifacts

- Schematic source: [hardware/schematic/SPARK Schematic.fsch](hardware/schematic/SPARK%20Schematic.fsch)
- PCB source: [hardware/pcb/SPARK PCB.fbrd](hardware/pcb/SPARK%20PCB.fbrd)
- Design archive: [hardware/pcb/Electronics Design.f3z](hardware/pcb/Electronics%20Design.f3z)
- Fabrication archives: [hardware/fabrication/SPARK PCB.zip](hardware/fabrication/SPARK%20PCB.zip), [hardware/fabrication/SPARK PCB.tar](hardware/fabrication/SPARK%20PCB.tar), [hardware/fabrication/SPARK PCB.tgz](hardware/fabrication/SPARK%20PCB.tgz)
- ODB++ output tree: [hardware/outputs/odb++/ODBFiles](hardware/outputs/odb++/ODBFiles)

## Bill of Materials (BOM)

- Master BOM: [bom/bom_master.csv](bom/bom_master.csv)
- The BOM is derived from a local schematic export intake file (stored under `Inbox/` during import and not committed).
- Any part substitution must be documented in [CHANGELOG.md](CHANGELOG.md).

## License

See [LICENSE](LICENSE) for terms.

