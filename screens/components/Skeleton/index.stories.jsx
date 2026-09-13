import Skeleton from './index';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
};

export const TextLine = {
  args: {
    width: '200px',
    height: '1em',
  },
};

export const Circle = {
  args: {
    circle: true,
    width: 40,
    height: 40,
  },
};

export const Block = {
  args: {
    width: '100%',
    height: '120px',
    radius: '12px',
  },
};

export const ListPreview = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Skeleton circle width={28} height={28} />
          <Skeleton width={`${60 + (idx % 3) * 15}%`} height="12px" />
        </div>
      ))}
    </div>
  ),
};
