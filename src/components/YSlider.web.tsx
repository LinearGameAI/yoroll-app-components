import { useId } from 'react';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import type { YSliderProps } from './sliderValue';
export type { YSliderProps } from './sliderValue';

export function YSlider({ label, value, min, max, step = 1, disabled, onChange }: YSliderProps) {
  const { tokens } = useTheme();
  const id = useId();
  return (
    <div>
      <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, color: tokens.textPrimary, ...componentText.rowLabel }}>
        <span id={id + '-label'}>{label}</span>
        <output htmlFor={id} style={{ color: tokens.textSecondary, fontSize: componentText.modelBody.fontSize }}>{value}</output>
      </label>
      <input type="range" id={id} aria-labelledby={id + '-label'} min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        style={{ width: '100%', height: 44, display: 'block', accentColor: tokens.orange, margin: 0 }} />
    </div>
  );
}
