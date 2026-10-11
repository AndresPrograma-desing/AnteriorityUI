// Entry point corto para buscar íconos de react-icons sin conocer de antemano en qué pack
// vive cada uno: import { findIcons } from 'anteriority-ui/common/icons'. Re-exporta el
// registro real, que vive junto a los 31 packs generados en screens/components/Icons/.
export { findIcons } from '../../screens/components/Icons/findIcons';
export { ICON_PACKS, ICON_PACK_NAMES } from '../../screens/components/Icons/registry';
