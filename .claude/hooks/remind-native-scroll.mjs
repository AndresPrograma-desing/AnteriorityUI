#!/usr/bin/env node
// PostToolUse (Write|Edit) hook: cuando se escribe un archivo de screens/components con scroll NATIVO
// (overflow auto/scroll) o una superficie de MUI (Menu, Dialog, Popover...) sin ScrollBar, recuerda usar el
// ScrollBar de la libreria. Ver .claude/skills/native-scroll-audit/SKILL.md y `pnpm check-scroll`.
import fs from 'node:fs';

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

  const filePath = input?.tool_input?.file_path || input?.tool_response?.filePath || '';
  const normalized = filePath.replace(/\\/g, '/');
  if (!/screens\/components\/.*\.(css|jsx)$/.test(normalized)) process.exit(0);
  if (/\.stories\.jsx$|\/ScrollBar\//.test(normalized)) process.exit(0);

  let text = '';
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch {
    process.exit(0);
  }
  if (text.includes('native-scroll-ok')) process.exit(0);

  const nativeOverflow = /overflow(?:-[xy]|[XY])?\s*[:=]\s*\{?\s*['"]?(auto|scroll)\b/i.test(text);
  const muiSurface =
    /\.jsx$/.test(normalized) &&
    /from\s+['"]@mui\/material\/(Menu|MenuList|Dialog|DialogContent|Popover|Popper|Drawer|Select|Autocomplete)['"]/.test(text) &&
    !/ScrollBar/.test(text);
  if (!nativeOverflow && !muiSurface) process.exit(0);

  const what = nativeOverflow
    ? 'tiene `overflow: auto|scroll` (scroll nativo del navegador)'
    : 'usa una superficie de MUI sin `ScrollBar`';
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          'AVISO (scroll nativo): ' + normalized + ' ' + what + '. Si ese scroll lo ve el usuario, usa el ScrollBar de la libreria ' +
          '(screens/components/ScrollBar) en vez de la barra nativa; corre la skill `native-scroll-audit` y `pnpm check-scroll <ruta>`. ' +
          'Si es una excepcion legitima, marcala con el comentario "native-scroll-ok: <motivo>".',
      },
    }),
  );
  process.exit(0);
});
