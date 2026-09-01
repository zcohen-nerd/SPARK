<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# SPARK V0.4 — evidence capture checklist (operator)

**Purpose.** SPARK is published as **Prototype**, and the repository currently
publishes **no fabrication, assembly, or measurement records**. This one page
lists the minimum artifacts needed to change that, and exactly where each
belongs. Nothing here is a result; it is a to-do list for a human at the bench.

Do not mark any repository stage **Yes**, and do not raise the public maturity
wording on the Portfolio case study or the hub, until the matching row below is
real and committed. `TBD` is always an acceptable entry — an invented number is
not.

---

## 1. Fabrication received  → unlocks README "Fabricated: Yes"

| Artifact | Put it here | Notes |
|---|---|---|
| Fab order / receipt (vendor, order #, date, qty, stackup, spec) | `validation/results/v0.4/00-fabrication.md` | Redact pricing if desired. Vendor name + date + qty is the minimum. |
| Bare-board photo, top and bottom, in focus, ruler or coin for scale | `images/board/v0.4-bare-top.jpg`, `-bare-bottom.jpg` | ≤ 2000 px long edge, EXIF GPS/serial stripped. Add a row to `README.md` "Design artifacts" and a provenance line to a new `images/README.md`. |
| Incoming inspection notes (dimensions, finish, obvious defects) | `validation/results/v0.4/00-fabrication.md` | Optional but recommended. |

## 2. Assembly  → unlocks README "Assembled: Yes"

| Artifact | Put it here | Notes |
|---|---|---|
| Populated-board photo(s), top (and bottom if placed), in focus | `images/board/v0.4-assembled-top.jpg` | Same optimization/metadata rules as §1. |
| Assembly notes: method (hand / reflow / stencil), date, who, which BOM revision | `validation/results/v0.4/01-assembly.md` | Reference `bom/bom_master.csv`; note any DNI / substitutions (substitutions also go in `CHANGELOG.md`). |
| Rework log: what was reworked, why, how, result | `validation/results/v0.4/01-assembly.md` (Rework section) | One row per rework event. |

## 3. First power-on  → unlocks README "Electrically verified: Yes"

Run [`bring_up.md`](bring_up.md). Record with a copy of
[`results/TEMPLATE.md`](results/TEMPLATE.md).

| Artifact | Put it here |
|---|---|
| Session record: board serial/id, bench supply model + mode, instruments, ambient | `validation/results/v0.4/<YYYY-MM-DD>-<board-id>-bringup.md` |
| Power-off resistance checks (steps 1.1–1.6) with measured values + units | same file, Results table |
| Current-limited power-on: quiescent current, master 5 V (eFuse out), internal 1.8 V / 3.3 V — values with tolerances | same file |
| Each target rail switched ON deliberately: measured voltage, load-switch behavior | same file |
| VTREF path check (≤ 3.6 V), no short to GND or any rail | same file |
| Scope / logic-analyzer captures where useful | `validation/results/v0.4/captures/` — reference by filename in the session record |
| Anomalies + stop-conditions hit + rework | same file, Failures/rework + Outcome sections |

## 4. Bench campaign  → unlocks README "Bench-validated: Yes"

Execute [`test_plan.md`](test_plan.md). For **every** plan item, record an
explicit **Pass / Fail / Blocked** with the measurement that supports it. An
unexecuted item stays **pending** — it is never a result.

| Artifact | Put it here |
|---|---|
| Results index: one row per `test_plan.md` item → status → session file | `validation/results/v0.4/README.md` |
| Per-topic session records (power sequencing, backfeed / zombie-board, eFuse trip + recovery, SI on SWD/UART/SPI/I²C, I²C clock stretching, CAN hot-plug + termination, miswire / fault injection) | `validation/results/v0.4/<date>-<board-id>-<topic>.md` |
| Equipment / setup description (shared across sessions) | `validation/results/v0.4/00-equipment.md` |
| Remaining risks after the campaign | `validation/results/v0.4/README.md` (Risks section) |

---

## 5. When the above exists — update the public claims

Only after the matching evidence is committed:

1. `README.md` "Status" table — flip the specific stage(s) to **Yes** and cite
   the file.
2. `CHANGELOG.md` — add a dated entry under the current revision.
3. Portfolio case study `portfolio/src/pages/projects/stlink-v3mods.mdx` — update
   "At a glance", "Implementation & Manufacturing", and "Testing & Verification"
   from the repository, using the canonical vocabulary (Concept / Prototype /
   Public Beta / Deployed). **Bench measurements do not by themselves move SPARK
   past Prototype** — that needs the design to have been through a full bench
   campaign with results, and ideally a second board.
4. Hub `zcohen-nerd-landing-page/src/pages/index.js` `SELECTED_WORK` SPARK
   entry — bring `role` and `evidence` in line with the repository. Keep `status`
   at `'Prototype'` until §5.3's bar is met.
5. Optionally publish a tagged release once a defensible snapshot exists (see
   `CONTRIBUTING.md` "Releases").

---

## What must NOT happen

- No stage marked **Yes** without a committed artifact behind it.
- No planned acceptance criterion from `test_plan.md` restated as a result.
- No "boards in hand", "assembly underway", or "bring-up started" wording on the
  Portfolio or hub until §1/§2 artifacts exist in this repository.
- No Gerber/Excellon claim anywhere — V0.4 exports **ODB++ only** (see
  `hardware/README.md`).
