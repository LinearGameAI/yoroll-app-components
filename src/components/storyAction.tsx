import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { componentText } from '../typography';

export function StoryAction({ label, onPress, selected, disabled, style }: {
  label: string; onPress: () => void; selected?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected, disabled }} onPress={onPress} disabled={disabled}
      style={({ pressed }) => [styles.action, selected && styles.selected, {
        opacity: disabled && !selected ? 0.55 : pressed ? 0.7 : 1,
      }, style]}>
      <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.48, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.inner} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: { minHeight: 45, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)' },
  selected: { borderColor: '#F7CF6D' },
  inner: { position: 'absolute', left: 3, right: 3, top: 3, bottom: 3,
    borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  label: { ...componentText.feedback, color: '#FFFFFF', fontWeight: '500', textAlign: 'center' },
});
