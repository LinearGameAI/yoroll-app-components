import { IconAdd, IconClose } from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';
import { YIconButton } from './YIconButton';

export interface YUploadItem { id: string; uri: string; label?: string }
export interface YUploadGridProps {
  items: readonly YUploadItem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onPreview?: (id: string) => void;
  limit?: number;
  addLabel?: string;
  removeLabel?: (item: YUploadItem) => string;
}

export function YUploadGrid({ items, onAdd, onRemove, onPreview, limit = 4, addLabel = 'Add attachment', removeLabel }: YUploadGridProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={[styles.tile, { backgroundColor: tokens.bgTertiary }]}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityRole={onPreview ? 'button' : 'image'}
            accessibilityLabel={item.label} onPress={onPreview ? () => onPreview(item.id) : undefined}>
            <Image style={StyleSheet.absoluteFill} source={item.uri} contentFit="cover" />
          </Pressable>
          {onRemove && <YIconButton style={styles.remove} icon={IconClose} variant="media" iconSize={14}
            label={removeLabel?.(item) ?? 'Remove attachment'} onPress={() => onRemove(item.id)} />}
        </View>
      ))}
      {onAdd && items.length < limit && <Pressable accessibilityRole="button" accessibilityLabel={addLabel} onPress={onAdd}
        style={({ pressed }) => [styles.tile, styles.add, {
          borderColor: tokens.cardStroke, backgroundColor: tokens.bgCard, opacity: pressed ? 0.7 : 1,
        }]}>
        <IconAdd size={22} color={tokens.textSecondary} />
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: controlMetrics.upload.width, height: controlMetrics.upload.height, borderRadius: controlMetrics.upload.radius, overflow: 'hidden' },
  add: { borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  remove: { position: 'absolute', right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.55)' },
});
