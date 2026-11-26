import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconCheck } from '@yoroll/rn-icon';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';
import { typography } from '../typography';

export interface YFilterChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  variant?: 'pill' | 'filter';
  onPress: () => void;
}

export function YFilterChip({ label, selected = false, disabled, variant = 'pill', onPress }: YFilterChipProps) {
  const { tokens } = useTheme();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected, disabled }}
      disabled={disabled} onPress={onPress} style={({ pressed }) => [
        styles.target, { opacity: disabled ? 0.4 : pressed ? 0.65 : 1 },
      ]}>
      <View style={[styles.chip, { backgroundColor: selected ? tokens.bgPicked : tokens.bgTertiary }]}>
        {variant === 'filter' && selected && <IconCheck size={14} color={tokens.orange} />}
        <Text style={[typography.creatorHeading, { color: selected ? tokens.orange : tokens.textSecondary }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { minHeight: controlMetrics.iconButton.target, justifyContent: 'center', alignSelf: 'flex-start' },
  chip: { borderRadius: controlMetrics.creatorChip.radius, paddingHorizontal: controlMetrics.creatorChip.paddingHorizontal,
    paddingVertical: controlMetrics.creatorChip.paddingVertical,
    flexDirection: 'row', alignItems: 'center', gap: 6 },
});
