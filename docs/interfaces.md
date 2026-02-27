# SPARK V0.4 Interfaces

## Scope

This document summarizes interface-level electrical behavior for SPARK V0.4. Pin-level mapping is intentionally omitted where not yet published.

Pinouts: **TBD (see schematic).**

## Connector Overview

SPARK provides target/debug interface exposure for:

- SWD
- JTAG
- UART
- SPI
- I2C
- CAN
- Target power rails and VTREF reference

Physical connector footprints and exact pin assignments are defined in schematic/PCB sources.

## Common Electrical Expectations

### External-Facing Signal Conditioning

- 22 Ω series resistor on each external-facing signal line
- SP0503BAHTG ESD protection arrays at interface boundary
- ESD clamp reference is GND

### Translation Topology

- LSF0108 for open-drain/complex lines (I2C minimum)
- SN74AXC8T245 for push-pull/high-bandwidth lines (SPI/UART/GPIO/SWO as applicable)
- SWDIO is implemented through SN74AXC8T245

### VTREF and Logic Domain

- VTREF defines target I/O reference behavior for translated interfaces.
- VTREF is not equivalent to available target power rails.
- Unless explicit VTREF OVP/disconnect hardware exists in the implementation, VTREF must remain `<= 3.6 V`.
- `5V_TARGET` is power-only and does not imply 5 V logic compatibility on interface pins.

## Interface Electrical Notes

## SWD / JTAG

- SWD/JTAG digital lines are treated as translated, external-facing signals.
- SWDIO is on SN74AXC8T245.
- SWDCLK/TCK/TMS/TDI/TDO routing and translation assignment are defined in schematic implementation.
- Directionality follows protocol role (debugger vs target) and translator channel assignment.

Pinouts: **TBD (see schematic).**

## UART

- UART TX/RX are push-pull translated channels (SN74AXC8T245 domain).
- Directionality is role-dependent and must match connector labeling in schematic.

Pinouts: **TBD (see schematic).**

## SPI

- SPI SCK/MOSI/MISO/CS are push-pull translated channels (SN74AXC8T245 domain).
- Channel direction control follows debug/programming use case and schematic assignment.

Pinouts: **TBD (see schematic).**

## I2C

- I2C SDA/SCL use LSF0108 open-drain translation.
- Pull-ups are present on both translator sides.
- SPARK-side I2C pull-ups are DNI by default.
- Effective bus pull-up network must be validated in-system to avoid over-pull conditions.

Pinouts: **TBD (see schematic).**

## CAN

- Physical layer uses TCAN1051 transceiver.
- 120 Ω termination is switch-selectable.
- External CAN TVS should be automotive-rated for expected transient environment.

Pinouts: **TBD (see schematic).**

## Target Power Interfaces

Exported rails:

- `1.8V_TARGET`
- `3.3V_TARGET`
- `5V_TARGET`

Each rail is gated by TPS22919 load switch and defaults OFF via EN pulldown hardware.

Pinouts: **TBD (see schematic).**