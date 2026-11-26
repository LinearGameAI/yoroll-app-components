import { View } from 'react-native';
import { YBadge } from '@yoroll/app-components';

export default function Example() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      <YBadge label="草稿" /><YBadge label="推荐" variant="brand" />
      <YBadge label="已发布" variant="positive" /><YBadge label="需修改" variant="warning" />
      <YBadge label="短剧" variant="media" />
    </View>
  );
}
