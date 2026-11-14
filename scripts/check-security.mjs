#!/usr/bin/env node
// Auditor de seguridad estático para AnteriorityUI.
// Busca patrones de riesgo en el código fuente (XSS, ejecución de código, secretos
// hardcodeados, fugas por consola/storage/errores, enlaces sin rel seguro, transporte
// inseguro). Informa y sale en 0; con --strict falla si hay hallazgos de severidad "high".
//
// Uso:
//   node scripts/check-security.mjs [ruta ...]   (por defecto: screens common features hooks index.js)
//   node scripts/check-security.mjs --strict
//
// Excepción legítima: comentario `security-ok: <motivo>` en la misma línea o en la anterior.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, extname, basename } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));
const defaultTargets = ['screens', 'common', 'features', 'hooks', 'index.js'];
// Rutas que ya no existen (ej. archivos borrados en git status) se ignoran.
const scanRoots = (targets.length ? targets : defaultTargets)
  .map((t) => resolve(ROOT, t))
  .filter((p) => existsSync(p));

const EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx']);
// Vendorizados / minificados de terceros: no son código nuestro.
const isVendored = (file) => /\.min\.m?js$/.test(file) || /plasmic\.css$/.test(file);

const SECURITY_OK = /security-ok:/;

// Cada regla: id, severidad, descripción, regex sobre una línea, y opcional `check(lines, idx)`
// para reglas que necesitan mirar contexto (ej. rel="noopener" en las líneas siguientes).
const RULES = [
  {
    id: 'xss-dangerous-html',
    severity: 'high',
    message: 'dangerouslySetInnerHTML: inyección de HTML sin sanitizar (XSS).',
    test: /dangerouslySetInnerHTML/,
  },
  {
    id: 'xss-inner-html-assign',
    severity: 'high',
    message: 'Asignación a innerHTML/outerHTML/insertAdjacentHTML/document.write (XSS).',
    test: /\.(innerHTML|outerHTML)\s*=[^=]|insertAdjacentHTML\(|document\.write\(/,
  },
  {
    id: 'code-eval',
    severity: 'high',
    message: 'eval / new Function / setTimeout con string: ejecución de código dinámico.',
    test: /\beval\s*\(|new Function\s*\(|set(Timeout|Interval)\s*\(\s*['"`]/,
  },
  {
    id: 'secret-literal',
    severity: 'high',
    message: 'Posible secreto hardcodeado (token, API key, password, bearer o clave privada).',
    test: /(api[_-]?key|secret|passw(or)?d|access[_-]?token|auth[_-]?token)\s*[:=]\s*['"`][^'"`\s]{6,}['"`]|Bearer\s+[A-Za-z0-9._\-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  },
  {
    id: 'secret-in-url',
    severity: 'high',
    message: 'Credencial en query string (token/key/password en la URL queda en logs e historial).',
    test: /[?&](token|api[_-]?key|password|secret)=/i,
  },
  {
    id: 'postmessage-wildcard',
    severity: 'high',
    message: 'postMessage con origen "*": cualquier ventana puede recibir el mensaje.',
    test: /postMessage\([^)]*,\s*['"`]\*['"`]\s*\)/,
  },
  {
    id: 'blank-link-no-noopener',
    severity: 'medium',
    message: 'target="_blank" sin rel="noopener" / "noreferrer" (tabnabbing).',
    test: /target\s*=\s*\{?\s*['"`]_blank['"`]/,
    check: (lines, idx) => {
      const window = lines.slice(Math.max(0, idx - 3), idx + 6).join('\n');
      return /noopener|noreferrer/.test(window) ? null : 'sin noopener/noreferrer cerca';
    },
  },
  {
    id: 'window-open-no-noopener',
    severity: 'medium',
    message: 'window.open sin "noopener" en las features (tabnabbing).',
    test: /window\.open\(/,
    check: (lines, idx) => {
      const window = lines.slice(idx, idx + 3).join('\n');
      return /noopener/.test(window) ? null : 'window.open sin noopener';
    },
  },
  {
    id: 'iframe-no-sandbox',
    severity: 'medium',
    message: '<iframe> sin atributo sandbox.',
    test: /<iframe\b/,
    check: (lines, idx) => {
      const window = lines.slice(idx, idx + 6).join('\n');
      return /sandbox/.test(window) ? null : 'iframe sin sandbox';
    },
  },
  {
    id: 'console-leak',
    severity: 'medium',
    message: 'console.log/info/debug en código de la librería: puede filtrar datos al consumidor. Usar solo console.warn/error o quitarlo.',
    test: /\bconsole\.(log|info|debug)\(/,
  },
  {
    id: 'error-stack-exposed',
    severity: 'medium',
    message: 'Se muestra o loguea err.stack / JSON.stringify(err): puede filtrar rutas internas y datos.',
    test: /\.stack\b|JSON\.stringify\(\s*(err|error|e)\s*\)/,
  },
  {
    id: 'storage-write',
    severity: 'low',
    message: 'Escritura en localStorage/sessionStorage: revisar que no guarde tokens, contraseñas ni datos personales.',
    test: /(local|session)Storage\.setItem\(/,
  },
  {
    id: 'insecure-http',
    severity: 'medium',
    message: 'URL http:// (sin TLS) en código fuente. Solo localhost es aceptable.',
    test: /['"`]http:\/\/(?!localhost|127\.0\.0\.1)/,
    // Comparaciones (startsWith('http://')) no son URLs de red.
    skip: /startsWith|includes|indexOf|\.test\(|xmlns/,
  },
];

const walk = (path, out) => {
  const st = statSync(path);
  if (st.isFile()) {
    if (EXTENSIONS.has(extname(path)) && !isVendored(path)) out.push(path);
    return out;
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    walk(join(path, entry.name), out);
  }
  return out;
};

const files = scanRoots.flatMap((r) => walk(r, []));
const findings = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const isStory = /\.stories\.(jsx?|tsx?)$/.test(basename(file));
  lines.forEach((line, idx) => {
    const prev = idx > 0 ? lines[idx - 1] : '';
    if (SECURITY_OK.test(line) || SECURITY_OK.test(prev)) return;
    for (const rule of RULES) {
      if (!rule.test.test(line)) continue;
      if (rule.skip && rule.skip.test(line)) continue;
      // Comentarios de código no son ejecución ni tráfico.
      if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;
      // En stories, secretos/URL/console de demo son ruido (los onClick de ejemplo loguean a propósito).
      if (isStory && ['secret-literal', 'insecure-http', 'console-leak'].includes(rule.id)) continue;
      const detail = rule.check ? rule.check(lines, idx) : null;
      if (rule.check && detail === null) continue;
      findings.push({
        file: relative(ROOT, file).replaceAll('\\', '/'),
        line: idx + 1,
        rule: rule.id,
        severity: rule.severity,
        message: detail ? `${rule.message} (${detail})` : rule.message,
        snippet: line.trim().slice(0, 140),
      });
    }
  });
}

const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);

const counts = { high: 0, medium: 0, low: 0 };
for (const f of findings) counts[f.severity]++;

console.log(`check-security: ${files.length} archivos revisados, ${findings.length} hallazgos ` +
  `(high ${counts.high}, medium ${counts.medium}, low ${counts.low}).`);
for (const f of findings) {
  console.log(`\n[${f.severity.toUpperCase()}] ${f.file}:${f.line}  ${f.rule}\n  ${f.message}\n  > ${f.snippet}`);
}
if (findings.length) {
  console.log('\nPara una excepción legítima, agregar `security-ok: <motivo>` en la línea o en la anterior.');
}
if (strict && counts.high > 0) {
  console.error(`\ncheck-security --strict: ${counts.high} hallazgo(s) high.`);
  process.exit(1);
}
