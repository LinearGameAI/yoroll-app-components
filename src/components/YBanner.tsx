import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { rewardBannerAppearance } from '../appStyles';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { YButton, type YButtonProps } from './YButton';

export interface YBannerProps {
  title: string;
  detail?: string;
  variant?: 'info' | 'warning' | 'reward';
  leading?: ReactNode;
  artwork?: ReactNode;
  reward?: ReactNode;
  action?: YButtonProps & { label: string };
}
export function YBanner({ title, detail, variant = 'info', leading, artwork, reward, action }: YBannerProps) {
  const { tokens } = useTheme();
  const isReward = variant === 'reward';
  const isWarning = variant === 'warning';
  const appearance = rewardBannerAppearance;
  return (
    <View style={[styles.root, isReward ? styles.reward : {
      backgroundColor: isWarning ? tokens.bgHighlight : tokens.bgSecondary, borderColor: isWarning ? tokens.bgPicked : tokens.cardStroke,
    }]}>
      {isReward && <LinearGradient pointerEvents="none" {...appearance.surface} style={StyleSheet.absoluteFill} />}
      {artwork && <View style={isReward ? styles.rewardArtwork : styles.artwork} pointerEvents="none">{artwork}</View>}
      {leading}
      <View style={[styles.copy, isReward && Boolean(artwork) && styles.withArt]}>
        <View style={styles.heading}>
          <Text style={[isReward ? styles.rewardTitle : typography.profileLabel, {
            color: isReward ? appearance.text : isWarning ? tokens.orange : tokens.textPrimary,
          }]}>{title}</Text>
          {reward}
        </View>
        {detail && <Text style={[componentText.taskDescription, { color: isReward ? appearance.body : tokens.textSecondary }]}>{detail}</Text>}
      </View>
      {action && <YButton variant={isReward ? 'primary' : 'secondary'} size="sm"
        backgroundGradient={isReward ? appearance.buttonGradient : undefined}
        backgroundHighlightGradient={isReward ? appearance.buttonHighlight : undefined} {...action}
        style={[isReward && appearance.button, action.style]} textStyle={[isReward && styles.rewardLabel, action.textStyle]} />}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { position: 'relative', gap: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: 12,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, overflow: 'hidden' },
  copy: { flex: 1, minWidth: 110, gap: 4 },
  heading: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 },
  reward: { minHeight: 96, padding: 16, borderWidth: 0, borderRadius: rewardBannerAppearance.card.borderRadius, backgroundColor: '#292929' },
  artwork: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, opacity: 0.45 },
  rewardArtwork: { position: 'absolute', left: -6, top: 4, bottom: -17, width: 78 },
  withArt: { marginLeft: 62 },
  rewardTitle: { fontSize: 18, lineHeight: 24, fontWeight: '700', flexShrink: 1 },
  rewardLabel: { ...componentText.taskAction, color: rewardBannerAppearance.buttonText },
});
