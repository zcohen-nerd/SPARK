# SPARK — Electrical Validation Plan

This document defines the validation testing categories for the SPARK hardened interface board.
Validation is conducted against each major protection and functional requirement defined in the
design specification. Each test category includes objectives, conditions, pass/fail criteria,
and notes on measurement setup.

All tests are conducted at nominal operating conditions unless otherwise stated. Worst-case
derating and corner conditions are tested where specified.

---

## Table of Contents

- [1. Power Sequencing Tests](#1-power-sequencing-tests)
- [2. Fault Injection Tests](#2-fault-injection-tests)
- [3. ESD Testing Plan](#3-esd-testing-plan)
- [4. Backfeed Testing](#4-backfeed-testing)
- [5. Interface Validation](#5-interface-validation)
  - [5.1 SWD](#51-swd)
  - [5.2 JTAG](#52-jtag)
  - [5.3 UART](#53-uart)
  - [5.4 SPI](#54-spi)
  - [5.5 I2C](#55-i2c)
  - [5.6 CAN](#56-can)

---

## 1. Power Sequencing Tests

### Objective
Verify that the board powers up and powers down in a defined order, that level translators are
not enabled until both VDD\_DBG and VTREF are within valid operating ranges, and that no bus
contention or back-drive conditions occur during transitions.

### Test Conditions

| Test | Description |
|---|---|
| PS-01 | Normal power-up: USB applied to STLINK-V3MODS, target powered separately. Verify VDD\_DBG rises before VTREF-dependent logic enables. |
| PS-02 | Target powered before debugger: VTREF present before VDD\_DBG. Verify level translators remain disabled and no current flows into STLINK-V3MODS pins. |
| PS-03 | Target power removed during active debug session. Verify VTREF falls, translator OE deasserts, and STLINK-V3MODS interface pins go to high-impedance state. |
| PS-04 | Debugger power removed while target remains powered. Verify no current path from target VTREF back into STLINK-V3MODS through protection or translation circuitry. |
| PS-05 | Power-on with VTREF below threshold (e.g., 1.2 V, below 1.65 V minimum). Verify interface is held off. Apply VTREF rising above threshold; verify interface enables cleanly. |
| PS-06 | Repeated power cycling (>100 cycles). Verify no latch-up or degraded behavior in level translators or protection components. |

### Measurements
- VDD\_DBG and VTREF waveforms captured simultaneously on oscilloscope during transition
- Quiescent current on VDD\_DBG and VTREF rails during each state
- Logic analyzer capture on SWDIO/SWDCLK/TMS/TCK during transitions to verify three-state behavior

### Pass Criteria
- No measured backfeed current exceeding 50 µA on any rail during adverse sequencing
- Level translators do not drive outputs when VTREF is absent or below threshold
- No latch-up observed after 100 power cycles

---

## 2. Fault Injection Tests

### Objective
Verify that fault conditions (short circuits, overcurrent, overvoltage application, reversed
connections) result in a defined safe state without damage to the SPARK board or the
STLINK-V3MODS.

### Test Conditions

| Test | Description |
|---|---|
| FI-01 | Short circuit on target power output (VDD\_TGT to GND). Verify eFuse/polyfuse trips, VDD\_TGT shuts down or limits current, and VDD\_DBG is unaffected. |
| FI-02 | Sustained overcurrent on target power (150% of rated limit) for 10 seconds. Verify protective device trips and board survives. |
| FI-03 | Apply 12 V to a signal pin on the SWD header. Verify TVS clamps, series resistor limits current, and no damage to level translator or STLINK-V3MODS. |
| FI-04 | Apply 12 V to VTREF sensing input. Verify sensing circuit clamps voltage, no damage to comparator or translator. |
| FI-05 | Reverse polarity on target power input (VDD\_TGT connector). Verify reverse-polarity protection blocks current; no damage to downstream components. |
| FI-06 | Simultaneous short on two adjacent SWD pins (e.g., SWDIO and SWDCLK shorted). Verify series resistors limit current; no bus damage. |
| FI-07 | Apply target power while VDD\_DBG is absent. Verify no unexpected current path; LEDs, translators, and comparators remain off or in defined state. |

### Measurements
- Current through VDD\_TGT rail during fault conditions (current probe)
- Voltage at STLINK-V3MODS interface pins during FI-03 and FI-06
- Thermal imaging or thermocouple on protection components during FI-01 and FI-02
- Post-test functional check: reconnect normally, verify full operation

### Pass Criteria
- No visible damage (burn, discoloration, cracked components) after any fault injection test
- Protective devices (TVS, resistors, eFuse) absorb fault energy within ratings
- Full functional operation restored after fault is removed and protective device resets (or replaced if one-shot)

---

## 3. ESD Testing Plan

### Objective
Verify that the board meets a minimum ESD immunity level on all external-facing connectors and
test points. This is a lab-use device; formal IEC 61000-4-2 compliance certification is not
required, but the board should demonstrate tolerance to realistic ESD events from operators
and targets.

### Test Method
ESD testing is performed using an ESD simulator (gun) per IEC 61000-4-2 methodology:
- **Contact discharge**: applied directly to metal connector shells and exposed test points
- **Air discharge**: applied to signal pin entry points on headers

### Test Levels

| Level | Voltage (Contact) | Voltage (Air) |
|---|---|---|
| Target minimum | ±2 kV | ±4 kV |
| Stretch goal | ±4 kV | ±8 kV |

### Test Points

| Test | Location |
|---|---|
| ESD-01 | SWD 10-pin header — each signal pin (air discharge) |
| ESD-02 | JTAG 20-pin header — each signal pin (air discharge) |
| ESD-03 | UART header — TX, RX, VCC, GND (air discharge) |
| ESD-04 | SPI header — each signal pin (air discharge) |
| ESD-05 | I2C header — SDA, SCL, VCC, GND (air discharge) |
| ESD-06 | CAN header — CANH, CANL, GND (air discharge) |
| ESD-07 | Target power connector — VDD, GND (contact discharge) |
| ESD-08 | VTREF sense pin (air discharge) |
| ESD-09 | Connector shells and board ground plane (contact discharge) |

### Measurements
- Functional test before and after each ESD sequence
- Visual inspection for damaged TVS diodes or component cracking after testing
- Leakage current measurement on protection diodes after test (compare to pre-test baseline)

### Pass Criteria
- No loss of function during or after ESD events at target minimum level
- No visible damage to TVS arrays or other protection components
- Leakage current on protection diodes within 20% of pre-test values

---

## 4. Backfeed Testing

### Objective
Verify that no significant current flows from the target system back into the STLINK-V3MODS
or host USB supply through parasitic paths. Backfeed can occur through clamping diode leakage
in level translators, TVS structures, or shared ground paths.

### Test Conditions

| Test | Description |
|---|---|
| BF-01 | Target powered at 3.3 V, debugger USB unplugged. Measure current flowing from target into VDD\_DBG rail through any path. Expected: < 100 µA. |
| BF-02 | Target powered at 5 V, debugger USB unplugged. Same measurement. |
| BF-03 | Target powered at 1.8 V (below translator operating range). Verify no unexpected current path enabled. |
| BF-04 | Target powered at 3.3 V, debugger powered, but level translator OE held low (disabled). Measure backfeed through translator IO clamping diodes. |
| BF-05 | Target VTREF applied without target ground connected. Verify no functional current path from VTREF sense to GND through any parasitic route. |

### Measurements
- Precision current measurement (µA range) on VDD\_DBG rail during each condition
- Measurement at VTREF sense node
- Thermal scan of board during BF-01 and BF-02 to identify any unexpected dissipation

### Pass Criteria
- Backfeed current from target into VDD\_DBG < 100 µA under any unpowered-debugger condition
- No backfeed current > 50 µA through level translator clamping paths when OE is disabled
- No unexpected thermal dissipation on any component during backfeed conditions

---

## 5. Interface Validation

### 5.1 SWD

**Objective:** Verify correct SWD communication through the SPARK interface at multiple VTREF levels.

| Test | Description |
|---|---|
| SWD-01 | SWD communication to a known-good target at VTREF = 3.3 V. Verify successful connect, halt, read/write, and resume. |
| SWD-02 | SWD communication at VTREF = 1.8 V. Same operations. |
| SWD-03 | SWD communication at VTREF = 5.0 V. Same operations. |
| SWD-04 | SWD at maximum rated clock frequency for the selected level translator. Verify signal integrity on SWDIO and SWDCLK at translator output (oscilloscope). |
| SWD-05 | SWD with 10 cm target cable (representative of typical bench use). Verify no communication errors at rated speed. |

**Pass Criteria:** Zero communication errors during enumeration and 1000-word memory transfer at each VTREF.

---

### 5.2 JTAG

**Objective:** Verify JTAG communication through the SPARK interface at multiple VTREF levels.

| Test | Description |
|---|---|
| JTAG-01 | JTAG boundary scan or core access at VTREF = 3.3 V. Verify TDI/TDO/TMS/TCK signal integrity. |
| JTAG-02 | Repeat at VTREF = 1.8 V and 5.0 V. |
| JTAG-03 | Verify both 10-pin and 20-pin headers pass JTAG communication to the same target. |

**Pass Criteria:** Successful JTAG device ID read on all VTREF test points; no bit errors in 1000-clock test sequence.

---

### 5.3 UART

**Objective:** Verify UART communication at multiple baud rates and VTREF levels.

| Test | Description |
|---|---|
| UART-01 | Loopback test at 115200 baud, VTREF = 3.3 V. |
| UART-02 | Loopback test at 1 Mbaud, VTREF = 3.3 V. |
| UART-03 | Loopback test at 115200 baud, VTREF = 1.8 V and 5.0 V. |
| UART-04 | Verify TX and RX are correctly oriented relative to target header labeling. |

**Pass Criteria:** Zero byte errors in 10,000-byte loopback transfer at each test condition.

---

### 5.4 SPI

**Objective:** Verify SPI signal integrity and correct level translation at multiple VTREF levels and clock rates.

| Test | Description |
|---|---|
| SPI-01 | SPI loopback (MOSI to MISO) at 1 MHz, VTREF = 3.3 V. |
| SPI-02 | SPI loopback at 10 MHz, VTREF = 3.3 V. |
| SPI-03 | SPI loopback at 1 MHz, VTREF = 1.8 V and 5.0 V. |
| SPI-04 | Verify CS, SCK, MOSI, MISO signal levels at target header with oscilloscope. |

**Pass Criteria:** Zero bit errors in 10,000-byte SPI transfer at each test condition; signal transitions within valid logic levels for VTREF.

---

### 5.5 I2C

**Objective:** Verify I2C communication through the SPARK interface with appropriate pull-up handling.

| Test | Description |
|---|---|
| I2C-01 | I2C communication to a known target device at 100 kHz, VTREF = 3.3 V. |
| I2C-02 | I2C communication at 400 kHz, VTREF = 3.3 V. |
| I2C-03 | Repeat at VTREF = 1.8 V and 5.0 V. |
| I2C-04 | Verify SDA and SCL open-drain behavior through level translator. Confirm correct pull-up configuration does not conflict with target pull-ups. |

**Pass Criteria:** Successful ACK on device address at all test conditions; no bus stuck condition; pull-up current within translator output ratings.

---

### 5.6 CAN

**Objective:** Verify CAN signal integrity through the SPARK interface, including transceiver (if fitted) or passive differential pair handling.

| Test | Description |
|---|---|
| CAN-01 | CAN communication at 500 kbit/s between SPARK and a reference CAN node. |
| CAN-02 | CAN communication at 1 Mbit/s. |
| CAN-03 | Verify CANH and CANL differential amplitude at the connector under load (60 Ω termination). |
| CAN-04 | Verify bus survival after a short of CANH or CANL to GND for 1 second (if transceiver is fitted with fault-tolerant operation). |

**Pass Criteria:** Zero frame errors in 1000-frame sequence at each bit rate; differential voltage within CAN specification at the connector.

---

## Revision History

| Date | Revision | Notes |
|---|---|---|
| 2026-02-24 | 0.1 | Initial validation plan, schematic phase |
