import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardMetrics } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import { YButton } from './YButton';
import { TreatText } from './TreatText';

export interface YTaskRowProps {
  title: string;
  detail?: string;
  reward?: string;
  icon?: ReactNode;
  status?: 'available' | 'claimable' | 'complete' | 'locked';
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
}
export function YTaskRow({ title, detail, reward, icon, status = 'available', actionLabel, onAction, loading }: YTaskRowProps) {
  const { tokens } = useTheme();
  const disabled = !onAction || status === 'complete' || status === 'locked';
  return (
    <View style={[styles.row, { backgroundColor: tokens.bgSecondary }]}>
      {icon}
      <View style={styles.copy}>
        <View style={styles.heading}>
          <Text style={[componentText.taskTitle, styles.title, { color: tokens.textPrimary }]}>{title}</Text>
          {reward && <TreatText style={componentText.taskAction}>{reward}</TreatText>}
        </View>
        {detail && <Text style={[componentText.taskDescription, { color: tokens.textSecondary }]}>{detail}</Text>}
      </View>
      {actionLabel && <YButton label={actionLabel} onPress={onAction} disabled={disabled} loading={loading}
        variant={status === 'claimable' ? 'orange' : 'secondary'} size="sm" style={styles.action} textStyle={componentText.taskAction} />}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, gap: 8 },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  heading: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 },
  title: { flexShrink: 1 },
  action: { borderRadius: 999, minHeight: cardMetrics.task.buttonMinHeight, minWidth: 72, maxWidth: 120 },
});
