# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version numbering follows hardware revision conventions: `rev-X.Y` where X is the
major revision (significant redesign) and Y is the minor revision (incremental change
within the same design generation).

---

## [Unreleased]

### Added
- V1 goals section for next major hardware revision planning
- Imported hardware design and fabrication artifacts from `Inbox/` into repository hardware paths:
	- `hardware/schematic/SPARK Schematic.fsch`
	- `hardware/pcb/SPARK PCB.fbrd`
	- `hardware/pcb/Electronics Design.f3z`
	- `hardware/fabrication/SPARK PCB.zip`
	- `hardware/fabrication/SPARK PCB.tar`
	- `hardware/fabrication/SPARK PCB.tgz`
	- `hardware/outputs/odb++/ODBFiles/`
- Board render images:
	- `images/spark-board-top.png`
	- `images/spark-board-perspective.png`

### Changed
- Documentation aligned to V0.4 architecture baseline
- README status updated to reflect available schematic/PCB source files and imported fabrication packages
- Local intake workflow formalized: `Inbox/` is git-ignored and used only for non-versioned handoff files

### Fixed
- N/A

### V1 Goals
- Add VTREF overvoltage protection/disconnect path
- Evaluate optional split CAN termination network (60 Ω + 60 Ω + capacitor)

---

## [rev-0.4] - Architecture Update (In Progress)

### Added
- 5 V entry protection architecture based on TPS2596 eFuse (`5V_OUT` -> eFuse -> SPARK master 5 V)
- Target rail gating for `1.8V_TARGET`, `3.3V_TARGET`, and `5V_TARGET` using TPS22919 load switches with hardware default-OFF EN pulldowns
- Dedicated low-noise LDO rails for internal 1.8 V and 3.3 V logic domains
- Hybrid translation architecture:
	- LSF0108 for open-drain/complex signals (I2C minimum)
	- SN74AXC8T245 for push-pull/high-bandwidth signals (SPI, UART, GPIO, SWO as applicable)
- Per-line 22 Ω series resistors on external-facing signal lines
- SP0503BAHTG ESD arrays on external interfaces with clamp reference to GND
- CAN FD physical layer with TCAN1051 and switchable 120 Ω termination
- PCB/mechanical baseline notes: 4-layer controlled-impedance stackup (JLC04161H-7628), heavy GND flooding with via stitching, 12 mil typical routing, ENIG finish, ink-plugged vias, 88.9 mm x 88.9 mm board envelope

### Changed
- VTREF policy documentation made explicit: VTREF/logic-domain constraints are separate from target power export
- VTREF operating guidance set conservatively to `<= 3.6 V` unless explicit hardware OVP/disconnect is implemented
- Clarified that `5V_TARGET` is power-only and does not imply 5 V logic tolerance on interface pins
- Corrected SWDIO translator mapping to SN74AXC8T245

### Notes
- CAN TVS selection requirement documented as automotive-rated (part selection remains implementation-dependent)

---

## [rev-0.1] - Schematic Phase (In Progress)

### Added
- Project requirements definition
- Block diagram (see `docs/`)
- Initial component selection for protection, level translation, and power management functions
- Power architecture decision: separate VDD\_DBG and VDD\_TGT rails with independent control
- VTREF sensing and level translator enable logic defined
- Interface list confirmed: SWD, JTAG (10-pin and 20-pin), UART, SPI, I2C, CAN

### Changed
- N/A (initial revision)

### Fixed
- N/A (initial revision)

---

<!-- Versions are listed newest-first. Add new entries under [Unreleased]. -->
<!-- When a revision is released, move [Unreleased] content to a new versioned section. -->
