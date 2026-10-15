import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Camera } from 'lucide-react';
import { getAvatarInitial, stringToColor } from './utils'; 
import styles from './index.module.css';
import ModalTooltip from '../../ModalTooltip/ModalTooltip';
import AlertModal from '../../AlertModal/AlertModal';
import Loading from '../../Loading/index';

export default function UserAvatar({ 
  src, 
  name = 'Usuario', 
  size = 35, 
  editable = false, 
  onEditClick = () => {},
  loading = false,
  viewable = false,
  isActive = null,
  fallbackBgColor,
  activeStatusColor = '#10b981',
  inactiveStatusColor = '#ef4444',
  className = '',
  style
}) {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  if (loading) {
    return (
      <div
        className={className || undefined}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '50%',
          ...style
        }}
      >
        <Loading size="small" />
      </div>
    );
  }

  const initial = getAvatarInitial(name);
  const backgroundColor = stringToColor(name);

  const avatarElement = (
    <Avatar
      alt={name}
      src={src || undefined}
      className={styles.avatarContainer}
      sx={{
        width: size,
        height: size,
        fontSize: `${size * 0.43}px`,
        bgcolor: src ? 'transparent' : backgroundColor,
      }}
    >
      <span className={styles.fallbackText}>
        {initial}
      </span>
    </Avatar>
  );

  return (
    <>
      <div 
        className={`${styles.avatarWrapper}
        ${editable ? styles.editable : ''}
        ${viewable && src ? styles.viewable : ''}
        ${className}`.trim()}
        onClick={(e) => {
          if (editable) {
            if (typeof onEditClick === 'function') {
              onEditClick(e);
            }
          } else if (viewable && src) {
            setIsFullViewOpen(true);
          }
        }}
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'inline-flex',
          ...(fallbackBgColor ? { '--avatar-fallback-bg': fallbackBgColor } : {}),
          ...style,
        }}
      >
        {editable ? (
          <ModalTooltip text='Cambiar Foto de Perfil' position="top">
            {avatarElement}
            <div className={styles.overlay}>
              <Camera size={size * 0.45} />
            </div>
          </ModalTooltip>
        ) : viewable && src ? (
          <ModalTooltip text='Toca para ver imagen'>
            {avatarElement}
          </ModalTooltip>
        ) : (
          avatarElement
        )}

        {isActive !== null && isActive !== undefined && (
          
          <span 
            className={styles.statusDot} 
            style={{
              backgroundColor: isActive ? activeStatusColor : inactiveStatusColor,
              width: `${Math.max(8, size * 0.22)}px`,
              height: `${Math.max(8, size * 0.22)}px`,
            }} 
          />
        )}
      </div>

      <AlertModal 
        open={isFullViewOpen}
        title="Foto de Perfil"
        imageUrl={src}
        onClose={() => setIsFullViewOpen(false)}
        showWarningIcon={false}
        confirmText="Cerrar"
      />
    </>
  );
}