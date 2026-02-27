# SPARK V0.4 Architecture

## Scope

This document defines the SPARK V0.4 electrical architecture for power, level translation, and fault containment. It is written as an implementation reference for schematic, layout, and bench validation.

## Power Tree

### 5 V Entry Path

1. STLINK-V3MODS `5V_OUT` enters SPARK.
2. Entry rail is protected by a TPS2596 eFuse.
3. Protected output becomes SPARK master 5 V rail.

If implemented in the schematic, TPS2596 `FAULT` and `PG` outputs provide status/fault telemetry for system monitoring and validation.

### Internal Logic Rails

Internal logic rails are generated from dedicated low-noise LDOs:

- Internal 1.8 V logic rail
- Internal 3.3 V logic rail

These rails serve on-board logic/translation domains and are separate from exported target power rails.

### Target Power Rails

SPARK exports three gated target rails:

- `1.8V_TARGET`
- `3.3V_TARGET`
- `5V_TARGET`

Each rail is switched by TPS22919 load switches. Hardware pulldowns on each EN input enforce a default-OFF state at power-up and reset.

## VTREF Policy

VTREF is the target I/O reference used for translator domain alignment and debugger reference behavior.

- VTREF policy is independent from target power export.
- `5V_TARGET` availability does not imply 5 V-tolerant interface logic.
- Unless explicit VTREF overvoltage protection/disconnect is present in hardware, VTREF must be constrained to `<= 3.6 V`.

Operational rule:

- VTREF above 3.6 V is an out-of-policy condition for interface operation.

## Translation Architecture

V0.4 uses a hybrid translator topology to match signal type and bandwidth.

### LSF0108 Domain (Open-Drain / Complex)

- Used for open-drain signaling (I2C minimum).
- Pull-ups are present on both sides.
- SPARK-side I2C pull-ups are DNI by default to reduce pull-up conflicts with target-side networks.

### SN74AXC8T245 Domain (Push-Pull / High-Bandwidth)

- Used for push-pull or higher edge-rate channels (SPI, UART, GPIO, SWO as applicable).
- **SWDIO is routed through SN74AXC8T245, not LSF0108.**

## Signal Protection Envelope

External-facing signal paths include:

- 22 Ω series resistor per line
- SP0503BAHTG ESD arrays at board boundary
- ESD clamps referenced to GND (not to logic/power rails)

This arrangement is intended to reduce transient energy coupling into translator and debugger-side domains.

## CAN Subsystem

- Transceiver: TCAN1051 (CAN FD capable)
- Termination: switchable 120 Ω
- External CAN surge suppression should use automotive-rated TVS appropriate to environment and wiring length

## PCB + Mechanical Implementation Constraints

- 4-layer controlled-impedance stackup (JLC04161H-7628)
- Heavy ground flooding and via stitching
- 12 mil typical trace width unless signal constraints require deviation
- ENIG surface finish
- Ink-plugged vias
- Board outline: 88.9 mm x 88.9 mm with reinforced mounting holes

## Design Philosophy (Engineering)

1. **Fail-safe defaults:** externally controlled power rails default OFF.
2. **Fault containment at boundaries:** eFuse + ESD + per-line impedance before sensitive logic.
3. **Signal-specific translation:** open-drain and push-pull signals handled by different translator classes.
4. **Backfeed resistance:** power/translation behavior should prevent unintended parasitic powering during abnormal sequencing.
5. **Validation-driven development:** architecture choices are paired with explicit bench tests for sequencing, fault recovery, and signal integrity.