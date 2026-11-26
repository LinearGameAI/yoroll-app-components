import { useState } from 'react';
import { View } from 'react-native';
import { YToast, YButton } from '@yoroll/app-components';

export default function Example() {
  const [message, setMessage] = useState('');
  return (
    <View style={{ minHeight: 104, gap: 12 }}>
      <YButton label="提交反馈" size="sm" onPress={() => setMessage('反馈已收到')} />
      <YToast message={message} onHidden={() => setMessage('')} />
    </View>
  );
}
