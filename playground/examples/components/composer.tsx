import { useState } from 'react';
import { View } from 'react-native';
import { YComposer, YMessageBubble } from '@yoroll/app-components';

export default function Example() {
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  return (
    <View style={{ gap: 12 }}>
      {message && <YMessageBubble variant="user" text={message} />}
      <YComposer value={draft} onChangeText={setDraft} onSend={(text) => { setMessage(text); setDraft(''); }}
        placeholder="输入消息" sendLabel="发送" />
    </View>
  );
}
