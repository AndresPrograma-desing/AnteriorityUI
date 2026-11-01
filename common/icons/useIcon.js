import { useEffect, useState } from 'react';

// Resolución de íconos por nombre (FaReact, SiDocker, LuHome...) con carga PEREZOSA de los 31
// packs de react-icons: el registro solo se importa la primera vez que se pide un ícono, así
// los componentes livianos que lo usan (Text, MarkdownContent) no arrastran todos los packs
// en su bundle inicial. Los nombres llevan prefijo de pack, por lo que el nombre es único.
let iconMap = null;
let loadPromise = null;

function loadIconMap() {
  if (!loadPromise) {
    loadPromise = import('../../screens/components/Icons/registry.js').then(({ ICON_PACKS }) => {
      const map = new Map();
      for (const pack of Object.values(ICON_PACKS)) {
        for (const [name, Icon] of Object.entries(pack)) {
          if (typeof Icon === 'function' && !map.has(name)) map.set(name, Icon);
        }
      }
      iconMap = map;
      return map;
    });
  }
  return loadPromise;
}

export function getIconSync(name) {
  return (name && iconMap?.get(name)) || null;
}

export function useIcon(name) {
  const [Icon, setIcon] = useState(() => getIconSync(name));

  useEffect(() => {
    if (!name) {
      setIcon(null);
      return undefined;
    }
    const cached = getIconSync(name);
    if (cached) {
      setIcon(() => cached);
      return undefined;
    }
    let cancelled = false;
    loadIconMap().then((map) => {
      if (!cancelled) setIcon(() => map.get(name) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  return Icon;
}
