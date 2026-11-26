import { readFile } from 'node:fs/promises';
import { posix } from 'node:path';

const promptFile = /(?:\.prompt|\/generation-prompts?)\.json$/;
const imageTypes = ['.webp', '.png', '.jpg', '.jpeg', '.avif', '.gif', '.svg'];
const outputKeys = ['appAsset', 'file', 'asset'];
const referenceKeys = [
  'reference', 'references', 'referenceImages', 'reference_image', 'styleReference', 'editTarget', 'edit_target',
  'composition_reference', 'composition_template', 'character_reference', 'shapeReference',
];

const stageNames = {
  prompt: '生成／编辑',
  refinementPrompt: '细化',
  materialRefinementPrompt: '材质细化',
  groundLightingPrompt: '地面光效',
  darkModeLightingPrompt: '深色环境光效',
  contactShadowPrompt: '接触阴影',
  alphaCleanupPrompt: '透明边缘清理',
  visibleCastShadowPrompt: '投影调整',
  lightMatchedShadowPrompt: '环境阴影',
  shadowMatteCleanupPrompt: '阴影透明边缘清理',
  negativePrompt: '负面提示词',
};

function resolveImage(file, value, assets) {
  if (typeof value !== 'string' || /^[a-z]+:|^\//i.test(value)) return undefined;
  const path = value.replace(/^YorollApp\//, '').replace(/^\.\//, '');
  const candidate = path.startsWith('assets/') ? path : posix.normalize(posix.join(posix.dirname(file), path));
  if (assets.get(candidate) === 'image') return candidate;
  // Lossless replacements in the same directory keep the asset name and change its extension.
  const extension = posix.extname(candidate).toLowerCase();
  if (!imageTypes.includes(extension)) return undefined;
  const base = candidate.slice(0, -extension.length);
  const alternatives = imageTypes.map((type) => base + type).filter((name) => assets.get(name) === 'image');
  return alternatives.length === 1 ? alternatives[0] : undefined;
}

function byRecordName(file, assets) {
  if (!file.endsWith('.prompt.json')) return undefined;
  const base = file.slice(0, -'.prompt.json'.length);
  const alternatives = imageTypes.map((type) => base + type).filter((name) => assets.get(name) === 'image');
  return alternatives.length === 1 ? alternatives[0] : undefined;
}

function promptStages(record) {
  return Object.entries(record).flatMap(([name, text]) =>
    /prompt$/i.test(name) && typeof text === 'string' && text.trim()
      ? [{ label: stageNames[name] ?? name, field: name, text }] : []);
}

function referencedImages(file, record, assets) {
  return referenceKeys.flatMap((key) => {
    const value = record[key];
    const values = Array.isArray(value) ? value : [value];
    return values.flatMap((item) => {
      const path = resolveImage(file, typeof item === 'object' && item ? item.file : item, assets);
      return path ? [path] : [];
    });
  });
}

export async function readArtworkPrompts(root, files, assets, openTracked) {
  const prompts = new Map();
  for (const file of files.filter((path) => path.startsWith('assets/') && promptFile.test(path))) {
    const original = await openTracked(root, file);
    if (!original) continue;
    let manifest;
    try {
      manifest = JSON.parse(await readFile(original, 'utf8'));
    } catch {
      console.warn('Unable to read artwork prompt manifest: ' + file);
      continue;
    }
    if (!manifest || typeof manifest !== 'object') continue;
    const method = manifest.generation_method ?? manifest.generationMode ?? manifest.mode ?? manifest.tool;
    const created = manifest.created_date ?? manifest.createdAt ?? manifest.created;

    function add(record, fallback) {
      const stages = promptStages(record);
      if (!stages.length) return;
      const explicit = outputKeys.map((key) => resolveImage(file, record[key], assets)).find(Boolean);
      const target = explicit ?? fallback;
      if (!target) {
        console.warn('Artwork prompts have no matching output: ' + file);
        return;
      }
      const references = [...new Set([
        ...referencedImages(file, manifest, assets),
        ...referencedImages(file, record, assets),
      ])].filter((reference) => reference !== target);
      const result = { source: file, method, created, references, stages };
      prompts.set(target, [...(prompts.get(target) ?? []), result]);
    }

    add(manifest, byRecordName(file, assets));
    for (const record of Array.isArray(manifest.assets) ? manifest.assets : []) {
      if (record && typeof record === 'object') add(record);
    }
  }
  return prompts;
}
