import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const snapshot = 'src/appStyles.ts';
const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv[2] === '--check';
const app = process.argv[check ? 3 : 2];
if (!app) throw new Error('Usage: node scripts/sync-app-styles.mjs [--check] /path/to/YorollApp');

// Copy only the named presentation constants below. No screen code or hooks are evaluated.
const blocks = [
  ['theme/layout.ts', 'layout', 'nativeLayout', 'all'],
  ['theme/tokens.ts', 'YOROLL_DARK', 'nativeDark', 'all'],
  ['theme/treats.ts', 'TREAT_GRADIENT', 'nativeTreatGradient', 'all'],
  ['screens/membership/membershipAppearance.ts', 'MEMBERSHIP_APPEARANCE', 'membershipAppearance', 'all'],
  ['screens/membership/treatStoreAppearance.ts', 'TREAT_STORE_APPEARANCE', 'treatStoreAppearance', 'all'],
  ['components/rewardBannerAppearance.ts', 'REWARD_BANNER_APPEARANCE', 'rewardBannerAppearance', 'all'],
  ['screens/membership/TreatBalanceCard.tsx', 'storeCandies', 'balanceCandies', 'all'],
  ['screens/membership/TreatBalanceCard.tsx', 'styles', 'treatBalanceStyles', 'container card candy artworkImage label note valueRow value textSpace overflowArtwork'],
  ['screens/membership/TreatCardGlow.tsx', 'styles', 'treatShadingStyles', 'upperLight bottomShadow rightShadow'],
  ['screens/membership/CreditPackRow.tsx', 'styles', 'creditPackStyles', 'card packBadge packBadgeText contentRow creditArtwork'],
  ['screens/membership/CreditPackCredits.tsx', 'creditPackCreditsLayout', 'creditCreditsLayout', 'group amountRow bonusRow'],
  ['screens/membership/CreditPackCredits.tsx', 'styles', 'creditTextStyles', 'creditsText bonusCreditsText'],
  ['screens/membership/CreditPackPrice.tsx', 'styles', 'creditPriceStyles', 'priceButton buttonSurface buttonContent priceText'],
  ['screens/membership/MembershipOffers.tsx', 'styles', 'membershipOfferStyles', 'comparison columns column tierChoice cardTitleRow statusBadge benefitCard benefitList benefitDivider benefitRow benefitArtwork benefitLabel benefitValueRow benefitValue cycleChoice cycleFace cycleTitle choicePrice referencePrice priceSkeleton cardBadgeAnchor'],
  ['screens/MembershipScreen.tsx', 'SUBSCRIPTION_BUTTON_GRADIENTS', 'subscriptionButtonGradients', 'all'],
  ['screens/MembershipScreen.tsx', 'SUBSCRIPTION_BUTTON_HIGHLIGHT', 'subscriptionButtonHighlight', 'all'],
  ['screens/MembershipScreen.tsx', 'styles', 'subscriptionDockStyles', 'purchaseDock purchaseButton purchaseButtonText legalRow legalAction legalLink'],
  ['screens/membership/MembershipBackground.tsx', 'styles', 'membershipBackgroundStyles', 'root scene image'],
  ['screens/membership/TreatPacksBackground.tsx', 'styles', 'treatBackgroundStyles', 'root glow'],
  ['components/ProfileIdentity.tsx', 'styles', 'profileIdentityStyles', 'identity identityRow coverOverlap avatar information textGroup details subtitleRow nameRow accessory avatarSkeleton nameSkeleton subtitleSkeleton'],
  ['screens/MeScreen.tsx', 'styles', 'profileAccountStyles', 'accountCards accountCardRow accountCard accountCardContent accountCardPrimaryRow accountCardLabel membershipCardContent membershipCrown creditToken'],
  ['components/messageListRowStyles.ts', 'messageListRowStyles', 'nativeInboxStyles', 'row avatarWrap avatarFallback avatarLetter unreadDot rowBody rowHeader rowName rowTime rowPreview'],
  ['components/MeContentCard.tsx', 'meContentGridStyles', 'profileContentStyles', 'cover title subtitle'],
  ['screens/chat/CompanionCard.tsx', 'styles', 'companionCardStyles', 'card discoverCard fallback fallbackText copy name discoverName tagline taglineLineHeight tags tag tagText interactions interactionCount discoverHeader headerBadges'],
  ['screens/chat/ModelPicker.tsx', 'styles', 'modelPickerStyles', 'modelPickerIntro modelTabs modelTab modelTabText modelAuxiliaryText modelPiecesRow modelPiecesContent modelRechargeLabel modelPiecesText modelPiecesAmount modelOptionCard modelOptionSurface modelOptionInset modelOptionCardHeader modelOptionHeading modelOptionName modelOptionDescription modelPriceRow modelPriceAmounts modelOriginalPrice modelOfferCountdown modelOptionPrice'],
  ['components/LoginBackground.tsx', 'styles', 'loginBackdropStyles', 'tilt row coverWrap coverImg'],
  ['../app/(auth)/login.tsx', 'styles', 'loginFormStyles', 'welcomeHeader welcomeText logo bottomGroup primaryMethods methodBtn methodBtnText emailBtn emailBtnText legal legalLink'],
  ['components/MessageEmptyState.tsx', 'styles', 'messageEmptyStyles', 'container image message'],
  ['theme/modelPickerSheet.ts', 'modelPickerSheetStyles', 'modelSheetStyles', 'surface dragZone handle heading title'],
  ['components/primitives/centeredDialogStyles.ts', 'centeredDialogStyles', 'nativeConfirmStyles', 'card heading close'],
  ['components/primitives/noticeDialogStyles.ts', 'noticeDialogStyles', 'nativeNoticeStyles', 'cardContent title body primaryButton primaryButtonText'],
  ['screens/SearchScreen.tsx', 'styles', 'nativeSearchStyles', 'searchInputWrap searchInput'],
  ['screens/HomeScreen.tsx', 'styles', 'homePillStyles', 'tabPill tabPillIdle tabPillActive tabIcon'],
  ['screens/HomeScreen.tsx', 'styles', 'homeFeedStyles', 'feedCover feedTitleRow feedTitle feedMeta feedMetaText catBadge catBadgeText'],
  ['screens/chat/ChatScreen.tsx', 'styles', 'chatHeaderStyles', 'topBar iconButton modelSwitchPill modelSwitchText titleWrap headerAvatar title'],
  ['screens/chat/MessageBubble.tsx', 'styles', 'chatBubbleStyles', 'userBubble userBubbleSurface userBubbleHighlight userText dialogRow dialogBubble thoughtRow thoughtText'],
  ['overlays/ShareSheet.tsx', 'styles', 'shareSheetStyles', 'companionTitle linkRow linkText linkCopy targetsRow target iconCircle'],
  ['overlays/CompanionSharePreview.tsx', 'styles', 'sharePreviewStyles', 'characterCard characterImage characterInfo characterName description'],
  ['screens/ShortDramaProgressBar.tsx', 'styles', 'dramaProgressStyles', 'track fill thumb'],
  ['screens/chat/creator/CharacterVoiceCard.tsx', 'styles', 'voiceCardStyles', 'card select check preview playCircle skeletonAvatar skeletonNameLine skeletonName'],
];

const declarations = new Map();
const loads = new Map();
const backgrounds = (name) => declarations.get(name);
const external = {
  layout: () => backgrounds('nativeLayout'),
  pageLayout: () => backgrounds('nativeLayout'),
  YOROLL_DARK: () => backgrounds('nativeDark'),
  TREAT_GRADIENT: () => backgrounds('nativeTreatGradient'),
  TREAT_STORE_APPEARANCE: () => backgrounds('treatStoreAppearance'),
  MEMBERSHIP_APPEARANCE: () => backgrounds('membershipAppearance'),
  StyleSheet: () => ({
    hairlineWidth: '$native.hairlineWidth',
    absoluteFill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    absoluteFillObject: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  }),
};

async function moduleFor(path) {
  if (!loads.has(path)) {
    const source = ts.createSourceFile(path, await readFile(join(app, 'src', path), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const definitions = new Map();
    for (const node of source.statements) {
      if (!ts.isVariableStatement(node)) continue;
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) definitions.set(declaration.name.text, declaration.initializer);
      }
    }
    loads.set(path, { source, definitions });
  }
  return loads.get(path);
}

function readLiteral(node, scope) {
  const read = (child) => readLiteral(child, scope);
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return read(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node)) {
    const target = scope.definitions.get(node.text);
    if (target) return read(target);
    if (node.text in external) return external[node.text]();
  }
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -read(node.operand);
  if (ts.isBinaryExpression(node)) {
    const left = read(node.left);
    const right = read(node.right);
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.PlusToken: return left + right;
      case ts.SyntaxKind.MinusToken: return left - right;
      case ts.SyntaxKind.AsteriskToken: return left * right;
      case ts.SyntaxKind.SlashToken: return left / right;
    }
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(read);
  if (ts.isElementAccessExpression(node)) return read(node.expression)[read(node.argumentExpression)];
  if (ts.isPropertyAccessExpression(node)) {
    const value = read(node.expression);
    if (value && Object.hasOwn(value, node.name.text)) return value[node.name.text];
  }
  if (ts.isObjectLiteralExpression(node)) {
    const values = {};
    for (const prop of node.properties) {
      if (ts.isSpreadAssignment(prop)) Object.assign(values, read(prop.expression));
      else if (ts.isPropertyAssignment(prop) && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
        values[prop.name.text] = read(prop.initializer);
      } else if (ts.isShorthandPropertyAssignment(prop)) values[prop.name.text] = read(prop.name);
      else throw new Error('Unsupported style field ' + prop.getText(scope.source));
    }
    return values;
  }
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
    const fn = node.expression.getText(scope.source);
    if (fn === 'PixelRatio.roundToNearestPixel') return read(node.arguments[0]);
    if (fn === 'Math.ceil') return Math.ceil(read(node.arguments[0]));
    if (fn === 'Math.round') return Math.round(read(node.arguments[0]));

    if (fn === 'StyleSheet.create') return read(node.arguments[0]);
  }
  throw new Error('Unsupported style expression in ' + scope.source.fileName + ': ' + node.getText(scope.source));
}

const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: app, encoding: 'utf8' }).trim();
const parts = [
  "import { StyleSheet } from 'react-native';",
  '',
  '// Visual constants from YorollApp ' + revision + '.',
  '// Regenerate with scripts/sync-app-styles.mjs. Runtime bindings stay in the presentation components.',
  '',
];
for (const [path, name, exportName, fields] of blocks) {
  const scope = await moduleFor(path);
  const expr = scope.definitions.get(name);
  if (!expr) throw new Error('Missing ' + name + ' in ' + path);
  if (fields === 'all') {
    const value = readLiteral(expr, scope);
    declarations.set(exportName, value);
    if (['nativeLayout', 'nativeDark', 'nativeTreatGradient'].includes(exportName)) continue;
    parts.push('// ' + (path.startsWith('../') ? path.slice(3) : 'src/' + path) + ' · ' + name,
      'export const ' + exportName + ' = ' + JSON.stringify(value, null, 2) + ' as const;', '');
  } else {
    const shape = expr.arguments?.[0];
    if (!shape || !ts.isObjectLiteralExpression(shape)) throw new Error('Missing StyleSheet in ' + path);
    parts.push('// ' + (path.startsWith('../') ? path.slice(3) : 'src/' + path) + ' · ' + name, 'export const ' + exportName + ' = StyleSheet.create({');
    for (const key of fields.split(' ')) {
      const prop = shape.properties.find((item) => item.name?.getText(scope.source) === key);
      if (!prop) throw new Error('Missing style ' + key + ' in ' + path);
      const value = JSON.stringify(readLiteral(prop.initializer, scope)).replaceAll('"$native.hairlineWidth"', 'StyleSheet.hairlineWidth');
      parts.push('  ' + key + ': ' + value + ',');
    }
    parts.push('});', '');
  }
}
const output = parts.join('\n');
const path = join(root, snapshot);
if (check) {
  if (await readFile(path, 'utf8') !== output) throw new Error(snapshot + ' differs from the App visual source snapshot');
} else {
  await writeFile(path, output);
}
console.log('Verified ' + (blocks.length - 3) + ' App presentation groups at ' + revision.slice(0, 9));
