import { useState } from 'react';
import { YInboxRow } from '@yoroll/app-components';

export default function Example() {
  const [unread, setUnread] = useState(true);
  return (
    <YInboxRow title="月光旅人" preview="你看见海岸上的灯了吗？" timestamp="刚刚" unread={unread}
      unreadLabel="未读" onPress={() => setUnread(false)} />
  );
}
