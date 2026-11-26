import { useState } from 'react';
import { View } from 'react-native';
import { YSheet, YButton, YChoiceGroup } from '@yoroll/app-components';

export default function Example() {
  const [variant, setVariant] = useState<'' | 'standard' | 'model' | 'drama'>('');
  const [value, setValue] = useState('zh');
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <YButton size="sm" label="标准弹层" onPress={() => setVariant('standard')} />
        <YButton size="sm" label="模型弹层" variant="secondary" onPress={() => setVariant('model')} />
        <YButton size="sm" label="播放器弹层" variant="outline" onPress={() => setVariant('drama')} />
      </View>
      <YSheet variant={variant || 'standard'} visible={Boolean(variant)} title="选择显示语言" onClose={() => setVariant('')} closeLabel="关闭弹层"
        footer={<YButton label="应用" fullWidth onPress={() => setVariant('')} />}>
        <YChoiceGroup label="语言" value={value} onChange={setValue}
          items={[{ key: 'zh', label: '简体中文' }, { key: 'en', label: 'English' }]} />
      </YSheet>
    </View>
  );
}
