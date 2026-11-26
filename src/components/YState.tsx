import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';
import { YButton } from './YButton';

export interface YStateProps {
  state: 'loading' | 'empty' | 'error';
  title: string;
  detail?: string;
  artwork?: ReactNode;
  loadingLayout?: 'spinner' | 'rows';
  action?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
}

export function YState({ state, title, detail, artwork, loadingLayout = 'rows', action, style }: YStateProps) {
  const { tokens } = useTheme();
  const loading = state === 'loading';
  return (
    <View accessibilityLiveRegion="polite" accessibilityState={{ busy: loading }} style={[styles.root, style]}>
      {loading ? loadingLayout === 'rows' ? (
        <View style={styles.skeletons}>
          {[0, 1, 2].map((row) => <View key={row} style={styles.skeletonRow}>
            <SkeletonBlock style={styles.avatar} />
            <View style={styles.lines}><SkeletonBlock style={styles.line} /><SkeletonBlock style={styles.shortLine} /></View>
          </View>)}
        </View>
      ) : <ActivityIndicator color={tokens.textPrimary} /> : artwork}
      <Text style={[componentText.feedback, { color: loading ? tokens.textSecondary : tokens.textPrimary, textAlign: 'center' }]}>{title}</Text>
      {detail && <Text style={[typography.profileDetail, styles.body, { color: tokens.textSecondary }]}>{detail}</Text>}
      {action && !loading && <YButton size="sm" variant="secondary" {...action} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minHeight: 144, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
  body: { textAlign: 'center' },
  skeletons: { width: '100%', gap: 12 },
  skeletonRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  lines: { flex: 1, gap: 8 },
  line: { height: 13, width: '78%', borderRadius: 4 },
  shortLine: { height: 10, width: '54%', borderRadius: 4 },
});
