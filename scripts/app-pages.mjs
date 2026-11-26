import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const entriesFile = 'playground/app-pages.json';
const sourceFolder = 'playground/examples/screens';

export async function loadAppPages(root, components) {
  const data = JSON.parse(await readFile(join(root, entriesFile), 'utf8'));
  const modelSource = await readFile(join(root, sourceFolder, 'screenModel.ts'), 'utf8');
  const compiled = ts.transpileModule(modelSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const { screenParts } = await import('data:text/javascript,' + encodeURIComponent(compiled));
  const groupIds = new Set(data.groups.map(({ id }) => id));
  const ids = new Set(data.entries.map(({ id }) => id));
  const paths = new Set(data.entries.map(({ route }) => route));

  assert.match(data.revision, /^[0-9a-f]{40}$/);
  assert.equal(groupIds.size, data.groups.length, 'Duplicate App page group');
  assert.equal(ids.size, data.entries.length, 'Duplicate App page id');
  assert.equal(paths.size, data.entries.length, 'Duplicate App route file');
  const knownComponents = new Set(components ?? []);
  const screens = new Map();

  for (const entry of data.entries) {
    assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(entry.route, /^app\/.+\.tsx$/);
    assert(groupIds.has(entry.group), 'Unknown page group ' + entry.group);
    if (entry.target) {
      assert(entry.target !== entry.id, 'Page refers to itself: ' + entry.id);
      assert(ids.has(entry.target), 'Unknown page target ' + entry.target);
    }
    for (const child of entry.children ?? []) assert(ids.has(child), 'Unknown navigation child ' + child);
    const parts = (entry.parts ?? []).map(({ part, source, related }) => {
      assert(Object.hasOwn(screenParts, part.kind), 'Unknown screen section ' + part.kind);
      if (part.step !== undefined) assert(Number.isInteger(part.step) && Boolean(entry.steps?.[part.step]), 'Unknown step in ' + entry.id);
      assert(source?.[0], 'Missing screen reference for ' + entry.id + ' / ' + part.label);
      if (components) for (const component of [...screenParts[part.kind], ...(related ?? [])]) {
        assert(knownComponents.has(component), 'Unknown design component ' + component);
      }
      return part;
    });
    if (entry.kind === 'screen' || entry.kind === 'debug') assert(parts.length, 'Missing preview for ' + entry.id);
    if (!parts.length || (entry.kind === 'layout' && !entry.states)) continue;

    const recipe = { title: entry.title, appearance: entry.appearance, shell: entry.shell, activeTab: entry.shell === 'tab' ? entry.id : undefined,
      footer: entry.footer, secondary: entry.secondary, steps: entry.steps, completeLabel: entry.completeLabel, parts };
    const name = entry.id.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('') + 'ScreenExample';
    const code = [
      "import { ScreenComposition } from './screen-composition';",
      "import type { ScreenRecipe } from './screenModel';",
      '',
      'const recipe: ScreenRecipe = ' + JSON.stringify(recipe, null, 2) + ';',
      '',
      'export default function ' + name + '() {',
      '  return <ScreenComposition recipe={recipe} />;',
      '}',
    ].join('\n');
    screens.set(entry.id, { recipe, code, path: sourceFolder + '/' + entry.id + '.tsx' });
  }
  return { data, screens };
}

async function checkSnapshot(appRoot) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const { data, screens } = await loadAppPages(root);
  const git = (args) => execFileSync('git', args, { cwd: appRoot, encoding: 'utf8' });
  assert.equal(git(['rev-parse', 'HEAD']).trim(), data.revision, 'App checkout differs from the audited revision');
  const routes = git(['ls-files', '-z', 'app/*.tsx']).split('\0').filter(Boolean).sort();
  assert.deepEqual(data.entries.map(({ route }) => route).sort(), routes, 'Page catalog differs from tracked App route files');
  const sources = new Map();
  for (const entry of data.entries) {
    for (const [file, line] of [entry.source, ...(entry.parts ?? []).map(({ source }) => source)]) {
      assert(/^(app|src)\/[^\r\n]+\.tsx?$/.test(file), 'Invalid App source path ' + file);
      if (!sources.has(file)) sources.set(file, (await readFile(join(appRoot, file), 'utf8')).split('\n').length);
      if (line !== undefined) assert(Number.isInteger(line) && line >= 1 && line <= sources.get(file), 'Invalid App source line ' + file + ':' + line);
    }
  }
  console.log('Verified ' + routes.length + ' route files, ' + sources.size + ' source references and ' + screens.size + ' screen compositions.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assert(process.argv[2] && process.argv.length === 3, 'Usage: node scripts/app-pages.mjs /path/to/YorollApp');
  await checkSnapshot(process.argv[2]);
}
