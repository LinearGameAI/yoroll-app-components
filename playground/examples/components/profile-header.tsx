import { YProfileHeader, YBadge } from '@yoroll/app-components';

export default function Example() {
  return (
    <YProfileHeader name="月光旅人" subtitle="互动故事创作者" bio="欢迎来我的故事世界。"
      cover="./artwork/originals/assets/login-covers/cover-01.jpg" badge={<YBadge label="创作者" variant="brand" />}
      stats={[{ id: 'followers', value: '1,284', label: '关注者' }, { id: 'works', value: '8', label: '作品' }]} />
  );
}
