import { View } from 'react-native';
import { YAvatar } from '@yoroll/app-components';

export default function AvatarExamples() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <YAvatar name="Yoroll" size={36} />
      <YAvatar name="Amy" size={48} color="#6551B5" />
      <YAvatar name="Remi" size={56} ring="#FF9CD5" gradientColors={['#BE9AFF', '#6551B5']} />
    </View>
  );
}
