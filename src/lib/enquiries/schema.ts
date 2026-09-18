import { z } from "zod";

import { enquiryInterestValues } from "@/config/classes";

const trimmed = (max: number) => z.string().trim().max(max);

/**
 * Server-side validation for the enquiry form. Mirrors the HTML constraints
 * so the client gets instant feedback but the server is the authority.
 */
export const enquirySchema = z.object({
  name: trimmed(120).min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email({ message: "Please enter a valid email address." })),
  phone: z
    .string()
    .trim()
    .max(40, "Telephone number looks too long.")
    .refine((v) => v === "" || /^[+()\d\s.-]{6,40}$/.test(v), "Please enter a valid telephone number, or leave it blank.")
    .transform((v) => (v === "" ? null : v)),
  interest: z
    .string()
    .trim()
    .refine((v) => enquiryInterestValues.includes(v), "Please choose what you are interested in."),
  message: trimmed(2000).min(10, "Please tell us a little more (at least 10 characters)."),
  marketingConsent: z.boolean().default(false),
  /** Client-generated UUID used to make submissions idempotent. */
  clientToken: z.string().uuid("Invalid submission token. Please reload the page and try again."),
  /** Honeypot: must be empty. Bots that fill every field are rejected. */
  website: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
  /** Timestamp (ms) when the form was rendered; sub-3-second submits are rejected. */
  renderedAt: z.coerce.number().int().nonnegative(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryInput, string>>;

/** Minimum time a human plausibly needs between render and submit. */
export const MIN_FILL_TIME_MS = 3000;

export function parseEnquiryFormData(formData: FormData) {
  const raw: EnquiryInput = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    interest: String(formData.get("interest") ?? ""),
    message: String(formData.get("message") ?? ""),
    marketingConsent: formData.get("marketingConsent") === "on",
    clientToken: String(formData.get("clientToken") ?? ""),
    website: String(formData.get("website") ?? ""),
    renderedAt: String(formData.get("renderedAt") ?? "0"),
  };
  const result = enquirySchema.safeParse(raw);
  if (result.success) {
    return { ok: true as const, values: result.data, raw };
  }
  const fieldErrors: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof EnquiryInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false as const, fieldErrors, raw };
}
