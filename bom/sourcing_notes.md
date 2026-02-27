# Sourcing Notes

Source analyzed: `Inbox/Schematic v26.csv`

## Data Integrity Flags

The following line items are missing Manufacturer or Manufacturer Part Number fields:
- Item 1 (C1, C2, C3, C6, C8, C14, C15, C16, C17, C18, C19, C20, C21, C22, C23, C24): Manufacturer='', Manufacturer Part Number=''
- Item 2 (C4, C7, C10, C11): Manufacturer='', Manufacturer Part Number=''
- Item 3 (C5, C9, C13): Manufacturer='', Manufacturer Part Number=''
- Item 4 (C12): Manufacturer='', Manufacturer Part Number=''
- Item 6 (D2): Manufacturer='', Manufacturer Part Number=''
- Item 7 (D3, D6): Manufacturer='', Manufacturer Part Number=''
- Item 8 (D4, D7): Manufacturer='', Manufacturer Part Number=''
- Item 9 (D5): Manufacturer='', Manufacturer Part Number=''
- Item 10 (D8): Manufacturer='', Manufacturer Part Number=''
- Item 11 (D9): Manufacturer='', Manufacturer Part Number=''
- Item 12 (FB1): Manufacturer='', Manufacturer Part Number=''
- Item 13 (JP1): Manufacturer='', Manufacturer Part Number=''
- Item 14 (JP2): Manufacturer='', Manufacturer Part Number=''
- Item 15 (JP3): Manufacturer='', Manufacturer Part Number=''
- Item 16 (JP4): Manufacturer='', Manufacturer Part Number=''
- Item 17 (JP5): Manufacturer='', Manufacturer Part Number=''
- Item 18 (JP6): Manufacturer='', Manufacturer Part Number=''
- Item 19 (JP7, JP9): Manufacturer='', Manufacturer Part Number=''
- Item 20 (JP8): Manufacturer='', Manufacturer Part Number=''
- Item 21 (R1, R15): Manufacturer='', Manufacturer Part Number=''
- Item 22 (R2): Manufacturer='', Manufacturer Part Number=''
- Item 23 (R3, R4, R5, R6, R7, R8, R13, R16): Manufacturer='', Manufacturer Part Number=''
- Item 24 (R9, R10, R11, R12, R29, R30): Manufacturer='', Manufacturer Part Number=''
- Item 25 (R14, R17, R19, R23): Manufacturer='', Manufacturer Part Number=''
- Item 26 (R18, R22, R24, R28): Manufacturer='', Manufacturer Part Number=''
- Item 27 (R20): Manufacturer='', Manufacturer Part Number=''
- Item 28 (R21): Manufacturer='', Manufacturer Part Number=''
- Item 29 (R25, R26, R27): Manufacturer='', Manufacturer Part Number=''
- Item 30 (S1): Manufacturer='', Manufacturer Part Number=''
- Item 31 (U$1): Manufacturer='', Manufacturer Part Number=''
- Item 32 (U$2, U$3): Manufacturer='', Manufacturer Part Number=''
- Item 33 (U$4): Manufacturer='', Manufacturer Part Number=''
- Item 34 (U$5): Manufacturer='', Manufacturer Part Number=''
- Item 35 (U$6): Manufacturer='', Manufacturer Part Number=''
- Item 36 (U$7, U$8, U$10, U$11, U$12, U$17, U$19): Manufacturer='', Manufacturer Part Number=''
- Item 37 (U$9, U$13, U$14, U$15, U$16): Manufacturer='', Manufacturer Part Number=''
- Item 38 (U$18): Manufacturer='', Manufacturer Part Number=''
- Item 39 (U1): Manufacturer='', Manufacturer Part Number=''
- Item 40 (U2): Manufacturer='', Manufacturer Part Number=''
- Item 41 (U3): Manufacturer='', Manufacturer Part Number=''
- Item 42 (U4): Manufacturer='', Manufacturer Part Number=''
- Item 43 (U5): Manufacturer='', Manufacturer Part Number=''
- Item 44 (U6, U8): Manufacturer='', Manufacturer Part Number=''
- Item 45 (U7): Manufacturer='', Manufacturer Part Number=''
- Item 46 (U10): Manufacturer='', Manufacturer Part Number=''

## Careful Sourcing

Fine-pitch / IC package-code checks identified from CSV fields:
- Item 33: U$4 | AP2112K | 3v3
- Item 34: U$5 | AP2112K | 1v8
- Item 39: U1 | TCAN1051HGVDR | TCAN1051HGVDRTCAN1051HGVDR
- Item 40: U2 | TPS22919DCKR | 5v
- Item 41: U3 | TPS22919DCKR | 3v3
- Item 42: U4 | TPS259620DDAR | TPS259620DDAR
- Item 43: U5 | TPS22919DCKR | 1v8
- Item 44: U6, U8 | SN74AXC8T245PWR | SN74AXC8T245PWR
- Item 46: U10 | LSF0108PW-Q100J | LSF0108PW-Q100J

## Voltage Rating Verification

Potential voltage/protection-rating checks from CSV identifiers:
- Item 33: U$4 | AP2112K | 3v3 - Verify rating during sourcing.
- Item 34: U$5 | AP2112K | 1v8 - Verify rating during sourcing.
- Item 36: U$7, U$8, U$10, U$11, U$12, U$17, U$19 | SP0503BAHTG | SP0503BAHTG - Verify rating during sourcing.
- Item 38: U$18 | SM24CANB-02HTG | SM24CANB-02HTG - Verify rating during sourcing.
- Item 40: U2 | TPS22919DCKR | 5v - Verify rating during sourcing.
- Item 41: U3 | TPS22919DCKR | 3v3 - Verify rating during sourcing.
- Item 42: U4 | TPS259620DDAR | TPS259620DDAR - Verify rating during sourcing.
- Item 43: U5 | TPS22919DCKR | 1v8 - Verify rating during sourcing.

## Automotive Rating Confirmation (CAN)

- Item 13: JP1 | 1X03 | CAN - Verify rating during sourcing.
- Item 38: U$18 | SM24CANB-02HTG | SM24CANB-02HTG - Verify rating during sourcing.
- Item 39: U1 | TCAN1051HGVDR | TCAN1051HGVDRTCAN1051HGVDR - Verify rating during sourcing.

## Missing Metadata Policy

If any required data is absent in the schematic export, do not infer it. Verify rating during sourcing.
