import { ICON_PACKS, ICON_PACK_NAMES } from './registry';

// Busca `query` (substring, case-insensitive) en el nombre de ícono de TODOS los packs
// de react-icons empaquetados, sin que el caller necesite saber de antemano en qué pack
// vive cada uno. Devuelve todos los matches encontrados, no solo el primero, porque el
// mismo término puede existir en más de un pack con logos/estilos distintos (ej. "csharp"
// no está en Simple Icons pero sí como TbBrandCSharp en Tabler Icons).
export function findIcons(query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return [];

  const results = [];
  for (const packName of ICON_PACK_NAMES) {
    const pack = ICON_PACKS[packName];
    for (const name of Object.keys(pack)) {
      if (name.toLowerCase().includes(q)) {
        results.push({ pack: packName, name, Icon: pack[name] });
      }
    }
  }
  return results;
}
