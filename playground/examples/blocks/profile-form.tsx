import { useState } from 'react';
import { Text, View } from 'react-native';
import { YAvatar, YButton, YTextInput, YTopBar, layout, useTheme } from '@yoroll/app-components';

export default function ProfileForm() {
  const { tokens } = useTheme();
  const [name, setName] = useState('Yoroll');
  const [saved, setSaved] = useState(false);
  return (
    <View style={{ width: '100%', maxWidth: 330, backgroundColor: tokens.bgPrimary, borderRadius: 16, borderWidth: 1, borderColor: tokens.cardStroke, overflow: 'hidden' }}>
      <YTopBar title="编辑个人资料" />
      <View style={{ padding: layout.gutter, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 }}>
          <YAvatar name={name.trim()} size={44} />
          <Text style={{ flex: 1, color: tokens.textPrimary, fontSize: 16, fontWeight: '600' }} numberOfLines={1}>{name.trim() || '个人资料'}</Text>
        </View>
        <Text style={{ color: tokens.textSecondary, fontSize: 13 }}>显示名称</Text>
        <YTextInput accessibilityLabel="显示名称" value={name} placeholder="输入名称"
          onChangeText={(value) => { setName(value); setSaved(false); }} />
        <YButton fullWidth label={saved ? '已保存' : '保存资料'} disabled={!name.trim()} onPress={() => setSaved(true)} />
      </View>
    </View>
  );
}
