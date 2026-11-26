export interface YSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  variant?: 'appearance' | 'playback';
}

export function steppedValue(value: number, min: number, max: number, step: number) {
  return Math.max(min, Math.min(max, Number((min + Math.round((value - min) / step) * step).toFixed(8))));
}
