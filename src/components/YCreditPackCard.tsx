import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardMetrics, TREAT_GRADIENT } from '../foundations';
import { darkTokens } from '../tokens';
import { componentText, typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';
import { TreatText } from './TreatText';

export interface YCreditPackCardProps {
  amount: string;
  price?: string;
  bonus?: string;
  badge?: string;
  artwork?: ReactNode;
  loadingPrice?: boolean;
  disabled?: boolean;
  retryLabel?: string;
  onPurchase?: () => void;
  onRetry?: () => void;
}
export function YCreditPackCard({ amount, price, bonus, badge, artwork, loadingPrice, disabled, retryLabel = 'Retry price',
  onPurchase, onRetry }: YCreditPackCardProps) {
  const action = price ? onPurchase : onRetry;
  const blocked = disabled || loadingPrice;
  return (
    <Pressable accessibilityRole={action ? 'button' : undefined} accessibilityState={{ disabled: blocked, busy: loadingPrice }}
      disabled={blocked} onPress={action} style={({ pressed }) => [styles.root, { opacity: disabled ? 0.48 : pressed ? 0.8 : 1 }]}>
      <LinearGradient pointerEvents="none" colors={['#40303F', '#2B2231', '#19151C']} style={StyleSheet.absoluteFill} />
      {badge && <LinearGradient colors={TREAT_GRADIENT} style={styles.badge}><Text numberOfLines={1} style={styles.badgeLabel}>{badge}</Text></LinearGradient>}
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.amount}>{amount}</Text>
          {bonus && <TreatText style={componentText.modelBody}>{bonus}</TreatText>}
        </View>
        {artwork}
      </View>
      {loadingPrice ? <SkeletonBlock style={styles.skeleton} /> : (
        <LinearGradient colors={TREAT_GRADIENT} style={styles.price}>
          <Text numberOfLines={1} style={styles.priceLabel}>{price ?? (action ? retryLabel : '—')}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: { minHeight: cardMetrics.pack.minHeight, borderRadius: cardMetrics.pack.radius, overflow: 'hidden',
    padding: cardMetrics.pack.padding, justifyContent: 'space-between', backgroundColor: '#19151C', gap: 6 },
  badge: { alignSelf: 'flex-start', minHeight: cardMetrics.pack.badgeHeight, borderRadius: 6, paddingHorizontal: 6, justifyContent: 'center' },
  badgeLabel: { ...componentText.coverTag, fontWeight: '700', color: darkTokens.dark },
  row: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 6 },
  copy: { flex: 1, minWidth: 0 },
  amount: { ...componentText.planPrice, color: '#FFFFFF', fontVariant: ['tabular-nums'] },
  skeleton: { width: '100%', height: 36, borderRadius: 18 },
  price: { minHeight: 36, borderRadius: 18, justifyContent: 'center', paddingHorizontal: 8 },
  priceLabel: { ...typography.profileLabel, color: darkTokens.dark, textAlign: 'center' },
});
