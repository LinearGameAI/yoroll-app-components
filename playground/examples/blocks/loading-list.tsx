import { useState } from 'react';
import { Text, View } from 'react-native';
import { SkeletonBlock, YButton, YTab, layout, useTheme } from '@yoroll/app-components';

const tabs = [{ key: 'content', label: '内容' }, { key: 'saved', label: '收藏' }];
const samples = [
  { key: 'recent', label: '最近更新', detail: '查看新内容' },
  { key: 'recommended', label: '为你推荐', detail: '浏览精选' },
];

export default function LoadingList() {
  const { tokens } = useTheme();
  const [active, setActive] = useState('content');
  const [loading, setLoading] = useState(true);
  return (
    <View style={{ width: '100%', maxWidth: 330, gap: 10, padding: layout.gutter, backgroundColor: tokens.bgPrimary,
      borderRadius: 16, borderWidth: 1, borderColor: tokens.cardStroke }}>
      <YTab items={tabs} active={active} onChange={setActive} variant="segment" />
      {loading ? (
        <View accessibilityLabel="正在加载" accessibilityState={{ busy: true }} style={{ gap: 8 }}>
          {samples.map(({ key }) => <SkeletonBlock key={key} style={{ width: '100%', height: 48, borderRadius: 8 }} />)}
        </View>
      ) : active === 'saved' ? (
        <Text style={{ minHeight: 104, paddingVertical: 15, color: tokens.textTertiary }}>暂无收藏</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {samples.map(({ key, label, detail }) => (
            <View key={key} style={{ minHeight: 48, borderRadius: 8, padding: 8, backgroundColor: tokens.bgSecondary }}>
              <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>{label}</Text>
              <Text style={{ color: tokens.textSecondary, fontSize: 12 }}>{detail}</Text>
            </View>
          ))}
        </View>
      )}
      <YButton label={loading ? '查看加载结果' : '重播加载'} variant="outline" fullWidth onPress={() => setLoading(!loading)} />
    </View>
  );
}
