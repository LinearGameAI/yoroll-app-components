import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { IconCheck } from '@yoroll/rn-icon';
import { cardMetrics, TREAT_GRADIENT } from '../foundations';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';

export interface YPlanCardProps {
  title: string;
  price?: string;
  referencePrice?: string;
  period?: string;
  badge?: ReactNode;
  features?: readonly string[];
  selected?: boolean;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'benefits' | 'cycle';
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
}
export function YPlanCard({ title, price, referencePrice, period, badge, features = [], selected, loading, disabled,
  variant = 'benefits', onSelect, style }: YPlanCardProps) {
  const { tokens } = useTheme();
  const cycle = variant === 'cycle';
  const textColor = cycle ? '#FFFFFF' : tokens.textPrimary;
  const secondary = cycle ? 'rgba(255,255,255,0.6)' : tokens.textSecondary;
  return (
    <Pressable accessibilityRole={onSelect ? 'radio' : undefined} accessibilityState={{ checked: selected, disabled, busy: loading }}
      onPress={onSelect} disabled={disabled} style={({ pressed }) => [styles.card, cycle && styles.cycle, {
        backgroundColor: cycle ? '#39323F' : tokens.bgCard, borderColor: selected ? tokens.orange : tokens.cardStroke,
        opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
      }, style]}>
      {cycle && <View pointerEvents="none" style={styles.cycleFace}>
        <LinearGradient colors={selected ? ['#493149', '#19141F'] : ['#292630', '#151318']} style={StyleSheet.absoluteFill} />
      </View>}
      {badge}
      <Text style={[cycle ? typography.profileLabel : componentText.planTitle, { color: textColor, textAlign: cycle ? 'center' : 'auto' }]}>{title}</Text>
      {loading && !price ? <SkeletonBlock style={styles.priceSkeleton} /> : <View style={[styles.price, cycle && styles.center]}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}
          style={[cycle ? typography.membershipPrice : componentText.planPrice, { color: textColor, flexShrink: 1 }]}>{price ?? '—'}</Text>
        {period && <Text style={[componentText.modelBody, { color: secondary }]}>{period}</Text>}
      </View>}
      {referencePrice && <Text style={[styles.reference, { color: secondary, textAlign: cycle ? 'center' : 'auto' }]}>{referencePrice}</Text>}
      {features.map((feature, index) => <View key={feature + index} style={styles.feature}>
        <IconCheck size={15} color={TREAT_GRADIENT[0]} />
        <Text style={[typography.profileDetail, { color: secondary, flexShrink: 1 }]}>{feature}</Text>
      </View>)}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: cardMetrics.plan.radius, padding: cardMetrics.plan.padding, gap: 6, borderWidth: 1, minWidth: 0 },
  cycle: { minHeight: 106, borderRadius: 14, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 11 },
  cycleFace: { ...StyleSheet.absoluteFillObject, borderRadius: 13, overflow: 'hidden' },
  price: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  center: { justifyContent: 'center' },
  priceSkeleton: { width: 110, maxWidth: '100%', height: 30, borderRadius: 6, alignSelf: 'center' },
  reference: { ...componentText.modelBody, textDecorationLine: 'line-through' },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
