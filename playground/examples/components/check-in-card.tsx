import { useState } from 'react';
import { YCheckInCard } from '@yoroll/app-components';

export default function Example() {
  const [claimed, setClaimed] = useState(false);
  return (
    <YCheckInCard title="每日签到" detail="每天刷新奖励" status={claimed ? 'complete' : 'claimable'}
      actionLabel={claimed ? '已领取' : '签到'} onAction={() => setClaimed(true)} days={[
        { id: '1', label: '第 1 天', amount: '+10', status: 'claimed' },
        { id: '2', label: '今天', amount: '+30', status: claimed ? 'claimed' : 'today' },
        { id: '3', label: '第 3 天', amount: '+50', status: 'upcoming' },
      ]} />
  );
}
