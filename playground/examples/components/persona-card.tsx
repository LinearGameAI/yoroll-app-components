import { useState } from 'react';
import { View } from 'react-native';
import { YPersonaCard, YButton } from '@yoroll/app-components';

export default function Example() {
  const [isDefault, setDefault] = useState(true);
  return (
    <View style={{ maxWidth: 230 }}>
      <YPersonaCard title="月光旅人" subtitle="旅行者" cover="./artwork/originals/assets/login-covers/cover-01.jpg" label={isDefault ? '默认人设' : '备用人设'}
        status={isDefault ? 'default' : undefined} detail="探索海岸、收集每一封寄错的信。"
        actions={<YButton label={isDefault ? '取消默认' : '设为默认'} size="sm" variant="ghost" onPress={() => setDefault(!isDefault)} />} />
    </View>
  );
}
