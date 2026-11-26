import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { YButton, type YButtonProps } from './YButton';

export interface YBannerProps {
  title: string;
  detail?: string;
  variant?: 'info' | 'warning' | 'reward';
  leading?: ReactNode;
  artwork?: ReactNode;
  action?: YButtonProps & { label: string };
}
export function YBanner({ title, detail, variant = 'info', leading, artwork, action }: YBannerProps) {
  const { tokens } = useTheme();
  const isReward = variant === 'reward';
  const isWarning = variant === 'warning';
  return (
    <View style={[styles.root, {
      backgroundColor: isReward ? '#2B2528' : isWarning ? tokens.bgHighlight : tokens.bgSecondary,
      borderColor: isWarning ? tokens.bgPicked : tokens.cardStroke,
    }]}>
      {isReward && <LinearGradient pointerEvents="none" colors={['#2B2528', '#19191C']} style={StyleSheet.absoluteFill} />}
      {artwork && <View style={styles.artwork} pointerEvents="none">{artwork}</View>}
      {leading}
      <View style={styles.copy}>
        <Text style={[typography.profileLabel, { color: isReward ? '#F7F7F8' : isWarning ? tokens.orange : tokens.textPrimary }]}>{title}</Text>
        {detail && <Text style={[componentText.taskDescription, { color: isReward ? '#D8D8DC' : tokens.textSecondary }]}>{detail}</Text>}
      </View>
      {action && <YButton variant={isReward ? 'primary' : 'secondary'} size="sm" {...action}
        style={[isReward && styles.rewardAction, action.style]} textStyle={[isReward && styles.rewardLabel, action.textStyle]} />}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { position: 'relative', gap: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: 12,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, overflow: 'hidden' },
  copy: { flex: 1, minWidth: 110, gap: 4 },
  artwork: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, opacity: 0.45 },
  rewardAction: { borderRadius: 999, backgroundColor: '#FFFFFF' },
  rewardLabel: { color: '#1C1E22' },
});
