#!/usr/bin/env node
// Copia la skill de anteriority-ui al proyecto consumidor, en .claude/skills/anteriority-ui/,
// que es donde Claude Code la detecta. Claude Code no lee skills desde node_modules, así que
// este paso es necesario una vez por instalación (y de nuevo después de cada actualización).
//
// Uso (desde la raíz del proyecto consumidor):
//   pnpm anteriority-ui-install-skill
//   npx anteriority-ui-install-skill
//
// Opcional: pasar otra carpeta de destino como argumento.

import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `anteriority-ui-install-skill — copia la skill de anteriority-ui a .claude/skills/

Uso:
  anteriority-ui-install-skill [carpeta-del-proyecto]

Sin argumento usa la raíz del proyecto desde donde se ejecuta (INIT_CWD o el cwd actual).
`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  process.stdout.write(HELP);
  process.exit(0);
}

const here = path.dirname(fileURLToPath(import.meta.url));
// Funciona igual desde el repo (bin/ → skill/) y desde dist/ (dist/bin/ → dist/skill/).
const skillSrc = path.resolve(here, '..', 'skill', 'anteriority-ui');

// pnpm/npm exponen en INIT_CWD la carpeta desde la que se invocó el script, aunque el bin
// corra desde node_modules. Sin eso, usamos el cwd actual.
const projectRoot = path.resolve(args[0] ?? process.env.INIT_CWD ?? process.cwd());
const dest = path.join(projectRoot, '.claude', 'skills', 'anteriority-ui');

try {
  await stat(path.join(skillSrc, 'SKILL.md'));
} catch {
  console.error(`No se encontró la skill en ${skillSrc}. ¿La librería está instalada completa?`);
  process.exit(1);
}

// Reemplaza la copia anterior para que quede exactamente la versión instalada
// (sin archivos viejos que hayan sido eliminados en una versión nueva).
await rm(dest, { recursive: true, force: true });
await mkdir(path.dirname(dest), { recursive: true });
await cp(skillSrc, dest, { recursive: true });

console.log(`Skill de anteriority-ui instalada en: ${dest}`);
console.log('Claude Code la detecta en la próxima sesión (o al reiniciar).');
