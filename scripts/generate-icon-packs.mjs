// Genera screens/components/Icons/<pack>/index.js, uno por cada pack de react-icons
// (fa, si, md, bi, etc.), como un re-export de 1 línea. Esto permite que un proyecto
// consumidor haga `import { SiJavascript } from 'anteriority-ui/screens/components/Icons/si'`
// sin instalar react-icons por su cuenta (queda empaquetada como dependency normal de
// anteriority-ui, igual que lucide-react).
//
// No corre en cada build: los archivos generados quedan versionados en el repo como
// cualquier otro archivo fuente. Volver a correr este script solo si react-icons agrega
// o quita un pack (ver carpetas en node_modules/react-icons, excluyendo lib/ y la raíz).
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const reactIconsDir = path.join(rootDir, 'node_modules', 'react-icons');
const iconsDir = path.join(rootDir, 'screens', 'components', 'Icons');

const EXCLUDE = new Set(['lib', 'cjs', 'esm']);

async function main() {
  const entries = await readdir(reactIconsDir, { withFileTypes: true });
  const packs = entries
    .filter((e) => e.isDirectory() && !EXCLUDE.has(e.name))
    .map((e) => e.name)
    .sort();

  if (packs.length === 0) {
    throw new Error('No se encontraron packs en node_modules/react-icons. ¿Está instalado?');
  }

  for (const pack of packs) {
    const dir = path.join(iconsDir, pack);
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, 'index.js'),
      `// Re-export del pack '${pack}' de react-icons. Generado por scripts/generate-icon-packs.mjs.\nexport * from 'react-icons/${pack}';\n`,
    );
  }

  console.log(`Generados ${packs.length} packs en screens/components/Icons/: ${packs.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
