/** Timing and distances from the individual YorollApp implementations. */
export const motionTokens = {
  bottomSheet: { enterMs: 220, exitMs: 200, snapBackMs: 160, dismissDistance: 56, dismissVelocity: 0.6 },
  modelPicker: { enterMs: 220, exitMs: 220 },
  replyAction: { feedbackMs: 160, exitMs: 140, layoutMs: 210, pressedOpacity: 0.65, disabledOpacity: 0.5 },
  carouselDot: { durationMs: 260, width: 3, activeWidth: 6 },
  checkInDialog: { enterMs: 240, exitMs: 220 },
  discoveryHeader: { durationMs: 220 },
  membershipBackground: { durationMs: 800 },
  splash: { fadeMs: 350 },
  typingDots: { appearMs: 180, fadeMs: 240, restOpacity: 0.38 },
  skeleton: { halfCycleMs: 750, restOpacity: 0.5 },
  navigationBackground: { scrollDistance: 100 },
} as const;
