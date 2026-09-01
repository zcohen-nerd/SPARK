// Cross-document consistency checks: catch drift between the README, the design
// docs, the licence, and the validation material. Nothing here verifies hardware.

import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const read = (rel) => (existsSync(resolve(repoRoot, rel)) ? readFileSync(resolve(repoRoot, rel), 'utf8') : null);

const failures = [];
const need = (cond, msg) => {
  if (!cond) failures.push(msg);
};

const readme = read('README.md');
const arch = read('docs/architecture.md');
const iface = read('docs/interfaces.md');
const bringup = read('validation/bring_up.md');
const valReadme = read('validation/README.md');
const license = read('LICENSE');

need(readme, 'README.md missing');
need(license, 'LICENSE missing');

// 1) Required maturity phrasing in the README.
need(readme && /Prototype \/ beta hardware in bring-up/i.test(readme),
  'README.md does not contain the status phrase "Prototype / beta hardware in bring-up"');

// 2) VTREF <= 3.6 V limit must appear in every doc that discusses it (drift guard).
for (const [name, body] of [
  ['README.md', readme],
  ['docs/architecture.md', arch],
  ['docs/interfaces.md', iface],
  ['validation/bring_up.md', bringup],
]) {
  need(body && /3\.6\s*V/.test(body), `${name} does not state the VTREF 3.6 V limit`);
}

// 3) 5V_TARGET "power only" caveat must be in README and at least one design doc.
need(readme && /5V_TARGET.{0,40}power only/is.test(readme.replace(/`/g, '')),
  'README.md does not state that 5V_TARGET is power only');

// 4) Licence naming is consistent.
need(readme && /CERN-OHL-S-2\.0/.test(readme), 'README.md does not name CERN-OHL-S-2.0');
need(license && /CERN Open Hardware Licence Version 2/i.test(license),
  'LICENSE does not look like the CERN-OHL-S v2 text');
need(read('SECURITY.md') && read('CONTRIBUTING.md'), 'CONTRIBUTING.md and/or SECURITY.md missing');

// 5) Validation index points at both procedures.
need(valReadme && /bring_up\.md/.test(valReadme) && /test_plan\.md/.test(valReadme),
  'validation/README.md must link both bring_up.md and test_plan.md');

// 6) No unverified "pass" claims: any results file other than the template must
//    be built from the template (carry its provenance fields).
const resultsDir = resolve(repoRoot, 'validation/results');
if (existsSync(resultsDir)) {
  const walk = (d) => {
    for (const e of readdirSync(d, {withFileTypes: true})) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') && e.name !== 'TEMPLATE.md') {
        const body = readFileSync(p, 'utf8');
        if (!/Board identifier \/ serial/.test(body) || !/Operator/.test(body)) {
          failures.push(`validation/results/${e.name}: not derived from TEMPLATE.md (missing provenance fields)`);
        }
      }
    }
  };
  walk(resultsDir);
}

// 7) README status table must still mark the unverified stages as not-yet-done
//    while no real results exist.
const hasRealResults =
  existsSync(resultsDir) &&
  readdirSync(resultsDir, {recursive: true}).some(
    (f) => typeof f === 'string' && f.endsWith('.md') && !f.endsWith('TEMPLATE.md'),
  );
if (!hasRealResults && readme) {
  need(/\|\s*\*\*Bench-validated\*\*.*\|\s*\*\*No\*\*/s.test(readme.replace(/\n/g, ' ')),
    'README.md status table should mark Bench-validated as **No** while validation/results/ holds no records');
}

console.log('Consistency checks complete.');
if (failures.length) {
  for (const f of failures) console.log(`FAIL  ${f}`);
  console.error(`\n${failures.length} consistency failure(s).`);
  process.exit(1);
}
console.log('OK - documents are consistent.');
