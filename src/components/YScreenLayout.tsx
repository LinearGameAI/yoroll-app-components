import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { layout } from '../foundations';
import { useTheme } from '../theme';
import { YTopBar } from './YTopBar';

export interface YScreenLayoutProps {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  header?: ReactNode;
  footer?: ReactNode;
  background?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  edgeToEdge?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}
export function YScreenLayout({ title, onBack, backLabel, header, footer, background, children, scroll = true, edgeToEdge = false,
  contentStyle, style }: YScreenLayoutProps) {
  const { tokens } = useTheme();
  const content = [edgeToEdge ? styles.edge : styles.inset, contentStyle];
  return (
    <View style={[styles.root, { backgroundColor: tokens.bgPrimary }, style]}>
      {background}
      {header ?? (title ? <YTopBar title={title} onBack={onBack} backLabel={backLabel} /> : null)}
      {scroll ? <ScrollView style={styles.root} contentContainerStyle={content}
        keyboardShouldPersistTaps="handled">{children}</ScrollView> : <View style={[styles.root, content]}>{children}</View>}
      {footer}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 0, minWidth: 0 },
  edge: { gap: 12 },
  inset: { paddingHorizontal: layout.gutter, paddingVertical: 16, gap: 12 },
});
