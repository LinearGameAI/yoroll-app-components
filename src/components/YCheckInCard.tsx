import { IconCheckedFilled, IconTreatsFilled } from '@yoroll/rn-icon';
import { StyleSheet, Text, View } from 'react-native';
import { cardMetrics } from '../foundations';
import { useTheme } from '../theme';
import { YTaskRow, type YTaskRowProps } from './YTaskRow';

export interface YCheckInDay { id: string; label: string; amount: string; status?: 'today' | 'claimed' | 'upcoming' }
export interface YCheckInCardProps extends YTaskRowProps {
  days: readonly YCheckInDay[];
  claimedLabel?: string;
}
export function YCheckInCard({ days, claimedLabel = 'Claimed', ...task }: YCheckInCardProps) {
  const { tokens } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: tokens.bgSecondary }]}>
      <YTaskRow {...task} />
      <View style={styles.days}>
        {days.map(({ id, label, amount, status }) => {
          const claimed = status === 'claimed';
          const today = status === 'today';
          const Icon = claimed ? IconCheckedFilled : IconTreatsFilled;
          const color = claimed || today ? tokens.orange : tokens.textTertiary;
          return (
            <View key={id} accessible accessibilityLabel={[label, amount, claimed ? claimedLabel : undefined].filter(Boolean).join(', ')}
              style={[styles.day, { backgroundColor: today ? tokens.bgHighlight : tokens.bgTertiary, borderColor: today ? tokens.orange : 'transparent' }]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.dayLabel, { color: today ? tokens.textPrimary : tokens.textSecondary }]}>{label}</Text>
              <Icon size={16} color={color} />
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.amount, { color }]}>{amount}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: cardMetrics.task.radius, overflow: 'hidden' },
  days: { flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingBottom: 16 },
  day: { flex: 1, minWidth: 0, minHeight: cardMetrics.task.dayMinHeight, borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 2, paddingVertical: 12, gap: 8, alignItems: 'center', justifyContent: 'center' },
  dayLabel: { fontSize: 11, lineHeight: 15, fontWeight: '600', textAlign: 'center', alignSelf: 'stretch' },
  amount: { fontSize: 12, lineHeight: 16, fontWeight: '600', textAlign: 'center', alignSelf: 'stretch', fontVariant: ['tabular-nums'] },
});
