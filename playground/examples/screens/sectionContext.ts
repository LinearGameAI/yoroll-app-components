import { createContext, useContext } from 'react';

export const artworkPaths = {
  coast: 'login-covers/cover-01.jpg',
  forest: 'login-covers/cover-03.jpg',
  night: 'login-covers/cover-08.jpg',
  treat: 'membership/treat-packs/treat-single-v1.webp',
  checkin: 'tasks/checkin-v1.webp',
  event: 'notifications/event-story-discovery-v7.webp',
  gate: 'short-drama/membership-paywall-pro.webp',
} as const;

export const publicArtworkBase = 'https://lineargameai.github.io/yoroll-app-components/artwork/originals/assets/';
export const sectionContext = createContext({ artworkBase: publicArtworkBase, announce: (_message: string) => {}, tab: '', setTab: (_key: string) => {} });

export function useScreenArtwork() {
  const { artworkBase } = useContext(sectionContext);
  return (key: keyof typeof artworkPaths) => artworkBase + artworkPaths[key];
}
