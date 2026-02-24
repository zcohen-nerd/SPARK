# SPARK

![Status](https://img.shields.io/badge/status-schematic--phase-yellow)
![License](https://img.shields.io/badge/license-see%20LICENSE-blue)

**SPARK** is a hardened breakout and target interface board for the [STLINK-V3MODS](https://www.st.com/en/development-tools/stlink-v3mods.html) debugger/programmer. It prioritizes electrical robustness, protection-first design, fault tolerance, and correct voltage-domain handling. It is intended for lab, development, and educational environments where the debugger hardware must survive improperly wired targets, transient events, and operator error.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Design Philosophy](#design-philosophy)
- [Features](#features)
- [Power Architecture](#power-architecture)
- [Voltage-Domain and VTREF Handling](#voltage-domain-and-vtref-handling)
- [Protection Strategy](#protection-strategy)
- [Intended Use Cases](#intended-use-cases)
- [Repository Structure](#repository-structure)
- [Safety and Voltage Limitations](#safety-and-voltage-limitations)
- [Status](#status)
- [License](#license)

---

## Project Overview

The STLINK-V3MODS is a compact, surface-mount debugger module with limited on-board protection. SPARK provides a carrier and interface board that expands the STLINK-V3MODS with:

- Hardened signal paths on all debug and programming interfaces
- VTREF-adaptive level translation on SWD, JTAG, UART, SPI, I2C, and CAN
- Bidirectional TVS and series current-limiting resistors on every I/O line
- Overcurrent and reverse-polarity protection on target power supply rails
- Visual fault indicators for power and interface states
- Standard 0.1" and 1.27mm debug header footprints for broad target compatibility

This board does not add firmware or processing capability. It is a passive-active interface board designed to protect both the STLINK-V3MODS and connected target hardware.

---

## Design Philosophy

SPARK is designed around the following principles:

**Protection First**
Every external-facing signal and power rail is treated as potentially hostile. Clamping diodes, series resistors, and transient suppressors are placed at the board boundary before signals reach the STLINK-V3MODS or level translators.

**Fault Tolerance**
The board is designed to survive common fault conditions in a lab environment, including accidental short circuits, incorrect voltage application, ESD events, and reversed connectors. Fault conditions should result in a known-safe state (typically: disconnection or current limiting), not component damage.

**Correct Voltage-Domain Handling**
All interface signals are level-translated relative to the target's VTREF rail. The board does not assume a fixed logic voltage. Level translators are configured dynamically based on measured VTREF, and the STLINK-V3MODS VTREF input is driven accordingly.

**Repeatability and Reliability**
Component selection favors parts with broad availability, defined specifications, and tolerance to worst-case operating conditions. Derating is applied to all critical components.

**Minimal Injection Risk**
The board is designed to avoid back-driving the STLINK-V3MODS or target through parasitic or leakage paths, especially during power-up sequencing and when the target is unpowered.

---

## Features

- Carrier board for STLINK-V3MODS (mezzanine connector footprint)
- VTREF sensing and level translation for all interface signals
- Interface support: SWD, JTAG (10-pin and 20-pin ARM standard), UART, SPI, I2C, CAN
- Switchable 3.3 V and 5 V target power supply with current limiting and soft-start
- Reverse-polarity protection on target power input
- Overcurrent protection (polyfuse or eFuse, TBD during schematic review)
- TVS diode arrays on all external connectors
- Series current-limiting resistors on all signal lines
- LED indicators: power good, target power enabled, fault/overcurrent
- Reset and boot-mode control signals with open-drain output drivers
- Compact form factor suitable for bench mounting or enclosure use
- Standard debug headers: ARM 10-pin SWD (1.27mm), ARM 20-pin JTAG (2.54mm), UART (2.54mm)

---

## Power Architecture

SPARK handles two distinct power domains:

**Debugger Power (VDD\_DBG)**
Derived from the STLINK-V3MODS USB connection. This rail powers the SPARK board logic, level translators, and protection circuitry. It is not routed to the target by default.

**Target Power (VDD\_TGT)**
An independently controlled rail that can supply target boards at either 3.3 V or 5 V. This rail is protected by a polyfuse or eFuse for current limiting and includes reverse-polarity protection at the input. Target power is enabled via a control signal and is monitored for fault conditions.

Power sequencing ensures that the level translators are disabled until both the debugger power rail and VTREF are valid. This prevents bus contention during startup and shutdown.

---

## Voltage-Domain and VTREF Handling

The STLINK-V3MODS requires a VTREF signal that reflects the target's I/O voltage. SPARK measures the target's VTREF and uses it to:

1. Configure the bidirectional level translators on all interface signals
2. Drive the STLINK-V3MODS VTREF input with the measured target voltage
3. Inhibit interface signal enabling until VTREF is within an acceptable range (nominally 1.65 V – 5.5 V)

When the target is unpowered (VTREF absent or below threshold), all level translators are disabled and the STLINK-V3MODS interface pins are isolated from the external connectors. This prevents the STLINK-V3MODS from back-driving an unpowered target through clamping diode leakage paths.

VTREF is sensed through a high-impedance path to avoid loading the target's reference supply.

---

## Protection Strategy

| Threat | Mitigation |
|---|---|
| ESD on external connectors | TVS diode arrays (bidirectional, clamped to rail) at connector boundary |
| Overcurrent on signal lines | Series current-limiting resistors (typically 33 Ω – 100 Ω depending on interface speed) |
| Target power overcurrent | Polyfuse or eFuse with configurable current limit |
| Reverse polarity on target input | P-channel MOSFET or Schottky diode series protection |
| Back-drive through level translators | Level translator OE disabled when VTREF absent |
| Floating VTREF | VTREF threshold comparator inhibits interface enables |
| Short on debug header pins | Series resistors limit current; TVS clamps transients |
| USB overvoltage from host | Filtered through STLINK-V3MODS on-board protection (not overridden) |

---

## Intended Use Cases

- Embedded systems development and debugging using STLINK-V3MODS with mixed-voltage targets
- Educational lab environments where target boards may be incorrectly wired or damaged
- Field programming and bring-up of prototype hardware
- Long-duration bench testing where the debugger must remain connected and survive target power cycling
- Environments with elevated ESD risk (carpeted labs, low-humidity conditions)

---

## Repository Structure

```
SPARK/
├── hardware/
│   ├── schematic/          # KiCad schematic files (.kicad_sch)
│   ├── pcb/                # KiCad PCB layout files (.kicad_pcb)
│   ├── fabrication/        # Fabrication-ready output files (Gerbers, drill, IPC-D-356)
│   ├── 3d/                 # 3D model files (.step, .wrl) for mechanical integration
│   └── outputs/            # Generated outputs: Gerbers, drill files, assembly drawings
│       ├── gerbers/
│       ├── drill/
│       └── assembly/
├── docs/                   # Design documentation, interface specs, errata
├── images/                 # Board renders, photos, block diagrams
├── validation/             # Electrical validation plans and test reports
├── bom/                    # Bill of Materials (CSV, Excel, KiCad BOM exports)
├── manufacturing/          # Fab notes, stackup definition, assembly instructions
├── compliance/             # Regulatory and compliance documentation
└── archive/                # Superseded revisions and legacy files
```

---

## Safety and Voltage Limitations

> **Warning:** SPARK is a lab and development tool. It is not a certified safety device. The following limitations apply:

- Maximum target supply voltage: **5.5 V** (limited by level translator absolute maximum ratings)
- Minimum VTREF for interface operation: **1.65 V**
- Maximum VTREF: **5.5 V**
- Target supply current limit: defined by eFuse/polyfuse selection (see BOM and schematic notes)
- The board does not provide galvanic isolation. A ground fault on the target will affect the host PC via USB.
- Do not connect targets with voltages exceeding the stated maximums to any header.
- The board is not rated for use in production, safety-critical, or regulated environments without independent validation.

---

## Status

| Phase | Status |
|---|---|
| Requirements | Complete |
| Schematic | In progress |
| PCB Layout | Not started |
| Fabrication | Not started |
| Validation | Not started |

---

## License

See [LICENSE](LICENSE) for terms.

