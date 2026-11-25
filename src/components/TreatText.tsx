import { StyleSheet, Text, type TextProps } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';
import { TREAT_TEXT_GRADIENT } from '../foundations';

function readableText(value: TextProps['children']): string {
  if (Array.isArray(value)) return value.map(readableText).join('');
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

/** Keep native text measurement and font scaling while sharing the Treats gradient. */
export type TreatTextProps = Omit<TextProps, 'onPress' | 'onLongPress'> & {
  gradientColors?: LinearGradientProps['colors'];
  androidRenderingMode?: 'software' | 'hardware';
};

export function TreatText({ children, style, testID, accessibilityLabel, onTextLayout, onLayout,
  gradientColors = TREAT_TEXT_GRADIENT, androidRenderingMode = 'software', ...props }: TreatTextProps) {
  const label = accessibilityLabel ?? (readableText(children) || undefined);
  return <MaskedView testID={testID ? `${testID}-gradient` : undefined} style={styles.root}
    onLayout={onLayout}
    androidRenderingMode={androidRenderingMode} pointerEvents="none" accessible={props.accessible ?? true}
    accessibilityRole="text" accessibilityLabel={label}
    maskElement={<Text {...props} accessible={false} importantForAccessibility="no-hide-descendants"
      style={[style, { color: '#000000' }]}>{children}</Text>}>
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
      <Text {...props} testID={testID} onTextLayout={onTextLayout}
        accessible={false} importantForAccessibility="no-hide-descendants" style={[style, styles.measure]}>{children}</Text>
    </LinearGradient>
  </MaskedView>;
}

const styles = StyleSheet.create({
  root: { flexShrink: 1, minWidth: 0, maxWidth: '100%' },
  measure: { opacity: 0 },
});
