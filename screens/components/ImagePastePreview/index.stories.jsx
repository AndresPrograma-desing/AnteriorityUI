import React, { useState } from 'react';
import ImagePastePreview from './index';

export default {
  title: 'Components/ImagePastePreview',
  component: ImagePastePreview,
};

const SAMPLE_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const useSamplePreviews = (count) => {
  const [previews, setPreviews] = useState(
    Array.from({ length: count }, (_, i) => ({ id: `sample-${i}`, url: SAMPLE_IMAGE }))
  );
  const onRemove = (id) => setPreviews((current) => current.filter((p) => p.id !== id));
  return { previews, onRemove };
};

export const Default = {
  render: () => {
    const { previews, onRemove } = useSamplePreviews(1);
    return <ImagePastePreview previews={previews} onRemove={onRemove} />;
  },
};

export const MultipleImages = {
  render: () => {
    const { previews, onRemove } = useSamplePreviews(3);
    return <ImagePastePreview previews={previews} onRemove={onRemove} />;
  },
};

export const CustomColors = {
  render: () => {
    const { previews, onRemove } = useSamplePreviews(2);
    return (
      <ImagePastePreview
        previews={previews}
        onRemove={onRemove}
        label="Adjunto"
        labelBgColor="#fce7f3"
        labelTextColor="#9d174d"
        borderColor="#f9a8d4"
      />
    );
  },
};
