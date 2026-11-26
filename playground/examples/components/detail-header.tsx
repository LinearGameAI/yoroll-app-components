import { YDetailHeader, YBadge } from '@yoroll/app-components';

export default function Example() {
  return (
    <YDetailHeader title="雾岛来信" subtitle="月光旅人 · 互动故事"
      cover="./artwork/originals/assets/login-covers/cover-01.jpg" tags={<YBadge label="奇幻" variant="brand" />} detail="循着灯塔的光，找到寄给你的信。" />
  );
}
