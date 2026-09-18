/**
 * Central business configuration.
 *
 * Every value here that is `null` or empty is UNVERIFIED and is hidden from
 * the public site until the owner supplies it. See docs/OWNER-CHECKLIST.md.
 * Do not invent values to fill gaps.
 */

export type Address = {
  street: string;
  town: string;
  region?: string;
  postcode?: string;
  country: string;
  /** Google Maps embed URL (https://www.google.com/maps/embed?...) */
  mapEmbedUrl?: string;
  /** Link to open in a maps app */
  mapLinkUrl?: string;
};

export type OpeningHours = Array<{ days: string; hours: string }>;

export type Trainer = {
  name: string;
  role: string;
  bio: string;
  /** Verified qualifications only. */
  qualifications?: string[];
};

export type TimetableEntry = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  start: string; // "18:30"
  end?: string; // "19:30"
  classSlug: string;
  location?: string;
};

export const siteConfig = {
  /** Working title until the client confirms the brand name. */
  name: "GYM",
  /** Used in copy such as "the GYM community". */
  shortName: "GYM",
  legalName: null as string | null,
  tagline: "Get stronger. Move better. Find your community.",
  description:
    "Outdoor group training for every age and stage. Join our classes, move with a supportive community and build strength that lasts.",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL in the environment. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",

  contact: {
    /** Public email. null = hidden. */
    email: null as string | null,
    /** Public phone in international format, e.g. "+1 246 000 0000". null = hidden. */
    phone: null as string | null,
    /** WhatsApp number in E.164 digits only, e.g. "12460000000". null = no WhatsApp button. */
    whatsapp: null as string | null,
  },

  /** null = location/map section hidden. */
  address: null as Address | null,

  /** null = opening hours hidden. */
  openingHours: null as OpeningHours | null,

  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },

  /**
   * Meal plans and nutrition advice are provided by a partner nutritionist,
   * not by the gym owner. Name and link shown only once verified.
   */
  nutritionPartner: {
    name: null as string | null,
    credentials: null as string | null,
    url: null as string | null,
  },

  /** Verified trainer information. Empty = section shows community copy only. */
  trainers: [] as Trainer[],

  /** null = timetable hidden everywhere. */
  timetable: null as TimetableEntry[] | null,

  /**
   * Planned classes (Spin, Step) are hidden by default. Set to true to show
   * them with a "Coming soon" label. Never a launch date unless verified.
   */
  showComingSoonClasses: false,

  /** Set true only once marketing emails will actually be sent. */
  marketingSignupEnabled: false,
};

export type SiteConfig = typeof siteConfig;

export const hasContactDetails = Boolean(
  siteConfig.contact.email || siteConfig.contact.phone || siteConfig.contact.whatsapp,
);

export const whatsappUrl = siteConfig.contact.whatsapp
  ? `https://wa.me/${siteConfig.contact.whatsapp}`
  : null;

export const socialLinks = Object.entries(siteConfig.social)
  .filter((entry): entry is [string, string] => Boolean(entry[1]))
  .map(([key, href]) => ({ key, href, label: key.charAt(0).toUpperCase() + key.slice(1) }));
