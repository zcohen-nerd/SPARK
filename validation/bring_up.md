<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# SPARK V0.4 — First-Article Bring-Up and Known Limits

This is the procedure for powering a freshly assembled SPARK V0.4 board for the
first time and confirming basic health **before** it is connected to a debugger
or a target. It is deliberately conservative.

The broader interface and fault campaign lives in
[`test_plan.md`](test_plan.md). This document is the gate that comes first.

> **Nothing in this document is a test result.** All expected observations are
> qualitative design expectations, not measurements. Record real numbers in
> `validation/results/` using [`results/TEMPLATE.md`](results/TEMPLATE.md).

---

## 0. Preconditions

**Do not start** unless all of these are true:

- Bench DC supply with an adjustable **current limit** and current readback.
- Multimeter; oscilloscope recommended for the rail-settling checks.
- The board is **not** connected to an STLINK-V3MODS or any target.
- You have read the "Critical power / VTREF warnings" in the [README](../README.md)
  and the [Known limits](#known-limits-v04) section below.
- Eye protection on; assume a first-article board can fail energetically.

Reference documents: [`../docs/architecture.md`](../docs/architecture.md) (power
tree, VTREF policy), [`../docs/interfaces.md`](../docs/interfaces.md),
[`../bom/bom_readable.md`](../bom/bom_readable.md).

---

## 1. Power-off checks (no supply connected)

| Step | Check | Expected |
|---|---|---|
| 1.1 | Visual inspection under magnification: solder bridges, tombstoned parts, missing parts vs. BOM, correct orientation of U1–U10, D1, polarized caps. | No defects; placements match `bom/bom_master.csv`. |
| 1.2 | DMM resistance, master 5 V rail to GND. | Not a short. A few hundred Ω to some kΩ settling upward (bulk capacitance charging through the meter) is normal; **near 0 Ω is a fault — stop.** |
| 1.3 | DMM resistance, internal 3.3 V to GND, and internal 1.8 V to GND. | Not a short. |
| 1.4 | DMM resistance, each of `1.8V_TARGET`, `3.3V_TARGET`, `5V_TARGET` to GND. | Not a short. These rails are downstream of load switches that are OFF, so a high reading is expected. |
| 1.5 | DMM resistance, VTREF net to GND, and VTREF net to each target rail. | Not a short to GND or to any rail. |
| 1.6 | Confirm every load-switch enable sits at its default-OFF level (pulldown present). | Enables read ~0 V referenced to their local ground once powered; verify the pulldown resistors are populated now. |

If any check fails, stop and resolve it before applying power.

---

## 2. Current-limited power-on

Bring the master 5 V path up alone, STLINK and target still disconnected.

| Step | Action | Expected observation |
|---|---|---|
| 2.1 | Set the bench supply to **5.0 V**, current limit **100 mA**, output OFF. Connect to the STLINK `5V_OUT` entry point (the eFuse input). | — |
| 2.2 | Enable the output. Watch the supply current. | Brief inrush, then settle to a small quiescent draw. If the supply sits in **constant-current** at 100 mA, the board is over-drawing — **turn off, investigate.** |
| 2.3 | If quiescent current is plausible, raise the limit in steps (e.g. 100 → 250 → 500 mA), pausing at each step. | Current stays well below the limit at each step. No part gets hot to the touch. No smell, no discoloration. |
| 2.4 | Measure the master 5 V rail (eFuse output). | Present and stable, close to the input minus the eFuse drop; no oscillation. |

Stop immediately on any [stop condition](#stop-conditions).

---

## 3. Rail and VTREF checks

Still no STLINK, no target. Measure to board GND.

| Step | Measurement | Expected |
|---|---|---|
| 3.1 | Internal 3.3 V LDO output. | Regulates near 3.3 V; on a scope, settles without sustained oscillation or ringing. |
| 3.2 | Internal 1.8 V LDO output. | Regulates near 1.8 V; settles cleanly. |
| 3.3 | `1.8V_TARGET`, `3.3V_TARGET`, `5V_TARGET` with **no enable asserted**. | All read approximately 0 V — target rails are OFF by default. |
| 3.4 | Assert one target-rail enable (per the schematic's control method) and re-measure that rail. | Only the selected rail turns on and reads near its nominal value; the other two stay near 0 V. |
| 3.5 | De-assert; confirm the rail returns to ~0 V. Repeat 3.4–3.5 for each rail individually. | Each rail switches independently and defaults OFF when released. |
| 3.6 | VTREF net, with the intended VTREF source method for your setup. | **≤ 3.6 V.** V0.4 has no VTREF OVP — if your target can present more than 3.6 V on VTREF, do not connect it. |
| 3.7 | Status LEDs (`PWR`, `VCC`, rail LEDs D2–D9). | Behave consistently with the rails that are actually on. Note any LED that does not match its rail. |

---

## 4. Interface smoke checks

Only after sections 1–3 pass on this board.

| Step | Action | Expected |
|---|---|---|
| 4.1 | Connect the STLINK-V3MODS. Confirm the host enumerates it. | STLINK enumerates as normal; SPARK does not prevent enumeration. |
| 4.2 | With a **known-good target** whose VTREF is ≤ 3.6 V, connect SWD only. Attempt a connect at a **low SWD clock** (e.g. lowest available). | Debugger connects; ID/IDCODE read succeeds. |
| 4.3 | UART: loop TX→RX (through SPARK's UART path) at a low baud and send a known pattern. | Pattern returns intact; no framing errors. |
| 4.4 | I²C: with a known peripheral and the target-side pull-ups active (SPARK-side DNI), run a bus scan. | Expected device address(es) ACK; SDA/SCL rise times look sane on a scope. |
| 4.5 | Raise SWD clock / UART baud toward working values, one step at a time. | Continues to work; stop at the first sign of protocol errors and record where. |

Deeper signal-integrity, clock-stretching, CAN hot-plug, eFuse-trip, backfeed,
and fault-injection testing is in [`test_plan.md`](test_plan.md) and should only
be attempted after this bring-up passes.

---

## Stop conditions

Turn the supply off immediately, disconnect, and record what happened if **any**
of these occur:

- Bench supply enters constant-current / hits its limit unexpectedly.
- Any rail is outside a sane band (e.g. internal 3.3 V reading 2.0 V or 4.5 V), or
  will not stop oscillating.
- A target rail is live when no enable is asserted.
- VTREF exceeds 3.6 V at any point.
- Any component is hot to the touch, smells, discolors, or vents.
- The eFuse latches off and will not recover per its configured behavior.
- Any measurement contradicts the schematic in a way you cannot explain.

Do not "try it once more." Investigate first.

---

## Known limits (V0.4)

These are design-level limits and open items, not test findings:

- **No VTREF overvoltage protection or disconnect.** VTREF above 3.6 V is
  uncontained in hardware. OVP is a named V1 goal (`CHANGELOG.md`).
- **`5V_TARGET` is power only** — not 5 V logic tolerance on any interface pin.
- **CAN TVS not finalized.** The design requires an automotive-rated TVS on the
  CAN lines; the specific part is not selected in the BOM.
- **BOM data gaps.** Many rows lack `Manufacturer` / `Manufacturer Part Number`,
  and some `Value` fields are duplicated export strings. See
  [`../bom/sourcing_notes.md`](../bom/sourcing_notes.md). Sourcing must resolve
  these; do not infer.
- **Manufacturing outputs are ODB++ only.** No RS-274X Gerber or Excellon drill
  export is present (`hardware/README.md`).
- **Pinouts are not published** in the docs — they live in the schematic
  (`docs/interfaces.md` marks them TBD).
- **`FAULT` / `PG` telemetry from the eFuse is "if routed"** — not confirmed as
  connected in the current implementation.
- **ERC / DRC results are not published.** Design-rule cleanliness is unverified
  in this repository.
- **No board has been electrically verified.** Every expected observation above
  is a prediction from the schematic, not a measurement.

---

## Recording results

1. Create `validation/results/v0.4/` (it does not exist until there are results).
2. Copy [`results/TEMPLATE.md`](results/TEMPLATE.md) to a dated file per session,
   e.g. `results/v0.4/2026-03-01-board01-bringup.md`.
3. One row per numbered step above. Record the **measured value or capture
   filename**, not just "pass". Store scope screenshots and logic captures
   alongside, referenced by filename.
4. If a step fails, record the observation, the hypothesis, and the fix. A
   documented failure is a valid and useful result.
5. Update `CHANGELOG.md` under `[Unreleased]` with a one-line summary and a link
   to the results file.
6. Do not edit this procedure to match what a board did — if the procedure was
   wrong, fix it in a separate, described change.
