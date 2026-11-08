// Valida un File contra un atributo `accept` de <input type="file">: ".pdf,.xlsx", "image/*", "text/csv".
// Sin accept se acepta todo.
export function matchesAccept(file, accept) {
  if (!accept) return true;
  const rules = accept.split(',').map((rule) => rule.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

// Ctrl+V dentro de un campo de texto debe seguir pegando texto, no cargar un archivo.
export function isEditableTarget(target) {
  if (!target || !target.tagName) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
}
