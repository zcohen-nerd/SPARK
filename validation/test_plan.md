# SPARK V0.4 Bench Validation Test Plan

## Scope

This plan defines bench validation for SPARK V0.4 architecture using PicoScope, function generator, and Saleae logic analyzer. It targets power behavior, fault handling, translation behavior, and interface signal integrity.

## Equipment

- STLINK-V3MODS with SPARK V0.4 board under test
- Current-limited bench DC supply
- PicoScope (minimum 4 channels)
- Function generator
- Saleae logic analyzer
- Programmable or switchable target load/target board
- CAN peer node and cable harness for CAN tests

## General Test Rules

- Start each fault test with conservative current limits.
- Record ambient temperature and rail setpoints.
- Capture scope screenshots and Saleae traces for each pass/fail decision.
- After each fault case, perform a brief functional re-check before proceeding.

## 1) Power Sequencing Tests

### Objective

Verify default-safe startup, translator readiness behavior, and clean transitions during power ordering changes.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| PWR-01 | Apply debugger-side 5 V path, keep target rails disabled. Observe master 5 V and internal logic rails. | Master 5 V comes up through eFuse path; internal 1.8 V/3.3 V rails regulate without oscillation. |
| PWR-02 | Enable each target rail (1.8/3.3/5) one at a time from default OFF state. | Only selected rail turns on; non-selected rails remain OFF. |
| PWR-03 | Power-cycle board and monitor TPS22919 EN behavior. | Target rails remain OFF by default until explicitly enabled. |
| PWR-04 | Remove and restore upstream 5 V while target rail enables are inactive. | No unintended target rail assertion during brown-in/brown-out. |

### Instrumentation

- PicoScope: master 5 V, internal 3.3 V, internal 1.8 V, selected target rail
- Saleae: optional enable/control lines if routed to test points

## 2) Backfeed / Zombie Board Tests

### Objective

Detect unintended parasitic powering when target-side rails or IO are active while SPARK is unpowered.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| BF-01 | Keep SPARK unpowered. Externally power target and provide VTREF within policy. Measure SPARK internal rails. | Internal 1.8 V and 3.3 V remain below functional turn-on (no zombie powering). |
| BF-02 | Repeat BF-01 with target powered from 5V_TARGET path removed/unavailable and interface lines connected. | No sustained internal rail rise indicating backfeed through IO paths. |
| BF-03 | Toggle target power repeatedly with SPARK unpowered; monitor current into SPARK connectors. | No latch-up or progressive rail biasing. |

### Instrumentation

- PicoScope on internal rails
- Bench supply current readback and DMM spot checks

## 3) eFuse Trip / Recovery Tests

### Objective

Verify TPS2596 protection response and recovery behavior on overload/short events.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| EF-01 | Increase load on protected 5 V path until eFuse protection engages. | Current limiting/trip behavior occurs without board damage. |
| EF-02 | Apply hard short-to-GND on protected downstream 5 V using current-limited source. | eFuse limits or disconnects as intended; upstream source remains controlled. |
| EF-03 | Remove fault and observe recovery (auto-retry or re-enable sequence per implementation). | Rail returns to normal operation without manual repair. |
| EF-04 | If FAULT/PG are implemented, capture status transitions during EF-01..03. | FAULT/PG transitions match protection state changes. |

### Instrumentation

- PicoScope on upstream 5 V, protected 5 V, and FAULT/PG (if present)
- Bench supply current logging

## 4) Signal Integrity Captures (SWD, UART, SPI, I2C)

### Objective

Validate translated signal quality and protocol-level stability under representative clock/baud conditions.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| SI-SWD-01 | Capture SWDCLK + SWDIO during repeated memory/program operations. | Stable decode / no persistent protocol errors; clean edges without abnormal ringing. |
| SI-UART-01 | Run UART traffic at low and high baud profiles used in project workflows. | No framing/parity errors in capture; voltage levels consistent with active VTREF domain. |
| SI-SPI-01 | Run SPI transfers at representative low/high clock rates. | No bit-slip/clocking errors; transitions remain monotonic at probe point. |
| SI-I2C-01 | Capture I2C start/stop, ACK/NACK, repeated-start activity at standard and fast mode. | Correct open-drain behavior with valid rise times and no stuck bus state. |

### Instrumentation

- PicoScope for analog edge quality
- Saleae for protocol decode and error counting

## 5) I2C Clock Stretching Test

### Objective

Confirm LSF0108-based path correctly handles target clock stretching.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| I2C-CS-01 | Use a target/peripheral that intentionally stretches SCL. Capture SDA/SCL on both sides of translator if accessible. | Master and target complete transactions without timeout due to translation path. |
| I2C-CS-02 | Repeat with SPARK-side pull-ups DNI configuration maintained and target pull-ups active. | No bus lock condition; rise/fall behavior remains protocol compliant for configured speed. |

## 6) CAN Hot-Plug + Termination Tests

### Objective

Validate TCAN1051 interface behavior during live connect/disconnect and termination changes.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| CAN-01 | Establish CAN communication with 120 Ω termination enabled. | Stable frame exchange with no sustained error escalation. |
| CAN-02 | Repeat with termination switch disabled in a bus setup that already has proper external termination. | Link remains functional when total bus termination is correct. |
| CAN-03 | Perform controlled hot-plug events while monitoring bus errors and recovery. | Bus recovers automatically; no persistent bus-off attributable to SPARK path. |

### Note

CAN surge protection implementation should use automotive-rated TVS selection in design/BOM review.

## 7) Miswire / Fault Injection Tests

### Objective

Check robustness of protected signal paths and target-power gating under common bench wiring errors.

### Tests

| ID | Procedure | Pass Criteria |
|---|---|---|
| FI-01 | Short external-facing signal line to GND (one line at a time) with current-limited source and active interface session. | No permanent damage; interface recovers after fault removal. |
| FI-02 | Short external-facing signal line to VTREF (one line at a time) under current limit. | No permanent damage; translator/protection path remains functional post-test. |
| FI-03 | Apply short on enabled target rail to GND through current-limited setup. | Protection limits fault energy; board recovers after clear. |
| FI-04 | Repeat key faults while monitoring rail transients and adjacent channels. | No cascading rail collapse outside expected protective response. |

### Instrumentation

- Bench supply in current-limit mode
- PicoScope on affected rail/signal and nearby reference rails
- Saleae to confirm post-fault protocol recovery

## Test Artifacts

For each test, store:

- Setup photo or wiring diagram
- Instrument settings
- Scope screenshots / Saleae traces
- Pass/fail outcome and notes

Recommended output location: `validation/results/v0.4/`.