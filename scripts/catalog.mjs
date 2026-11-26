import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import ts from 'typescript';
import { loadAppPages } from './app-pages.mjs';

const variants = ['.tsx', '.ts', '.native.tsx', '.native.ts', '.ios.tsx', '.ios.ts', '.android.tsx', '.android.ts', '.web.tsx', '.web.ts'];
const installCommand = 'npm install git+https://github.com/LinearGameAI/yoroll-app-components.git';

async function readSources(root, folder) {
  const entries = await readdir(join(root, folder), { withFileTypes: true });
  const sources = new Map();
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = posix.join(folder, entry.name);
    if (entry.isDirectory()) {
      for (const [name, code] of await readSources(root, path)) sources.set(name, code);
    } else if (entry.isFile() && /\.[jt]sx?$/.test(entry.name)) {
      sources.set(path, await readFile(join(root, path), 'utf8'));
    }
  }
  return sources;
}

export async function loadCatalog(root) {
  const examples = await readSources(root, 'playground/examples');
  const sources = await readSources(root, 'src');
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const exported = ts.createSourceFile('src/index.ts', sources.get('src/index.ts'), ts.ScriptTarget.Latest);
  const components = new Map();
  for (const node of exported.statements) {
    if (!ts.isExportDeclaration(node) || node.isTypeOnly || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const match = /^\.\/components\/([A-Z]\w*)$/.exec(node.moduleSpecifier.text);
    if (match) components.set(match[1], 'src/components/' + match[1] + '.tsx');
  }

  const { screens } = await loadAppPages(root, components.keys());
  for (const { code, path } of screens.values()) {
    if (examples.has(path)) throw new Error('Duplicate screen recipe ' + path);
    examples.set(path, code + '\n');
  }

  return {
    plugin: {
      name: 'catalog-examples',
      setup(build) {
        build.onResolve({ filter: /^app-page-recipes$/ }, () => ({ path: 'app-page-recipes', namespace: 'page-recipes' }));
        build.onLoad({ filter: /.*/, namespace: 'page-recipes' }, () => ({
          contents: 'export const screenExamples = ' + JSON.stringify(Object.fromEntries([...screens].map(([id, { recipe, code }]) => [id, { recipe, code }]))),
          loader: 'js',
        }));
        build.onResolve({ filter: /^catalog-examples$/ }, () => ({ path: 'catalog-examples', namespace: 'catalog' }));
        build.onLoad({ filter: /.*/, namespace: 'catalog' }, () => {
          const imports = [];
          const entries = [];
          for (const [path, code] of examples) {
            if (!/^playground\/examples\/(components|blocks)\/.+\.tsx$/.test(path)) continue;
            const id = path.slice('playground/examples/'.length, -'.tsx'.length);
            const name = 'Example' + imports.length;
            imports.push('import ' + name + ' from ' + JSON.stringify('./' + path.slice('playground/'.length)) + ';');
            entries.push(JSON.stringify(id) + ': { Preview: ' + name + ', code: ' + JSON.stringify(code.trimEnd()) + ' }');
          }
          const module = imports.join('\n') + '\nexport const examples = {' + entries.join(',\n') + '};';
          return { contents: module, resolveDir: join(root, 'playground'), loader: 'js' };
        });
      },
    },

    async writeRegistry(outdir) {
      const folder = join(outdir, 'r');
      await mkdir(folder, { recursive: true });
      const items = [];

      const add = async ({ id, name, type, entry, paths, docs }) => {
        const files = new Map();
        const packages = new Set();
        function collect(path) {
          if (files.has(path)) return;
          const content = sources.get(path) ?? examples.get(path);
          if (!content) throw new Error('Missing catalog source ' + path);
          files.set(path, { path, content });
          for (const imported of ts.preProcessFile(content, true).importedFiles) {
            const specifier = imported.fileName;
            if (!specifier.startsWith('.')) {
              const segments = specifier.split('/');
              packages.add(segments.slice(0, specifier.startsWith('@') ? 2 : 1).join('/'));
              continue;
            }
            const base = posix.normalize(posix.join(posix.dirname(path), specifier));
            const candidates = [base, ...variants.map((extension) => base + extension), base + '/index.ts'];
            const resolved = candidates.filter((candidate) => sources.has(candidate) || examples.has(candidate));
            if (!resolved.length) throw new Error('Unresolved registry import ' + specifier + ' in ' + path);
            for (const dependency of resolved) collect(dependency);
          }
          const base = path.replace(/\.(?:native\.|ios\.|android\.|web\.)?tsx?$/, '');
          for (const suffix of variants) {
            if (sources.has(base + suffix)) collect(base + suffix);
          }
        }

        for (const path of paths) collect(path);
        const dependencies = Object.fromEntries([...packages].sort().map((name) => {
          const version = manifest.dependencies?.[name] ?? manifest.peerDependencies?.[name] ?? manifest.devDependencies?.[name];
          if (!version && name !== manifest.name) throw new Error('Undeclared registry dependency ' + name);
          return [name, name === manifest.name ? 'git+https://github.com/LinearGameAI/yoroll-app-components.git' : version];
        }));
        const descriptor = { id, name, type, docs, item: './r/' + id + '.json' };
        items.push(descriptor);
        await writeFile(join(folder, id + '.json'), JSON.stringify({
          formatVersion: 1, ...descriptor, entry, dependencies,
          peerDependencies: manifest.peerDependencies, files: [...files.values()],
        }, null, 2) + '\n');
      };

      for (const [name, entry] of components) {
        const id = name.toLowerCase();
        await add({ id, name, type: 'component', entry, paths: [entry], docs: './#' + id });
      }
      for (const entry of examples.keys()) {
        if (!entry.startsWith('playground/examples/blocks/') || !entry.endsWith('.tsx')) continue;
        const id = posix.basename(entry, '.tsx');
        await add({ id, name: id, type: 'block', entry, paths: [entry], docs: './#blocks/' + id });
      }
      for (const [id, { path }] of screens) {
        await add({ id: 'page-' + id, name: id, type: 'page', entry: path, paths: [path], docs: './#pages/' + id });
      }
      await writeFile(join(outdir, 'registry.json'), JSON.stringify({
        formatVersion: 1, name: manifest.name, installCommand, items,
      }, null, 2) + '\n');
    },
  };
}
