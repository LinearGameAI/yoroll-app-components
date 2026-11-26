import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';
import { componentText } from '../typography';

export interface YBadgeProps {
  label: string;
  variant?: 'muted' | 'brand' | 'positive' | 'warning' | 'media';
}
export function YBadge({ label, variant = 'muted' }: YBadgeProps) {
  const { tokens } = useTheme();
  const [backgroundColor, color] = {
    muted: [tokens.bgTertiary, tokens.textSecondary], brand: [tokens.bgPicked, tokens.orange],
    positive: [tokens.bgRight, tokens.textRight], warning: [tokens.bgWrong, tokens.textWrong],
    media: ['rgba(0,0,0,0.55)', '#FFFFFF'],
  }[variant];
  return <Text numberOfLines={1} style={[styles.badge, { backgroundColor, color }]}>{label}</Text>;
}
const styles = StyleSheet.create({
  badge: { ...componentText.coverTag, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, overflow: 'hidden',
    alignSelf: 'flex-start', maxWidth: '100%' },
});
