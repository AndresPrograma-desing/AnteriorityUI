#!/usr/bin/env node
// Audita scroll NATIVO del navegador en screens/ (la librería tiene su propio ScrollBar, que debe usarse siempre).
// Falla recurrente: un componente nuevo deja `overflow: auto` o una superficie de MUI (Menu, Dialog, Popover…)
// con la barra gris nativa. Ver .claude/skills/native-scroll-audit/SKILL.md.
//
// Uso:
//   node scripts/check-native-scroll.mjs            # informa y sale con código 0
//   node scripts/check-native-scroll.mjs --strict   # sale con código 1 si hay hallazgos
//   node scripts/check-native-scroll.mjs <ruta>     # limita el análisis a un archivo o carpeta
//
// Excepciones legítimas: un comentario `native-scroll-ok: <motivo>` en el archivo (CSS o JSX) lo omite.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const target = args.find((a) => !a.startsWith('--'));
const START = path.resolve(ROOT, target || 'screens');

// El propio ScrollBar (y piezas que lo implementan) puede usar overflow nativo.
const IGNORED_DIRS = new Set(['node_modules', 'dist', 'storybook-static', 'plasmic', 'plasmic-gen', 'ScrollBar']);
const FILE_RE = /\.(css|jsx|js)$/;
const SKIP_FILE_RE = /\.stories\.jsx?$|\.mdx$/;

const OVERFLOW_RE = /overflow(?:-[xy]|[XY])?\s*[:=]\s*\{?\s*['"]?(auto|scroll)\b/gi;
const MUI_SURFACES = ['Menu', 'MenuList', 'Dialog', 'DialogContent', 'Popover', 'Popper', 'Drawer', 'Select', 'Autocomplete', 'List'];
const MUI_IMPORT_RE = new RegExp(`from\\s+['"]@mui/material/(${MUI_SURFACES.join('|')})['"]`, 'g');
const OK_MARK = 'native-scroll-ok';

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else if (FILE_RE.test(entry.name) && !SKIP_FILE_RE.test(entry.name)) {
      yield path.join(dir, entry.name);
    }
  }
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const findings = [];

const files = fs.statSync(START).isFile() ? [START] : [...walk(START)];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes(OK_MARK)) continue;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');

  for (const match of text.matchAll(OVERFLOW_RE)) {
    findings.push({ rel, line: lineOf(text, match.index), kind: 'overflow', detail: match[0].trim() });
  }

  // Superficie de MUI que scrollea sola cuando el contenido no entra, sin ScrollBar en el archivo.
  if (/\.jsx$/.test(file) && !/ScrollBar/.test(text)) {
    const surfaces = [...text.matchAll(MUI_IMPORT_RE)].map((m) => m[1]);
    if (surfaces.length) {
      findings.push({ rel, line: 1, kind: 'mui', detail: `usa ${[...new Set(surfaces)].join(', ')} de MUI sin ScrollBar` });
    }
  }
}

if (!findings.length) {
  console.log('OK: sin scroll nativo sospechoso en screens/.');
  process.exit(0);
}

const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.rel)) byFile.set(f.rel, []);
  byFile.get(f.rel).push(f);
}
console.log(`Scroll nativo sospechoso: ${findings.length} hallazgos en ${byFile.size} archivos.`);
console.log('Usar <ScrollBar> de la librería (screens/components/ScrollBar) o marcar la excepción con "native-scroll-ok: <motivo>".\n');
for (const [rel, list] of byFile) {
  console.log(rel);
  list.forEach((f) => console.log(`  L${f.line}  [${f.kind}] ${f.detail}`));
}
process.exit(strict ? 1 : 0);
