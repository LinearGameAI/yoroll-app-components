import { useState } from 'react';
import { Text, View } from 'react-native';
import { IconAdd } from '@yoroll/rn-icon';
import { YButton, useTheme } from '@yoroll/app-components';

export default function ButtonVariants() {
  const { tokens } = useTheme();
  const [action, setAction] = useState('');
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        <YButton label="确认" onPress={() => setAction('确认')} />
        <YButton label="取消" variant="outline" onPress={() => setAction('取消')} />
        <YButton label="添加" variant="brand" leftIcon={<IconAdd size={14} color={tokens.orange4} />} onPress={() => setAction('添加')} />
      </View>
      <Text accessibilityLiveRegion="polite" style={{ minHeight: 18, fontSize: 13, color: tokens.textSecondary }}>
        {action ? `已点击${action}` : ''}
      </Text>
    </View>
  );
}
