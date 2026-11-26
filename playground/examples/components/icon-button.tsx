import { useState } from 'react';
import { View } from 'react-native';
import { IconClose, IconFavorite, IconShare } from '@yoroll/rn-icon';
import { YIconButton } from '@yoroll/app-components';

export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <YIconButton icon={IconFavorite} label="收藏" selected={saved} onPress={() => setSaved(!saved)} color={saved ? '#FF8652' : undefined} />
      <YIconButton icon={IconShare} label="分享" variant="surface" onPress={() => setSaved(false)} />
      <YIconButton icon={IconClose} label="关闭" variant="media" disabled onPress={() => {}} />
    </View>
  );
}
