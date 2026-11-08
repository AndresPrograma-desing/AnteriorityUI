import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import ScrollBar from '../../../../../ScrollBar/index';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import {
  Copy, Scissors, Pencil, CalendarDays, CalendarPlus, Clock, ShieldCheck, Eraser, Sigma, ListPlus, Table2, FileJson, FileSpreadsheet, Rows3, Columns3, SquareDashedMousePointer,
} from 'lucide-react';

// Lista del menú dentro del ScrollBar de la librería (en vez de la barra de scroll nativa del navegador cuando el
// menú no entra en pantalla). Reenvía todo a MenuList para conservar el foco y la navegación por teclado de MUI.
const MENU_MAX_HEIGHT = 'calc(100vh - 48px)';
const ScrollableMenuList = React.forwardRef(function ScrollableMenuList(props, ref) {
  return (
    <ScrollBar maxHeight={MENU_MAX_HEIGHT} horizontal={false}>
      <MenuList {...props} ref={ref} />
    </ScrollBar>
  );
});

// Menú contextual (click derecho) del visor de hojas de cálculo. Se monta en un portal, así que los
// colores se aplican directo (las CSS custom properties del visor no llegan hasta acá).
const XlsxContextMenu = ({
  position,
  onClose,
  onAction,
  labels,
  editable = false,
  canAutosum = false,
  cellKind = 'other',
  validationPanel = null,
  bgColor,
  textColor,
  accentColor,
  borderColor,
}) => {
  // Panel lateral de «Validar datos…»: se abre pegado al ítem, a la derecha del menú (o a la izquierda si no hay
  // lugar), sin cerrar el menú. Se cierra solo cuando el menú se cierra.
  const [flyout, setFlyout] = useState(null);
  useEffect(() => {
    if (!position) setFlyout(null);
  }, [position]);

  const openFlyout = (event) => {
    const anchorEl = event.currentTarget;
    const box = anchorEl.getBoundingClientRect();
    setFlyout({ anchorEl, toLeft: box.right + 340 > window.innerWidth && box.left > 340 });
  };

  const run = (action) => () => {
    onClose();
    onAction(action);
  };

  const itemSx = {
    fontSize: '0.85rem',
    py: 1,
    px: 1.75,
    gap: 0.5,
    color: textColor,
    '&:hover': { backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`, color: accentColor },
  };
  const iconSx = { minWidth: 28, color: 'inherit' };

  return (
    <>
    <Menu
      open={Boolean(position)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position ? { top: position.y, left: position.x } : undefined}
      onContextMenu={(event) => {
        event.preventDefault();
        onClose();
      }}
      slots={{ list: ScrollableMenuList }}
      slotProps={{
        paper: {
          style: {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 32px)',
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: '10px',
            minWidth: '220px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      }}
    >
      <MenuItem sx={itemSx} onClick={run('copy')}>
        <ListItemIcon sx={iconSx}><Copy size={16} /></ListItemIcon>
        {labels.copy}
      </MenuItem>
      {editable && (
        <MenuItem sx={itemSx} onClick={run('cut')}>
          <ListItemIcon sx={iconSx}><Scissors size={16} /></ListItemIcon>
          {labels.cut}
        </MenuItem>
      )}
      <MenuItem sx={itemSx} onClick={run('copyWithHeaders')}>
        <ListItemIcon sx={iconSx}><Table2 size={16} /></ListItemIcon>
        {labels.copyWithHeaders}
      </MenuItem>
      <MenuItem sx={itemSx} onClick={run('copyCsv')}>
        <ListItemIcon sx={iconSx}><FileSpreadsheet size={16} /></ListItemIcon>
        {labels.copyCsv}
      </MenuItem>
      <MenuItem sx={itemSx} onClick={run('copyJson')}>
        <ListItemIcon sx={iconSx}><FileJson size={16} /></ListItemIcon>
        {labels.copyJson}
      </MenuItem>
      {editable && <Divider sx={{ borderColor }} />}
      {editable && (
        <MenuItem sx={itemSx} onClick={run('edit')}>
          <ListItemIcon sx={iconSx}><Pencil size={16} /></ListItemIcon>
          {labels.edit}
        </MenuItem>
      )}
      {editable && cellKind === 'date' && (
        <MenuItem sx={itemSx} onClick={run('editDate')}>
          <ListItemIcon sx={iconSx}><CalendarDays size={16} /></ListItemIcon>
          {labels.editDate}
        </MenuItem>
      )}
      {editable && cellKind === 'empty' && (
        <MenuItem sx={itemSx} onClick={run('editDate')}>
          <ListItemIcon sx={iconSx}><CalendarDays size={16} /></ListItemIcon>
          {labels.pickDate}
        </MenuItem>
      )}
      {editable && cellKind === 'empty' && (
        <MenuItem sx={itemSx} onClick={run('insertToday')}>
          <ListItemIcon sx={iconSx}><CalendarPlus size={16} /></ListItemIcon>
          {labels.insertToday}
        </MenuItem>
      )}
      {editable && cellKind === 'empty' && (
        <MenuItem sx={itemSx} onClick={run('insertNow')}>
          <ListItemIcon sx={iconSx}><Clock size={16} /></ListItemIcon>
          {labels.insertNow}
        </MenuItem>
      )}
      {editable && (
        <MenuItem sx={itemSx} onClick={run('clear')}>
          <ListItemIcon sx={iconSx}><Eraser size={16} /></ListItemIcon>
          {labels.clear}
        </MenuItem>
      )}
      {editable && (
        <MenuItem sx={itemSx} onClick={run('addRows')}>
          <ListItemIcon sx={iconSx}><ListPlus size={16} /></ListItemIcon>
          {labels.addRows}
        </MenuItem>
      )}
      {editable && canAutosum && (
        <MenuItem sx={itemSx} onClick={run('autosum')}>
          <ListItemIcon sx={iconSx}><Sigma size={16} /></ListItemIcon>
          {labels.autosum}
        </MenuItem>
      )}
      {editable && (
        <MenuItem sx={itemSx} onClick={openFlyout} aria-haspopup="dialog" aria-expanded={Boolean(flyout)}>
          <ListItemIcon sx={iconSx}><ShieldCheck size={16} /></ListItemIcon>
          {labels.validate}
        </MenuItem>
      )}
      <Divider sx={{ borderColor }} />
      <MenuItem sx={itemSx} onClick={run('selectRow')}>
        <ListItemIcon sx={iconSx}><Rows3 size={16} /></ListItemIcon>
        {labels.selectRow}
      </MenuItem>
      <MenuItem sx={itemSx} onClick={run('selectColumn')}>
        <ListItemIcon sx={iconSx}><Columns3 size={16} /></ListItemIcon>
        {labels.selectColumn}
      </MenuItem>
      <MenuItem sx={itemSx} onClick={run('selectAll')}>
        <ListItemIcon sx={iconSx}><SquareDashedMousePointer size={16} /></ListItemIcon>
        {labels.selectAll}
      </MenuItem>
    </Menu>
    <Popover
      open={Boolean(flyout && validationPanel)}
      anchorEl={flyout ? flyout.anchorEl : null}
      onClose={() => setFlyout(null)}
      anchorOrigin={{ vertical: 'top', horizontal: flyout && flyout.toLeft ? 'left' : 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: flyout && flyout.toLeft ? 'right' : 'left' }}
      slotProps={{
        paper: {
          style: {
            overflow: 'hidden', // sin scroll nativo: el panel scrollea con el ScrollBar de la librería
            maxHeight: 'calc(100vh - 16px)',
            borderRadius: '12px',
            margin: flyout && flyout.toLeft ? '0 -4px' : '0 4px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      }}
    >
      {validationPanel}
    </Popover>
    </>
  );
};

export default XlsxContextMenu;
