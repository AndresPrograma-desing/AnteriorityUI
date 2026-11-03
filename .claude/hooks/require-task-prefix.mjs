#!/usr/bin/env node
// PreToolUse (Bash) hook: exige el prefijo de tarea (UI-<n>) en los nombres de rama y en los
// mensajes de commit de este repo.
//
//   - Rama nueva (`git checkout -b`, `git switch -c|-C`, `git checkout -B`, `git branch <nombre>`):
//     el nombre debe ser `<tipo>/UI-<n>-<slug>` (slug en minúsculas), ej. `feat/UI-1-consumer-skill`.
//     Tipos: feat, fix, add, revert, chore, docs, refactor, test, style, perf, build, ci.
//   - Commit (`git commit`): el asunto debe ser `UI-<n>: <asunto en inglés>`, ej. `UI-1: Add consumer skill`.
//     Se lee del primer `-m "..."` o del primer renglón de un heredoc. Si no se puede leer el
//     asunto (ej. `-F archivo` o abrir el editor), se bloquea para pedir `-m "UI-<n>: ..."`.
//     `git commit --amend` sin `-m` se permite porque reutiliza un mensaje ya validado.
//   - Commit en una rama que no tiene el prefijo (salvo `main`): se bloquea.
//
// El idioma (inglés) lo valida el otro hook, block-spanish-git.mjs.

import { execSync } from 'node:child_process';

// Tipo de cambio (como en las ramas existentes del repo: feat/..., fix/...) + prefijo de tarea.
const BRANCH_TYPES = ['feat', 'fix', 'add', 'revert', 'chore', 'docs', 'refactor', 'test', 'style', 'perf', 'build', 'ci'];
const TASK_BRANCH = new RegExp(`^(${BRANCH_TYPES.join('|')})\\/UI-\\d+-[a-z0-9][a-z0-9._-]*$`);
const TASK_SUBJECT = /^UI-\d+: \S.*$/;
const PROTECTED_BRANCHES = new Set(['main']);

function currentBranch(cwd) {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

// Devuelve el asunto del commit, o null si no se puede determinar.
// `undefined` significa "no es un commit que cree mensaje nuevo" (--amend sin -m).
function commitSubject(command) {
  const heredoc = command.match(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n([\s\S]*?)\n\s*\1\b/);
  if (heredoc) {
    const firstLine = heredoc[2].split('\n').find((line) => line.trim() !== '');
    return firstLine ? firstLine.trim() : null;
  }
  const messageFlag = command.match(/(?:^|\s)-m\s+(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/);
  if (messageFlag) return (messageFlag[1] ?? messageFlag[2]).trim();
  if (/\s--amend\b/.test(command)) return undefined;
  return null;
}

// Solo cuentan los segmentos que EMPIEZAN con `git` (separados por &&, ||, ;, | o salto de línea).
// Así un `echo "git commit ..."` o el texto de un archivo no dispara el hook.
function gitSegments(command) {
  return command
    .split(/&&|\|\||;|\||\n/)
    .map((segment) => segment.trim())
    .filter((segment) => /^git\s/.test(segment));
}

function branchNamesToCreate(segments) {
  const names = [];
  for (const segment of segments) {
    const patterns = [
      /^git\s+checkout\s+-[bB]\s+(\S+)/,
      /^git\s+switch\s+-[cC]\s+(\S+)/,
      /^git\s+branch\s+(?!-)(\S+)/,
    ];
    for (const pattern of patterns) {
      const match = segment.match(pattern);
      if (match) names.push(match[1]);
    }
  }
  return names;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    process.exit(0);
  }

  const command = input?.tool_input?.command || '';
  if (!command) process.exit(0);

  const cwd = process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
  const segments = gitSegments(command);
  if (segments.length === 0) process.exit(0);

  const problems = [];

  for (const name of branchNamesToCreate(segments)) {
    if (!TASK_BRANCH.test(name)) {
      problems.push(`nombre de rama "${name}": debe ser <tipo>/UI-<n>-<slug>, ej. feat/UI-1-consumer-skill (tipos: ${BRANCH_TYPES.join(', ')})`);
    }
  }

  if (segments.some((segment) => /^git\s+commit\b/.test(segment))) {
    const subject = commitSubject(command);
    if (subject === null) {
      problems.push('no se pudo leer el asunto del commit: usá -m "UI-<n>: <asunto en inglés>"');
    } else if (subject !== undefined && !TASK_SUBJECT.test(subject)) {
      problems.push(`asunto de commit "${subject}": debe empezar con UI-<n>: , ej. "UI-1: Add consumer skill"`);
    }

    const branch = currentBranch(cwd);
    if (branch && !PROTECTED_BRANCHES.has(branch) && !TASK_BRANCH.test(branch)) {
      problems.push(`la rama actual "${branch}" no tiene el prefijo UI-<n>-; creá una rama nueva con el prefijo`);
    }
  }

  if (problems.length === 0) process.exit(0);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `Este repo exige el prefijo de tarea UI-<n> en ramas y commits. Problemas: ${problems.join('; ')}. Corregilo y volvé a intentar.`,
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});
