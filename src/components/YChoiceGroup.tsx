import { IconCheck } from '@yoroll/rn-icon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';

export interface YChoiceItem { key: string; label: string; detail?: string; disabled?: boolean }
export interface YChoiceGroupProps {
  items: readonly YChoiceItem[];
  value: string;
  onChange: (key: string) => void;
  label: string;
}

export function YChoiceGroup({ items, value, onChange, label }: YChoiceGroupProps) {
  const { tokens } = useTheme();
  return (
    <View accessibilityLabel={label} accessibilityRole="radiogroup" style={{ gap: 2 }}>
      {items.map(({ key, label: title, detail, disabled }) => {
        const checked = key === value;
        return (
          <Pressable key={key} accessibilityRole="radio" accessibilityState={{ checked, disabled }} aria-checked={checked} onPress={() => onChange(key)}
            disabled={disabled} style={({ pressed }) => [styles.row, {
              backgroundColor: checked ? tokens.bgHighlight : tokens.bgCard, opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
            }]}>
            <View style={styles.copy}>
              <Text style={[componentText.rowLabel, { color: tokens.textPrimary }]}>{title}</Text>
              {detail && <Text style={[typography.profileDetail, { color: tokens.textSecondary }]}>{detail}</Text>}
            </View>
            {checked && <IconCheck size={18} color={tokens.orange} />}
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { minHeight: controlMetrics.settingsRow.minHeight, borderRadius: controlMetrics.settingsRow.groupRadius,
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
});
