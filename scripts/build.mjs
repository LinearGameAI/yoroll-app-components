import { createHash } from 'node:crypto';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { loadCatalog } from './catalog.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const appPath = args[0] === '--app-root' ? args[1] : undefined;
if (args.length && (!appPath || args.length !== 2)) {
  throw new Error('Usage: node scripts/build.mjs [--app-root /path/to/YorollApp]');
}
const outdir = appPath ? 'dist-app' : 'dist';
const output = join(repository, outdir);
await rm(output, { recursive: true, force: true });
const catalog = await loadCatalog(repository);
let dataId;
let data;
if (appPath) {
  const { buildAppInventory } = await import('./app-inventory.mjs');
  const inventory = await buildAppInventory(appPath, output);
  const { sources, assets } = inventory;
  const motionCount = sources.reduce((count, source) => count + source.motions.length, 0);
  console.log(`Indexed ${sources.length} App UI source files, ${assets.length} assets and ${motionCount} motion calls.`);
  dataId = 'app-inventory-data';
  data = inventory;
} else {
  const artwork = join(repository, 'artwork');
  dataId = 'artwork-data';
  data = JSON.parse(await readFile(join(artwork, 'catalog.json'), 'utf8'));
  await cp(artwork, join(output, 'artwork'), { recursive: true });
}

const referencePrompts = JSON.parse(await readFile(join(repository, 'playground/artwork-reference-prompts.json'), 'utf8'));
const originals = join(output, appPath ? 'app-assets' : 'artwork/originals');
await Promise.all(data.assets.map(async (asset) => {
  const reference = referencePrompts[asset.path];
  if (!reference || asset.prompts?.length || (appPath && asset.availability !== 'preview')) return;
  const image = await readFile(join(originals, asset.path));
  if (createHash('sha256').update(image).digest('hex') === reference.sha256) {
    asset.referencePrompt = reference.text;
  }
}));
const pageData = JSON.stringify(data).replaceAll('<', '\\u003c');

const result = await build({
  absWorkingDir: repository,
  entryPoints: ['playground/main.tsx'],
  outdir,
  entryNames: 'assets/catalog-[hash]',
  bundle: true,
  minify: true,
  metafile: true,
  plugins: [catalog.plugin],
  target: 'es2022',
  platform: 'browser',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  alias: { 'react-native': 'react-native-web' },
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
  define: {
    __DEV__: 'false',
    __APP_INVENTORY__: JSON.stringify(!!appPath),
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
    'process.env.EXPO_OS': '"web"',
  },
});

const [script, { cssBundle }] = Object.entries(result.metafile.outputs)
  .find(([, details]) => details.entryPoint === 'playground/main.tsx');

await catalog.writeRegistry(output);
await cp(join(repository, 'playground/homepage'), join(output, 'homepage'), { recursive: true });
await writeFile(join(output, appPath ? 'app-inventory.json' : 'artwork/catalog.json'),
  appPath ? JSON.stringify(data) : JSON.stringify(data, null, 2) + '\n');

await writeFile(join(output, 'index.html'), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Yoroll App 的 React Native 组件、设计 Token、动效规则和图素目录。">
    <title>Yoroll App 组件库</title>
    <link rel="stylesheet" href="./${cssBundle.slice(outdir.length + 1)}">
    <script defer src="./${script.slice(outdir.length + 1)}"></script>
  </head>
  <body>
    <div id="root"></div>
    <script id="${dataId}" type="application/json">${pageData}</script>
    <noscript>请启用 JavaScript 查看组件预览。</noscript>
  </body>
</html>
`);
console.log(`Built ${outdir}/index.html`);
