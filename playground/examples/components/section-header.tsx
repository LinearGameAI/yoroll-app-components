import { YSectionHeader, YBadge } from '@yoroll/app-components';

export default function Example() {
  return (
    <YSectionHeader title="每日任务" subtitle="完成后领取 Treats" trailing={<YBadge label="进行中" variant="brand" />} />
  );
}
