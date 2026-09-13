// Compila la librería para publicar: transpila JSX -> JS (import/export ESM intactos)
// y copia los assets (CSS Modules, imágenes, etc.) manteniendo la MISMA estructura de
// carpetas que el código fuente, para que los subpath imports documentados en el README
// (ej. 'anteriority-ui/screens/components/Button', 'anteriority-ui/common/theme/muiTheme')
// sigan resolviendo igual una vez instalada la librería, sin exponer JSX sin compilar.
import { build } from 'esbuild';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(rootDir, 'dist');
const sourceDirs = ['screens', 'common', 'features', 'hooks'];

const isSourceFile = (file) => /\.(jsx|js)$/.test(file) && !/\.stories\.jsx$/.test(file);

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const allFiles = [path.join(rootDir, 'index.js')];
  for (const dir of sourceDirs) {
    const abs = path.join(rootDir, dir);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    allFiles.push(...(await collectFiles(abs)));
  }

  const jsEntryPoints = allFiles.filter((f) => isSourceFile(path.relative(rootDir, f)));
  const assetFiles = allFiles.filter((f) => !isSourceFile(path.relative(rootDir, f)) && !/\.stories\.jsx$/.test(f));

  if (jsEntryPoints.length === 0) {
    throw new Error('No se encontraron archivos fuente para compilar.');
  }

  await build({
    entryPoints: jsEntryPoints,
    outdir: outDir,
    outbase: rootDir,
    bundle: false,
    format: 'esm',
    platform: 'neutral',
    jsx: 'automatic',
    logLevel: 'info',
  });

  for (const file of assetFiles) {
    const rel = path.relative(rootDir, file);
    const dest = path.join(outDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(file, dest);
  }

  for (const file of ['README.md', 'AnteriorityUI.md', 'LICENSE']) {
    const src = path.join(rootDir, file);
    try {
      await stat(src);
      await cp(src, path.join(outDir, file));
    } catch {
      // opcional, no todos existen
    }
  }

  // pnpm publish empaqueta desde `dist/` (ver publishConfig.directory en package.json),
  // así que este subset de campos es el package.json que va a terminar publicado.
  const rootPkg = JSON.parse(await readFile(path.join(rootDir, 'package.json'), 'utf8'));
  const {
    name,
    version,
    description,
    main,
    license,
    author,
    type,
    keywords,
    repository,
    homepage,
    bugs,
    dependencies,
    peerDependencies,
  } = rootPkg;
  await writeFile(
    path.join(outDir, 'package.json'),
    JSON.stringify(
      {
        name,
        version,
        description,
        main,
        license,
        author,
        type,
        keywords,
        repository,
        homepage,
        bugs,
        dependencies,
        peerDependencies,
        publishConfig: { registry: rootPkg.publishConfig.registry },
      },
      null,
      2,
    ) + '\n',
  );

  console.log(`\nBuild OK: ${jsEntryPoints.length} módulos, ${assetFiles.length} assets copiados -> dist/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
