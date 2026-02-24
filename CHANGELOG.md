# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version numbering follows hardware revision conventions: `rev-X.Y` where X is the
major revision (significant redesign) and Y is the minor revision (incremental change
within the same design generation).

---

## [Unreleased]

### Added
- Initial repository structure and project documentation
- README with project overview, design philosophy, protection strategy, and voltage-domain handling
- CONTRIBUTING.md with hardware-specific contribution guidelines
- Validation plan in `validation/README.md` covering power sequencing, fault injection, ESD, backfeed, and interface validation
- `.gitignore` configured for KiCad, Fusion 360, generated manufacturing files, and OS metadata
- Directory structure: `hardware/schematic`, `hardware/pcb`, `hardware/fabrication`, `hardware/3d`, `hardware/outputs`, `docs`, `images`, `validation`, `bom`, `manufacturing`, `compliance`, `archive`

### Changed
- N/A

### Fixed
- N/A

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
