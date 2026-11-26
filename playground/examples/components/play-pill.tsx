import { useState } from 'react';
import { Text, View } from 'react-native';
import { YPlayPill, useTheme } from '@yoroll/app-components';

export default function PlayActions() {
  const { tokens } = useTheme();
  const [action, setAction] = useState('');
  return (
    <View style={{ gap: 8, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        <YPlayPill label="播放" onPress={() => setAction('播放')} />
        <YPlayPill label="继续观看" mode="continue" variant="brand" onPress={() => setAction('继续观看')} />
      </View>
      <Text accessibilityLiveRegion="polite" style={{ minHeight: 18, color: tokens.textSecondary }}>
        {action ? `已点击${action}` : ''}
      </Text>
    </View>
  );
}
