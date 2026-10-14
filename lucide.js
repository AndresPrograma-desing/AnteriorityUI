// Re-exporta lucide-react completo para que un consumidor de anteriority-ui
// no necesite instalar lucide-react por su cuenta (ya es dependency de esta
// librería, así que llega transitivamente): `import { Home } from
// 'anteriority-ui/lucide'` en vez de `from 'lucide-react'`.
export * from 'lucide-react';
