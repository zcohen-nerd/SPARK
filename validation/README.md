<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# Validation

This directory holds the SPARK V0.4 validation documents and their results. It
contains **no completed measurements** — see the status table in the
[README](../README.md).

## Documents

- **[`bring_up.md`](bring_up.md)** — first-article bring-up procedure and the
  V0.4 known-limits list. Do this before anything in the test plan: power-off
  checks, current-limited power-on, rail and VTREF checks, interface smoke
  checks, stop conditions, and how to record results.
- **[`test_plan.md`](test_plan.md)** — the fuller V0.4 bench campaign: power
  sequencing, backfeed / zombie-board behavior, eFuse trip and recovery, signal
  integrity (SWD/UART/SPI/I²C), I²C clock stretching, CAN hot-plug and
  termination, and miswire / fault injection with a current-limited supply.

## Results

- **[`results/TEMPLATE.md`](results/TEMPLATE.md)** — session record template.
- Real results go in `results/v0.4/` (created when the first session happens),
  one file per session, with captures alongside.
- Nothing in `results/` other than the template is a real measurement today.

## Finishing this

- **[`EVIDENCE-CHECKLIST.md`](EVIDENCE-CHECKLIST.md)** — operator to-do list: the
  minimum fabrication / assembly / measurement artifacts needed to flip each
  README status stage to **Yes**, exactly where each file belongs, and the rule
  that no public claim (repository, Portfolio, or hub) moves ahead of committed
  evidence.
