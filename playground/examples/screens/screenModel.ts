export const screenParts = {
  actions: ['YButton', 'YIconButton'],
  banner: ['YBanner'],
  balance: ['YBalanceCard'],
  account: ['YBalanceCard', 'YPlanCard', 'YIconButton'],
  call: ['YCallPanel', 'YIconButton'],
  cards: ['YMediaCard', 'YBadge'],
  checkin: ['YCheckInCard', 'YTaskRow', 'TreatText'],
  comments: ['YSheet', 'YCommentRow', 'YComposer', 'YToast'],
  confirm: ['YDialog', 'YButton'],
  choices: ['YStoryChoices'],
  ending: ['YStoryEnding', 'YTab'],
  detail: ['YDetailHeader', 'YIconButton', 'YBadge'],
  dialog: ['YDialog', 'YButton', 'TreatText'],
  episodes: ['YEpisodeGrid', 'YDialog'],
  fields: ['YField', 'YTextInput'],
  fullscreen: ['YFullscreenOverlay', 'YChoiceGroup', 'YActionBar'],
  host: ['YWebCapsule', 'YState', 'YTopBar'],
  identity: ['YProfileHeader', 'YAvatar', 'YBadge'],
  inbox: ['YInboxRow', 'YState'],
  media: ['YMediaCard', 'YPlayPill', 'CarouselIndicatorDot'],
  messages: ['YMessageBubble', 'YComposer', 'YAvatar', 'YToast'],
  model: ['YSheet', 'YTab', 'YModelCard', 'TreatText'],
  notice: ['YBanner', 'YBadge'],
  packs: ['YCreditPackCard', 'TreatText'],
  personas: ['YPersonaCard', 'YMediaCard', 'YButton'],
  plans: ['YPlanCard', 'YBadge'],
  player: ['YPlayerControls', 'YSlider', 'YIconButton', 'YMediaCard'],
  rows: ['YListGroup', 'YListRow', 'YAvatar'],
  search: ['YSearchField', 'YMediaCard', 'YState'],
  section: ['YSectionHeader'],
  selection: ['YChoiceGroup'],
  share: ['YSheet', 'YIconButton', 'YToast'],
  sheet: ['YSheet', 'YChoiceGroup', 'YButton'],
  slider: ['YSlider'],
  tabs: ['YTab'],
  tags: ['YFilterChip'],
  tasks: ['YTaskRow', 'TreatText', 'YListGroup'],
  toggles: ['YSwitch', 'YListGroup', 'YListRow'],
  uploads: ['YUploadGrid'],
  voices: ['YVoiceCard', 'YAvatar', 'YIconButton'],
} as const;

export type ScreenPartKind = keyof typeof screenParts;
export type ScreenState = 'ready' | 'loading' | 'empty' | 'error';
export interface ScreenPart {
  kind: ScreenPartKind;
  label: string;
  items?: readonly string[];
  detail?: string;
  variant?: string;
  step?: number;
}
export interface ScreenRecipe {
  title: string;
  appearance?: 'home' | 'discover' | 'inbox' | 'chat' | 'membership' | 'treats' | 'profile' | 'login' | 'tasks' | 'drama';
  parts: readonly ScreenPart[];
  shell?: 'tab' | 'full' | 'detail' | 'standard';
  footer?: string;
  secondary?: string;
  activeTab?: string;
  steps?: readonly string[];
  completeLabel?: string;
}
