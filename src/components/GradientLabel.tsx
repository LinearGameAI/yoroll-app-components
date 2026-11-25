import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import type { YButtonGradient } from './YButton';

export interface GradientLabelProps {
  gradient: YButtonGradient;
  style: StyleProp<TextStyle>;
  children: string;
}

export function GradientLabel({ gradient, style, children }: GradientLabelProps) {
  return (
    <MaskedView
      androidRenderingMode="software"
      style={{ flexShrink: 0 }}
      maskElement={<Text style={[style, { color: '#fff' }]} numberOfLines={1}>{children}</Text>}
    >
      <LinearGradient {...gradient}>
        <Text style={[style, { opacity: 0 }]} numberOfLines={1}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
