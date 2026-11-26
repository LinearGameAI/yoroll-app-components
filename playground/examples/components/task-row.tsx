import { useState } from 'react';
import { YTaskRow } from '@yoroll/app-components';

export default function Example() {
  const [claimed, setClaimed] = useState(false);
  return (
    <YTaskRow title="完成三次对话" detail="每日刷新" reward="+20 Treats"
      status={claimed ? 'complete' : 'claimable'} actionLabel={claimed ? '已完成' : '领取'} onAction={() => setClaimed(true)} />
  );
}
