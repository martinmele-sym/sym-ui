import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const jsonPath = join(root, 'src', 'tokens', 'design_tokens.json');
const outPath = join(root, 'src', 'styles', 'tokens.css');

const raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
const tokenRoots = raw.tokens;

if (!tokenRoots || typeof tokenRoots !== 'object') {
  throw new Error('design_tokens.json: missing tokens root object');
}

/** @param {string} segment */
function cssSegment(segment) {
  return String(segment)
    .replace(/([A-Z])/g, '-$1')
    .replace(/^-/, '')
    .toLowerCase();
}

/** @param {string} ref dot.path from alias e.g. semantic.color.dark */
function aliasRefToVarName(ref) {
  const parts = ref.split('.').map(cssSegment);
  return `--${parts.join('-')}`;
}

/** @param {unknown} value */
function toCssValue(value, pathForError) {
  if (typeof value === 'string') {
    const m = /^\{alias:([^}]+)\}$/.exec(value);
    if (m) {
      const name = aliasRefToVarName(m[1].trim());
      return `var(${name})`;
    }
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  throw new Error(`Unsupported token leaf at ${pathForError}: ${typeof value}`);
}

/**
 * @param {unknown} node
 * @param {string} namespace core | semantic | component | layout
 * @param {string[]} segments path under namespace (logical hierarchy)
 * @param {{ name: string; value: string }[]} out
 */
function walk(node, namespace, segments, out, pathLabel) {
  if (node === null || node === undefined) return;

  if (Array.isArray(node)) {
    throw new Error(`Unexpected array in tokens at ${pathLabel}`);
  }

  if (typeof node !== 'object') {
    const varName = `--${[namespace, ...segments.map(cssSegment)].join('-')}`;
    out.push({ name: varName, value: toCssValue(node, pathLabel) });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    walk(child, namespace, [...segments, key], out, `${pathLabel}.${key}`);
  }
}

const namespaces = ['core', 'semantic', 'component', 'layout'];
let css =
  '/* Symphonica design tokens — generated from src/tokens/design_tokens.json */\n' +
  '/* Hierarchy preserved: core → semantic → component → layout */\n' +
  ':root {\n';

for (const ns of namespaces) {
  const subtree = tokenRoots[ns];
  if (subtree === undefined) {
    throw new Error(`Missing tokens.${ns} in design_tokens.json`);
  }
  const entries = [];
  walk(subtree, ns, [], entries, `tokens.${ns}`);
  css += `\n  /* --- ${ns} --- */\n`;
  for (const { name, value } of entries) {
    css += `  ${name}: ${value};\n`;
  }
}

css += '}\n';

writeFileSync(outPath, css, 'utf8');
console.log(`Wrote ${outPath} (${namespaces.length} namespaces)`);
