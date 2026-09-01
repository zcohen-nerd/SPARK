// Structural (syntax) check for the machine-readable BOM.
// Verifies the CSV parses, columns are consistent, and quantities line up with
// reference-designator counts. It does NOT judge part choices or completeness -
// missing Manufacturer/MPN data is tracked in bom/sourcing_notes.md, not here.

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const csvPath = resolve(repoRoot, 'bom/bom_master.csv');

const EXPECTED_HEADER = [
  'Item',
  'Quantity',
  'Reference Designators',
  'Manufacturer',
  'Manufacturer Part Number',
  'Value',
  'Package / Footprint',
  'Description',
  'Supplier',
  'Supplier Part Number',
  'Notes',
];

// Minimal RFC4180 parser: handles quoted fields, escaped "" and commas/newlines.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    if (row.length > 1 || row[0] !== '') rows.push(row);
  }
  return rows;
}

let raw = readFileSync(csvPath, 'utf8');
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // strip UTF-8 BOM

const rows = parseCsv(raw);
const failures = [];
const warnings = [];

if (rows.length < 2) {
  failures.push('BOM has no data rows.');
} else {
  const header = rows[0];
  if (header.length !== EXPECTED_HEADER.length || header.some((h, i) => h.trim() !== EXPECTED_HEADER[i])) {
    failures.push(`header mismatch.\n  expected: ${EXPECTED_HEADER.join(', ')}\n  got:      ${header.join(', ')}`);
  }

  const seenItems = new Set();
  let totalPlacements = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const where = `row ${r + 1}`;
    if (row.length !== EXPECTED_HEADER.length) {
      failures.push(`${where}: has ${row.length} fields, expected ${EXPECTED_HEADER.length}`);
      continue;
    }
    const [item, qty, refdes] = row;

    if (!/^\d+$/.test(item.trim())) failures.push(`${where}: Item "${item}" is not a positive integer`);
    else if (seenItems.has(item.trim())) failures.push(`${where}: duplicate Item "${item}"`);
    else seenItems.add(item.trim());

    if (!/^\d+$/.test(qty.trim()) || Number(qty) < 1) {
      failures.push(`${where}: Quantity "${qty}" is not a positive integer`);
      continue;
    }
    const q = Number(qty);
    totalPlacements += q;

    const refs = refdes.split(',').map((s) => s.trim()).filter(Boolean);
    if (refs.length !== q) {
      failures.push(`${where}: Quantity ${q} but ${refs.length} reference designator(s): "${refdes}"`);
    }
    const dupRefs = refs.filter((x, i) => refs.indexOf(x) !== i);
    if (dupRefs.length) warnings.push(`${where}: repeated reference designator(s): ${[...new Set(dupRefs)].join(', ')}`);
  }

  console.log(`BOM: ${rows.length - 1} line items, ${totalPlacements} total placements.`);
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const f of failures) console.log(`FAIL  ${f}`);
if (failures.length) {
  console.error(`\n${failures.length} BOM failure(s).`);
  process.exit(1);
}
console.log('OK - BOM syntax and quantities are consistent.');
