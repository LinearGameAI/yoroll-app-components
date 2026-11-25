import { Text, type TextStyle } from 'react-native';
import { TREAT_TEXT_GRADIENT } from '../foundations';
import type { TreatTextProps } from './TreatText';

export function TreatText({
  gradientColors = TREAT_TEXT_GRADIENT,
  androidRenderingMode: _androidRenderingMode,
  style,
  ...props
}: TreatTextProps) {
  const supportsGradient = gradientColors.every((color) => typeof color === 'string');
  const gradientStyle = supportsGradient ? {
    backgroundImage: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
    backgroundClip: 'text',
    color: 'transparent',
  } as TextStyle : undefined;

  return <Text {...props} style={[style, gradientStyle]} />;
}
