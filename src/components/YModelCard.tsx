import type { ReactNode } from 'react';
import { IconCheckedFilled, IconSingleunchecked, IconTreatsFilled } from '@yoroll/rn-icon';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { cardMetrics, TREAT_TEXT_GRADIENT } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import { TreatText } from './TreatText';

export interface YModelCardProps {
  title: string;
  description?: string;
  price?: string;
  referencePrice?: string;
  countdown?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  saving?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}
export function YModelCard({ title, description, price, referencePrice, countdown, badge, icon, selected, saving, disabled, onSelect }: YModelCardProps) {
  const { tokens } = useTheme();
  const blocked = saving || disabled;
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected, disabled: blocked, busy: saving }}
      disabled={blocked} onPress={onSelect} style={({ pressed }) => [styles.card, {
        backgroundColor: tokens.bgTertiary, borderColor: selected ? tokens.orange : 'transparent', opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
      }]}>
      {selected && <LinearGradient pointerEvents="none" colors={[tokens.bgPicked, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
      <View style={styles.row}>
        {icon}
        <Text style={[componentText.modelTitle, styles.title, { color: tokens.textPrimary }]}>{title}</Text>
        {badge}
        {saving ? <ActivityIndicator color={tokens.orange} /> : selected
          ? <IconCheckedFilled size={20} color={tokens.orange} /> : <IconSingleunchecked size={20} color={tokens.textTertiary} />}
      </View>
      {description && <Text style={[componentText.modelBody, { color: tokens.textSecondary }]}>{description}</Text>}
      {(price || countdown) && <View style={styles.row}>
        {price && <><IconTreatsFilled size={14} color={TREAT_TEXT_GRADIENT[0]} />
          <TreatText style={componentText.modelPrice}>{price}</TreatText></>}
        {referencePrice && <Text style={[componentText.modelBody, styles.reference, { color: tokens.textTertiary }]}>{referencePrice}</Text>}
        {countdown && <Text style={[componentText.modelBody, styles.timer, { color: tokens.textSecondary }]}>{countdown}</Text>}
      </View>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: cardMetrics.model.radius, overflow: 'hidden', gap: 8,
    paddingHorizontal: cardMetrics.model.paddingH, paddingVertical: cardMetrics.model.paddingV },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  title: { flex: 1, minWidth: 52 },
  reference: { textDecorationLine: 'line-through' },
  timer: { marginLeft: 'auto', fontVariant: ['tabular-nums'] },
});
