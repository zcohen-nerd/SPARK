<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# SPARK Validation Session — TEMPLATE

Copy this file to `validation/results/v<rev>/<YYYY-MM-DD>-<board-id>-<topic>.md`
and fill it in. Do not commit invented values. "TBD" is a valid entry.

## Session metadata

| Field | Value |
|---|---|
| Date | TBD |
| Board revision | rev-0.4 |
| Board identifier / serial | TBD |
| Operator | TBD |
| Procedure | `validation/bring_up.md` §… / `validation/test_plan.md` §… |
| Bench supply (model, mode) | TBD |
| Instruments (scope, logic analyzer, DMM) | TBD |
| Ambient temperature | TBD |
| Firmware / host tools | STLINK host tools: TBD |

## Setpoints

| Rail / parameter | Setpoint | Notes |
|---|---|---|
| Master 5 V input | TBD | |
| Supply current limit (start) | TBD | |
| VTREF source | TBD | Must be ≤ 3.6 V |

## Results

| Step ID | Measured value / capture file | Pass / Fail / N-A | Notes |
|---|---|---|---|
| 1.1 | TBD | TBD | |
| 1.2 | TBD | TBD | |
| … | TBD | TBD | Add one row per step actually performed |

## Captures

| Filename | What it shows | Step ID |
|---|---|---|
| TBD | TBD | TBD |

## Failures / rework

| Observation | Hypothesis | Action taken | Follow-up |
|---|---|---|---|
| TBD | TBD | TBD | TBD |

## Outcome

- Summary: TBD
- Stop conditions hit: none / list
- Next session: TBD
