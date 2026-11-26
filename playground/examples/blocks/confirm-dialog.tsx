import { useState } from 'react';
import { Text, View } from 'react-native';
import { YButton, YDialog, useTheme } from '@yoroll/app-components';

export default function ConfirmDialog() {
  const { tokens } = useTheme();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  const resolve = (message: string) => { setOpen(false); setResult(message); };
  return (
    <View style={{ width: '100%', maxWidth: 330, gap: 12 }}>
      <YButton label={result ? '再次预览' : '打开修改确认框'} variant="outline" fullWidth onPress={() => setOpen(true)} />
      {result && <Text accessibilityLiveRegion="polite" style={{ color: tokens.textPrimary }}>{result}</Text>}
      <YDialog visible={open} title="保存修改？" description="保存后会应用更新后的资料。"
        closeLabel="关闭确认框" onClose={() => resolve('已关闭')}
        primary={{ label: '保存修改', onPress: () => resolve('已保存修改') }}
        secondary={{ label: '放弃修改', onPress: () => resolve('已放弃修改') }} />
    </View>
  );
}
