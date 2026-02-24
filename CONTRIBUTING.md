# Contributing to SPARK

Thank you for your interest in contributing to the SPARK project. This document describes the contribution process for a hardware-first project (schematic + PCB design).

---

## Table of Contents

- [What You Can Contribute](#what-you-can-contribute)
- [Prerequisites](#prerequisites)
- [Design Tools](#design-tools)
- [Branching and Workflow](#branching-and-workflow)
- [Schematic Contribution Guidelines](#schematic-contribution-guidelines)
- [PCB Layout Contribution Guidelines](#pcb-layout-contribution-guidelines)
- [Documentation Contributions](#documentation-contributions)
- [Bill of Materials](#bill-of-materials)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Review Criteria](#review-criteria)
- [Component Selection Policy](#component-selection-policy)
- [Code of Conduct](#code-of-conduct)

---

## What You Can Contribute

- Schematic corrections, improvements, or additions
- PCB layout improvements (routing, via placement, copper pours, silkscreen)
- Component substitutions with equivalent or improved specifications
- Documentation improvements (design notes, interface specifications, errata)
- Validation procedures and test reports
- Manufacturing notes or fab house compatibility improvements
- Bill of Materials accuracy corrections
- Identified errata with proposed corrections

---

## Prerequisites

Before contributing, review the following:

- The existing schematic (once committed to `hardware/schematic/`)
- The [README.md](README.md) for design philosophy and voltage-domain handling requirements
- The [validation/README.md](validation/README.md) for protection and testing requirements
- The CHANGELOG for the current revision status

All contributions must be consistent with the protection-first design philosophy described in the README. Changes that reduce protection margins, remove clamping, increase leakage risk, or introduce back-drive paths will not be accepted without strong justification.

---

## Design Tools

The primary EDA tool for this project is **KiCad 8.x** (or later stable release). PCB layout files and schematics must be committed in native KiCad format (`.kicad_sch`, `.kicad_pcb`).

3D models (for mechanical integration checks) should be committed as `.step` files.

Do not convert files to other EDA formats (Eagle, Altium, OrCAD) as part of a contribution. Tool-specific export formats belong in `hardware/outputs/` and are only committed when associated with a release.

---

## Branching and Workflow

- `main` — stable, reviewed, and released revisions only
- `dev` — active development; open pull requests target this branch
- `feature/<description>` — specific schematic, layout, or documentation feature
- `fix/<description>` — corrections to identified errata or errors

Do not commit directly to `main`. All changes go through pull requests and review.

---

## Schematic Contribution Guidelines

1. Use the project KiCad symbol library where applicable. Do not replace project-standard symbols with generic equivalents without discussion.
2. Every net that crosses a sheet boundary or connects to a connector must have a net label. Unnamed nets on connectors are not acceptable.
3. Power symbols must use the project-standard power flag conventions. Do not add floating PWR_FLAG symbols without understanding the net they reference.
4. All new components must have:
   - A reference designator following the project naming convention
   - A value that reflects the actual part (e.g., `100nF` not `C`)
   - A footprint assigned
   - A `MPN` (Manufacturer Part Number) field
   - A `Manufacturer` field
   - A `LCSC` or distributor part number field where applicable
5. Do not delete or bypass protection components (TVS diodes, series resistors, polyfuses) without opening a discussion first.
6. ERC (Electrical Rules Check) must pass with zero errors before submitting. Accepted ERC suppressions must be documented in the schematic or in the pull request.

---

## PCB Layout Contribution Guidelines

1. Follow the design rules defined in the KiCad project DRC file. DRC must pass with zero errors before submitting.
2. Maintain a minimum 0.2 mm clearance between copper features on the same net, and 0.25 mm between different nets, unless the design rules specify otherwise.
3. Protection components (TVS arrays, series resistors at connector entry) must remain physically close to their associated connectors.
4. Decoupling capacitors must be placed as close as practical to the power pins they serve.
5. Do not move or resize silkscreen reference designators in a way that makes them ambiguous or unreadable after fabrication.
6. 3D clearance checks must pass for all placed components.
7. Copper pours must be refreshed before committing (fill all zones).

---

## Documentation Contributions

- Documentation lives in `docs/` and the project root markdown files.
- Use clear, direct technical language. Avoid marketing terms.
- Include specific values, voltage limits, or component references where applicable.
- Do not document specifications that have not been verified or are not yet determined. Use "TBD" with context rather than invented numbers.

---

## Bill of Materials

The BOM lives in `bom/`. When adding or changing components:

- Update the BOM to reflect any new or changed parts.
- Verify availability at at least one major distributor (Digi-Key, Mouser, LCSC).
- Flag any parts with supply chain concerns (single-source, long lead time, NRND) in the BOM notes column.
- Do not introduce parts that are only available through gray-market or unverified sources.

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `dev`.
2. Make your changes, following the applicable guidelines above.
3. Verify ERC/DRC pass (for schematic/PCB changes).
4. Update the BOM if components changed.
5. Update `CHANGELOG.md` under the `[Unreleased]` section with a summary of your changes.
6. Open a pull request against the `dev` branch.
7. Describe what changed and why. Reference any related issues.
8. Be available for review comments. Review may include requests for simulation results, component datasheet references, or design justification.

---

## Review Criteria

Pull requests are evaluated against:

- Correctness of the schematic or layout change
- Consistency with the protection-first design philosophy
- Impact on VTREF handling and level translation operation
- Component availability and procurement risk
- Manufacturability (DFM considerations)
- Documentation completeness

---

## Component Selection Policy

When selecting components:

- Prefer parts in standard packages (SOT-23, SOT-363, 0402, 0603, SOIC-8).
- Prefer parts rated to at least 10 V on any pin that may see target or supply transients.
- Prefer AEC-Q100 or AEC-Q101 rated parts for any protection or power management function where available at reasonable cost.
- Avoid parts with absolute maximum ratings that are only marginally above operating conditions.
- Derating: voltage-rated components should be derated to 80% of rated voltage under normal operating conditions.

---

## Code of Conduct

This project follows a standard professional code of conduct. Contributions and discussions must remain technical and respectful. Issues used for off-topic discussion or without technical content will be closed.
