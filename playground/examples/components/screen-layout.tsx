import { useState } from 'react';
import { View } from 'react-native';
import { YScreenLayout, YActionBar, YTextInput } from '@yoroll/app-components';

export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <View style={{ height: 190, width: '100%' }}>
      <YScreenLayout title="编辑资料" footer={<YActionBar primary={{ label: '保存', onPress: () => setSaved(true), disabled: saved }} safeArea={false} />}>
        <YTextInput accessibilityLabel="昵称" defaultValue="月光旅人" />
      </YScreenLayout>
    </View>
  );
}
