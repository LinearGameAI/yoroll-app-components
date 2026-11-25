import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, posix, relative } from 'node:path';
import ts from 'typescript';

const scopes = ['src', 'app', 'assets', 'ios/Yoroll', 'android/app/src/main/res', 'android/app/src/main/java'];
const mediaExtensions = {
  '.avif': 'image', '.gif': 'image', '.ico': 'image', '.jpeg': 'image', '.jpg': 'image',
  '.png': 'image', '.svg': 'image', '.webp': 'image',
  '.otf': 'font', '.ttf': 'font', '.woff': 'font', '.woff2': 'font',
  '.mp4': 'video', '.webm': 'video', '.mov': 'video', '.lottie': 'animation',
};
const animatedMethods = new Set(['timing', 'spring', 'decay', 'event', 'loop', 'sequence', 'parallel', 'stagger', 'delay']);
const reanimatedMethods = new Set(['withTiming', 'withSpring', 'withDecay', 'withDelay', 'withRepeat', 'withSequence']);
const motionSettings = new Set(['duration', 'easing', 'delay', 'damping', 'stiffness', 'mass', 'useNativeDriver', 'reduceMotion']);
const appearanceProps = new Set(['colors', 'locations', 'start', 'end', 'tint', 'blurRadius']);
const isTheme = (name) => ['tokens', 'YOROLL_DARK', 'YOROLL_LIGHT'].includes(name);
const nameOf = (node) => ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : '';
const textOf = (node, source) => node.getText(source).replace(/\s+/g, ' ').slice(0, 220);
const lineOf = (node, source) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

function assetKind(file) {
  const extension = extname(file).toLowerCase();
  if (file.startsWith('assets/')) {
    if (mediaExtensions[extension]) return mediaExtensions[extension];
    if (extension === '.json' && !file.endsWith('.prompt.json')) return 'spec';
    return null;
  }
  if (file.startsWith('src/') || file.startsWith('app/')) return mediaExtensions[extension] || null;
  if (file.startsWith('android/app/src/main/res/')) {
    return mediaExtensions[extension] || (extension === '.xml' ? 'spec' : null);
  }
  if (file.startsWith('ios/Yoroll/')) {
    return mediaExtensions[extension] || (file.includes('.xcassets/') || extension === '.storyboard' ? 'spec' : null);
  }
  return null;
}

function relativeAsset(file, value, assets) {
  const candidate = value.startsWith('@/') ? posix.join('src', value.slice(2))
    : value.startsWith('./') || value.startsWith('../') ? posix.join(posix.dirname(file), value)
    : '';
  return assets.has(candidate) ? candidate : null;
}

function groupFor(file) {
  if (/^(ios|android)\//.test(file)) return 'native';
  if (file.startsWith('app/')) return 'route';
  if (file.startsWith('src/components/') || file.startsWith('src/theme/')) return 'shared';
  return 'feature';
}

function inspectTypeScript(file, raw, assets, themeKeys) {
  const source = ts.createSourceFile(file, raw, ts.ScriptTarget.Latest, true);
  const constants = new Map();
  const components = [];
  const icons = new Set();
  const tokenUses = new Set();
  const references = new Set();
  const styles = [];
  const motions = [];

  for (const node of source.statements) {
    if (ts.isVariableStatement(node) && node.declarationList.flags & ts.NodeFlags.Const) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          constants.set(declaration.name.text, declaration.initializer);
        }
      }
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)
        && node.moduleSpecifier.text === '@yoroll/rn-icon') {
      const imports = node.importClause?.namedBindings;
      if (imports && ts.isNamedImports(imports)) {
        for (const item of imports.elements) {
          const name = (item.propertyName ?? item.name).text;
          if (name.startsWith('Icon')) icons.add(name);
        }
      }
    }
  }

  function objectOf(node) {
    if (!node) return null;
    if (ts.isObjectLiteralExpression(node)) return node;
    if (ts.isIdentifier(node)) {
      const target = constants.get(node.text);
      if (target && ts.isObjectLiteralExpression(target)) return target;
    }
    return null;
  }

  function recordedStyles(node, slot) {
    const values = node.properties.flatMap((property) => {
      if (ts.isSpreadAssignment(property)) return [{ name: '…', value: textOf(property.expression, source) }];
      if (ts.isShorthandPropertyAssignment(property)) return [{ name: property.name.text, value: property.name.text }];
      return ts.isPropertyAssignment(property)
        ? [{ name: property.name.getText(source), value: textOf(property.initializer, source) }] : [];
    });
    if (values.length) styles.push({ name: slot, line: lineOf(node, source), values });
  }

  function inlineStyle(node) {
    if (ts.isObjectLiteralExpression(node)) recordedStyles(node, 'style');
    else if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inlineStyle);
    else if (ts.isConditionalExpression(node)) {
      inlineStyle(node.whenTrue);
      inlineStyle(node.whenFalse);
    } else if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) inlineStyle(node.expression);
    else if (ts.isArrowFunction(node)) inlineStyle(node.body);
  }

  function withJsx(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return true;
    return ts.forEachChild(node, (child) => withJsx(child) || undefined) ?? false;
  }

  function addComponent(name, node) {
    if (/^[A-Z]/.test(name) && withJsx(node)) components.push({ name, line: lineOf(node, source) });
  }

  function motionValue(node) {
    const value = textOf(node, source);
    const literal = ts.isIdentifier(node) && constants.get(node.text);
    return literal && (ts.isNumericLiteral(literal) || ts.isStringLiteral(literal))
      ? value + ' (' + textOf(literal, source) + ')'
      : value;
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.body) addComponent(node.name.text, node);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer
        && (ts.isArrowFunction(node.initializer) || ts.isCallExpression(node.initializer))) {
      addComponent(node.name.text, node);
    }
    if (ts.isStringLiteralLike(node)) {
      const asset = relativeAsset(file, node.text, assets);
      if (asset) references.add(asset);
    }
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)
        && isTheme(node.expression.text) && themeKeys.has(node.name.text)) {
      tokenUses.add(node.name.text);
    }
    if (ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name)
        && node.initializer && ts.isIdentifier(node.initializer) && isTheme(node.initializer.text)) {
      for (const item of node.name.elements) {
        const key = nameOf(item.propertyName ?? item.name);
        if (themeKeys.has(key)) tokenUses.add(key);
      }
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const values = [];
      for (const property of node.attributes.properties) {
        if (!ts.isJsxAttribute(property) || !property.initializer) continue;
        const prop = property.name.getText(source);
        const expression = ts.isJsxExpression(property.initializer) ? property.initializer.expression : property.initializer;
        if (!expression) continue;
        if (prop === 'style') inlineStyle(expression);
        if (/(?:Gradient|BlurView)$/.test(tag) && appearanceProps.has(prop)) {
          values.push({ name: prop, value: textOf(expression, source) });
        }
      }
      if (values.length) styles.push({ name: tag, line: lineOf(node, source), values });
    }
    if (ts.isCallExpression(node)) {
      const call = node.expression;
      const api = textOf(call, source);
      if (api === 'StyleSheet.create') {
        const sheet = objectOf(node.arguments[0]);
        for (const property of sheet?.properties ?? []) {
          if (!ts.isPropertyAssignment(property)) continue;
          const value = objectOf(property.initializer);
          if (value) recordedStyles(value, nameOf(property.name));
        }
      }
      const reanimated = ts.isIdentifier(call) && reanimatedMethods.has(call.text);
      const animated = ts.isPropertyAccessExpression(call) && call.expression.getText(source) === 'Animated'
        && animatedMethods.has(call.name.text);
      const layoutTransition = /^(?:Fade|Slide|Zoom|Bounce|Flip|Roll|Stretch|LightSpeed|LinearTransition|Layout|EntryExitTransition|SequencedTransition|FadingTransition)[A-Za-z]*(?:\.[A-Za-z]+\([^)]*\))*\.duration$/.test(api);
      if (reanimated || animated || layoutTransition) {
        const config = objectOf(node.arguments[1]);
        const settings = (config?.properties ?? []).flatMap((property) =>
          ts.isPropertyAssignment(property) && motionSettings.has(nameOf(property.name))
            ? [{ name: nameOf(property.name), value: motionValue(property.initializer) }] : []);
        if (layoutTransition && node.arguments[0]) settings.push({ name: 'duration', value: motionValue(node.arguments[0]) });
        if ((api === 'withDelay' || api === 'Animated.delay') && node.arguments[0]) {
          settings.push({ name: 'delay', value: motionValue(node.arguments[0]) });
        }
        motions.push({ api, line: lineOf(node, source), settings });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return {
    path: file, group: groupFor(file), components,
    tokens: [...tokenUses].sort(), icons: [...icons].sort(), styles, motions, assets: [...references].sort(),
  };
}

function inspectNative(file, raw, assets) {
  const motions = [];
  const lines = raw.split('\n');
  for (const [index, line] of lines.entries()) {
    if (/\b(?:UIView\.animate|UIViewPropertyAnimator|ValueAnimator|ObjectAnimator|startAnimation)\b/.test(line)
        || /android:(?:duration|interpolator|startOffset)=/.test(line)) {
      motions.push({ api: line.trim().slice(0, 180), line: index + 1, settings: [] });
    }
  }
  const ui = /(?:UIView|UIHostingController|ViewGroup|AlertDialog|setContentView|RCTView|UIViewController|SwiftUI|Storyboard|WindowInsets)/.test(raw);
  const references = [];
  if (file.startsWith('android/')) {
    for (const match of raw.matchAll(/(?:R\.(drawable|mipmap|anim)\.|@(drawable|mipmap|anim)\/)([\w_]+)/g)) {
      const [, field, xmlType, name] = match;
      const prefix = 'android/app/src/main/res/' + (field ?? xmlType);
      references.push(...[...assets.keys()].filter((path) => path.startsWith(prefix)
        && posix.basename(path, extname(path)) === name));
    }
  } else {
    for (const [, name] of raw.matchAll(/(?:UIImage\(named:\s*"|\bimage=")([^"]+)"/g)) {
      references.push(...[...assets.keys()].filter((path) => path.includes('/' + name + '.imageset/')));
    }
  }
  if (!ui && !motions.length && !references.length) return null;
  return { path: file, group: 'native', components: [], tokens: [], icons: [], styles: [], motions, assets: [...new Set(references)] };
}

function collectTheme(raw) {
  const source = ts.createSourceFile('tokens.ts', raw, ts.ScriptTarget.Latest, true);
  const variables = source.statements.flatMap((node) => ts.isVariableStatement(node) ? [...node.declarationList.declarations] : []);
  return Object.fromEntries(['dark', 'light'].map((mode) => {
    const name = 'YOROLL_' + mode.toUpperCase();
    const theme = variables.find((node) => nameOf(node.name) === name && node.initializer && ts.isObjectLiteralExpression(node.initializer));
    if (!theme) throw new Error('Could not find ' + name + ' in App theme tokens.');
    const values = theme.initializer.properties.flatMap((property) =>
      ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
        ? [[nameOf(property.name), property.initializer.text]] : []);
    return [mode, Object.fromEntries(values)];
  }));
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
  });
}

async function openTracked(root, file) {
  const original = join(root, file);
  try {
    const resolved = await realpath(original);
    const fromRoot = relative(root, resolved);
    return fromRoot && !fromRoot.startsWith('..') && !isAbsolute(fromRoot) ? resolved : null;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}

async function prepareAsset(root, outdir, file, kind, usedBy) {
  const original = await openTracked(root, file);
  const result = { path: file, kind, usedBy: usedBy.get(file) ?? [], bytes: 0, availability: 'metadata' };
  if (!original) return { ...result, availability: 'missing' };
  const { size } = await stat(original);
  result.bytes = size;
  if (kind === 'spec' || kind === 'animation') return result;
  if (size < 512 && (await readFile(original, 'utf8')).startsWith('version https://git-lfs.github.com/spec/')) {
    return { ...result, availability: 'lfs' };
  }
  if (kind === 'font') {
    const mime = 'font/' + extname(file).slice(1).toLowerCase();
    const data = (await readFile(original)).toString('base64');
    return { ...result, availability: 'preview', previewUrl: `data:${mime};base64,${data}` };
  }
  const target = join(outdir, 'app-assets', file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(original, target);
  return { ...result, availability: 'preview', previewUrl: './app-assets/' + file.split('/').map(encodeURIComponent).join('/') };
}

export async function buildAppInventory(appPath, outdir) {
  const root = await realpath(appPath);
  const themeFile = await openTracked(root, 'src/theme/tokens.ts');
  if (!themeFile || !(await openTracked(root, 'src/components/primitives/YButton.tsx'))) {
    throw new Error('Pass the root of a YorollApp checkout to npm run build:app.');
  }
  const revision = git(root, ['rev-parse', 'HEAD']).trim();
  const changed = !!git(root, ['status', '--short', '--untracked-files=no', '--', ...scopes]).trim();
  const files = [...new Set(git(root, ['ls-files', '-z', '--', ...scopes]).split('\0').filter(Boolean))].sort();
  const assetKinds = new Map(files.flatMap((file) => {
    const kind = assetKind(file);
    return kind ? [[file, kind]] : [];
  }));
  const themeColors = collectTheme(await readFile(themeFile, 'utf8'));
  const themeKeys = new Set([...Object.keys(themeColors.dark), ...Object.keys(themeColors.light)]);
  const sources = [];
  const usedBy = new Map();
  const missing = [];
  for (const file of files) {
    const isTypeScript = /^(?:src|app)\/.*\.[jt]sx?$/.test(file);
    const isNative = /^(?:ios|android)\/.*\.(?:swift|[mh]|mm|kt|java|storyboard)$/.test(file) ||
      /^android\/app\/src\/main\/res\/(?:anim(?:ator)?|drawable|mipmap)(?:-[^/]+)?\/.+\.xml$/.test(file);
    if (!isTypeScript && !isNative) continue;
    const original = await openTracked(root, file);
    if (!original) {
      missing.push(file);
      continue;
    }
    const raw = await readFile(original, 'utf8');
    const entry = isTypeScript ? inspectTypeScript(file, raw, assetKinds, themeKeys) : inspectNative(file, raw, assetKinds);
    if (!entry || !(isNative || /\.[jt]sx$/.test(file) || /^(?:src\/theme|src\/components)\//.test(file)
        || entry.styles.length || entry.tokens.length || entry.motions.length || entry.assets.length || entry.icons.length)) continue;
    sources.push(entry);
    for (const asset of entry.assets) {
      if (!usedBy.has(asset)) usedBy.set(asset, []);
      usedBy.get(asset).push(file);
    }
  }
  const assets = [];
  for (const [file, kind] of assetKinds) assets.push(await prepareAsset(root, outdir, file, kind, usedBy));
  const inventory = { revision, changed, themeColors, sources, assets, missing };
  await mkdir(outdir, { recursive: true });
  await writeFile(join(outdir, 'app-inventory.json'), JSON.stringify(inventory));
  return inventory;
}
