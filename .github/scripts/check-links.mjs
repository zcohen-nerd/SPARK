// Documentation link + image check for the SPARK repository.
//
// For every link/image target in a Markdown file:
//   - relative paths must resolve to a file/dir that exists in the repo
//   - http(s) URLs get a timed request; only hard 404/410 or DNS/connection
//     failure fails the build (403/429/5xx are warnings)
//   - image embeds pointing at github.com/.../blob/... fail (they do not render)
//
// Documentation hygiene only. No EDA tools, no hardware, no design verification.

import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const SOFT_HOSTS = ['www.st.com', 'st.com', 'www.digikey.com', 'digikey.com'];

function listMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full));
    else if (entry.name.toLowerCase().endsWith('.md')) out.push(full);
  }
  return out;
}

const LINK_RE = /(!?)\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const AUTOLINK_RE = /<((?:https?:)\/\/[^>\s]+)>/g;

const failures = [];
const warnings = [];
const externalTargets = new Map();

const mdFiles = listMarkdown(repoRoot);
if (mdFiles.length === 0) {
  console.error('No Markdown files found.');
  process.exit(1);
}

for (const file of mdFiles) {
  const rel = relative(repoRoot, file).replace(/\\/g, '/');
  const text = readFileSync(file, 'utf8');
  const targets = [];
  let m;
  while ((m = LINK_RE.exec(text)) !== null) targets.push({isImage: m[1] === '!', raw: m[2]});
  while ((m = AUTOLINK_RE.exec(text)) !== null) targets.push({isImage: false, raw: m[1]});

  for (const {isImage, raw} of targets) {
    if (raw.startsWith('#') || raw.startsWith('mailto:')) continue;
    if (/^https?:\/\//i.test(raw)) {
      if (isImage && /github\.com\/[^)]*\/blob\//i.test(raw)) {
        failures.push(`${rel}: image uses a GitHub blob URL (will not render): ${raw}`);
        continue;
      }
      const loc = externalTargets.get(raw) || [];
      loc.push(rel);
      externalTargets.set(raw, loc);
      continue;
    }
    const cleaned = decodeURIComponent(raw.split('#')[0].split('?')[0]);
    if (cleaned === '') continue;
    const abs = resolve(dirname(file), cleaned);
    if (!existsSync(abs)) {
      failures.push(`${rel}: broken relative link -> ${raw}`);
      continue;
    }
    try {
      if (statSync(abs).isFile() && statSync(abs).size <= 2 && /\.(md|txt|csv)$/i.test(abs)) {
        warnings.push(`${rel}: link target is a near-empty file -> ${raw}`);
      }
    } catch {
      /* ignore */
    }
  }
}

async function checkUrl(url) {
  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return '';
    }
  })();
  const soft = SOFT_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ac.signal,
      headers: {'user-agent': 'spark-integrity-check'},
    });
    if (res.status === 404 || res.status === 410) {
      if (soft) warnings.push(`soft host ${res.status}: ${url}`);
      else failures.push(`dead link (${res.status}): ${url}`);
    } else if (!res.ok) {
      warnings.push(`non-OK ${res.status} (not failing): ${url}`);
    }
  } catch (err) {
    if (soft) warnings.push(`soft host unreachable (${err.name}): ${url}`);
    else failures.push(`unreachable (${err.name}): ${url}`);
  } finally {
    clearTimeout(timer);
  }
}

const urls = [...externalTargets.keys()];
console.log(`Checking ${mdFiles.length} Markdown file(s), ${urls.length} external URL(s)...`);
await Promise.all(urls.map(checkUrl));

for (const w of warnings) console.log(`WARN  ${w}`);
for (const f of failures) console.log(`FAIL  ${f}`);
if (failures.length > 0) {
  console.error(`\n${failures.length} failure(s).`);
  process.exit(1);
}
console.log(`\nOK - no broken links or images.${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
