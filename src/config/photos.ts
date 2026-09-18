/**
 * Asset inventory for the supplied gym photographs.
 *
 * All images are real outdoor group-training photographs, mostly taken at
 * night under a marquee. Source files were 2000x924 (2.165:1). They are
 * imported statically so next/image knows their intrinsic size and can
 * generate blur placeholders. See docs/ASSET-INVENTORY.md.
 */
import type { StaticImageData } from "next/image";

import bandedGluteBridgeSetup from "@/assets/photos/banded-glute-bridge-setup.jpg";
import bandedSingleLegBridgeWide from "@/assets/photos/banded-single-leg-bridge-wide.jpg";
import coolDownOverheadView from "@/assets/photos/cool-down-overhead-view.jpg";
import coolDownTwistHouse from "@/assets/photos/cool-down-twist-house.jpg";
import coolDownTwistStretch from "@/assets/photos/cool-down-twist-stretch.jpg";
import dumbbellPressDark from "@/assets/photos/dumbbell-press-dark.jpg";
import dumbbellPressLegsRaisedBright from "@/assets/photos/dumbbell-press-legs-raised-bright.jpg";
import dumbbellPressLegsRaisedTrio from "@/assets/photos/dumbbell-press-legs-raised-trio.jpg";
import forwardFoldStretchGroup from "@/assets/photos/forward-fold-stretch-group.jpg";
import gobletSquatHoldInstructor from "@/assets/photos/goblet-squat-hold-instructor.jpg";
import groupSeatedChatDusk from "@/assets/photos/group-seated-chat-dusk.jpg";
import groupSquatUnderTent from "@/assets/photos/group-squat-under-tent.jpg";
import hamstringStretchLaughing from "@/assets/photos/hamstring-stretch-laughing.jpg";
import silhouettesUnderTent from "@/assets/photos/silhouettes-under-tent.jpg";
import singleLegGluteBridgeGroup from "@/assets/photos/single-leg-glute-bridge-group.jpg";
import tentSilhouettesPole from "@/assets/photos/tent-silhouettes-pole.jpg";
import warmUpCircleLaughing from "@/assets/photos/warm-up-circle-laughing.jpg";
import wideMatWorkDumbbellPress from "@/assets/photos/wide-mat-work-dumbbell-press.jpg";

export type Photo = {
  src: StaticImageData;
  /** Descriptive alt text. Describes the activity, not individuals. */
  alt: string;
  /** CSS object-position used when the wide frame is cropped (mobile/cards). */
  focus: string;
  /** Source filename as supplied by the client, for traceability. */
  source: string;
};

export const photos = {
  gobletSquatHoldInstructor: {
    src: gobletSquatHoldInstructor,
    alt: "A coach at the centre of the group holding a dumbbell at chest height under a lit marquee at night, with members following the movement around her.",
    focus: "50% 45%",
    source: "16.jpg",
  },
  groupSquatUnderTent: {
    src: groupSquatUnderTent,
    alt: "Members squatting together on mats under a marquee at night, some holding dumbbells, with the coach at the front.",
    focus: "50% 50%",
    source: "1.jpg",
  },
  wideMatWorkDumbbellPress: {
    src: wideMatWorkDumbbellPress,
    alt: "Wide view of a night class: members lying on mats with legs raised, pressing dumbbells overhead under a white marquee.",
    focus: "50% 55%",
    source: "2.jpg",
  },
  forwardFoldStretchGroup: {
    src: forwardFoldStretchGroup,
    alt: "The group stretching forward towards their toes on mats under the marquee, with the coach in the centre.",
    focus: "50% 50%",
    source: "5.jpg",
  },
  singleLegGluteBridgeGroup: {
    src: singleLegGluteBridgeGroup,
    alt: "Members lying on mats doing single-leg glute bridges on an outdoor platform at night.",
    focus: "60% 50%",
    source: "6.jpg",
  },
  coolDownTwistStretch: {
    src: coolDownTwistStretch,
    alt: "Members lying on their backs in a relaxed twist stretch during the cool-down at the end of class.",
    focus: "45% 50%",
    source: "7.jpg",
  },
  dumbbellPressLegsRaisedTrio: {
    src: dumbbellPressLegsRaisedTrio,
    alt: "Three members lying on mats with legs raised, pressing dumbbells straight up, lit against the dark night.",
    focus: "50% 55%",
    source: "8.jpg",
  },
  warmUpCircleLaughing: {
    src: warmUpCircleLaughing,
    alt: "Members standing in a loose circle under the marquee, smiling and chatting before the session starts.",
    focus: "55% 40%",
    source: "9.jpg",
  },
  dumbbellPressDark: {
    src: dumbbellPressDark,
    alt: "Members lying on mats pressing dumbbells overhead with legs raised, lit from above in the dark.",
    focus: "50% 50%",
    source: "10.jpg",
  },
  tentSilhouettesPole: {
    src: tentSilhouettesPole,
    alt: "Silhouettes of members with legs raised on mats under the glowing marquee roof.",
    focus: "50% 50%",
    source: "11.jpg",
  },
  dumbbellPressLegsRaisedBright: {
    src: dumbbellPressLegsRaisedBright,
    alt: "Three members on mats pressing dumbbells overhead with legs raised, dumbbells lined up in the foreground.",
    focus: "50% 55%",
    source: "12.jpg",
  },
  groupSeatedChatDusk: {
    src: groupSeatedChatDusk,
    alt: "Members sitting on their mats chatting at dusk, with a row of dumbbells in the foreground.",
    focus: "50% 50%",
    source: "13.jpg",
  },
  bandedGluteBridgeSetup: {
    src: bandedGluteBridgeSetup,
    alt: "Four members lying on mats with resistance bands around their thighs, ready for glute bridges, dumbbells stacked nearby.",
    focus: "50% 45%",
    source: "14.jpg",
  },
  coolDownTwistHouse: {
    src: coolDownTwistHouse,
    alt: "Members lying in a gentle twist stretch on the platform at night, a lit window glowing behind them.",
    focus: "40% 55%",
    source: "15.jpg",
  },
  hamstringStretchLaughing: {
    src: hamstringStretchLaughing,
    alt: "Members lying on mats stretching one leg towards the sky, one laughing in the foreground.",
    focus: "55% 55%",
    source: "17.jpg",
  },
  bandedSingleLegBridgeWide: {
    src: bandedSingleLegBridgeWide,
    alt: "Wide view of members doing banded single-leg glute bridges on mats on an outdoor platform at night.",
    focus: "50% 55%",
    source: "18.jpg",
  },
  coolDownOverheadView: {
    src: coolDownOverheadView,
    alt: "Overhead view of members lying on mats in a cool-down twist at the end of a night class.",
    focus: "50% 50%",
    source: "19.jpg",
  },
  silhouettesUnderTent: {
    src: silhouettesUnderTent,
    alt: "Atmospheric silhouettes of the class on mats under the marquee at night.",
    focus: "50% 60%",
    source: "4.jpg",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Photo used for the home hero. Well lit, coach centred, faces visible. */
export const heroPhoto: Photo = photos.gobletSquatHoldInstructor;

/** Curated gallery order. Clear, well lit, respectful framing first. */
export const galleryPhotoKeys: PhotoKey[] = [
  "warmUpCircleLaughing",
  "bandedSingleLegBridgeWide",
  "groupSquatUnderTent",
  "wideMatWorkDumbbellPress",
  "groupSeatedChatDusk",
  "forwardFoldStretchGroup",
  "dumbbellPressLegsRaisedTrio",
  "bandedGluteBridgeSetup",
  "hamstringStretchLaughing",
  "singleLegGluteBridgeGroup",
  "dumbbellPressLegsRaisedBright",
  "coolDownTwistStretch",
  "coolDownTwistHouse",
  "coolDownOverheadView",
  "dumbbellPressDark",
  "tentSilhouettesPole",
];

/**
 * Supplied files intentionally NOT used on the public site:
 * - 3.jpg  (plank-position-from-behind): dark, framed from behind; not respectful of members.
 * - 20.jpg (motion-blur-forward-fold): heavy motion blur, unusable.
 */
