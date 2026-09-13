// Audita imports relativos contra el filesystem real, comparando MAYÚSCULAS/minúsculas
// exactas. En Windows/Mac (case-insensitive) un import mal casado resuelve igual y no
// se nota; en Linux (donde corren los builds de deploy) revienta con "module not found".
// Uso: node scripts/check-case.mjs        (reporta)
//      node scripts/check-case.mjs --fix  (además lista qué archivos habría que renombrar)
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDirs = ['screens', 'common', 'features', 'hooks'];
const importRe = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
const candidateExts = ['', '.jsx', '.js', '.module.css', '.css'];
const candidateIndexes = ['/index.jsx', '/index.js', '/Index.jsx', '/Index.js'];

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(full)));
    else files.push(full);
  }
  return files;
}

// Devuelve el nombre EXACTO (case-sensitive) tal como está en disco para un segmento
// dado dentro de un directorio, o null si no existe ningún archivo/carpeta con ese
// nombre en cualquier casing.
async function exactNameInDir(dir, name) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return { exists: false, exact: null };
  }
  const exact = entries.includes(name);
  const insensitiveMatch = entries.find((e) => e.toLowerCase() === name.toLowerCase());
  return { exists: Boolean(insensitiveMatch), exact: exact ? name : insensitiveMatch ?? null, caseMismatch: Boolean(insensitiveMatch) && !exact };
}

async function resolveCaseSensitive(fromFile, spec) {
  const baseDir = path.dirname(fromFile);
  const targetNoExt = path.resolve(baseDir, spec);
  const parentDir = path.dirname(targetNoExt);
  const leaf = path.basename(targetNoExt);

  // 1. spec ya trae extensión (ej. ./index.module.css)
  if (path.extname(leaf)) {
    const res = await exactNameInDir(parentDir, leaf);
    return res.exists ? { ok: !res.caseMismatch, actual: res.exact, tried: leaf, parentDir } : null;
  }

  // 2. probar como archivo con extensiones comunes
  for (const ext of candidateExts) {
    if (!ext) continue;
    const res = await exactNameInDir(parentDir, leaf + ext);
    if (res.exists) return { ok: !res.caseMismatch, actual: res.exact, tried: leaf + ext, parentDir };
  }

  // 3. probar como directorio con index.jsx / Index.jsx adentro
  const dirRes = await exactNameInDir(parentDir, leaf);
  if (dirRes.exists) {
    const dirExactOrGuess = path.join(parentDir, dirRes.exact ?? leaf);
    for (const idx of candidateIndexes) {
      const idxLeaf = path.basename(idx);
      const idxRes = await exactNameInDir(dirExactOrGuess, idxLeaf);
      if (idxRes.exists) {
        return {
          ok: !dirRes.caseMismatch && !idxRes.caseMismatch,
          actual: `${dirRes.actual}/${idxRes.exact}`,
          tried: `${leaf}${idx}`,
          parentDir,
        };
      }
    }
  }

  return null; // no se pudo resolver ni siquiera sin distinguir mayúsculas -> no es un problema de casing
}

async function main() {
  const allFiles = [];
  for (const dir of sourceDirs) {
    const abs = path.join(rootDir, dir);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    allFiles.push(...(await collectFiles(abs)));
  }
  const sourceFiles = allFiles.filter((f) => /\.jsx?$/.test(f));

  const mismatches = [];
  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(importRe)) {
      const spec = match[1];
      const resolved = await resolveCaseSensitive(file, spec);
      if (resolved && !resolved.ok) {
        mismatches.push({
          file: path.relative(rootDir, file),
          spec,
          importedAs: path.basename(spec),
          actualOnDisk: resolved.actual,
        });
      }
    }
  }

  if (mismatches.length === 0) {
    console.log('OK: ningún import relativo tiene mismatch de mayúsculas/minúsculas.');
    return;
  }

  console.log(`${mismatches.length} import(s) con casing distinto al archivo real en disco:\n`);
  for (const m of mismatches) {
    console.log(`  ${m.file}\n    import: '${m.spec}'  (pide "${m.importedAs}")\n    disco:  "${m.actualOnDisk}"\n`);
  }
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
