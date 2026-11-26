import { IconPlayFilled } from '@yoroll/rn-icon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../typography';
import { YBadge } from './YBadge';

export interface YEpisode { id: string; label: string; locked?: boolean; lockLabel?: string }
export interface YEpisodeGridProps {
  episodes: readonly YEpisode[];
  active?: string;
  onSelect: (id: string) => void;
  onLocked?: (id: string) => void;
}
export function YEpisodeGrid({ episodes, active, onSelect, onLocked }: YEpisodeGridProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.grid}>
      {episodes.map(({ id, label, locked, lockLabel }) => {
        const selected = active === id;
        const disabled = locked && !onLocked;
        return <Pressable key={id} accessibilityRole="button" accessibilityLabel={[label, lockLabel].filter(Boolean).join(', ')}
          accessibilityState={{ selected, disabled }} disabled={disabled} onPress={() => locked ? onLocked?.(id) : onSelect(id)}
          style={({ pressed }) => [styles.tile, {
            backgroundColor: selected ? tokens.bgPicked : tokens.bgTertiary,
            borderColor: selected ? tokens.orange : tokens.cardStroke, opacity: disabled || pressed ? 0.65 : 1,
          }]}>
          {selected && <IconPlayFilled size={12} color={tokens.orange} />}
          <Text style={[typography.profileLabel, { color: selected ? tokens.orange : tokens.textPrimary }]}>{label}</Text>
          {locked && lockLabel && <YBadge label={lockLabel} variant="brand" />}
        </Pressable>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexBasis: '22%', flexGrow: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth, minWidth: 52, minHeight: 48, padding: 4, gap: 3 },
});
