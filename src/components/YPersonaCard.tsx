import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardMetrics } from '../foundations';
import { useTheme } from '../theme';
import { typography } from '../typography';
import { YBadge } from './YBadge';
import { YMediaCard, type YMediaCardProps } from './YMediaCard';

export interface YPersonaCardProps {
  title: string;
  subtitle?: string;
  label?: string;
  cover?: YMediaCardProps['cover'];
  detail?: string;
  variant?: 'persona' | 'owned';
  status?: 'default' | 'draft' | 'review' | 'published' | 'rejected';
  actions?: ReactNode;
  onPress?: () => void;
}
export function YPersonaCard({ title, subtitle, label, cover, detail, variant = 'persona', status, actions, onPress }: YPersonaCardProps) {
  const { tokens } = useTheme();
  const persona = variant === 'persona';
  const badge = label && <YBadge label={label} variant={status === 'rejected' ? 'warning' : status === 'default' ? 'brand' : 'media'} />;
  return (
    <View style={[styles.card, { backgroundColor: tokens.bgCard }]}>
      <YMediaCard title={title} subtitle={subtitle} variant="character" cover={cover} badge={badge} onPress={onPress} />
      {persona && detail && <View style={styles.details}>
        <Text numberOfLines={4} style={[typography.profileDetail, { color: tokens.textSecondary }]}>{detail}</Text>
      </View>}
      {actions && <View style={[styles.actions, { borderTopColor: tokens.cardStroke }]}>{actions}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: cardMetrics.cover.radius, overflow: 'hidden' },
  details: { minHeight: cardMetrics.persona.detailMinHeight, padding: 12 },
  actions: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', minHeight: cardMetrics.persona.actionMinHeight, alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth },
});
