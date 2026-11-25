import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const repository = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  absWorkingDir: repository,
  entryPoints: ['playground/main.tsx'],
  outdir: 'dist',
  entryNames: 'assets/catalog-[hash]',
  bundle: true,
  minify: true,
  metafile: true,
  target: 'es2022',
  platform: 'browser',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  alias: { 'react-native': 'react-native-web' },
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
  define: {
    __DEV__: 'false',
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
    'process.env.EXPO_OS': '"web"',
  },
});

const [script, { cssBundle }] = Object.entries(result.metafile.outputs)
  .find(([, details]) => details.entryPoint === 'playground/main.tsx');

await writeFile(join(repository, 'dist/index.html'), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Yoroll App 的 React Native 基础组件、交互预览和使用示例。">
    <title>Yoroll App 组件库</title>
    <link rel="stylesheet" href="./${cssBundle.slice('dist/'.length)}">
    <script defer src="./${script.slice('dist/'.length)}"></script>
  </head>
  <body>
    <div id="root"></div>
    <noscript>请启用 JavaScript 查看组件预览。</noscript>
  </body>
</html>
`);
console.log('Built dist/index.html');
