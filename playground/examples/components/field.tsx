import { useState } from 'react';
import { YField, YTextInput } from '@yoroll/app-components';

export default function Example() {
  const [name, setName] = useState('月光旅人');
  return (
    <YField label="角色名称" required counter={name.length + '/30'} detail="公开展示的名称。">
      <YTextInput accessibilityLabel="角色名称" value={name} onChangeText={setName} maxLength={30} />
    </YField>
  );
}
