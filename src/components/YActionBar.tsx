import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout } from '../foundations';
import { useTheme } from '../theme';
import { YButton, type YButtonProps } from './YButton';

export interface YActionBarProps {
  primary: YButtonProps & { label: string };
  secondary?: YButtonProps & { label: string };
  layout?: 'row' | 'stack';
  safeArea?: boolean;
  divider?: boolean;
}

export function YActionBar({ primary, secondary, layout: direction = 'row', safeArea = true, divider = true }: YActionBarProps) {
  const insets = useSafeAreaInsets();
  const { tokens } = useTheme();
  const row = direction === 'row';
  return (
    <View style={[styles.bar, {
      flexDirection: row ? 'row' : 'column', backgroundColor: tokens.bgPrimary,
      borderTopColor: tokens.cardStroke, borderTopWidth: divider ? StyleSheet.hairlineWidth : 0,
      paddingBottom: layout.gutter + (safeArea ? insets.bottom : 0),
    }]}>
      {secondary && row && <YButton size="lg" variant="secondary" {...secondary} style={[styles.action, secondary.style]} />}
      <YButton size="lg" {...primary} style={[row && styles.action, primary.style]} />
      {secondary && !row && <YButton size="lg" variant="secondary" {...secondary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingTop: layout.gutter, paddingHorizontal: layout.gutter, gap: 8 },
  action: { flex: 1, minWidth: 0 },
});
