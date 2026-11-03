#!/usr/bin/env node
// PreToolUse (Bash) hook: bloquea `git commit`, `git checkout -b`, `git branch` y
// `git push` de una rama nueva cuando el mensaje de commit o el nombre de la rama
// parecen estar en español (tildes, ñ, o palabras comunes en español), para forzar que
// el historial de git de este repo quede en inglés.

const SPANISH_WORD_PATTERN =
  /\b(agregar|agrega|agregue|actualizar|actualiza|arreglar|arregla|arreglo|mejorar|mejora|mejoras|eliminar|elimina|borrar|borra|quitar|quita|corregir|corrige|refactorizar|refactoriza|documentar|documenta|implementar|implementa|renombrar|renombra|mover|mueve|añadir|añade|limpiar|limpia|cambiar|cambia|probar|prueba|componente|componentes|funcionalidad|correccion|corrección|caracteristica|característica|version|versión|nuevo|nueva|boton|botón|pantalla|barra|lateral)\b/i;
const SPANISH_CHAR_PATTERN = /[áéíóúñÁÉÍÓÚÑ¡¿]/;

function looksSpanish(text) {
  if (!text) return false;
  return SPANISH_CHAR_PATTERN.test(text) || SPANISH_WORD_PATTERN.test(text);
}

// Extrae los mensajes de `-m "..."` / `-m '...'` de un `git commit`. No intenta
// soportar heredocs (`git commit -F -` / `-m "$(cat <<'EOF' ... EOF)"`): si alguien usa
// ese patrón para esquivar el chequeo, es una señal más fuerte de que lo está haciendo
// a propósito, no algo que este hook deba perseguir con una regex de shell.
function extractCommitMessages(command) {
  const messages = [];
  const pattern = /-m\s+(".*?"|'.*?')/gs;
  let match;
  while ((match = pattern.exec(command))) {
    messages.push(match[1].slice(1, -1));
  }
  return messages;
}

function extractBranchNames(command) {
  const names = [];

  const checkoutMatch = command.match(/git\s+checkout\s+-b\s+(\S+)/);
  if (checkoutMatch) names.push(checkoutMatch[1]);

  const switchMatch = command.match(/git\s+switch\s+-c\s+(\S+)/);
  if (switchMatch) names.push(switchMatch[1]);

  const branchMatch = command.match(/git\s+branch\s+(?!-[a-zA-Z]*\s*$)(?!-[dD]\b)(?!-[mM]\b)(\S+)/);
  if (branchMatch) names.push(branchMatch[1]);

  const pushMatch = command.match(/git\s+push\s+(?:-u\s+|--set-upstream\s+)?\S+\s+(\S+)/);
  if (pushMatch && !pushMatch[1].startsWith('-')) names.push(pushMatch[1]);

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

  const isGitCommand = /\bgit\s+(commit|checkout\s+-b|switch\s+-c|branch|push)\b/.test(command);
  if (!isGitCommand) process.exit(0);

  const offenders = [];

  for (const message of extractCommitMessages(command)) {
    if (looksSpanish(message)) offenders.push(`mensaje de commit: "${message}"`);
  }

  for (const branch of extractBranchNames(command)) {
    // Los nombres de rama no suelen llevar tildes/ñ (git los normaliza/rechaza a veces),
    // así que acá alcanza con las palabras en español separadas por - o _.
    const branchAsWords = branch.replace(/[-_/]/g, ' ');
    if (looksSpanish(branchAsWords)) offenders.push(`nombre de rama: "${branch}"`);
  }

  if (offenders.length === 0) process.exit(0);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `Este repo requiere que los commits y nombres de rama estén en inglés. Se detectó texto en español en: ${offenders.join('; ')}. Reescribilo en inglés y volvé a intentar.`,
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});
