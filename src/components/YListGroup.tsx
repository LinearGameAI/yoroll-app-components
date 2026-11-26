import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { componentText } from '../typography';

export interface YListGroupProps { title?: string; children: ReactNode }
export function YListGroup({ title, children }: YListGroupProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.group}>
      {title && <Text accessibilityRole="header" style={[styles.title, { color: tokens.textTertiary }]}>{title}</Text>}
      <View style={[styles.surface, { backgroundColor: tokens.bgCard }]}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 8 },
  title: { ...componentText.rowMeta, letterSpacing: 0.8, paddingHorizontal: 8, textTransform: 'uppercase' },
  surface: { borderRadius: 14, overflow: 'hidden' },
});
