import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Video',
  component: MediaViewer,
};

export const Video = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-poster/640/360',
  },
};

export const VideoColoresPersonalizados = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-poster-custom/640/360',
    videoBgColor: '#1a0f2e',
    videoAccentColor: '#a855f7',
    videoControlsColor: '#f3e8ff',
  },
};

export const VideoSinPiP = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-no-pip/640/360',
    videoPip: false,
  },
};

export const VideoLargo = {
  args: {
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
};

export const VideoControlesNativos = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-native/640/360',
    controls: false,
  },
};
