import { View } from 'react-native';
import { YMediaCard, YBadge } from '@yoroll/app-components';

export default function Example() {
  return (
    <View style={{ gap: 12 }}>
      <YMediaCard variant="channel" title="雾岛剧场" subtitle="互动短剧" cover="./artwork/originals/assets/login-covers/cover-01.jpg" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <YMediaCard variant="discover" title="月光旅人" tags={['奇幻']} cover="./artwork/originals/assets/login-covers/cover-01.jpg" style={{ flex: 1 }} />
        <YMediaCard variant="profile" title="创作作品" subtitle="公开发布" gradient={['#315052', '#17171A']}
          badge={<YBadge label="已发布" variant="media" />} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
