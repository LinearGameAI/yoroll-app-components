import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appInventoryScopes, assetKind } from './app-inventory.mjs';
import { isArtwork } from './artwork-paths.mjs';
import { readArtworkPrompts } from './artwork.mjs';

const [appRoot, ref = 'HEAD', extra] = process.argv.slice(2);
if (!appRoot || extra !== undefined) {
  throw new Error('Usage: npm run sync:artwork -- /path/to/YorollApp [commit]');
}

function git(...args) {
  return execFileSync('git', ['-C', appRoot, ...args], { maxBuffer: 64 * 1024 * 1024 });
}

const revision = git('rev-parse', '--verify', '--end-of-options', ref + '^{commit}').toString().trim();
git('cat-file', '-e', revision + ':src/theme/tokens.ts');

const files = new Map(git('ls-tree', '-r', '-z', '--full-tree', revision, '--', ...appInventoryScopes)
  .toString().split('\0').flatMap((entry) => {
    const match = /^100(?:644|755) blob ([a-f0-9]+)\t(.+)$/s.exec(entry);
    return match ? [[match[2], match[1]]] : [];
  }));
const paths = [...files.keys()].sort();
const images = new Map(paths.filter((path) => assetKind(path) === 'image').map((path) => [path, 'image']));
const readBlob = (path) => git('cat-file', 'blob', files.get(path));
const promptRecords = await readArtworkPrompts(paths, images, (path) => readBlob(path).toString('utf8'));

const rasterTypes = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const originals = new Set([...images.keys()].filter((path) => isArtwork(path) && rasterTypes.has(extname(path).toLowerCase())));
if (!originals.size) throw new Error('No artwork images found in the selected YorollApp commit.');

const repository = fileURLToPath(new URL('../', import.meta.url));
const destination = join(repository, 'artwork');
const staging = await mkdtemp(join(repository, '.artwork-'));
const next = join(staging, 'next');
const previous = join(staging, 'previous');
let keepBackup = false;

try {
  const assets = [];
  for (const path of originals) {
    const content = readBlob(path);
    if (!content.length || (content.length < 512 && content.toString('utf8').startsWith('version https://git-lfs.github.com/spec/'))) {
      throw new Error('Missing original artwork bytes for ' + path);
    }
    const target = join(next, 'originals', path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);

    const prompts = promptRecords.get(path)?.map(({ source, method, created, references, stages }) => ({
      source,
      ...(typeof method === 'string' ? { method } : {}),
      ...(typeof created === 'string' ? { created } : {}),
      references: references.filter((reference) => originals.has(reference)),
      stages,
    }));
    assets.push({ path, bytes: content.length, ...(prompts ? { prompts } : {}) });
  }
  await writeFile(join(next, 'catalog.json'), JSON.stringify({ revision, assets }, null, 2) + '\n');

  let hasPrevious = true;
  try {
    await rename(destination, previous);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    hasPrevious = false;
  }
  try {
    await rename(next, destination);
  } catch (error) {
    if (hasPrevious) {
      try {
        await rename(previous, destination);
      } catch {
        keepBackup = true;
        throw new Error('Previous artwork snapshot is available at ' + previous, { cause: error });
      }
    }
    throw error;
  }

  const promptCount = assets.reduce((total, asset) => total + (asset.prompts ?? [])
    .reduce((steps, record) => steps + record.stages.length, 0), 0);
  console.log(`Exported ${assets.length} original images and ${promptCount} prompt stages from ${revision.slice(0, 8)}.`);
} finally {
  if (!keepBackup) await rm(staging, { recursive: true, force: true });
}
