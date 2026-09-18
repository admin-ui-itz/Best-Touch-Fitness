import { interestLabel } from "@/config/classes";
import { siteConfig } from "@/config/site";
import type { EnquiryRow } from "@/lib/supabase/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f6f2ea;font-family:Helvetica,Arial,sans-serif;color:#17181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ea;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#17181b;padding:20px 28px;color:#c8ef3a;font-weight:800;font-size:18px;letter-spacing:0.04em;">${escapeHtml(siteConfig.name)}</td></tr>
        <tr><td style="padding:28px;font-size:16px;line-height:1.55;">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 28px;font-size:12px;color:#5b6069;border-top:1px solid #ece6da;">${escapeHtml(siteConfig.url)}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Acknowledgement to the enquirer. States clearly that the enquiry was
 * RECEIVED. It must never imply a class place has been booked.
 */
export function acknowledgementEmail(enquiry: EnquiryRow) {
  const firstName = enquiry.name.split(/\s+/)[0] ?? enquiry.name;
  const interest = interestLabel(enquiry.interest);
  const subject = `We received your enquiry, ${firstName}`;
  const text = [
    `Hi ${firstName},`,
    "",
    `Thanks for getting in touch with ${siteConfig.name}. This is a confirmation that we have received your enquiry about: ${interest}.`,
    "",
    "Someone from the team will reply personally. This message is a receipt only; it is not a booking, and no class place has been reserved yet.",
    "",
    "Your message:",
    enquiry.message,
    "",
    `${siteConfig.name}`,
    siteConfig.url,
  ].join("\n");

  const html = layout(
    subject,
    `<p style="margin:0 0 16px;">Hi ${escapeHtml(firstName)},</p>
     <p style="margin:0 0 16px;">Thanks for getting in touch with ${escapeHtml(siteConfig.name)}. This is a confirmation that we have <strong>received your enquiry</strong> about: <strong>${escapeHtml(interest)}</strong>.</p>
     <p style="margin:0 0 16px;">Someone from the team will reply personally. This message is a receipt only; it is not a booking, and no class place has been reserved yet.</p>
     <p style="margin:0 0 8px;font-size:13px;color:#5b6069;">Your message:</p>
     <blockquote style="margin:0 0 16px;padding:12px 16px;background:#f6f2ea;border-left:4px solid #c8ef3a;border-radius:8px;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</blockquote>
     <p style="margin:0;">${escapeHtml(siteConfig.name)}</p>`,
  );

  return { subject, text, html };
}

/** Internal notification to the owner with the full enquiry. */
export function ownerNotificationEmail(enquiry: EnquiryRow, adminUrl: string) {
  const interest = interestLabel(enquiry.interest);
  const subject = `New enquiry: ${interest} from ${enquiry.name}`;
  const rows: Array<[string, string]> = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Telephone", enquiry.phone ?? "Not provided"],
    ["Interested in", interest],
    ["Marketing consent", enquiry.marketing_consent ? "Yes" : "No"],
    ["Received", new Date(enquiry.created_at).toUTCString()],
  ];
  const text = [
    "New website enquiry",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    enquiry.message,
    "",
    `Review in admin: ${adminUrl}`,
  ].join("\n");

  const html = layout(
    subject,
    `<p style="margin:0 0 16px;font-weight:700;">New website enquiry</p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;margin:0 0 16px;">
       ${rows
         .map(
           ([k, v]) =>
             `<tr><td style="padding:4px 12px 4px 0;color:#5b6069;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`,
         )
         .join("")}
     </table>
     <p style="margin:0 0 8px;font-size:13px;color:#5b6069;">Message:</p>
     <blockquote style="margin:0 0 16px;padding:12px 16px;background:#f6f2ea;border-left:4px solid #c8ef3a;border-radius:8px;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</blockquote>
     <p style="margin:0;"><a href="${escapeHtml(adminUrl)}" style="color:#17181b;font-weight:700;">Review in admin</a></p>`,
  );

  return { subject, text, html };
}
