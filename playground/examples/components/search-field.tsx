import { useState } from 'react';
import { YSearchField } from '@yoroll/app-components';

export default function Example() {
  const [query, setQuery] = useState('月光');
  return (
    <YSearchField value={query} onChangeText={setQuery} label="搜索游戏" clearLabel="清空搜索" />
  );
}
