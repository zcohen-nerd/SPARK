// Asserts that the design artifacts the docs point at actually exist.
// No EDA tools involved - this only checks that files are present and non-empty.

import {existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

// path -> minimum plausible size in bytes (0 = existence only)
const required = {
  'README.md': 500,
  'LICENSE': 1000,
  'CHANGELOG.md': 200,
  'CONTRIBUTING.md': 500,
  'SECURITY.md': 300,
  'hardware/README.md': 300,
  'hardware/schematic/SPARK Schematic.fsch': 1000,
  'hardware/pcb/SPARK PCB.fbrd': 1000,
  'hardware/pcb/Electronics Design.f3z': 10000,
  'hardware/fabrication/SPARK PCB.zip': 10000,
  'hardware/fabrication/SPARK PCB.tar': 10000,
  'bom/bom_master.csv': 500,
  'bom/bom_readable.md': 300,
  'bom/sourcing_notes.md': 300,
  'docs/architecture.md': 500,
  'docs/interfaces.md': 500,
  'validation/README.md': 200,
  'validation/test_plan.md': 500,
  'validation/bring_up.md': 500,
  'validation/results/TEMPLATE.md': 200,
  'images/spark-board-perspective.png': 10000,
  'images/spark-board-top.png': 10000,
};

const failures = [];
for (const [rel, minSize] of Object.entries(required)) {
  const abs = resolve(repoRoot, rel);
  if (!existsSync(abs)) {
    failures.push(`missing: ${rel}`);
    continue;
  }
  const size = statSync(abs).size;
  if (size < minSize) {
    failures.push(`too small (${size} B, expected >= ${minSize}): ${rel}`);
  }
}

console.log(`Checked ${Object.keys(required).length} expected artifact(s).`);
if (failures.length) {
  for (const f of failures) console.log(`FAIL  ${f}`);
  console.error(`\n${failures.length} failure(s).`);
  process.exit(1);
}
console.log('OK - all expected artifacts present.');
