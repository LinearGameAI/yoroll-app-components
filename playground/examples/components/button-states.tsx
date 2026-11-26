import { View } from 'react-native';
import { YButton } from '@yoroll/app-components';

export default function ButtonStates() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      <YButton label="无法继续" disabled />
      <YButton label="保存中" loading />
    </View>
  );
}
