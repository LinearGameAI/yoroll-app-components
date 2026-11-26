import { createContext, useContext } from 'react';

export const artworkPaths = {
  coast: 'login-covers/cover-01.jpg',
  royalty: 'login-covers/cover-01.jpg',
  occult: 'login-covers/cover-03.jpg',
  avatar: 'login-covers/overseas/ellis-kaminski.jpg',
  storyteller: 'login-covers/overseas/celeste-aubert.jpg',
  forest: 'login-covers/cover-03.jpg',
  night: 'login-covers/cover-08.jpg',
  treat: 'membership/treat-packs/treat-single-v1.webp',
  rewardTreats: 'profile/treat-trio-v1.webp',
  treatPile: 'membership/treat-packs/treat-pile-v1.webp',
  treatLarge: 'membership/treat-packs/treat-large-pile-v1.webp',
  basic: 'membership/backgrounds/basic-romance-v4.jpg',
  plus: 'membership/backgrounds/plus-romance-v3.jpg',
  creditBenefit: 'membership/benefits/monthly-treats-v2.webp',
  suggestionsBenefit: 'membership/benefits/suggested-replies-v2.webp',
  personaBenefit: 'membership/benefits/persona-card-v2.webp',
  callingBenefit: 'membership/benefits/voice-call-v2.webp',
  videoBenefit: 'membership/benefits/video-download-v2.webp',
  imageBenefit: 'membership/benefits/image-download-v2.webp',
  membershipCrown: 'profile/membership-crown-v2.webp',
  invite: 'tasks/invite-friends-v1.webp',
  logo: 'brand/login-logo-gradient.webp',
  notification: 'notifications/inbox-welcome-v7.webp',
  checkin: 'tasks/checkin-v1.webp',
  event: 'notifications/event-story-discovery-v7.webp',
  gate: 'short-drama/membership-paywall-pro.webp',
} as const;

export const publicArtworkBase = 'https://lineargameai.github.io/yoroll-app-components/artwork/originals/assets/';
export const publicUiBase = 'https://lineargameai.github.io/yoroll-app-components/app-ui/';
export type PreviewTier = 'basic' | 'plus';

export const sectionContext = createContext({
  artworkBase: publicArtworkBase,
  uiBase: publicUiBase,
  announce: (_message: string) => {},
  tab: '',
  setTab: (_key: string) => {},
  tier: 'basic' as PreviewTier,
  setTier: (_tier: PreviewTier) => {},
});

export function useScreenArtwork() {
  const { artworkBase } = useContext(sectionContext);
  return (key: keyof typeof artworkPaths) => artworkBase + artworkPaths[key];
}
