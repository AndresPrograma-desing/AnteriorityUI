import Button from '../../../Button/index';
import { SKIN_TONES, toneSwatchStyle } from '../../constants';
import styles from './index.module.css';

const SkinToneSelector = ({ tone, onChange, t }) => (
  <div className={styles.row} role="radiogroup" aria-label={t.skinTone}>
    {SKIN_TONES.map(({ code, color }, i) => (
      <Button
        key={code || 'default'}
        variant="ghost"
        circle
        size="small"
        role="radio"
        aria-checked={tone === code}
        aria-label={t.skinTones[i]}
        ToolTip={t.skinTones[i]}
        onClick={() => onChange(code)}
        style={toneSwatchStyle(color, tone === code)}
      />
    ))}
  </div>
);

export default SkinToneSelector;
