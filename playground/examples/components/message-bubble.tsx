import { View } from 'react-native';
import { YMessageBubble, YAvatar } from '@yoroll/app-components';

export default function Example() {
  return (
    <View style={{ gap: 10 }}>
      <YMessageBubble variant="narration" text="海风把路灯吹得轻轻晃动。" />
      <YMessageBubble text="你也在等那班船吗？" leading={<YAvatar name="月光" size={30} />} />
      <YMessageBubble variant="user" text="我在等一个人。" />
    </View>
  );
}
