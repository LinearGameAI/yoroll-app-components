import { useState } from 'react';
import { Text, View } from 'react-native';
import { IconMoreHorizontal } from '@yoroll/rn-icon';
import { YButton, YTopBar, useTheme } from '@yoroll/app-components';

export default function TopBarExample() {
  const { tokens } = useTheme();
  const [action, setAction] = useState('');
  return (
    <View style={{ width: '100%', maxWidth: 280, gap: 8, alignItems: 'stretch' }}>
      <View style={{ overflow: 'hidden', borderWidth: 1, borderColor: tokens.cardStroke, borderRadius: 9 }}>
        <YTopBar
          title="个人资料"
          backLabel="返回"
          onBack={() => setAction('返回')}
          rightSlot={
            <YButton
              variant="ghost"
              size="icon"
              accessibilityLabel="更多选项"
              icon={<IconMoreHorizontal color={tokens.textPrimary} size={20} />}
              onPress={() => setAction('更多选项')}
            />
          }
        />
      </View>
      <Text accessibilityLiveRegion="polite" style={{ minHeight: 18, textAlign: 'center', color: tokens.textSecondary }}>
        {action ? `已点击${action}` : ''}
      </Text>
    </View>
  );
}
