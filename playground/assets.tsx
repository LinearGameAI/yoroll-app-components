import { useState, type ComponentType } from 'react';
import * as Icons from '@yoroll/rn-icon';
import type { IconProps } from '@yoroll/rn-icon';
import { CopyButton, DirectoryHeading, Segmented } from './controls';

const icons = Object.entries(Icons).filter(([name]) => /^Icon[A-Z]/.test(name))
  .sort(([left], [right]) => left.localeCompare(right));
const iconSizes = [{ key: '16', label: '16 pt' }, { key: '24', label: '24 pt' }, { key: '32', label: '32 pt' }] as const;
type IconSize = typeof iconSizes[number]['key'];
const pageSize = 48;

export function AssetsPage({ showAppInventory }: { showAppInventory: boolean }) {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<IconSize>('24');
  const [limit, setLimit] = useState(pageSize);
  const matches = icons.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <DirectoryHeading title="图素" action={<a className="inline-source" href="https://lineargameai.github.io/linear-game-icons/">打开图标库</a>}>
        在浏览器里查看 App 使用的 <code>@yoroll/rn-icon</code> 图标库，复制 React Native 导入和调用代码。
      </DirectoryHeading>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索图标" placeholder="搜索图标名" value={query} onChange={(event) => { setQuery(event.currentTarget.value); setLimit(pageSize); }} />
        <Segmented items={iconSizes} value={size} onChange={setSize} label="图标预览尺寸" />
      </div>
      <p className="directory-count" aria-live="polite">{matches.length} 个图标</p>
      {!matches.length && <p className="empty">没有匹配的图标。</p>}
      <div className="icon-grid">
        {matches.slice(0, limit).map(([name, component]) => {
          const Icon = component as ComponentType<IconProps>;
          return (
            <article className="reference-card icon-card" key={name}>
              <div className="icon-field"><Icon size={Number(size)} color="currentColor" /></div>
              <code>{name}</code>
              <CopyButton code={`import { ${name} } from '@yoroll/rn-icon';\n\n<${name} size={${size}} color={tokens.textPrimary} />`} label="复制用法" />
            </article>
          );
        })}
      </div>
      {matches.length > limit && <button className="directory-more" type="button" onClick={() => setLimit(limit + pageSize)}>显示更多图标</button>}
      <p className="directory-note">
        {showAppInventory
          ? <a className="inline-source" href="#app-assets">查看 App 中的插画、品牌、字体和原生资源</a>
          : <>App 原始图素和使用位置可从 App checkout 生成。<a className="inline-source" href="https://github.com/LinearGameAI/yoroll-app-components#app-完整索引">生成说明</a></>}
      </p>
    </>
  );
}
