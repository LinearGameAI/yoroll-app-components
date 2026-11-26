import { useId, useState } from 'react';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import type { YSliderProps } from './sliderValue';
export type { YSliderProps } from './sliderValue';

export function YSlider({ label, value, min, max, step = 1, disabled, variant = 'appearance', onChange }: YSliderProps) {
  const { tokens } = useTheme();
  const id = useId();
  const [active, setActive] = useState(false);
  const playback = variant === 'playback';
  const fraction = max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  return (
    <div>
      {!playback && <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, color: tokens.textPrimary, ...componentText.rowLabel }}>
        <span>{label}</span><output htmlFor={id} style={{ color: tokens.textSecondary, fontSize: componentText.modelBody.fontSize }}>{value}</output>
      </label>}
      <div style={{ height: playback ? 22 : 44, position: 'relative', opacity: disabled ? 0.45 : 1,
        outline: active ? '1px solid ' + tokens.orange : undefined, outlineOffset: 2, borderRadius: playback ? 2 : 6 }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: playback ? 0 : 12, right: playback ? 0 : 12,
          top: playback ? undefined : 20, bottom: playback ? 0 : undefined,
          height: playback ? 2 : 4, background: playback ? 'rgba(255,255,255,0.30)' : tokens.bgTertiary, borderRadius: 2 }}>
          <div style={{ backgroundColor: playback ? '#FFFFFF' : tokens.orange, height: '100%', width: fraction * 100 + '%', borderRadius: 2 }} />
          {!playback && <div style={{ position: 'absolute', top: -10, left: fraction * 100 + '%', transform: 'translateX(-50%)',
            borderRadius: '50%', width: 24, height: 24, backgroundColor: tokens.textPrimary, boxShadow: '0 2px 5px #0006' }} />}
        </div>
        <input type="range" id={id} aria-label={label} min={min} max={max} step={step} value={value} disabled={disabled}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
          onFocus={() => setActive(true)} onBlur={() => setActive(false)}
          style={{ position: 'absolute', opacity: 0, display: 'block', inset: 0, width: '100%', height: '100%', margin: 0, cursor: disabled ? 'default' : 'pointer' }} />
      </div>
    </div>
  );
}
