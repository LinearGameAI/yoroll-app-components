import { useState } from 'react';
import { artStyles, artworkFamily, isArtwork } from './artStyles';
import { CopyButton, DirectoryHeading, SourceLink } from './controls';
import type { Asset, Inventory } from './inventoryData';

const inventoryInstructions = 'https://github.com/LinearGameAI/yoroll-app-components#app-完整索引';
const pageSize = 30;
const families = new Map(artStyles.map(({ id, name }) => [id, name]));
families.set('other', '其他素材');

export function AssetsPage({ inventory }: { inventory: Inventory | null }) {
  const images = new Map(inventory?.assets.filter((asset) => asset.kind === 'image').map((asset) => [asset.path, asset]));
  return (
    <>
      <DirectoryHeading title="图素" action={inventory
        ? <a className="inline-source" href="#app-assets">浏览完整素材图库</a>
        : <a className="inline-source" href={inventoryInstructions}>在本机生成完整图库</a>}>
        App 素材的构图、材质、用色和可复制的延展提示词。把提示词中的【占位文字】换成新素材的主题。
      </DirectoryHeading>
      <div className="art-style-grid">
        {artStyles.map(({ id, name, direction, palette, samples, prompt }) => {
          const available = samples.flatMap((path) => {
            const image = images.get(path);
            return image?.previewUrl ? [image] : [];
          });
          return (
            <article className="reference-card art-style" key={id}>
              {!!available.length && <div className="art-samples">
                {available.map(({ path, previewUrl }) => (
                  <a key={path} href={previewUrl} target="_blank" rel="noreferrer">
                    <img src={previewUrl} loading="lazy" decoding="async" alt={path.split('/').at(-1)} />
                  </a>
                ))}
              </div>}
              <div className="art-palette" aria-label={name + '参考色板'}>
                {palette.map((color) => <div key={color}><span style={{ backgroundColor: color }} /><code>{color}</code></div>)}
              </div>
              <div className="reference-body art-style-body">
                <h2>{name}</h2>
                <p>{direction}</p>
                <div className="art-prompt">
                  <div className="reference-title"><strong>延展提示词</strong><CopyButton code={prompt} label="复制提示词" /></div>
                  <p>{prompt}</p>
                </div>
                {inventory && <a className="inline-source" href={`#app-assets/${id}`}>查看这一类素材</a>}
              </div>
            </article>
          );
        })}
      </div>
      {!inventory && <p className="directory-note">
        App 原图、使用位置和已归档的原始提示词可从 App checkout 生成。
        <a className="inline-source" href={inventoryInstructions}>查看生成方式</a>
      </p>}
    </>
  );
}

function ArtworkCard({ asset, revision }: { asset: Asset; revision: string }) {
  const { path, previewUrl, bytes, usedBy, prompts } = asset;
  const title = path.split('/').at(-1) ?? path;
  const [dimensions, setDimensions] = useState('');
  const sizeKb = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 }).format(bytes / 1024);
  return (
    <article className="reference-card asset-card">
      <div className="asset-field">
        {previewUrl ? <a href={previewUrl} target="_blank" rel="noreferrer" aria-label={'查看原图 ' + title}>
          <img src={previewUrl} alt={title} loading="lazy" decoding="async" onLoad={({ currentTarget }) =>
            setDimensions(currentTarget.naturalWidth + ' × ' + currentTarget.naturalHeight + ' px')} />
        </a> : <small>{asset.availability === 'lfs' ? 'Git LFS 指针' : '当前 checkout 暂无可预览文件'}</small>}
      </div>
      <div className="reference-body">
        <strong>{title}</strong>
        <code>{path}</code>
        <small>{families.get(artworkFamily(path))} · {dimensions && dimensions + ' · '}{sizeKb} KB</small>
        <div className="reference-title">
          <SourceLink path={path} revision={revision}>打开文件</SourceLink>
          <CopyButton code={path} label="复制路径" />
        </div>
        {usedBy.length > 0 && <details className="asset-usage">
          <summary>{usedBy.length} 处静态引用</summary>
          <ul className="source-files">{usedBy.map((path) => <li key={path}><SourceLink path={path} revision={revision}>{path}</SourceLink></li>)}</ul>
        </details>}
        {prompts?.length ? <details className="asset-usage asset-prompts">
          <summary>{prompts.reduce((count, record) => count + record.stages.length, 0)} 段原始提示词</summary>
          {prompts.map(({ source, method, created, references, stages }, index) => (
            <div className="art-prompt" key={source + index}>
              <SourceLink path={source} revision={revision}>提示词源文件</SourceLink>
              {(method || created) && <small>{[method, created].filter(Boolean).join(' · ')}</small>}
              {stages.map(({ label, field, text }) => (
                <div className="prompt-stage" key={field}>
                  <div className="reference-title"><strong>{label}</strong><CopyButton code={text} label="复制原始提示词" /></div>
                  <p>{text}</p>
                </div>
              ))}
              {references.length > 0 && <><strong>参考原图</strong><ul className="source-files">
                {references.map((reference) => <li key={reference}><SourceLink path={reference} revision={revision}>{reference}</SourceLink></li>)}
              </ul></>}
            </div>
          ))}
        </details> : <small>暂无已归档的原始提示词</small>}
      </div>
    </article>
  );
}

export function ArtworkInventory({ inventory, initialFamily = 'all' }: { inventory: Inventory; initialFamily?: string }) {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState(families.has(initialFamily) ? initialFamily : 'all');
  const [recordedOnly, setRecordedOnly] = useState(false);
  const [limit, setLimit] = useState(pageSize);
  const artwork = inventory.assets.filter((asset) => asset.kind === 'image' && isArtwork(asset.path));
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = artwork.filter((asset) => {
    const category = artworkFamily(asset.path);
    if ((family !== 'all' && family !== category) || (recordedOnly && !asset.prompts?.length)) return false;
    if (!keywords.length) return true;
    const text = [
      asset.path, families.get(category), ...asset.usedBy,
      ...(asset.prompts ?? []).flatMap((record) => [record.source, ...record.stages.map((stage) => stage.text)]),
    ].join(' ').toLowerCase();
    return keywords.every((word) => text.includes(word));
  });
  return (
    <>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索 App 图素" placeholder="搜索素材名、路径或提示词" value={query} onChange={(event) => {
          setQuery(event.currentTarget.value);
          setLimit(pageSize);
        }} />
        <label className="art-filter">
          风格
          <select value={family} onChange={(event) => { setFamily(event.currentTarget.value); setLimit(pageSize); }}>
            <option value="all">全部</option>
            {[...families].map(([key, name]) => <option key={key} value={key}>{name}</option>)}
          </select>
        </label>
        <label className="art-filter"><input type="checkbox" checked={recordedOnly} onChange={(event) => {
          setRecordedOnly(event.currentTarget.checked);
          setLimit(pageSize);
        }} />有原始提示词</label>
      </div>
      <p className="directory-count" aria-live="polite">{shown.length} 张素材图 · {shown.filter((asset) => asset.prompts?.length).length} 张有原始提示词</p>
      {!shown.length && <p className="empty">没有匹配的素材图。</p>}
      <div className="asset-grid">
        {shown.slice(0, limit).map((asset) => <ArtworkCard key={asset.path} asset={asset} revision={inventory.revision} />)}
      </div>
      {shown.length > limit && <button className="directory-more" type="button" onClick={() => setLimit(limit + pageSize)}>显示更多素材</button>}
    </>
  );
}
