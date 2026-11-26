import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { IconClose } from '@yoroll/rn-icon';
import { YButton, dialogMetrics, useTheme } from '@yoroll/app-components';

export default function ConfirmDialog() {
  const { tokens } = useTheme();
  const [result, setResult] = useState('');
  const { maxWidth, borderRadius, padding, gap } = dialogMetrics.centered;
  return (
    <View style={{ width: '100%', maxWidth: Math.min(330, maxWidth), borderRadius, padding, gap, borderWidth: 1,
      backgroundColor: tokens.bgSecondary, borderColor: tokens.cardStroke }}>
      {result ? (
        <>
          <Text accessibilityLiveRegion="polite" style={{ color: tokens.textPrimary, fontWeight: '600', fontSize: 17 }}>{result}</Text>
          <YButton label="再次预览" variant="outline" fullWidth onPress={() => setResult('')} />
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: tokens.textPrimary, fontWeight: '700', fontSize: 18 }}>保存修改？</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="关闭确认框" onPress={() => setResult('已关闭')}
              style={{ width: 44, height: 44, margin: -9, alignItems: 'center', justifyContent: 'center' }}>
              <IconClose size={20} color={tokens.textSecondary} />
            </Pressable>
          </View>
          <Text style={{ color: tokens.textSecondary, fontSize: 14, lineHeight: 21 }}>保存后会应用更新后的资料。</Text>
          <YButton label="保存修改" size="lg" fullWidth onPress={() => setResult('已保存修改')} />
          <YButton label="放弃修改" size="lg" fullWidth variant="secondary" onPress={() => setResult('已放弃修改')} />
        </>
      )}
    </View>
  );
}
