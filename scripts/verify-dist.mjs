// Bundlea dist/index.js (que importa los ~50 componentes) con esbuild para confirmar
// que el grafo de imports del paquete YA COMPILADO resuelve de verdad. `pnpm build-storybook`
// no alcanza para esto: corre contra el código FUENTE (.jsx), donde un import con extensión
// ".jsx" explícita matchea el archivo real; una vez compilado a dist/ (.js), ese mismo import
// literal deja de resolver. Correr después de `pnpm run build`.
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const peerAndDeps = [
  'react',
  'react-dom',
  'react-dom/*',
  'react/*',
  '@mui/*',
  '@emotion/*',
  'lucide-react',
  'date-fns',
  'react-markdown',
  'remark-gfm',
];

async function main() {
  try {
    await build({
      entryPoints: [path.join(rootDir, 'dist', 'index.js')],
      bundle: true,
      outfile: path.join(rootDir, 'dist', '.verify-bundle.js'),
      format: 'esm',
      platform: 'browser',
      loader: { '.css': 'css' },
      external: peerAndDeps,
      logLevel: 'silent',
    });
  } catch (err) {
    console.error('FAIL: el paquete compilado en dist/ tiene imports que no resuelven:\n');
    console.error(err.message);
    process.exit(1);
  }
  console.log('OK: dist/index.js y los ~50 componentes que importa resuelven correctamente.');
}

main();
