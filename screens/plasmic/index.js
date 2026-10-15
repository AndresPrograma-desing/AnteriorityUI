import Button from '../components/Button/index.js';
import CardV1 from '../components/CardV1/index.js';
import ToggleCard from '../components/ToggleCard/index.js';
import Container from '../components/Container/index.js';
import Callout from '../components/Callout/index.js';
import Badge from '../components/Badge/index.js';
import Input from '../components/Input/index.js';
import Swich from '../components/Swich/index.js';
import Skeleton from '../components/Skeleton/index.js';
import Avatar from '../components/Avatar/index.js';
import Breadcrumbs from '../components/Breadcrumbs/index.js';
import DateTag from '../components/DateTag/index.js';
import CopyText from '../components/CopyText/index.js';
import SummaryCard from '../components/SummaryCard/index.js';
import Barnner from '../components/Barnner/index.js';
import BlueLink from '../components/BlueLink/index.js';
import Checks from '../components/Checks/index.js';
import ColorPicker from '../components/ColorPicker/index.js';
import Loading from '../components/Loading/index.js';
import TopBar from '../components/TopBar/index.js';
import AlertModal from '../components/AlertModal/AlertModal';
import AvatarChip, { AvatarChipGroup } from '../components/AvatarChip/index';
import CalendarComponent from '../components/CalendarComponent/CustomDatePicker';
import CalendarPicker from '../components/CalendarPicker/index';
import ChatWindow from '../components/ChatWindow/index';
import CommandPalette from '../components/CommandPalette/index';
import CountdownBar from '../components/CountdownBar/index';
import DesplegablePanel from '../components/DesplegablePanel/index';
import DrawPanel from '../components/DrawPanel/index';
import Filter from '../components/Filter/index';
import { FormCard, FormInput, FormTextArea } from '../components/FormControls/index';
import Frame from '../components/Frame/index';
import GreenHighlight from '../components/GreenHighlight/index';
import HoursPicker from '../components/HoursPicker/index';
import ImagePastePreview from '../components/ImagePastePreview/index';
import InfoTooltip from '../components/InfoTooltip/index';
import MarkdownContent from '../components/MarkdownContent/index';
import MarkdownEditor from '../components/MarkdownEditor/index';
import InputWithIcon from '../components/Material-UI/Components/InputWithIcon/index';
import MenuPopover from '../components/Material-UI/Components/MenuPopover/index';
import MultilinePlaceholder from '../components/Material-UI/Components/MultilinePlaceholder/index';
import Paginador from '../components/Material-UI/Components/Paginador/index';
import Search from '../components/Material-UI/Components/Search/index';
import Selector from '../components/Material-UI/Components/Selector/index';
import TextField from '../components/Material-UI/Components/TextField/index';
import ModalTooltip from '../components/ModalTooltip/ModalTooltip';
import ErrorMessage from '../components/Notification/Error/ErrorMessage';
import NotificationsPanel from '../components/NotificationsPanel/index';
import PasswordResetPanel from '../components/PasswordResetPanel/index';
import PasteImageField from '../components/PasteImageField/index';
import PlaceholderButton from '../components/PlaceholderButton/index';
import Profile from '../components/Profile/index';
import ProfileAvatar from '../components/Profile/Avatar/index';
import ScrollBar from '../components/ScrollBar/index';
import Sidebar from '../components/Sidebar/index';
import Slider from '../components/Slider/index';
import SubSidebarLayout from '../components/SubSidebarLayout/index';
import TableA from '../components/TableA/index';
import TableB from '../components/TableB/index';
import UserEditPopover from '../components/UserEditPopover/index';
import Text from '../components/Text/index';

/**
 * Registra los componentes del catálogo de AnteriorityUI en Plasmic Loader.
 * Permite que cualquier aplicación que consuma anteriority-ui pueda arrastrar
 * y configurar estos componentes visualmente en Plasmic Studio.
 *
 * @param {any} plasmic Instancia de PlasmicComponentLoader (initPlasmicLoader)
 */
export function registerAnteriority(plasmic) {
  if (!plasmic || typeof plasmic.registerComponent !== 'function') {
    throw new Error('registerAnteriority requiere una instancia válida de PlasmicLoader.');
  }

  // 1. Button
  plasmic.registerComponent(Button, {
    name: 'AnteriorityButton',
    displayName: 'Button',
    props: {
      children: { type: 'slot', defaultValue: 'Botón' },
      variant: {
        type: 'choice',
        options: ['contained', 'outlined', 'ghost', 'action', 'danger', 'delete', 'icon'],
        defaultValue: 'contained',
      },
      disabled: { type: 'boolean', defaultValue: false },
    },
  });

  // 2. CardV1
  plasmic.registerComponent(CardV1, {
    name: 'AnteriorityCardV1',
    displayName: 'CardV1',
    props: {
      primaryText: { type: 'string', defaultValue: 'Título de Tarjeta' },
      secondaryText: { type: 'string', defaultValue: 'Descripción secundaria' },
      badgeText: { type: 'string', defaultValue: 'Activo' },
      variant: { type: 'choice', options: ['default', 'glass-pink-green'], defaultValue: 'default' },
      children: { type: 'slot' },
    },
  });

  // 3. Container
  plasmic.registerComponent(Container, {
    name: 'AnteriorityContainer',
    displayName: 'Container',
    props: {
      children: { type: 'slot' },
      wattermark: { type: 'boolean', defaultValue: true },
      borderColor: { type: 'string' },
      bgImage: { type: 'imageUrl' },
      blurBackground: { type: 'boolean', defaultValue: false },
    },
  });

  // 4. Callout
  plasmic.registerComponent(Callout, {
    name: 'AnteriorityCallout',
    displayName: 'Callout',
    props: {
      title: { type: 'string', defaultValue: 'Aviso' },
      children: { type: 'slot', defaultValue: 'Mensaje de notificación o aviso' },
      variant: { type: 'choice', options: ['info', 'success', 'warning', 'error'], defaultValue: 'info' },
    },
  });

  // 5. Badge
  plasmic.registerComponent(Badge, {
    name: 'AnteriorityBadge',
    displayName: 'Badge',
    props: {
      label: { type: 'string', defaultValue: 'Estado' },
      value: { type: 'string', defaultValue: 'Activo' },
      bgColor: { type: 'string' },
      borderColor: { type: 'string' },
    },
  });

  // 6. Input
  plasmic.registerComponent(Input, {
    name: 'AnteriorityInput',
    displayName: 'Input',
    props: {
      label: { type: 'string', defaultValue: 'Campo de texto' },
      helperText: { type: 'string' },
      required: { type: 'boolean', defaultValue: false },
      numeric: { type: 'boolean', defaultValue: false },
    },
  });

  // 7. Swich
  plasmic.registerComponent(Swich, {
    name: 'AnterioritySwitch',
    displayName: 'Switch',
    props: {
      value: { type: 'boolean', defaultValue: false },
      disabled: { type: 'boolean', defaultValue: false },
      showLabels: { type: 'boolean', defaultValue: false },
    },
  });

  // 8. Skeleton
  plasmic.registerComponent(Skeleton, {
    name: 'AnterioritySkeleton',
    displayName: 'Skeleton',
    props: {
      width: { type: 'string', defaultValue: '100%' },
      height: { type: 'string', defaultValue: '20px' },
      radius: { type: 'string', defaultValue: '6px' },
      circle: { type: 'boolean', defaultValue: false },
    },
  });

  // 9. Avatar
  plasmic.registerComponent(Avatar, {
    name: 'AnteriorityAvatar',
    displayName: 'Avatar',
    props: {
      name: { type: 'string', defaultValue: 'Usuario' },
      src: { type: 'string' },
      size: { type: 'choice', options: ['small', 'medium', 'large'], defaultValue: 'medium' },
      shape: { type: 'choice', options: ['circle', 'square'], defaultValue: 'circle' },
    },
  });

  // 10. ToggleCard
  plasmic.registerComponent(ToggleCard, {
    name: 'AnteriorityToggleCard',
    displayName: 'ToggleCard',
    props: {
      title: { type: 'string', defaultValue: 'Tarjeta Seleccionable' },
      backgroundColor: { type: 'string', defaultValue: '#171a21' },
      titleColor: { type: 'string', defaultValue: '#e6e8ec' },
    },
  });

  // 11. Breadcrumbs
  plasmic.registerComponent(Breadcrumbs, {
    name: 'AnteriorityBreadcrumbs',
    displayName: 'Breadcrumbs',
    props: {
      separator: { type: 'string', defaultValue: '/' },
    },
  });

  // 12. DateTag
  plasmic.registerComponent(DateTag, {
    name: 'AnteriorityDateTag',
    displayName: 'DateTag',
    props: {
      date: { type: 'string', defaultValue: '2026-10-14' },
    },
  });

  // 13. CopyText
  plasmic.registerComponent(CopyText, {
    name: 'AnteriorityCopyText',
    displayName: 'CopyText',
    props: {
      text: { type: 'string', defaultValue: 'Texto para copiar' },
    },
  });

  // 14. SummaryCard
  plasmic.registerComponent(SummaryCard, {
    name: 'AnterioritySummaryCard',
    displayName: 'SummaryCard',
    props: {
      title: { type: 'string', defaultValue: 'Resumen' },
      children: { type: 'slot' },
    },
  });

  // 15. Barnner
  plasmic.registerComponent(Barnner, {
    name: 'AnteriorityBanner',
    displayName: 'Banner',
    props: {
      title: { type: 'string', defaultValue: 'Banner de bienvenida' },
      description: { type: 'string', defaultValue: 'Descripción del banner' },
    },
  });

  // 16. BlueLink
  plasmic.registerComponent(BlueLink, {
    name: 'AnteriorityBlueLink',
    displayName: 'BlueLink',
    props: {
      children: { type: 'slot', defaultValue: 'Enlace' },
      href: { type: 'string', defaultValue: '#' },
    },
  });

  // 17. Checks
  plasmic.registerComponent(Checks, {
    name: 'AnteriorityChecks',
    displayName: 'Checks',
    props: {
      label: { type: 'string', defaultValue: 'Opción' },
      checked: { type: 'boolean', defaultValue: false },
    },
  });

  // 18. ColorPicker
  plasmic.registerComponent(ColorPicker, {
    name: 'AnteriorityColorPicker',
    displayName: 'ColorPicker',
    props: {
      color: { type: 'string', defaultValue: '#0099e6' },
    },
  });

  // 19. Loading
  plasmic.registerComponent(Loading, {
    name: 'AnteriorityLoading',
    displayName: 'Loading',
    props: {
      label: { type: 'string', defaultValue: 'Cargando...' },
    },
  });

  // 20. TopBar
  plasmic.registerComponent(TopBar, {
    name: 'AnteriorityTopBar',
    displayName: 'TopBar',
    props: {
      title: { type: 'string', defaultValue: 'Barra Superior' },
      children: { type: 'slot' },
    },
  });

  // 21. AlertModal
  plasmic.registerComponent(AlertModal, {
    name: 'AnteriorityAlertModal',
    displayName: 'AlertModal',
    props: {
      open: { type: 'boolean', defaultValue: true },
      title: { type: 'string', defaultValue: 'Alerta' },
      message: { type: 'string', defaultValue: '' },
      confirmText: { type: 'string', defaultValue: 'Ok' },
      cancelText: { type: 'string', defaultValue: 'Cancelar' },
      hideActions: { type: 'boolean', defaultValue: false },
      showWarningIcon: { type: 'boolean', defaultValue: true },
      children: { type: 'slot' },
      bgColor: { type: 'string' },
      titleBorderColor: { type: 'string' },
    },
  });

  // 22. AvatarChip
  plasmic.registerComponent(AvatarChip, {
    name: 'AnteriorityAvatarChip',
    displayName: 'AvatarChip',
    props: {
      name: { type: 'string', defaultValue: 'Usuario' },
      label: { type: 'string' },
      src: { type: 'string' },
      variant: { type: 'choice', options: ['filled', 'outlined'], defaultValue: 'filled' },
      size: { type: 'choice', options: ['small', 'medium', 'large'], defaultValue: 'medium' },
      expandOnHover: { type: 'boolean', defaultValue: false },
      disabled: { type: 'boolean', defaultValue: false },
      bgColor: { type: 'string' },
      textColor: { type: 'string' },
      borderColor: { type: 'string' },
    },
  });

  // 23. AvatarChipGroup
  plasmic.registerComponent(AvatarChipGroup, {
    name: 'AnteriorityAvatarChipGroup',
    displayName: 'AvatarChipGroup',
    props: {
      children: { type: 'slot' },
      direction: { type: 'choice', options: ['row', 'column'], defaultValue: 'row' },
      spacing: { type: 'number', defaultValue: 8 },
      wrap: { type: 'boolean', defaultValue: true },
    },
  });

  // 24. CalendarComponent
  plasmic.registerComponent(CalendarComponent, {
    name: 'AnteriorityCalendarComponent',
    displayName: 'CalendarComponent',
    props: {
      label: { type: 'string', defaultValue: 'Fecha' },
      required: { type: 'boolean', defaultValue: false },
      disabled: { type: 'boolean', defaultValue: false },
      selectedColor: { type: 'string' },
      accentColor: { type: 'string' },
    },
  });

  // 25. CalendarPicker
  plasmic.registerComponent(CalendarPicker, {
    name: 'AnteriorityCalendarPicker',
    displayName: 'CalendarPicker',
    props: {
      label: { type: 'string', defaultValue: 'Fecha' },
      required: { type: 'boolean', defaultValue: false },
      disabled: { type: 'boolean', defaultValue: false },
      range: { type: 'boolean', defaultValue: false },
      selectedColor: { type: 'string' },
      accentColor: { type: 'string' },
    },
  });

  // 26. ChatWindow
  plasmic.registerComponent(ChatWindow, {
    name: 'AnteriorityChatWindow',
    displayName: 'ChatWindow',
    props: {
      isTyping: { type: 'boolean', defaultValue: false },
      showHeader: { type: 'boolean', defaultValue: true },
      isMobile: { type: 'boolean', defaultValue: false },
      isLoading: { type: 'boolean', defaultValue: false },
      placeholder: { type: 'string', defaultValue: 'Escribe tu mensaje aquí...' },
      accentColor: { type: 'string' },
      accentColorDark: { type: 'string' },
    },
  });

  // 27. CommandPalette
  plasmic.registerComponent(CommandPalette, {
    name: 'AnteriorityCommandPalette',
    displayName: 'CommandPalette',
    props: {
      open: { type: 'boolean', defaultValue: true },
      placeholder: { type: 'string', defaultValue: 'Buscar...' },
      emptyMessage: { type: 'string', defaultValue: 'No se encontraron resultados.' },
      maxHeight: { type: 'number', defaultValue: 360 },
      isLoading: { type: 'boolean', defaultValue: false },
      loadingType: { type: 'choice', options: ['spinner', 'skeleton'], defaultValue: 'spinner' },
      bgColor: { type: 'string' },
      textColor: { type: 'string' },
      accentColor: { type: 'string' },
    },
  });

  // 28. CountdownBar
  plasmic.registerComponent(CountdownBar, {
    name: 'AnteriorityCountdownBar',
    displayName: 'CountdownBar',
    props: {
      active: { type: 'boolean', defaultValue: true },
      duration: { type: 'number', defaultValue: 10000 },
      height: { type: 'string', defaultValue: '6px' },
      width: { type: 'string', defaultValue: '100%' },
      increment: { type: 'boolean', defaultValue: false },
      isOverlay: { type: 'boolean', defaultValue: false },
      overlayMessage: { type: 'string' },
    },
  });

  // 29. DesplegablePanel
  plasmic.registerComponent(DesplegablePanel, {
    name: 'AnteriorityDesplegablePanel',
    displayName: 'DesplegablePanel',
    props: {
      title: { type: 'string', defaultValue: 'Sección' },
      description: { type: 'string' },
      isOpen: { type: 'boolean', defaultValue: false },
      children: { type: 'slot', defaultValue: 'Contenido expandible' },
      iconColor: { type: 'string' },
      iconBgColor: { type: 'string' },
    },
  });

  // 30. DrawPanel
  plasmic.registerComponent(DrawPanel, {
    name: 'AnteriorityDrawPanel',
    displayName: 'DrawPanel',
    props: {
      isOpen: { type: 'boolean', defaultValue: true },
      title: { type: 'string', defaultValue: 'Panel' },
      description: { type: 'string' },
      descriptionPosition: { type: 'choice', options: ['top', 'bottom'], defaultValue: 'top' },
      children: { type: 'slot', defaultValue: 'Contenido del panel' },
      width: { type: 'string', defaultValue: '400px' },
      showActions: { type: 'boolean', defaultValue: false },
      confirmText: { type: 'string', defaultValue: 'Confirmar' },
      cancelText: { type: 'string', defaultValue: 'Cancelar' },
      loading: { type: 'boolean', defaultValue: false },
      anchor: { type: 'choice', options: ['right', 'top'], defaultValue: 'right' },
      panelColor: { type: 'string', defaultValue: '#ffffff' },
      textColor: { type: 'string', defaultValue: '#0f172a' },
      borderColor: { type: 'string', defaultValue: '#e2e8f0' },
    },
  });

  // 31. Filter
  plasmic.registerComponent(Filter, {
    name: 'AnteriorityFilter',
    displayName: 'Filter',
    props: {
      children: { type: 'slot', defaultValue: 'Campos de filtro' },
      title: { type: 'string', defaultValue: 'Filtros' },
      searchTerm: { type: 'string', defaultValue: '' },
      width: { type: 'string', defaultValue: '350px' },
      activeFiltersCount: { type: 'number', defaultValue: 0 },
      badgeColor: { type: 'string' },
    },
  });

  // 32. FormCard
  plasmic.registerComponent(FormCard, {
    name: 'AnteriorityFormCard',
    displayName: 'FormCard',
    props: {
      title: { type: 'string', defaultValue: 'Título de formulario' },
      children: { type: 'slot', defaultValue: 'Contenido del formulario' },
      iconColor: { type: 'string' },
    },
  });

  // 33. FormInput
  plasmic.registerComponent(FormInput, {
    name: 'AnteriorityFormInput',
    displayName: 'FormInput',
    props: {
      label: { type: 'string', defaultValue: 'Campo' },
      value: { type: 'string' },
      placeholder: { type: 'string' },
    },
  });

  // 34. FormTextArea
  plasmic.registerComponent(FormTextArea, {
    name: 'AnteriorityFormTextArea',
    displayName: 'FormTextArea',
    props: {
      label: { type: 'string', defaultValue: 'Campo' },
      value: { type: 'string' },
      placeholder: { type: 'string' },
    },
  });

  // 35. Frame
  plasmic.registerComponent(Frame, {
    name: 'AnteriorityFrame',
    displayName: 'Frame',
    props: {
      title: { type: 'string' },
      content: { type: 'string' },
      error: { type: 'string' },
      children: { type: 'slot' },
      isModal: { type: 'boolean', defaultValue: false },
      isLoading: { type: 'boolean', defaultValue: false },
      loadingType: { type: 'choice', options: ['spinner', 'skeleton'], defaultValue: 'spinner' },
      scrollable: { type: 'boolean', defaultValue: false },
      bgColor: { type: 'string' },
      iconColor: { type: 'string' },
    },
  });

  // 36. GreenHighlight
  plasmic.registerComponent(GreenHighlight, {
    name: 'AnteriorityGreenHighlight',
    displayName: 'GreenHighlight',
    props: {
      children: { type: 'slot', defaultValue: 'Texto resaltado' },
      textColor: { type: 'string' },
      bgColor: { type: 'string' },
    },
  });

  // 37. HoursPicker
  plasmic.registerComponent(HoursPicker, {
    name: 'AnteriorityHoursPicker',
    displayName: 'HoursPicker',
    props: {
      label: { type: 'string', defaultValue: 'Hora' },
      required: { type: 'boolean', defaultValue: false },
      disabled: { type: 'boolean', defaultValue: false },
      range: { type: 'boolean', defaultValue: false },
      format24h: { type: 'boolean', defaultValue: false },
      selectedColor: { type: 'string', defaultValue: '#10b981' },
      accentColor: { type: 'string', defaultValue: '#0f172a' },
    },
  });

  // 38. ImagePastePreview
  plasmic.registerComponent(ImagePastePreview, {
    name: 'AnteriorityImagePastePreview',
    displayName: 'ImagePastePreview',
    props: {
      label: { type: 'string', defaultValue: 'Imagen pegada' },
      removeLabel: { type: 'string', defaultValue: 'Quitar imagen' },
      borderColor: { type: 'string', defaultValue: '#e2e8f0' },
      labelBgColor: { type: 'string', defaultValue: '#dbeafe' },
      labelTextColor: { type: 'string', defaultValue: '#1e40af' },
    },
  });

  // 39. InfoTooltip
  plasmic.registerComponent(InfoTooltip, {
    name: 'AnteriorityInfoTooltip',
    displayName: 'InfoTooltip',
    props: {
      content: { type: 'string', defaultValue: 'Información adicional' },
      title: { type: 'string' },
      iconSize: { type: 'number', defaultValue: 18 },
      iconColor: { type: 'string', defaultValue: '#94a3b8' },
      width: { type: 'string', defaultValue: '280px' },
    },
  });

  // 40. MarkdownContent
  plasmic.registerComponent(MarkdownContent, {
    name: 'AnteriorityMarkdownContent',
    displayName: 'MarkdownContent',
    props: {
      children: { type: 'string', defaultValue: '# Título\n\nContenido en **markdown**.' },
      linkColor: { type: 'string' },
    },
  });

  // 41. MarkdownEditor
  plasmic.registerComponent(MarkdownEditor, {
    name: 'AnteriorityMarkdownEditor',
    displayName: 'MarkdownEditor',
    props: {
      value: { type: 'string', defaultValue: '' },
      placeholder: { type: 'string', defaultValue: 'Escribí en markdown...' },
      defaultHeight: { type: 'number', defaultValue: 320 },
      activeColor: { type: 'string' },
    },
  });

  // 42. InputWithIcon
  plasmic.registerComponent(InputWithIcon, {
    name: 'AnteriorityInputWithIcon',
    displayName: 'InputWithIcon',
    props: {
      label: { type: 'string', defaultValue: 'Campo' },
      value: { type: 'string' },
      placeholder: { type: 'string' },
      type: { type: 'string', defaultValue: 'text' },
      variant: { type: 'choice', options: ['standard', 'outlined', 'row', 'filled'], defaultValue: 'outlined' },
      fullWidth: { type: 'boolean', defaultValue: true },
      iconColor: { type: 'string', defaultValue: 'black' },
    },
  });

  // 43. MenuPopover
  plasmic.registerComponent(MenuPopover, {
    name: 'AnteriorityMenuPopover',
    displayName: 'MenuPopover',
    props: {
      isCollapsed: { type: 'boolean', defaultValue: false },
      bgColor: { type: 'string', defaultValue: '#ffffffff' },
      textColor: { type: 'string', defaultValue: '#000000ff' },
      dangerColor: { type: 'string', defaultValue: '#ef4444' },
    },
  });

  // 44. MultilinePlaceholder
  plasmic.registerComponent(MultilinePlaceholder, {
    name: 'AnteriorityMultilinePlaceholder',
    displayName: 'MultilinePlaceholder',
    props: {
      label: { type: 'string', defaultValue: 'Campo' },
      value: { type: 'string' },
      placeholder: { type: 'string' },
      rows: { type: 'number', defaultValue: 4 },
      variant: { type: 'choice', options: ['outlined', 'filled', 'standard'], defaultValue: 'outlined' },
      size: { type: 'choice', options: ['small', 'medium'], defaultValue: 'small' },
      fullWidth: { type: 'boolean', defaultValue: true },
      bgColor: { type: 'string', defaultValue: '#fff' },
      showImagePreview: { type: 'boolean', defaultValue: true },
    },
  });

  // 45. Paginador
  plasmic.registerComponent(Paginador, {
    name: 'AnteriorityPaginador',
    displayName: 'Paginador',
    props: {
      count: { type: 'number', defaultValue: 10 },
      page: { type: 'number', defaultValue: 1 },
      color: { type: 'choice', options: ['primary', 'secondary', 'standard'], defaultValue: 'primary' },
      size: { type: 'choice', options: ['small', 'medium', 'large'], defaultValue: 'medium' },
      disabled: { type: 'boolean', defaultValue: false },
      variant: { type: 'choice', options: ['text', 'outlined'], defaultValue: 'outlined' },
      shape: { type: 'choice', options: ['circular', 'rounded'], defaultValue: 'rounded' },
    },
  });

  // 46. Search
  plasmic.registerComponent(Search, {
    name: 'AnteriorityMuiSearch',
    displayName: 'Search',
    props: {
      label: { type: 'string', defaultValue: 'Buscar' },
      placeholder: { type: 'string', defaultValue: 'Buscar...' },
      loading: { type: 'boolean', defaultValue: false },
      freeSolo: { type: 'boolean', defaultValue: false },
    },
  });

  // 47. Selector
  plasmic.registerComponent(Selector, {
    name: 'AnteriorityMuiSelector',
    displayName: 'Selector',
    props: {
      label: { type: 'string', defaultValue: 'Seleccionar' },
      placeholder: { type: 'string' },
      fullWidth: { type: 'boolean', defaultValue: true },
      required: { type: 'boolean', defaultValue: false },
      requiredColor: { type: 'string', defaultValue: 'red' },
      disableClearable: { type: 'boolean', defaultValue: false },
    },
  });

  // 48. TextField
  plasmic.registerComponent(TextField, {
    name: 'AnteriorityMuiTextField',
    displayName: 'TextField',
    props: {
      label: { type: 'string', defaultValue: 'Campo' },
      value: { type: 'string' },
      placeholder: { type: 'string' },
      type: { type: 'string', defaultValue: 'text' },
      variant: { type: 'choice', options: ['outlined', 'filled', 'standard'], defaultValue: 'outlined' },
      size: { type: 'choice', options: ['small', 'medium'], defaultValue: 'small' },
      fullWidth: { type: 'boolean', defaultValue: true },
      required: { type: 'boolean', defaultValue: false },
      requiredColor: { type: 'string', defaultValue: 'red' },
      bgColor: { type: 'string', defaultValue: '#fff' },
      textColor: { type: 'string', defaultValue: '#0f172a' },
    },
  });

  // 49. ModalTooltip
  plasmic.registerComponent(ModalTooltip, {
    name: 'AnteriorityModalTooltip',
    displayName: 'ModalTooltip',
    props: {
      text: { type: 'string', defaultValue: 'Texto de ayuda' },
      children: { type: 'slot', defaultValue: 'Pasá el mouse acá' },
      position: { type: 'choice', options: ['top', 'bottom'], defaultValue: 'top' },
      delay: { type: 'number', defaultValue: 150 },
      bgColor: { type: 'string' },
      textColor: { type: 'string' },
    },
  });

  // 50. ErrorMessage
  plasmic.registerComponent(ErrorMessage, {
    name: 'AnteriorityErrorMessage',
    displayName: 'ErrorMessage',
    props: {
      message: { type: 'string', defaultValue: 'Ocurrió un error.' },
      title: { type: 'string', defaultValue: 'Atención' },
      variant: { type: 'choice', options: ['danger', 'success'], defaultValue: 'danger' },
      bgColor: { type: 'string' },
      borderColor: { type: 'string' },
    },
  });

  // 51. NotificationsPanel
  plasmic.registerComponent(NotificationsPanel, {
    name: 'AnteriorityNotificationsPanel',
    displayName: 'NotificationsPanel',
    props: {
      title: { type: 'string', defaultValue: 'Notificaciones' },
      emptyMessage: { type: 'string', defaultValue: 'No tenés notificaciones nuevas.' },
      maxHeight: { type: 'number', defaultValue: 380 },
      dismissLabel: { type: 'string', defaultValue: 'Quitar notificación' },
      isModal: { type: 'boolean', defaultValue: false },
      bgColor: { type: 'string' },
      iconColor: { type: 'string' },
      textColor: { type: 'string' },
    },
  });

  // 52. PasswordResetPanel (solo theming: dispara llamadas reales de red, ver CLAUDE.md)
  plasmic.registerComponent(PasswordResetPanel, {
    name: 'AnteriorityPasswordResetPanel',
    displayName: 'PasswordResetPanel',
    props: {
      isOpen: { type: 'boolean', defaultValue: true },
      cancelColor: { type: 'string' },
    },
  });

  // 53. PasteImageField
  plasmic.registerComponent(PasteImageField, {
    name: 'AnteriorityPasteImageField',
    displayName: 'PasteImageField',
    props: {
      children: { type: 'slot', defaultValue: 'Campo de texto' },
      disabled: { type: 'boolean', defaultValue: false },
      showPreview: { type: 'boolean', defaultValue: true },
      previewLabel: { type: 'string', defaultValue: 'Imagen pegada' },
      removeLabel: { type: 'string', defaultValue: 'Quitar imagen' },
      borderColor: { type: 'string', defaultValue: '#e2e8f0' },
    },
  });

  // 54. PlaceholderButton
  plasmic.registerComponent(PlaceholderButton, {
    name: 'AnteriorityPlaceholderButton',
    displayName: 'PlaceholderButton',
    props: {
      placeholder: { type: 'string', defaultValue: 'Agregar valor' },
      buttonText: { type: 'string', defaultValue: 'Guardar' },
      hintText: { type: 'string' },
      initialValue: { type: 'string', defaultValue: '' },
      inputType: { type: 'string', defaultValue: 'number' },
      disabled: { type: 'boolean', defaultValue: false },
      multiline: { type: 'boolean', defaultValue: false },
      focusColor: { type: 'string' },
      unitBgColor: { type: 'string' },
    },
  });

  // 55. Profile
  plasmic.registerComponent(Profile, {
    name: 'AnteriorityProfile',
    displayName: 'Profile',
    props: {
      username: { type: 'string', defaultValue: 'Usuario' },
      avatarUrl: { type: 'string' },
      textColor: { type: 'string', defaultValue: '#ffffff' },
    },
  });

  // 56. ProfileAvatar
  plasmic.registerComponent(ProfileAvatar, {
    name: 'AnteriorityProfileAvatar',
    displayName: 'ProfileAvatar',
    props: {
      src: { type: 'string' },
      name: { type: 'string', defaultValue: 'Usuario' },
      size: { type: 'number', defaultValue: 35 },
      editable: { type: 'boolean', defaultValue: false },
      loading: { type: 'boolean', defaultValue: false },
      viewable: { type: 'boolean', defaultValue: false },
      activeStatusColor: { type: 'string', defaultValue: '#10b981' },
      inactiveStatusColor: { type: 'string', defaultValue: '#ef4444' },
    },
  });

  // 57. ScrollBar (solo layout; children arbitrario)
  plasmic.registerComponent(ScrollBar, {
    name: 'AnteriorityScrollBar',
    displayName: 'ScrollBar',
    props: {
      children: { type: 'slot', defaultValue: 'Contenido con scroll' },
      vertical: { type: 'boolean', defaultValue: true },
      horizontal: { type: 'boolean', defaultValue: true },
      autoHide: { type: 'boolean', defaultValue: true },
      maxHeight: { type: 'string' },
    },
  });

  // 58. Sidebar
  plasmic.registerComponent(Sidebar, {
    name: 'AnteriorityProSidebar',
    displayName: 'Sidebar',
    props: {
      collapsible: { type: 'boolean', defaultValue: true },
      loading: { type: 'boolean', defaultValue: false },
      headerContent: { type: 'slot' },
      footerContent: { type: 'slot' },
      avatarBgColor: { type: 'string' },
      pinnedIconColor: { type: 'string' },
    },
  });

  // 59. Slider
  plasmic.registerComponent(Slider, {
    name: 'AnteriorityCustomSlider',
    displayName: 'Slider',
    props: {
      value: { type: 'number', defaultValue: 0 },
      min: { type: 'number', defaultValue: 0 },
      max: { type: 'number', defaultValue: 100 },
      step: { type: 'number', defaultValue: 1 },
      disabled: { type: 'boolean', defaultValue: false },
      showPercentage: { type: 'boolean', defaultValue: false },
      accentColor: { type: 'string' },
      thickness: { type: 'number', defaultValue: 8 },
    },
  });

  // 60. SubSidebarLayout
  plasmic.registerComponent(SubSidebarLayout, {
    name: 'AnterioritySubSidebarLayout',
    displayName: 'SubSidebarLayout',
    props: {
      children: { type: 'slot', defaultValue: 'Contenido' },
      bgColor: { type: 'string' },
    },
  });

  // 61. TableA (props de datos/código quedan fuera; solo layout y theming)
  plasmic.registerComponent(TableA, {
    name: 'AnteriorityTableA',
    displayName: 'TableA',
    props: {
      loading: { type: 'boolean', defaultValue: false },
      skeletonRows: { type: 'number', defaultValue: 6 },
      emptyMessage: { type: 'string', defaultValue: 'No hay datos disponibles' },
      surfaceColor: { type: 'string' },
      headerColor: { type: 'string' },
      textColor: { type: 'string' },
      borderColor: { type: 'string' },
      stickyHeader: { type: 'boolean', defaultValue: false },
      maxHeight: { type: 'string', defaultValue: '70vh' },
    },
  });

  // 62. TableB (props de datos/código quedan fuera; solo layout y theming)
  plasmic.registerComponent(TableB, {
    name: 'AnteriorityTableB',
    displayName: 'TableB',
    props: {
      loading: { type: 'boolean', defaultValue: false },
      skeletonRows: { type: 'number', defaultValue: 6 },
      emptyMessage: { type: 'string', defaultValue: 'No hay datos disponibles.' },
      rowKey: { type: 'string', defaultValue: 'id' },
      surfaceColor: { type: 'string' },
      headerColor: { type: 'string' },
      textColor: { type: 'string' },
      borderColor: { type: 'string' },
      stickyHeader: { type: 'boolean', defaultValue: false },
      maxHeight: { type: 'string', defaultValue: '70vh' },
    },
  });

  // 63. UserEditPopover (solo theming: dispara llamadas reales de red, ver CLAUDE.md)
  plasmic.registerComponent(UserEditPopover, {
    name: 'AnteriorityUserEditPopover',
    displayName: 'UserEditPopover',
    props: {
      open: { type: 'boolean', defaultValue: true },
      currentName: { type: 'string', defaultValue: 'Usuario' },
      bgColor: { type: 'string' },
      saveColor: { type: 'string' },
      cancelColor: { type: 'string' },
    },
  });

  // 64. Text
  plasmic.registerComponent(Text, {
    name: 'AnteriorityText',
    displayName: 'Text',
    props: {
      children: { type: 'slot', defaultValue: 'Texto' },
      variant: { type: 'choice', options: ['h1', 'h2', 'h3', 'body', 'caption'], defaultValue: 'body' },
      color: { type: 'string' },
      align: { type: 'choice', options: ['left', 'center', 'right'], defaultValue: 'left' },
    },
  });
}

