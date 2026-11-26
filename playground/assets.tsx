import { useEffect, useState } from 'react';
import { isArtwork } from '../scripts/artwork-paths.mjs';
import { artStyles, artworkFamily } from './artStyles';
import { CopyButton, DirectoryHeading, SourceLink } from './controls';
import type { Asset, Inventory } from './inventoryData';

type Artwork = Pick<Asset, 'path' | 'bytes' | 'previewUrl' | 'prompts'> &
  Partial<Pick<Asset, 'availability' | 'usedBy'>>;
type GalleryRoute = '#assets' | '#app-assets';

const pageSize = 30;
const families = new Map([
  ['all', '全部风格'],
  ...artStyles.map(({ id, name }) => [id, name] as const),
  ['other', '其他素材'],
]);
const formatSize = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 });
const familyHref = (route: GalleryRoute, family: string) => family === 'all' ? route : route + '/' + family;
const filename = (path: string) => path.split('/').at(-1) ?? path;
const publicOriginal = (path: string) => './artwork/originals/' + path.split('/').map(encodeURIComponent).join('/');

export function inventoryArtwork(inventory: Inventory) {
  return inventory.assets.filter((asset) => asset.kind === 'image' && isArtwork(asset.path));
}

function readPublicArtwork(): Artwork[] | null {
  const data = document.getElementById('artwork-data')?.textContent;
  if (!data) return null;
  try {
    const { assets } = JSON.parse(data) as { assets: Artwork[] };
    return assets.map((asset) => ({ ...asset, previewUrl: publicOriginal(asset.path) }));
  } catch {
    return null;
  }
}

function StyleGuide({ assets }: { assets: Artwork[] }) {
  const images = new Map(assets.map((asset) => [asset.path, asset]));
  return (
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
                  <img src={previewUrl} loading="lazy" decoding="async" alt={filename(path)} />
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
                <div className="reference-title"><strong>延展提示词</strong><CopyButton code={prompt} label="复制延展提示词" /></div>
                <p>{prompt}</p>
              </div>
              <a className="inline-source" href={familyHref('#assets', id)}>查看这一类素材</a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function AssetsPage({ inventory, view }: { inventory: Inventory | null; view?: string }) {
  const [publicArtwork] = useState(() => inventory ? null : readPublicArtwork());
  const artwork = inventory ? inventoryArtwork(inventory) : publicArtwork;
  const guide = view === 'styles';

  return (
    <>
      <DirectoryHeading title="图素">
        {guide ? '对照 App 代表素材、色板和材质。将延展提示词中的【占位文字】换成新素材的主题。'
          : '按风格浏览 App 原图，下载素材并复制已归档的生成提示词。'}
      </DirectoryHeading>
      <nav className="directory-tabs" aria-label="图素视图">
        <a href="#assets" aria-current={!guide ? 'page' : undefined}>素材图库</a>
        <a href="#assets/styles" aria-current={guide ? 'page' : undefined}>风格指南</a>
      </nav>
      {!artwork ? <p className="empty" role="alert">素材图库加载失败，请刷新页面。</p> : guide
        ? <StyleGuide assets={artwork} />
        : <ArtworkInventory assets={artwork} route="#assets" family={view} revision={inventory?.revision} />}
    </>
  );
}

function ArtworkCard({ asset, revision }: { asset: Artwork; revision?: string }) {
  const { path, previewUrl, bytes, usedBy, prompts } = asset;
  const title = filename(path);
  const [dimensions, setDimensions] = useState('');
  const stages = (prompts ?? []).flatMap((record) => record.stages);
  const copyText = stages.length === 1 ? stages[0].text
    : stages.map(({ label, text }, index) => `${index + 1}. ${label}\n${text}`).join('\n\n');

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
        <small>{families.get(artworkFamily(path))} · {dimensions && dimensions + ' · '}{formatSize.format(bytes / 1024)} KB</small>
        <div className="asset-actions">
          {!!stages.length && <CopyButton code={copyText} label={stages.length > 1 ? '复制全部提示词' : '复制提示词'} />}
          {previewUrl && <a href={previewUrl} download={title} className="inline-source">下载原图</a>}
        </div>
        {revision && <>
          <code>{path}</code>
          <div className="reference-title">
            <SourceLink path={path} revision={revision}>App 文件</SourceLink>
            <CopyButton code={path} label="复制路径" />
          </div>
          {!!usedBy?.length && <details className="asset-usage">
            <summary>{usedBy.length} 处静态引用</summary>
            <ul className="source-files">{usedBy.map((path) => <li key={path}><SourceLink path={path} revision={revision}>{path}</SourceLink></li>)}</ul>
          </details>}
        </>}
        {prompts?.length ? <details className="asset-usage asset-prompts">
          <summary>{stages.length} 段原始提示词</summary>
          {prompts.map(({ source, method, created, references, stages }, index) => (
            <div className="art-prompt" key={source + index}>
              {revision
                ? <SourceLink path={source} revision={revision}>提示词源文件</SourceLink>
                : <small>{filename(source)}</small>}
              {(method || created) && <small>{[method, created].filter(Boolean).join(' · ')}</small>}
              {stages.map(({ label, field, text }) => (
                <div className="prompt-stage" key={field}>
                  <div className="reference-title"><strong>{label}</strong><CopyButton code={text} label="复制本段提示词" /></div>
                  <p>{text}</p>
                </div>
              ))}
              {references.length > 0 && <>
                <strong>参考原图</strong>
                <ul className="source-files">{references.map((reference) => (
                  <li key={reference}>{revision
                    ? <SourceLink path={reference} revision={revision}>{filename(reference)}</SourceLink>
                    : <a className="inline-source" href={publicOriginal(reference)} target="_blank" rel="noreferrer">{filename(reference)}</a>}</li>
                ))}</ul>
              </>}
            </div>
          ))}
        </details> : <small>暂无已归档的原始提示词</small>}
      </div>
    </article>
  );
}

export function ArtworkInventory({ assets, route, family, revision }: {
  assets: Artwork[]; route: GalleryRoute; family?: string; revision?: string;
}) {
  const category = family && families.has(family) ? family : 'all';
  const [query, setQuery] = useState('');
  const [recordedOnly, setRecordedOnly] = useState(false);
  const [limit, setLimit] = useState(pageSize);
  useEffect(() => setLimit(pageSize), [category]);

  const style = artStyles.find((item) => item.id === category);
  const byPath = new Map(assets.map((image) => [image.path, image]));
  const featured = artStyles.flatMap(({ samples }) => {
    const image = samples.map((sample) => byPath.get(sample)).find(Boolean);
    return image ? [image] : [];
  });
  const preferred = new Set(featured.map((image) => image.path));
  const ordered = [...featured, ...assets.filter((asset) => !preferred.has(asset.path))];

  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = ordered.filter((asset) => {
    const assetCategory = artworkFamily(asset.path);
    if ((category !== 'all' && category !== assetCategory) || (recordedOnly && !asset.prompts?.length)) return false;
    if (!keywords.length) return true;
    const text = [
      asset.path, families.get(assetCategory), ...(asset.usedBy ?? []),
      ...(asset.prompts ?? []).flatMap((record) => [record.source, ...record.stages.map((stage) => stage.text)]),
    ].join(' ').toLowerCase();
    return keywords.every((word) => text.includes(word));
  });
  const hasOther = assets.some((asset) => artworkFamily(asset.path) === 'other');

  return (
    <>
      <nav className="directory-tabs art-families" aria-label="素材风格">
        {[...families].filter(([id]) => id !== 'other' || hasOther).map(([id, label]) => (
          <a key={id} href={familyHref(route, id)} aria-current={id === category ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      {style && <div className="art-style-summary">
        <div><strong>{style.name}</strong><p>{style.direction}</p></div>
        <CopyButton code={style.prompt} label="复制延展提示词" />
      </div>}
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索 App 图素" placeholder="搜索素材名、路径或提示词" value={query} onChange={(event) => {
          setQuery(event.currentTarget.value);
          setLimit(pageSize);
        }} />
        <label className="art-filter"><input type="checkbox" checked={recordedOnly} onChange={(event) => {
          setRecordedOnly(event.currentTarget.checked);
          setLimit(pageSize);
        }} />有原始提示词</label>
      </div>
      <p className="directory-count" aria-live="polite">{shown.length} 张素材图 · {shown.filter((asset) => asset.prompts?.length).length} 张有原始提示词</p>
      {!shown.length && <p className="empty">没有匹配的素材图。</p>}
      <div className="asset-grid">
        {shown.slice(0, limit).map((asset) => <ArtworkCard key={asset.path} asset={asset} revision={revision} />)}
      </div>
      {shown.length > limit && <button className="directory-more" type="button" onClick={() => setLimit(limit + pageSize)}>显示更多素材</button>}
    </>
  );
}
