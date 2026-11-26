import { useState } from 'react';
import { IconAppfeed, IconGenerate, IconHomepage, IconHomepageFilled, IconMe, IconMessage } from '@yoroll/rn-icon';
import { YBottomNav } from '@yoroll/app-components';

export default function Example() {
  const [active, setActive] = useState('home');
  return (
    <YBottomNav active={active} onChange={setActive} safeArea={false} items={[
      { key: 'home', label: '首页', icon: IconHomepage, activeIcon: IconHomepageFilled },
      { key: 'discover', label: '发现', icon: IconGenerate },
      { key: 'feed', label: '精选', icon: IconAppfeed },
      { key: 'messages', label: '消息', icon: IconMessage, unread: true },
      { key: 'me', label: '我的', icon: IconMe },
    ]} />
  );
}
