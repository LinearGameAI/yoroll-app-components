import { darkTokens } from '../src/tokens';

type StyleFamily = {
  id: string;
  name: string;
  direction: string;
  palette: string[];
  samples: string[];
  prompt: string;
};

export const artStyles: StyleFamily[] = [
  {
    id: 'rewards', name: '糖果、任务与奖励',
    direction: '粉橙缎面与暖色边光。主体轮廓饱满，透明背景上保留克制的接触阴影。',
    palette: [darkTokens.orange7, darkTokens.orange, '#FFD6B4'],
    samples: ['assets/membership/treat-packs/treat-pile-v1.webp', 'assets/tasks/checkin-v1.webp', 'assets/referrals/invitation-gift-v2.webp'],
    prompt: '为移动应用制作一张独立奖励插画，主体为【替换为奖励物件】。用柔和缎面、桃粉至杏橙的渐变、暖色边光和细腻的接触阴影塑造圆润体积。以轻微三分之四视角居中，四周留足透明安全区，确保缩到 24–48 pt 时轮廓清晰。',
  },
  {
    id: 'membership', name: '会员背景与权益',
    direction: '竖屏场景用深紫、煤黑和局部星光。浅色权益物件采用缎面渐变，和暗底拉开层次。',
    palette: ['#211739', '#604387', '#DC9CC4'],
    samples: ['assets/membership/backgrounds/plus-romance-v3.jpg', 'assets/membership/backgrounds/treat-packs-starlight-v1.jpg', 'assets/membership/benefits/persona-card-v2.webp'],
    prompt: '制作 9:20 的移动端会员背景。主题为【替换主题】。主体与星尘集中在上方，主光从上方进入，采用暖粉边光和深紫环境色。中段开始降低亮度，下部平滑融入近黑，给标题、权益卡和固定购买区留出阅读空间。延展小型权益物件时，用玫瑰粉、暖杏与鸢尾紫的缎面光泽，独立透明输出。',
  },
  {
    id: 'notices', name: '通知与状态',
    direction: '石墨灰底、单一居中主体、低亮度暖粉反光。玻璃和柔和影子在暗底上保留边缘。',
    palette: [darkTokens.bgTertiary, '#766367', '#B68F8A'],
    samples: ['assets/notifications/inbox-welcome-v7.webp', 'assets/notifications/review-approved-v7.webp'],
    prompt: '制作方形移动通知插画，主题为【替换为通知语义】。在均匀的中性石墨背景上居中放置一个半透明的立体主体，用小范围暖粉柔光照亮边缘，压低整体高光。保持简洁留白，在小通知卡上能凭轮廓认出状态。',
  },
  {
    id: 'models', name: '模型身份与聊天插画',
    direction: '文本模型用表情明确的动物造型，媒体模型用相机或播放装置。两类均采用独立透明轮廓。',
    palette: ['#4B302B', '#BA7160', '#EDAC83'],
    samples: ['assets/chat-models/fox-v1.webp', 'assets/chat-models/dolphin-v1.webp', 'assets/chat-models/video-pro-v1.webp'],
    prompt: '为【替换为模型名称及能力】设计独立的 3D 身份插画。文本能力采用表情清晰的动物上半身，媒体能力采用功能明确的设备轮廓。使用近正面三分之四视角、柔和工作室光线和紧凑构图，保留透明背景及边缘余量，适配 24 pt 小尺寸。',
  },
  {
    id: 'profile', name: '个人资料与引导',
    direction: '雾面透明材质和玫瑰暖杏配色，使用中心镂空、对称轮廓和清晰接触边。',
    palette: ['#F4A5C1', '#F7B489', '#EAC7FF'],
    samples: ['assets/profile/membership-crown-v2.webp', 'assets/profile/treat-trio-v1.webp', 'assets/onboarding/gender-female-satin.webp'],
    prompt: '制作个人资料界面的立体装饰图，元素为【替换物件】。使用暖杏、玫瑰粉与适量柔紫的雾面玻璃或缎面材质。用明确的轮廓和适当镂空保证小尺寸辨识，使用柔和上方主光，四边保留透明像素和充足间距。',
  },
  {
    id: 'covers', name: '登录封面与短剧',
    direction: '封面以电影构图组织人物和背景。短剧标识与互动光效控制亮度，给叠加控件留下空间。',
    palette: ['#201719', '#805643', '#D4A083'],
    samples: ['assets/login-covers/cover-08.jpg', 'assets/short-drama/membership-paywall-pro.webp'],
    prompt: '制作一张竖屏剧情封面，主题为【替换剧情与人物】。用电影布光突出第一视觉主体，保留清楚的轮廓和背景层次。在顶部和底部安排低对比度留白，便于叠加导航、标题和控件，确保缩略图依然能读出画面中心。',
  },
  {
    id: 'brand', name: '品牌与启动',
    direction: '柔白主体配粉、杏、浅紫高光，色彩集中在图形内侧。启动页四周留足清晰暗底。',
    palette: ['#F5F3F5', '#FFD0BC', '#D1C4F9'],
    samples: ['assets/brand/login-logo-gradient.webp', 'assets/yoroll-launch-icon.webp'],
    prompt: '根据提供的品牌源图制作【替换为启动／品牌物料用途】。保留现有轮廓、字标和比例，使用柔白基础与克制的暖杏粉和浅紫高光。将效果集中在主体内侧，保留充分外部安全区，交付干净的透明版本及暗底检查图。',
  },
];

const prefixGroups = [
  ['assets/membership/backgrounds/', 'membership'], ['assets/membership/benefits/', 'membership'],
  ['assets/membership/', 'rewards'], ['assets/checkin/', 'rewards'], ['assets/tasks/', 'rewards'], ['assets/referrals/', 'rewards'],
  ['assets/notifications/', 'notices'], ['assets/chat-models/', 'models'], ['assets/chat-offers/', 'models'],
  ['assets/profile/', 'profile'], ['assets/onboarding/', 'profile'], ['assets/login-covers/', 'covers'], ['assets/short-drama/', 'covers'],
  ['android/app/src/main/res/drawable/daily_task_token.png', 'rewards'], ['ios/Yoroll/Images.xcassets/DailyTaskToken.imageset/', 'rewards'],
  ['assets/brand/', 'brand'], ['assets/yoroll-launch-icon', 'brand'], ['ios/', 'brand'], ['android/', 'brand'],
] as const;

export function artworkFamily(path: string) {
  return prefixGroups.find(([prefix]) => path.startsWith(prefix))?.[1] ?? 'other';
}

export function isArtwork(path: string) {
  return !/^assets\/(?:icons|home-tabs)\//.test(path)
    && !/^assets\/(?:adaptive-icon|favicon|icon)\.[^.]+$/.test(path)
    && !/^assets\/brand\/(?:comment-default-icon|home_nav_chat|home_nav_game|home_nav_icon|logo-icon)\.[^.]+$/.test(path)
    && !/(?:\/AppIcon\.appiconset\/|\/ic_launcher[^/]*$)/.test(path);
}
