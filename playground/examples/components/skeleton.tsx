import { View } from 'react-native';
import { SkeletonBlock, useTheme } from '@yoroll/app-components';

export default function ListSkeleton() {
  const { tokens } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: tokens.bgPrimary }}>
      <SkeletonBlock style={{ width: 48, height: 48, borderRadius: 24 }} />
      <View style={{ gap: 8 }}>
        <SkeletonBlock style={{ width: 128, height: 10, borderRadius: 5 }} />
        <SkeletonBlock style={{ width: 80, height: 8, borderRadius: 4 }} />
      </View>
    </View>
  );
}
