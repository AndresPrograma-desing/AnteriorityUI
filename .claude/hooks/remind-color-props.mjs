#!/usr/bin/env node
// PostToolUse (Write|Edit) hook: cuando se toca screens/components/**/index.jsx,
// recuerda correr la skill design-color-props antes de dar el componente por terminado.
// Ver CLAUDE.md -> "Convencion: props de color" (verificacion obligatoria al crear un componente nuevo).

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
  if (!filePath) process.exit(0);

  const normalized = filePath.replace(/\\/g, '/');
  const match = /screens\/components\/.*\/index\.jsx$/.test(normalized);
  if (!match) process.exit(0);

  const componentDir = normalized.slice(0, normalized.lastIndexOf('/'));
  const componentName = componentDir.slice(componentDir.lastIndexOf('/') + 1);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext:
        `RECORDATORIO OBLIGATORIO (CLAUDE.md, convencion de props de color): antes de dar el componente "${componentName}" (${normalized}) por terminado, corre la skill \`design-color-props\` sobre el para verificar que todo color visible sea configurable por prop. No se puede considerar terminado sin este chequeo.`,
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});
