#!/usr/bin/env node
// PreToolUse (Bash) hook: impide que la firma / marca de agua de Claude llegue al historial de git.
//
//   - `git commit` (y --amend): bloquea si el comando trae una atribución a Claude: la línea
//     `Co-Authored-By: Claude ...`, `noreply@anthropic.com`, `Generated with Claude Code`, un
//     enlace a claude.com/claude-code, `--author=...Claude...` o `GIT_AUTHOR_*`/`GIT_COMMITTER_*`
//     con Claude o Anthropic. Se revisa el texto completo del comando, así que también cubre
//     mensajes en heredoc.
//   - `git push`: red de seguridad. Revisa los commits locales que todavía no están en ningún
//     remoto (mensaje, autor y committer) y bloquea el push si alguno ya trae la firma, por
//     ejemplo porque se hizo con `-F archivo` o desde otro lado.
//
// Si ya hay un commit local sin subir con la firma, se arregla rehaciéndolo sin ella
// (`git reset --soft HEAD~1` y volver a commitear, o `git commit --amend` con el mensaje limpio).
// Convive con block-spanish-git.mjs (idioma) y require-task-prefix.mjs (prefijo UI-<n>).

import { execSync } from 'node:child_process';

// Texto que delata la atribución a Claude en un mensaje de commit.
const SIGNATURE_PATTERNS = [
  { pattern: /co-authored-by:\s*claude/i, label: 'línea "Co-Authored-By: Claude"' },
  { pattern: /noreply@anthropic\.com/i, label: 'correo noreply@anthropic.com' },
  { pattern: /generated\s+with\s+\[?\s*claude/i, label: 'texto "Generated with Claude Code"' },
  { pattern: /claude\.com\/claude-code/i, label: 'enlace a claude.com/claude-code' },
  { pattern: /🤖\s*generated/i, label: 'marca "🤖 Generated"' },
];

// Autor o committer que sea Claude / Anthropic.
// Solo el valor que recibe `--author` (entre comillas o un solo token), no el texto que siga: así un
// mensaje que mencione "--author" y más adelante a Claude no da un falso positivo.
const AUTHOR_FLAG = /--author(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
const authorFlagPointsToClaude = (command) =>
  [...command.matchAll(AUTHOR_FLAG)].some((match) => /claude|anthropic/i.test(match[1] ?? match[2] ?? match[3] ?? ''));
const AUTHOR_ENV = /GIT_(?:AUTHOR|COMMITTER)_(?:NAME|EMAIL)=["']?[^"'\s]*(claude|anthropic)/i;
const IDENTITY_PATTERN = /claude|anthropic/i;

// Solo cuentan los segmentos que EMPIEZAN con `git` (separados por &&, ||, ;, | o salto de línea),
// así un `echo "git commit ..."` o el texto de un archivo no dispara el hook.
function gitSegments(command) {
  return command
    .split(/&&|\|\||;|\||\n/)
    .map((segment) => segment.trim().replace(/^(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)+/, '')) // quita `VAR=valor` previos
    .filter((segment) => /^git\s/.test(segment));
}

function signaturesIn(text) {
  return SIGNATURE_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

// Commits locales que aún no están en ningún remoto, para el `ref` que se va a subir.
function unpushedCommits(cwd, ref) {
  try {
    const format = '%an <%ae>%n%cn <%ce>%n%B';
    const out = execSync(`git log ${ref} --not --remotes --format="${format}%x00"`, {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString();
    return out.split('\0').map((entry) => entry.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

// Rama o ref que sube un `git push [opciones] [remoto] [ref]`; sin ref explícito, HEAD.
function pushedRef(segment) {
  const tokens = segment.split(/\s+/).slice(2).filter((token) => !token.startsWith('-'));
  const ref = tokens[1] ?? 'HEAD';
  return ref.includes(':') ? ref.split(':')[0] || 'HEAD' : ref;
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

  if (segments.some((segment) => /^git\s+commit\b/.test(segment))) {
    for (const label of signaturesIn(command)) problems.push(`el commit incluye ${label}`);
    if (authorFlagPointsToClaude(command)) problems.push('--author apunta a Claude/Anthropic');
    if (AUTHOR_ENV.test(command)) problems.push('GIT_AUTHOR_*/GIT_COMMITTER_* apuntan a Claude/Anthropic');
    // `-F archivo` / `-C`: el mensaje no está en el comando, se valida igual al hacer push.
  }

  for (const segment of segments.filter((item) => /^git\s+push\b/.test(item))) {
    const ref = pushedRef(segment);
    unpushedCommits(cwd, ref).forEach((entry, index) => {
      const [authors = '', committers = '', ...message] = entry.split('\n');
      const found = [
        ...signaturesIn(message.join('\n')),
        ...(IDENTITY_PATTERN.test(authors) ? ['autor del commit = Claude/Anthropic'] : []),
        ...(IDENTITY_PATTERN.test(committers) ? ['committer del commit = Claude/Anthropic'] : []),
      ];
      if (found.length > 0) {
        const subject = message.find((line) => line.trim() !== '') || `commit #${index + 1}`;
        problems.push(`el commit local "${subject.slice(0, 60)}" trae ${[...new Set(found)].join(', ')}`);
      }
    });
  }

  if (problems.length === 0) process.exit(0);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `En este repo los commits no llevan la firma ni la atribución de Claude (Co-Authored-By, "Generated with Claude Code", autor o committer Claude/Anthropic). Problemas: ${problems.join('; ')}. ` +
        'Quitala del mensaje (o rehacé el commit local sin ella: git reset --soft HEAD~1 y commitear de nuevo) y volvé a intentar.',
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});
