import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Audio',
  component: MediaViewer,
};

export const Audio = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    name: 'rugido-trex.mp3',
  },
};

export const AudioLargo = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
  },
};

// Con `senderName` (y/o `senderAvatar`) la insignia de música se reemplaza por el Avatar de la
// librería, para identificar quién envió el audio: iniciales con color generado del nombre...
export const AudioConRemitente = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    senderName: 'Jane Doe',
  },
};

// ...o la foto del remitente (si la imagen no carga, cae a las iniciales).
export const AudioConRemitenteYFoto = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    senderName: 'Jane Doe',
    senderAvatar: 'https://picsum.photos/seed/remitente/80/80',
  },
};

export const AudioColoresPersonalizados = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    bgColor: '#fdf4ff',
    borderColor: '#f3e8ff',
    audioAccentColor: '#a855f7',
    audioControlsColor: '#581c87',
    audioIconBgColor: '#f3e8ff',
  },
};

export const AudioControlesNativos = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    controls: false,
  },
};
