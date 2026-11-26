import { StyleSheet } from 'react-native';

// Visual constants from YorollApp 0983ce7b25d25b69c151a07459af961b0900fc61.
// Regenerate with scripts/sync-app-styles.mjs. Runtime bindings stay in the presentation components.

// src/screens/membership/membershipAppearance.ts · MEMBERSHIP_APPEARANCE
export const membershipAppearance = {
  "basic": {
    "cardGradient": [
      {
        "color": "#633344",
        "opacity": 0.96
      },
      {
        "color": "#462337",
        "opacity": 0.64
      },
      {
        "color": "#361E2E",
        "opacity": 0.22
      },
      {
        "color": "#361E2E",
        "opacity": 0
      }
    ],
    "cardLight": {
      "color": "#FFB68E",
      "opacity": 0.12
    },
    "cardBorder": {
      "color": "#FFADC5",
      "opacity": 0.28
    },
    "badgeGradient": [
      "#FFB187",
      "#FFC5E4"
    ],
    "accent": "#F0A7CD",
    "backgroundTint": [
      "rgba(153,45,102,0.32)",
      "rgba(62,22,45,0.22)",
      "rgba(11,10,13,0)"
    ]
  },
  "plus": {
    "cardGradient": [
      {
        "color": "#50337A",
        "opacity": 0.96
      },
      {
        "color": "#3A2356",
        "opacity": 0.64
      },
      {
        "color": "#291C3B",
        "opacity": 0.22
      },
      {
        "color": "#291C3B",
        "opacity": 0
      }
    ],
    "cardLight": {
      "color": "#B98BFF",
      "opacity": 0.14
    },
    "cardBorder": {
      "color": "#C7A4FF",
      "opacity": 0.3
    },
    "badgeGradient": [
      "#BE9AFF",
      "#E2CFFF"
    ],
    "accent": "#C4A8FF",
    "backgroundTint": [
      "rgba(92,48,155,0.34)",
      "rgba(42,24,67,0.22)",
      "rgba(11,10,13,0)"
    ]
  }
} as const;

// src/screens/membership/treatStoreAppearance.ts · TREAT_STORE_APPEARANCE
export const treatStoreAppearance = {
  "cardBackground": "#19151C",
  "cardSurface": {
    "cardGradient": [
      {
        "color": "#795A70",
        "opacity": 0.41
      },
      {
        "color": "#534153",
        "opacity": 0.32
      },
      {
        "color": "#392D3D",
        "opacity": 0.2
      },
      {
        "color": "#231C28",
        "opacity": 0.1
      }
    ],
    "cardLight": {
      "color": "#FFD0BA",
      "opacity": 0.04
    }
  },
  "cardBadgeGradients": {
    "starter": [
      "#C8D7FF",
      "#9FBAFA"
    ],
    "everydayTopUp": [
      "#C5F0DC",
      "#92D9C8"
    ],
    "chatMore": [
      "#DDCEFF",
      "#BDA3F6"
    ],
    "recommended": [
      "#FFD15C",
      "#FFB08A"
    ],
    "firstChargeOffer": [
      "#FFB08A",
      "#FF9CD5"
    ],
    "newUser": [
      "#FF9CD5",
      "#DDA5FF"
    ]
  },
  "balanceBackground": "#FFB5AC",
  "balanceGradient": [
    "#FFB48D",
    "#FFACB5",
    "#FFA9D4"
  ],
  "balanceText": "#1C1E22",
  "mutedText": "#57353F",
  "balanceNoteText": "#69434E",
  "cardMutedText": "#E5CCD4",
  "buttonBackground": "#FF8652",
  "buttonGradient": [
    "#FF8652",
    "#FF9CD5"
  ],
  "buttonStroke": "rgba(255,221,202,0.44)",
  "buttonText": "#1C1E22"
} as const;

// src/components/rewardBannerAppearance.ts · REWARD_BANNER_APPEARANCE
export const rewardBannerAppearance = {
  "card": {
    "borderRadius": 16
  },
  "compactMaxWidth": 360,
  "surface": {
    "colors": [
      "#6B463F",
      "#292929F2"
    ],
    "start": {
      "x": 0,
      "y": 0.5
    },
    "end": {
      "x": 1,
      "y": 0.5
    }
  },
  "text": "#F7F2F5",
  "body": "#D2C5CE",
  "close": "rgba(255,244,248,0.65)",
  "closeBackground": "#292929",
  "button": {
    "minHeight": 36,
    "paddingVertical": 8,
    "borderRadius": 999,
    "borderWidth": 0
  },
  "buttonText": "#1C1E22",
  "buttonGradient": {
    "colors": [
      "#FF8652",
      "#FF9CD5"
    ],
    "start": {
      "x": 0,
      "y": 0.5
    },
    "end": {
      "x": 1,
      "y": 0.5
    }
  },
  "buttonHighlight": {
    "colors": [
      "rgba(255,255,255,0.5)",
      "rgba(255,255,255,0.12)",
      "rgba(255,255,255,0)",
      "rgba(0,0,0,0.12)"
    ],
    "locations": [
      0,
      0.38,
      0.56,
      1
    ],
    "start": {
      "x": 0.5,
      "y": 0
    },
    "end": {
      "x": 0.5,
      "y": 1
    }
  }
} as const;

// src/screens/membership/TreatBalanceCard.tsx · storeCandies
export const balanceCandies = [
  {
    "name": "edge",
    "size": 76,
    "position": {
      "top": 34,
      "right": -25
    },
    "angle": "43deg"
  },
  {
    "name": "middle",
    "size": 80,
    "position": {
      "top": 29,
      "right": 55
    },
    "angle": "28deg"
  },
  {
    "name": "lower",
    "size": 50,
    "position": {
      "top": 59,
      "right": 42
    },
    "angle": "-34deg"
  },
  {
    "name": "bottom",
    "size": 94,
    "position": {
      "bottom": -39,
      "right": 11
    },
    "angle": "12deg"
  }
] as const;

// src/screens/membership/TreatBalanceCard.tsx · styles
export const treatBalanceStyles = StyleSheet.create({
  container: {"marginBottom":16},
  card: {"borderRadius":16,"overflow":"hidden","paddingHorizontal":20,"paddingVertical":16,"gap":4,"zIndex":1},
  candy: {"position":"absolute"},
  artworkImage: {"width":"100%","height":"100%"},
  label: {"fontSize":14,"lineHeight":20,"fontWeight":"500","flexShrink":1},
  note: {"fontSize":11,"lineHeight":16,"textAlign":"auto","maxWidth":"100%","flexShrink":1,"marginTop":8,"marginRight":89},
  valueRow: {"flexDirection":"row","alignItems":"center","minHeight":48,"zIndex":1},
  value: {"flex":1,"minWidth":0,"fontSize":36,"lineHeight":44,"letterSpacing":-0.8,"includeFontPadding":false,"fontVariant":["tabular-nums"]},
  textSpace: {"paddingRight":112},
  overflowArtwork: {"position":"absolute","top":-43,"right":-1,"width":122,"height":122,"zIndex":2,"transform":[{"rotate":"-25deg"}]},
});

// src/screens/membership/TreatCardGlow.tsx · styles
export const treatShadingStyles = StyleSheet.create({
  upperLight: {"position":"absolute","top":0,"left":0,"right":0,"height":22},
  bottomShadow: {"position":"absolute","bottom":0,"left":0,"right":0,"height":22},
  rightShadow: {"position":"absolute","top":0,"right":0,"bottom":0,"width":18},
});

// src/screens/membership/CreditPackRow.tsx · styles
export const creditPackStyles = StyleSheet.create({
  card: {"width":"100%","borderRadius":12,"height":144,"padding":12,"paddingTop":24,"alignItems":"center","overflow":"hidden"},
  packBadge: {"position":"absolute","top":0,"left":0,"maxWidth":"100%","height":20,"paddingHorizontal":10,"justifyContent":"center","borderBottomRightRadius":8,"overflow":"hidden","shadowOpacity":0,"elevation":0},
  packBadgeText: {"fontSize":10,"lineHeight":12,"fontWeight":"700","includeFontPadding":false},
  contentRow: {"flex":1,"flexDirection":"row","width":"100%","alignItems":"center","gap":8},
  creditArtwork: {"width":"40%","maxWidth":64,"maxHeight":64,"aspectRatio":1,"flexShrink":0},
});

// src/screens/membership/CreditPackCredits.tsx · creditPackCreditsLayout
export const creditCreditsLayout = StyleSheet.create({
  group: {"flex":1,"minWidth":0,"alignSelf":"stretch","paddingTop":8,"gap":2},
  amountRow: {"height":28,"alignItems":"flex-start","justifyContent":"flex-end"},
  bonusRow: {"height":28,"alignItems":"flex-start","overflow":"hidden"},
});

// src/screens/membership/CreditPackCredits.tsx · styles
export const creditTextStyles = StyleSheet.create({
  creditsText: {"color":"#FFFFFF","fontSize":24,"lineHeight":28,"flexShrink":1,"textAlign":"left","includeFontPadding":false,"fontVariant":["tabular-nums"]},
  bonusCreditsText: {"color":"#FFFFFF","fontSize":10,"lineHeight":14,"fontWeight":"500","textAlign":"left","includeFontPadding":false},
});

// src/screens/membership/CreditPackPrice.tsx · styles
export const creditPriceStyles = StyleSheet.create({
  priceButton: {"width":"100%","height":36,"borderRadius":18,"paddingHorizontal":6,"alignItems":"center","justifyContent":"center","marginTop":4,"overflow":"hidden"},
  buttonSurface: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0},
  buttonContent: {"zIndex":1},
  priceText: {"width":"100%","fontSize":12,"lineHeight":18,"fontWeight":"700","textAlign":"center","zIndex":1},
});

// src/screens/membership/MembershipOffers.tsx · styles
export const membershipOfferStyles = StyleSheet.create({
  comparison: {"gap":8},
  columns: {"flexDirection":"row","alignItems":"stretch","gap":8},
  column: {"flex":1,"minWidth":0},
  tierChoice: {"minHeight":44,"gap":3,"alignItems":"center","paddingBottom":2},
  cardTitleRow: {"minHeight":30,"flexDirection":"row","alignItems":"center","justifyContent":"center","gap":5},
  statusBadge: {"maxWidth":"100%","fontSize":11,"lineHeight":15,"fontWeight":"600","textAlign":"center","includeFontPadding":false},
  benefitCard: {"flexGrow":1,"padding":8},
  benefitList: {"gap":2},
  benefitDivider: {"height":StyleSheet.hairlineWidth,"marginHorizontal":6},
  benefitRow: {"minHeight":60,"paddingHorizontal":6,"paddingVertical":7,"justifyContent":"center"},
  benefitArtwork: {"width":24,"height":24,"flexShrink":0},
  benefitLabel: {"width":"100%","color":"rgba(255,255,255,0.6)","fontSize":12,"lineHeight":16,"textAlign":"center","includeFontPadding":false},
  benefitValueRow: {"flexDirection":"row","alignItems":"center","justifyContent":"center","gap":4,"flexShrink":0},
  benefitValue: {"flexShrink":0,"color":"#FFFFFF","fontSize":16,"lineHeight":22,"textAlign":"center","fontWeight":"600","includeFontPadding":false},
  cycleChoice: {"minHeight":106,"paddingHorizontal":11,"paddingVertical":16,"gap":2,"justifyContent":"center","borderRadius":14,"backgroundColor":"#39323F"},
  cycleFace: {"position":"absolute","top":1,"right":1,"bottom":1,"left":1,"borderRadius":13,"backgroundColor":"#0B0B0D","overflow":"hidden"},
  cycleTitle: {"width":"100%","color":"#FFFFFF","fontSize":14,"lineHeight":20,"fontWeight":"500","textAlign":"center","includeFontPadding":false},
  choicePrice: {"width":"100%","color":"#FFFFFF","fontSize":26,"lineHeight":32,"fontWeight":"600","textAlign":"center","includeFontPadding":false},
  referencePrice: {"width":"100%","color":"rgba(255,255,255,0.6)","fontSize":12,"lineHeight":18,"fontWeight":"400","textAlign":"center","textDecorationLine":"line-through","includeFontPadding":false},
  priceSkeleton: {"width":110,"maxWidth":"100%","height":30,"borderRadius":6,"alignSelf":"center"},
  cardBadgeAnchor: {"position":"absolute","top":-12,"left":0,"right":0,"alignItems":"flex-start","zIndex":1},
});

// src/screens/MembershipScreen.tsx · SUBSCRIPTION_BUTTON_GRADIENTS
export const subscriptionButtonGradients = {
  "basic": {
    "colors": [
      "#FFB187",
      "#FFC9B0",
      "#FFE2D5",
      "#FFD4E5",
      "#FFC5E4"
    ],
    "locations": [
      0,
      0.24,
      0.5,
      0.76,
      1
    ],
    "start": {
      "x": 0,
      "y": 0.25
    },
    "end": {
      "x": 1,
      "y": 0.75
    }
  },
  "plus": {
    "colors": [
      "#BE9AFF",
      "#CFB5FF",
      "#E9DDFF",
      "#DDC8FF",
      "#E2CFFF"
    ],
    "locations": [
      0,
      0.24,
      0.5,
      0.76,
      1
    ],
    "start": {
      "x": 0,
      "y": 0.25
    },
    "end": {
      "x": 1,
      "y": 0.75
    }
  }
} as const;

// src/screens/MembershipScreen.tsx · SUBSCRIPTION_BUTTON_HIGHLIGHT
export const subscriptionButtonHighlight = {
  "colors": [
    "rgba(255,255,255,0.46)",
    "rgba(255,255,255,0.13)",
    "rgba(255,255,255,0)",
    "rgba(255,255,255,0.08)"
  ],
  "locations": [
    0,
    0.38,
    0.72,
    1
  ],
  "start": {
    "x": 0.5,
    "y": 0
  },
  "end": {
    "x": 0.5,
    "y": 1
  }
} as const;

// src/screens/MembershipScreen.tsx · styles
export const subscriptionDockStyles = StyleSheet.create({
  purchaseDock: {"flexShrink":0,"gap":10,"paddingHorizontal":12,"paddingTop":18},
  purchaseButton: {"height":52,"minHeight":52,"paddingVertical":12,"borderRadius":12,"backgroundColor":"transparent","borderWidth":StyleSheet.hairlineWidth,"borderColor":"rgba(255,255,255,0.38)"},
  purchaseButtonText: {"fontSize":16,"lineHeight":22,"fontWeight":"700","color":"#1C1E22","textAlign":"center","includeFontPadding":false},
  legalRow: {"flexDirection":"row","flexWrap":"wrap","alignItems":"center","justifyContent":"center","columnGap":6},
  legalAction: {"minHeight":44,"paddingHorizontal":4,"justifyContent":"center"},
  legalLink: {"fontSize":12,"color":"rgba(255,255,255,0.8)","textDecorationLine":"underline"},
});

// src/screens/membership/MembershipBackground.tsx · styles
export const membershipBackgroundStyles = StyleSheet.create({
  root: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0,"overflow":"hidden"},
  scene: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0,"backgroundColor":"#0B0A0D"},
  image: {"position":"absolute","top":"-6%","left":0,"width":"100%","height":"100%","opacity":0.9},
});

// src/screens/membership/TreatPacksBackground.tsx · styles
export const treatBackgroundStyles = StyleSheet.create({
  root: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0,"overflow":"hidden"},
  glow: {"position":"absolute","top":0,"left":0,"right":0,"height":"30%","maxHeight":248},
});

// src/components/ProfileIdentity.tsx · styles
export const profileIdentityStyles = StyleSheet.create({
  identity: {"paddingHorizontal":12,"paddingTop":12,"paddingBottom":24},
  identityRow: {"flexDirection":"row","alignItems":"center","gap":16},
  coverOverlap: {"marginTop":-45,"paddingTop":0},
  avatar: {"width":90,"height":90,"flexShrink":0},
  information: {"flex":1,"minWidth":0},
  textGroup: {"maxWidth":"100%","alignItems":"flex-start"},
  details: {"alignSelf":"stretch","alignItems":"flex-start","gap":12,"marginTop":16},
  subtitleRow: {"alignSelf":"stretch","maxWidth":"100%","flexDirection":"row","alignItems":"center","justifyContent":"flex-start","gap":6},
  nameRow: {"alignSelf":"stretch","maxWidth":"100%","flexDirection":"row","alignItems":"center","justifyContent":"flex-start","gap":6,"marginBottom":2},
  accessory: {"width":24,"height":24,"alignItems":"center","justifyContent":"center"},
  avatarSkeleton: {"width":90,"height":90,"borderRadius":45},
  nameSkeleton: {"width":120,"height":24,"borderRadius":4},
  subtitleSkeleton: {"width":96,"height":14,"borderRadius":4},
});

// src/screens/MeScreen.tsx · styles
export const profileAccountStyles = StyleSheet.create({
  accountCards: {"gap":8,"marginHorizontal":12},
  accountCardRow: {"flexDirection":"row","gap":8},
  accountCard: {"minWidth":0,"paddingHorizontal":12,"paddingVertical":12,"borderRadius":12,"flexDirection":"row","alignItems":"center","gap":8},
  accountCardContent: {"flex":1,"minWidth":0,"gap":8},
  accountCardPrimaryRow: {"minHeight":28,"flexDirection":"row","alignItems":"center"},
  accountCardLabel: {"flexShrink":1,"fontSize":12,"lineHeight":16},
  membershipCardContent: {"alignSelf":"stretch","justifyContent":"space-between"},
  membershipCrown: {"width":52,"height":52,"flexShrink":0},
  creditToken: {"width":48,"height":48,"flexShrink":0},
});

// src/components/messageListRowStyles.ts · messageListRowStyles
export const nativeInboxStyles = StyleSheet.create({
  row: {"flexDirection":"row","alignItems":"center","gap":12,"paddingLeft":12},
  avatarWrap: {"width":52,"height":52,"marginVertical":14},
  avatarFallback: {"alignItems":"center","justifyContent":"center"},
  avatarLetter: {"fontSize":20,"fontWeight":"700"},
  unreadDot: {"width":8,"height":8,"borderRadius":4},
  rowBody: {"flex":1,"alignSelf":"stretch","justifyContent":"center","gap":4,"paddingRight":12,"borderBottomWidth":StyleSheet.hairlineWidth},
  rowHeader: {"flexDirection":"row","justifyContent":"space-between","alignItems":"center","gap":8},
  rowName: {"fontSize":15,"fontWeight":"600","flexShrink":1},
  rowTime: {"fontSize":11},
  rowPreview: {"fontSize":13,"flex":1},
});

// src/components/MeContentCard.tsx · meContentGridStyles
export const profileContentStyles = StyleSheet.create({
  cover: {"width":"100%","aspectRatio":0.75,"borderRadius":8,"overflow":"hidden"},
  title: {"fontSize":14,"fontWeight":"500","letterSpacing":0.14},
  subtitle: {"fontSize":12,"letterSpacing":0.12,"marginTop":2},
});

// src/screens/chat/CompanionCard.tsx · styles
export const companionCardStyles = StyleSheet.create({
  card: {"flexGrow":0,"flexShrink":0,"aspectRatio":0.6392405063291139,"borderRadius":8,"overflow":"hidden"},
  discoverCard: {"aspectRatio":0.6},
  fallback: {"alignItems":"center","justifyContent":"center"},
  fallbackText: {"fontSize":44,"fontWeight":"700"},
  copy: {"position":"absolute","right":8,"bottom":8,"left":8},
  name: {"color":"#FFFFFF","fontSize":16,"lineHeight":20,"fontWeight":"700"},
  discoverName: {"fontSize":14,"lineHeight":18},
  tagline: {"color":"rgba(255,255,255,0.72)","fontSize":12,"marginTop":3},
  taglineLineHeight: {"lineHeight":17},
  tags: {"height":18,"flexDirection":"row","flexWrap":"wrap","gap":4,"marginTop":5,"overflow":"hidden"},
  tag: {"height":18,"maxWidth":"100%","justifyContent":"center","paddingHorizontal":6,"borderRadius":4,"backgroundColor":"rgba(255,255,255,0.16)"},
  tagText: {"color":"rgba(255,255,255,0.88)","fontSize":10,"lineHeight":14,"fontWeight":"500"},
  interactions: {"position":"absolute","top":10,"left":10,"flexDirection":"row","alignItems":"center","gap":4,"paddingHorizontal":8,"paddingVertical":4,"borderRadius":4,"backgroundColor":"rgba(0,0,0,0.60)"},
  interactionCount: {"color":"#FFFFFF","fontSize":11,"fontWeight":"500"},
  discoverHeader: {"position":"absolute","top":8,"left":8,"right":8,"flexDirection":"row","alignItems":"center","justifyContent":"space-between"},
  headerBadges: {"position":"absolute","top":10,"right":10,"flexDirection":"row","alignItems":"center","gap":6},
});

// src/screens/chat/ModelPicker.tsx · styles
export const modelPickerStyles = StyleSheet.create({
  modelPickerIntro: {"paddingBottom":8},
  modelTabs: {"flexDirection":"row","gap":4,"padding":4,"borderRadius":14,"marginTop":14,"marginBottom":6},
  modelTab: {"flex":1,"paddingVertical":9,"paddingHorizontal":8,"alignItems":"center","borderRadius":10},
  modelTabText: {"fontSize":13,"lineHeight":18,"fontWeight":"600"},
  modelAuxiliaryText: {"fontSize":12,"lineHeight":18},
  modelPiecesRow: {"flexDirection":"row","alignItems":"center","gap":7,"marginTop":10},
  modelPiecesContent: {"flexDirection":"row","alignItems":"center","gap":8},
  modelRechargeLabel: {"flexDirection":"row","alignItems":"center","gap":2},
  modelPiecesText: {"fontSize":13,"lineHeight":18,"fontWeight":"600"},
  modelPiecesAmount: {"fontSize":16,"lineHeight":22,"includeFontPadding":false,"fontVariant":["tabular-nums"]},
  modelOptionCard: {"borderRadius":16,"overflow":"hidden","paddingHorizontal":21,"paddingVertical":15,"marginBottom":10},
  modelOptionSurface: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0,"borderRadius":16},
  modelOptionInset: {"position":"absolute","top":1.25,"right":1.25,"bottom":1.25,"left":1.25,"borderRadius":14.75,"overflow":"hidden"},
  modelOptionCardHeader: {"flexDirection":"row","alignItems":"center","justifyContent":"space-between","gap":12},
  modelOptionHeading: {"flex":1,"minWidth":0,"flexDirection":"row","alignItems":"center","flexWrap":"wrap","columnGap":8,"rowGap":6},
  modelOptionName: {"flexShrink":1,"fontSize":16,"lineHeight":22,"fontWeight":"700"},
  modelOptionDescription: {"fontSize":12,"lineHeight":18,"fontWeight":"400","marginTop":8},
  modelPriceRow: {"flexDirection":"row","alignItems":"center","justifyContent":"space-between","columnGap":12,"marginTop":8},
  modelPriceAmounts: {"flex":1,"minWidth":0,"flexDirection":"row","alignItems":"center","gap":6},
  modelOriginalPrice: {"flexShrink":1,"minWidth":0,"textDecorationLine":"line-through"},
  modelOfferCountdown: {"flexShrink":0,"textAlign":"right","fontVariant":["tabular-nums"]},
  modelOptionPrice: {"fontSize":14,"lineHeight":20,"fontWeight":"600","includeFontPadding":false},
});

// src/components/LoginBackground.tsx · styles
export const loginBackdropStyles = StyleSheet.create({
  tilt: {"position":"absolute","top":-160,"bottom":-160,"left":-160,"right":-160,"alignItems":"center","transform":[{"rotate":"-10deg"}]},
  row: {"flexDirection":"row"},
  coverWrap: {"width":220,"height":293,"borderRadius":20,"overflow":"hidden","backgroundColor":"#0B0B0D","marginBottom":12,"marginHorizontal":6},
  coverImg: {"width":"100%","transform":[{"scale":1.03}]},
});

// app/(auth)/login.tsx · styles
export const loginFormStyles = StyleSheet.create({
  welcomeHeader: {"alignItems":"center","gap":8,"marginBottom":28},
  welcomeText: {"color":"#FFFFFF","fontSize":36,"lineHeight":44,"fontWeight":"700","textAlign":"center"},
  logo: {"width":144,"height":36},
  bottomGroup: {"marginTop":24},
  primaryMethods: {"gap":12},
  methodBtn: {"backgroundColor":"#FFFFFF","borderRadius":12,"height":52,"minHeight":52,"paddingVertical":12},
  methodBtnText: {"color":"#000000","fontWeight":"500","fontSize":16,"lineHeight":22},
  emailBtn: {"backgroundColor":"#2A2A2C","marginTop":12},
  emailBtnText: {"color":"rgba(255,255,255,0.72)"},
  legal: {"fontSize":12,"lineHeight":18,"textAlign":"center","marginTop":18,"paddingHorizontal":8},
  legalLink: {"fontWeight":"600","textDecorationLine":"underline"},
});

// src/components/MessageEmptyState.tsx · styles
export const messageEmptyStyles = StyleSheet.create({
  container: {"flex":1,"alignItems":"center","justifyContent":"center","paddingHorizontal":12},
  image: {"width":60,"height":60,"marginBottom":12},
  message: {"fontSize":14,"lineHeight":20,"textAlign":"center"},
});

// src/theme/modelPickerSheet.ts · modelPickerSheetStyles
export const modelSheetStyles = StyleSheet.create({
  surface: {"backgroundColor":"#1C1C1E","borderTopLeftRadius":20,"borderTopRightRadius":20,"paddingHorizontal":12},
  dragZone: {"height":22,"alignItems":"center","justifyContent":"center"},
  handle: {"width":36,"height":4,"borderRadius":2,"backgroundColor":"#2A2A28"},
  heading: {"minHeight":48,"alignItems":"flex-start","justifyContent":"center"},
  title: {"fontSize":18,"lineHeight":24,"fontWeight":"700"},
});

// src/components/primitives/centeredDialogStyles.ts · centeredDialogStyles
export const nativeConfirmStyles = StyleSheet.create({
  card: {"width":"100%","maxWidth":400,"borderRadius":20,"borderWidth":StyleSheet.hairlineWidth,"padding":20,"gap":16},
  heading: {"flexDirection":"row","alignItems":"center","gap":8},
  close: {"width":44,"height":44,"alignItems":"center","justifyContent":"center","marginRight":-10,"marginTop":-10},
});

// src/components/primitives/noticeDialogStyles.ts · noticeDialogStyles
export const nativeNoticeStyles = StyleSheet.create({
  cardContent: {"paddingHorizontal":20,"paddingTop":32,"paddingBottom":20,"alignItems":"center"},
  title: {"alignSelf":"stretch","paddingHorizontal":12,"color":"#F7F7F8","fontSize":20,"lineHeight":28,"fontWeight":"700","textAlign":"center"},
  body: {"color":"#D8D8DC","fontSize":14,"lineHeight":24},
  primaryButton: {"minHeight":48,"paddingHorizontal":24,"paddingVertical":12,"borderRadius":999,"borderWidth":0,"backgroundColor":"#FFFFFF"},
  primaryButtonText: {"color":"#1C1E22","fontSize":15,"lineHeight":21,"fontWeight":"600"},
});

// src/screens/SearchScreen.tsx · styles
export const nativeSearchStyles = StyleSheet.create({
  searchInputWrap: {"flex":1,"height":40,"borderRadius":999,"borderWidth":1,"paddingHorizontal":14,"flexDirection":"row","alignItems":"center"},
  searchInput: {"flex":1,"height":"100%","fontSize":15,"lineHeight":20,"fontWeight":"600","letterSpacing":0,"padding":0},
});

// src/screens/HomeScreen.tsx · styles
export const homePillStyles = StyleSheet.create({
  tabPill: {"position":"relative","flexDirection":"row","alignItems":"center","gap":4,"paddingHorizontal":8,"paddingVertical":8,"borderRadius":8,"borderWidth":0.5},
  tabPillIdle: {"backgroundColor":"rgba(255,255,255,0.05)","borderColor":"transparent"},
  tabPillActive: {"backgroundColor":"rgba(255,255,255,0.13)","borderColor":"rgba(255,255,255,0.22)"},
  tabIcon: {"width":18,"height":18},
});

// src/screens/HomeScreen.tsx · styles
export const homeFeedStyles = StyleSheet.create({
  feedCover: {"width":"100%","aspectRatio":1.7774647887323944,"borderRadius":12,"overflow":"hidden"},
  feedTitleRow: {"flexDirection":"row","alignItems":"center","gap":4},
  feedTitle: {"flex":1,"flexShrink":1,"fontSize":14,"fontWeight":"500","letterSpacing":0.14},
  feedMeta: {"flexDirection":"row","alignItems":"center","marginTop":2},
  feedMetaText: {"fontSize":12,"letterSpacing":0.12},
  catBadge: {"position":"absolute","top":10,"left":10,"backgroundColor":"rgba(0,0,0,0.6)","paddingHorizontal":8,"paddingVertical":4,"borderRadius":4},
  catBadgeText: {"color":"#fff","fontSize":11,"fontWeight":"500"},
});

// src/screens/chat/ChatScreen.tsx · styles
export const chatHeaderStyles = StyleSheet.create({
  topBar: {"position":"absolute","top":0,"left":0,"right":0,"zIndex":4,"overflow":"visible","flexDirection":"row","alignItems":"center","paddingHorizontal":8,"paddingBottom":8},
  iconButton: {"width":40,"height":40,"alignItems":"center","justifyContent":"center"},
  modelSwitchPill: {"height":32,"flexDirection":"row","alignItems":"center","justifyContent":"center","gap":6,"paddingHorizontal":12,"borderRadius":999,"flexShrink":0,"overflow":"visible"},
  modelSwitchText: {"fontSize":13,"lineHeight":18,"fontWeight":"600","flexShrink":1,"minWidth":0},
  titleWrap: {"flex":1,"minWidth":0,"flexDirection":"row","alignItems":"center","gap":10},
  headerAvatar: {"width":34,"height":34,"borderRadius":17},
  title: {"fontSize":15,"fontWeight":"700"},
});

// src/screens/chat/MessageBubble.tsx · styles
export const chatBubbleStyles = StyleSheet.create({
  userBubble: {"maxWidth":"82%","borderRadius":16,"borderTopRightRadius":0,"paddingHorizontal":13,"paddingVertical":10,"backgroundColor":"#F3C5E0","shadowColor":"#DE8AC5","shadowOpacity":0.18,"shadowRadius":10,"shadowOffset":{"width":0,"height":2},"elevation":2},
  userBubbleSurface: {"position":"absolute","top":0,"right":0,"bottom":0,"left":0,"borderRadius":16,"borderTopRightRadius":0,"overflow":"hidden"},
  userBubbleHighlight: {"position":"absolute","top":0,"left":10,"right":8,"height":StyleSheet.hairlineWidth},
  userText: {"color":"#17171A","fontSize":15,"lineHeight":21,"fontWeight":"500"},
  dialogRow: {"flexDirection":"row","alignItems":"flex-start","gap":8},
  dialogBubble: {"alignSelf":"flex-start","maxWidth":"100%","flexShrink":1,"borderRadius":16,"borderTopLeftRadius":0,"paddingHorizontal":13,"paddingVertical":10},
  thoughtRow: {"borderLeftWidth":2,"paddingLeft":10},
  thoughtText: {"fontSize":14,"lineHeight":22,"fontStyle":"italic"},
});

// src/overlays/ShareSheet.tsx · styles
export const shareSheetStyles = StyleSheet.create({
  companionTitle: {"fontSize":26,"lineHeight":32,"fontWeight":"700","textAlign":"center"},
  linkRow: {"flexDirection":"row","alignItems":"center","gap":8,"marginTop":20,"padding":6,"paddingLeft":16,"borderRadius":28},
  linkText: {"flex":1,"minWidth":0,"fontSize":16,"lineHeight":22},
  linkCopy: {"width":40,"height":40,"borderRadius":20,"alignItems":"center","justifyContent":"center"},
  targetsRow: {"alignSelf":"center","flexDirection":"row","justifyContent":"center","paddingTop":18,"paddingBottom":20,"gap":28},
  target: {"width":76,"alignItems":"center","gap":8},
  iconCircle: {"width":60,"height":60,"borderRadius":30,"alignItems":"center","justifyContent":"center"},
});

// src/overlays/CompanionSharePreview.tsx · styles
export const sharePreviewStyles = StyleSheet.create({
  characterCard: {"height":120,"flexShrink":0,"flexDirection":"row","alignItems":"center","gap":12,"padding":12,"borderRadius":16,"marginTop":20,"overflow":"hidden"},
  characterImage: {"width":96,"height":96,"flexShrink":0,"borderRadius":12,"overflow":"hidden","alignItems":"center","justifyContent":"center"},
  characterInfo: {"flex":1,"minWidth":0,"height":96,"justifyContent":"center","overflow":"hidden"},
  characterName: {"flexShrink":0,"fontSize":16,"lineHeight":24,"fontWeight":"600","includeFontPadding":false},
  description: {"flexShrink":0,"marginTop":6,"fontSize":12,"lineHeight":20,"includeFontPadding":false},
});

// src/screens/ShortDramaProgressBar.tsx · styles
export const dramaProgressStyles = StyleSheet.create({
  track: {"backgroundColor":"rgba(255,255,255,0.3)"},
  fill: {"position":"absolute","left":0,"top":0,"bottom":0,"backgroundColor":"#fff"},
  thumb: {"position":"absolute","width":12,"height":12,"borderRadius":6,"backgroundColor":"#fff"},
});

// src/screens/chat/creator/CharacterVoiceCard.tsx · styles
export const voiceCardStyles = StyleSheet.create({
  card: {"flexGrow":1,"minHeight":112,"borderRadius":16,"overflow":"hidden"},
  select: {"flexGrow":1,"minHeight":112,"padding":12,"paddingBottom":48,"gap":4},
  check: {"position":"absolute","top":12,"right":12},
  preview: {"position":"absolute","bottom":4,"right":4,"width":44,"height":44,"alignItems":"center","justifyContent":"center"},
  playCircle: {"width":28,"height":28,"borderRadius":14,"alignItems":"center","justifyContent":"center"},
  skeletonAvatar: {"width":24,"height":24,"borderRadius":12,"flexShrink":0},
  skeletonNameLine: {"height":21,"justifyContent":"center"},
  skeletonName: {"height":14,"width":"65%","borderRadius":7},
});
