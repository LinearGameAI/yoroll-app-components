import { Text, type TextStyle } from 'react-native';
import type { GradientLabelProps } from './GradientLabel';

export function GradientLabel({ gradient, style, children }: GradientLabelProps) {
  const { colors, locations, start = { x: 0, y: 0 }, end = { x: 0, y: 1 } } = gradient;
  if (!colors.every((color) => typeof color === 'string')) {
    return <Text numberOfLines={1} style={style}>{children}</Text>;
  }
  const angle = 90 + Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
  const stops = colors.map((color, index) => {
    const position = locations?.[index];
    return position === undefined ? String(color) : `${String(color)} ${position * 100}%`;
  });
  const gradientStyle = {
    backgroundImage: `linear-gradient(${angle}deg, ${stops.join(', ')})`,
    backgroundClip: 'text',
    color: 'transparent',
  } as TextStyle;

  return <Text numberOfLines={1} style={[style, gradientStyle]}>{children}</Text>;
}
