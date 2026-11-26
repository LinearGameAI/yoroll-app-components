import { useState } from 'react';
import { View } from 'react-native';
import { YWebCapsule, YToast } from '@yoroll/app-components';

export default function Example() {
  const [message, setMessage] = useState('');
  return (
    <View style={{ backgroundColor: '#293537', padding: 14, borderRadius: 12, gap: 8 }}>
      <YWebCapsule moreLabel="更多操作" closeLabel="关闭活动" onMore={() => setMessage('打开更多菜单')}
        onClose={() => setMessage('关闭宿主')} />
      <YToast message={message} onHidden={() => setMessage('')} />
    </View>
  );
}
