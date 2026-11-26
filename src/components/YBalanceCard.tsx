import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { cardMetrics } from '../foundations';
import { darkTokens } from '../tokens';
import { typography } from '../typography';

export interface YBalanceCardProps {
  title: string;
  amount?: string;
  detail?: string;
  artwork?: ReactNode;
  valueStyle?: StyleProp<TextStyle>;
}
export function YBalanceCard({ title, amount, detail, artwork, valueStyle }: YBalanceCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient pointerEvents="none" colors={['#FFB48D', '#FFACB5', '#FFA9D4']} style={StyleSheet.absoluteFill} />
      {artwork && <View pointerEvents="none" style={styles.art}>{artwork}</View>}
      <View style={[styles.copy, Boolean(artwork) && styles.withArt]}>
        <Text style={styles.label}>{title}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65} style={[styles.value, valueStyle]}>{amount ?? '—'}</Text>
        {detail && <Text style={styles.detail}>{detail}</Text>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { position: 'relative', borderRadius: cardMetrics.balance.radius, overflow: 'hidden',
    paddingHorizontal: cardMetrics.balance.paddingH, paddingVertical: cardMetrics.balance.paddingV },
  copy: { gap: 4 },
  withArt: { paddingRight: 84 },
  art: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 106 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: '#57353F' },
  value: { ...typography.treatBalance, minHeight: cardMetrics.balance.valueMinHeight, fontWeight: '800',
    color: darkTokens.dark, fontVariant: ['tabular-nums'], includeFontPadding: false },
  detail: { fontSize: 11, lineHeight: 16, color: '#69434E' },
});
