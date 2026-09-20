import { photos, type PhotoKey } from "./photos";
import { siteConfig } from "./site";

export type ClassStatus = "published" | "coming-soon" | "hidden";

export type GymClass = {
  slug: string;
  name: string;
  /** One line shown on cards. */
  summary: string;
  /** Short paragraph on the classes page. No invented exercises or durations. */
  description: string;
  /** Who it suits, phrased without medical claims. */
  suitedTo: string;
  /** Intensity and how it's modified for different levels, no invented specifics. */
  intensity: string;
  /** Practical, low-risk suggestion — not an operational policy. */
  whatToBring: string;
  /** Only set once genuinely confirmed; omitted from the page otherwise. */
  duration?: string;
  price?: string;
  status: ClassStatus;
  /** Label shown only when status is "coming-soon". Editable by the owner. */
  comingSoonLabel?: string;
  photo: PhotoKey;
};

export const gymClasses: GymClass[] = [
  {
    slug: "bums-tums-thighs",
    name: "Bums, Tums & Thighs",
    summary: "Lower-body and core focused training with the whole group.",
    description:
      "A session built around your glutes, core and legs. Expect mat work, resistance bands and light weights, with the pace set by the group and the coach keeping form front of mind.",
    suitedTo:
      "Anyone who wants to feel stronger through the hips, core and legs. Options are offered so you can work at your own level.",
    intensity:
      "Set by the group and adjusted by the coach. Every exercise has an easier or harder version, so you choose how far to push.",
    whatToBring: "Water, and a mat if you have one.",
    status: "published",
    photo: "stockCoupleLungesTwilight",
  },
  {
    slug: "bootcamp",
    name: "Bootcamp",
    summary: "Full-body group training that keeps the energy high.",
    description:
      "Our all-rounder. Bodyweight movement, dumbbells and team energy under the tent. You will sweat, you will laugh, and you will leave feeling like you did something.",
    suitedTo: "Beginners and regulars alike. Every movement can be scaled up or down.",
    intensity:
      "Higher energy than our other classes, but still scaled to you. First-timers are shown modifications for every move.",
    whatToBring: "Water, and a mat if you have one.",
    status: "published",
    photo: "stockGroupPlankFront",
  },
  {
    slug: "senior-circuit",
    name: "Senior Circuit",
    summary: "Steady, supported movement for our senior members.",
    description:
      "A circuit-style class designed with older adults in mind. Movements are taken at a comfortable pace with plenty of coaching and options, so you can build confidence session by session.",
    suitedTo: "Senior members who want to stay active, mobile and connected.",
    intensity: "Deliberately gentler pace with close coaching, built around confidence and consistency rather than intensity.",
    whatToBring: "Water, and a mat if you have one.",
    status: "published",
    photo: "coolDownTwistStretch",
  },
  {
    slug: "spin",
    name: "Spin",
    summary: "Indoor cycling sessions are on the way.",
    description: "Details will be shared once the class is confirmed.",
    suitedTo: "",
    intensity: "",
    whatToBring: "",
    status: "coming-soon",
    comingSoonLabel: "Coming soon",
    photo: "silhouettesUnderTent",
  },
  {
    slug: "step",
    name: "Step",
    summary: "Step classes are on the way.",
    description: "Details will be shared once the class is confirmed.",
    suitedTo: "",
    intensity: "",
    whatToBring: "",
    status: "coming-soon",
    comingSoonLabel: "Coming soon",
    photo: "silhouettesUnderTent",
  },
];

export const publishedClasses = gymClasses.filter((c) => c.status === "published");

/** Only shown when the owner opts in via siteConfig.showComingSoonClasses. */
export const comingSoonClasses = siteConfig.showComingSoonClasses
  ? gymClasses.filter((c) => c.status === "coming-soon")
  : [];

export function getClassBySlug(slug: string) {
  return gymClasses.find((c) => c.slug === slug) ?? null;
}

/**
 * Options offered in the enquiry form. Coming-soon classes are excluded so
 * nobody can be led to believe they are booking one. "Help me choose" is
 * separate from "General enquiry" so undecided visitors have an obvious,
 * low-commitment option.
 */
export const enquiryInterests = [
  ...publishedClasses.map((c) => ({ value: c.slug, label: c.name })),
  { value: "nutrition", label: "Nutrition support" },
  { value: "help-me-choose", label: "Help me choose a class" },
  { value: "general", label: "General enquiry" },
];

export const enquiryInterestValues = enquiryInterests.map((i) => i.value);

export function interestLabel(value: string) {
  return enquiryInterests.find((i) => i.value === value)?.label ?? value;
}

export const photoForClass = (c: GymClass) => photos[c.photo];
