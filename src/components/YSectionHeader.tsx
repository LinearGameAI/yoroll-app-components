import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../typography';

export interface YSectionHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  size?: 'section' | 'compact';
}
export function YSectionHeader({ title, subtitle, trailing, size = 'section' }: YSectionHeaderProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={[
          size === 'compact' ? typography.creatorHeading : typography.creatorTitle, { color: tokens.textPrimary },
        ]}>{title}</Text>
        {subtitle && <Text style={[typography.profileDetail, { color: tokens.textSecondary }]}>{subtitle}</Text>}
      </View>
      {trailing}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
});
