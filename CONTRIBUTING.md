<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# Contributing to SPARK

SPARK is a single-maintainer open-hardware project. The schematic and PCB are
designed in **Autodesk Fusion (Electronics)** and committed as native Fusion
files (`.fsch`, `.fbrd`, `.f3z`). There is no round-trippable text netlist, so
outside contributors generally cannot edit the schematic or layout directly —
but there is still plenty that is useful to contribute.

Contributions are accepted under the project licence, **CERN-OHL-S-2.0**
(inbound = outbound). By opening a pull request you agree your contribution is
licensed under those terms.

## What is genuinely useful

- **Errata and design-review findings** — open a GitHub Issue. Wrong value,
  missing protection, a translator on the wrong bus class, a footprint concern, a
  VTREF-policy hole: describe it with a reference to the schematic net or BOM
  line.
- **Documentation PRs** — `README.md`, `docs/`, `validation/`, `bom/*.md`,
  `hardware/README.md`. Corrections, clarifications, added detail with sources.
- **Validation results** — if you build a board and run
  [`validation/bring_up.md`](validation/bring_up.md) or
  [`validation/test_plan.md`](validation/test_plan.md), a PR adding a filled-in
  `validation/results/…` file (from the template) is one of the most valuable
  contributions possible. Record real numbers and captures; a documented failure
  counts.
- **BOM data** — resolving the missing `Manufacturer` / `Manufacturer Part
  Number` fields flagged in [`bom/sourcing_notes.md`](bom/sourcing_notes.md),
  with a distributor link per part.
- **Manufacturing** — a regenerated Gerber/Excellon export, fab-house DFM
  feedback, or panelization notes.

Schematic/layout changes themselves are applied by the maintainer in Fusion,
usually after an Issue discussion.

## Ground rules

- **Protection-first.** Changes that remove or weaken protection (eFuse, series
  resistors, ESD arrays, default-OFF rail gating, VTREF constraints) or that add
  a back-drive path will not be merged without a strong, specific justification.
- **No invented specifications.** If a value is unknown, write `TBD` with
  context. Do not publish a number that has not been measured or taken from a
  datasheet.
- **Match reality.** Don't describe the project as more mature than the
  [status table](README.md#status) supports.

## Workflow

- `main` is the only long-lived branch. Work on a short-lived
  `feature/<topic>` or `fix/<topic>` branch and open a PR against `main`.
- Update [`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]` with a one-line
  summary of what changed.
- Keep binary churn down: don't re-commit large Fusion archives or fabrication
  packages unless the design actually changed.
- The repository-integrity CI (`.github/workflows/integrity.yml`) runs Markdown
  lint, a link check, an expected-artifact check, a BOM-syntax check, and a
  docs-consistency check. It does **not** run ERC/DRC or any EDA tool — those are
  the maintainer's responsibility in Fusion.

## Component selection policy

When proposing a part (in an Issue or a BOM PR):

- Prefer standard packages (SOT-23, SOT-363, 0402, 0603, SOIC-8).
- Prefer parts rated to at least 10 V on any pin that may see a target or supply
  transient; derate voltage-rated parts to ~80 % under normal operation.
- Prefer AEC-Q100 / AEC-Q101 parts for protection and power-management functions
  where the cost is reasonable.
- Verify availability at a major distributor (Digi-Key, Mouser, LCSC). Flag
  single-source, NRND, or long-lead parts in the BOM `Notes` column.
- For the CAN lines, the TVS must be automotive-rated (see
  `docs/architecture.md`).

## Support expectations

One maintainer, best-effort, no service-level guarantee. Issues without technical
content may be closed. Discussion stays technical and respectful.

## Releases (recommendation)

No GitHub release exists yet, on purpose. A tagged release implies a snapshot
someone can build and trust. Recommend cutting the **first** release
(`v0.4.0` / `rev-0.4`) only once **all** of these hold:

1. BOM `Manufacturer` / `MPN` gaps in `bom/sourcing_notes.md` are either filled
   or explicitly accepted in writing, and the duplicated `Value` strings
   (e.g. `TCAN1051HGVDRTCAN1051HGVDR`) are cleaned.
2. The manufacturing package is either extended with Gerber/Excellon **or**
   `hardware/README.md` states ODB++-only is the intended deliverable and a fab
   house has confirmed it accepts it.
3. At least the power-on and rail/VTREF portion of `validation/bring_up.md` has
   been executed on a real board and the results file is committed.
4. `CHANGELOG.md` has a dated, versioned section (not `[Unreleased]`).

Until then, tag nothing; the design is still moving.
