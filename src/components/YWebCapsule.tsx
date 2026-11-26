import { IconClose, IconMoreHorizontal } from '@yoroll/rn-icon';
import { StyleSheet, View } from 'react-native';
import { YIconButton } from './YIconButton';

export interface YWebCapsuleProps {
  onMore: () => void;
  onClose: () => void;
  moreLabel?: string;
  closeLabel?: string;
}
export function YWebCapsule({ onMore, onClose, moreLabel = 'More', closeLabel = 'Close' }: YWebCapsuleProps) {
  return (
    <View style={styles.capsule}>
      <YIconButton icon={IconMoreHorizontal} color="#FFFFFF" label={moreLabel} onPress={onMore} iconSize={18} />
      <View style={styles.divider} />
      <YIconButton icon={IconClose} color="#FFFFFF" label={closeLabel} onPress={onClose} iconSize={18} />
    </View>
  );
}
const styles = StyleSheet.create({
  capsule: { alignSelf: 'flex-start', height: 32, marginVertical: 6, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(0,0,0,0.35)', flexDirection: 'row', alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, height: 18, backgroundColor: 'rgba(255,255,255,0.25)' },
});
