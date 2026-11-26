import { useState } from 'react';
import { YUploadGrid } from '@yoroll/app-components';

export default function Example() {
  const [attached, setAttached] = useState(true);
  return (
    <YUploadGrid items={attached ? [{ id: 'cover', uri: './artwork/originals/assets/login-covers/cover-01.jpg', label: '封面预览' }] : []}
      limit={1} addLabel="添加图片" removeLabel={() => '移除图片'} onAdd={() => setAttached(true)} onRemove={() => setAttached(false)} />
  );
}
