<!-- SPDX-License-Identifier: CERN-OHL-S-2.0 -->

# Security and safety reporting

SPARK is an open-hardware design. It has no firmware, no network service, and no
software supply chain of its own — so "security" here means **design faults that
could cause harm or damage**, plus repository and licensing integrity.

## What to report

- A design error that could damage a connected target, the STLINK-V3MODS probe,
  or the host — e.g. a missing or wrong protection element, a back-drive path, a
  rail that can come up when it should not, a VTREF path that can exceed 3.6 V.
- A safety hazard in the documented procedures (`validation/bring_up.md`,
  `validation/test_plan.md`).
- A licensing or attribution problem (incorrect notice, missing source, third-
  party IP concern).
- A factual claim in the docs that overstates maturity or implies testing that
  has not happened.

For general "this value looks wrong" design review, a normal Issue or PR is the
right channel — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## How to report

- **Preferred:** use this repository's **"Report a vulnerability"** button
  (GitHub → *Security* → *Advisories*) if it is available. This keeps the report
  private until it is resolved.
- **Otherwise:** open a public GitHub Issue. If the finding is sensitive and
  private reporting is not available, open a minimal Issue asking the maintainer
  to enable private reporting, without the details.

Please include: which file / schematic net / BOM line, what the problem is, the
failure it could cause, and a suggested fix if you have one.

## What to expect

- One maintainer, best-effort, **no guaranteed response time**.
- Confirmed design faults are tracked in `CHANGELOG.md` and, where they affect
  safe use, called out in the `README.md` warnings and `validation/bring_up.md`
  known-limits list.
- There is no bug-bounty program and no CVE process for this project.

## Not covered

SPARK is lab / educational reference hardware. It has **not** been through EMC,
electrical-safety, environmental, or production qualification, and no
target-compatibility testing has been recorded. Building, powering, and
connecting a board is done at your own risk — follow `validation/bring_up.md` and
the README warnings.
