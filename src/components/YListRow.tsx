import type { ReactNode } from 'react';
import { IconAngleright } from '@yoroll/rn-icon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { controlMetrics, layout } from '../foundations';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';

export interface YListRowProps {
  title: string;
  detail?: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  divider?: boolean;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onPress?: () => void;
}
export function YListRow({ title, detail, value, leading, trailing, divider = false, variant = 'default', disabled, onPress }: YListRowProps) {
  const { tokens } = useTheme();
  const row = [styles.row, { borderBottomColor: tokens.cardStroke, borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0 }];
  const content = <>
    {leading}
    <View style={styles.copy}>
      <Text style={[componentText.rowLabel, { color: variant === 'danger' ? tokens.textWrong : tokens.textPrimary }]}>{title}</Text>
      {detail && <Text numberOfLines={2} style={[typography.profileDetail, { color: tokens.textSecondary }]}>{detail}</Text>}
    </View>
    {value && <Text numberOfLines={1} style={[componentText.rowMeta, styles.value, { color: tokens.textSecondary }]}>{value}</Text>}
    {trailing ?? (onPress ? <IconAngleright size={16} color={tokens.textTertiary} /> : null)}
  </>;
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [row, { opacity: disabled ? 0.4 : pressed ? 0.65 : 1 }]}>{content}</Pressable>
  ) : <View style={row}>{content}</View>;
}
const styles = StyleSheet.create({
  row: { minHeight: controlMetrics.settingsRow.minHeight, paddingHorizontal: layout.gutter, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 8 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  value: { maxWidth: '32%' },
});
