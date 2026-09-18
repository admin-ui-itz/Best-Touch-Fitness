import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionForm } from "@/components/admin/action-form";
import { interestLabel } from "@/config/classes";
import { retryEnquiryEmails, updateEnquiryNotes, updateEnquiryStatus } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { EmailStatus, EnquiryStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Enquiry" };
export const dynamic = "force-dynamic";

const statusOptions: EnquiryStatus[] = ["new", "contacted", "closed", "spam"];

const emailStatusStyles: Record<EmailStatus, string> = {
  pending: "bg-cream-300 text-charcoal-900",
  sent: "bg-success-soft text-success",
  failed: "bg-amber-100 text-amber-900",
  abandoned: "bg-danger-soft text-danger",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminEnquiryDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await getSupabaseServerClient();
  const [{ data: enquiry }, { data: deliveries }] = await Promise.all([
    supabase!.from("enquiries").select("*").eq("id", id).maybeSingle(),
    supabase!.from("email_deliveries").select("*").eq("enquiry_id", id).order("kind"),
  ]);
  if (!enquiry) notFound();

  const canRetry = (deliveries ?? []).some((d) => d.status === "pending" || d.status === "failed");

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-ink-muted hover:text-charcoal-900">
          &larr; All enquiries
        </Link>
        <h1 className="mt-3 text-3xl">{enquiry.name}</h1>
        <p className="mt-1 text-ink-muted">
          Received <time dateTime={enquiry.created_at}>{new Date(enquiry.created_at).toLocaleString("en-GB")}</time>
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-charcoal-900/10 bg-cream-50 p-6 sm:grid-cols-2">
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Email</dt>
            <dd className="mt-1">
              <a href={`mailto:${enquiry.email}`} className="font-semibold underline decoration-lime-500 decoration-2 underline-offset-4">
                {enquiry.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Telephone</dt>
            <dd className="mt-1">
              {enquiry.phone ? (
                <a href={`tel:${enquiry.phone.replace(/\s+/g, "")}`} className="font-semibold">
                  {enquiry.phone}
                </a>
              ) : (
                <span className="text-ink-muted">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Interested in</dt>
            <dd className="mt-1 font-semibold">{interestLabel(enquiry.interest)}</dd>
          </div>
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Marketing consent</dt>
            <dd className="mt-1">{enquiry.marketing_consent ? "Yes" : "No"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Message</dt>
            <dd className="mt-2 whitespace-pre-wrap rounded-xl bg-cream-100 p-4">{enquiry.message}</dd>
          </div>
        </dl>

        <section className="mt-8" aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="text-xl">Internal notes</h2>
          <ActionForm action={updateEnquiryNotes} submitLabel="Save notes" className="mt-3">
            <input type="hidden" name="id" value={enquiry.id} />
            <label htmlFor="notes" className="sr-only">
              Notes
            </label>
            <textarea id="notes" name="notes" rows={4} maxLength={4000} defaultValue={enquiry.notes ?? ""} className="field-input" />
          </ActionForm>
        </section>
      </div>

      <aside className="space-y-8">
        <section aria-labelledby="status-heading" className="rounded-2xl border border-charcoal-900/10 bg-cream-50 p-6">
          <h2 id="status-heading" className="text-xl">Status</h2>
          <ActionForm action={updateEnquiryStatus} submitLabel="Update status" className="mt-3">
            <input type="hidden" name="id" value={enquiry.id} />
            <label htmlFor="status" className="sr-only">
              Status
            </label>
            <select id="status" name="status" defaultValue={enquiry.status} className="field-input">
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </ActionForm>
        </section>

        <section aria-labelledby="email-heading" className="rounded-2xl border border-charcoal-900/10 bg-cream-50 p-6">
          <h2 id="email-heading" className="text-xl">Email delivery</h2>
          <ul className="mt-3 space-y-3">
            {(deliveries ?? []).map((d) => (
              <li key={d.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{d.kind === "acknowledgement" ? "Acknowledgement" : "Owner notification"}</span>
                  <span className={`rounded-full px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${emailStatusStyles[d.status]}`}>
                    {d.status}
                  </span>
                </div>
                <p className="mt-1 text-ink-muted">
                  {d.attempts}/{d.max_attempts} attempts
                  {d.sent_at ? ` · sent ${new Date(d.sent_at).toLocaleString("en-GB")}` : ""}
                </p>
                {d.last_error ? <p className="mt-1 break-words text-xs text-danger">{d.last_error}</p> : null}
              </li>
            ))}
            {(deliveries ?? []).length === 0 ? <li className="text-sm text-ink-muted">No email records.</li> : null}
          </ul>
          {canRetry ? (
            <ActionForm action={retryEnquiryEmails} submitLabel="Retry now" pendingLabel="Retrying" className="mt-4" buttonClassName="btn btn-secondary btn-sm">
              <input type="hidden" name="id" value={enquiry.id} />
            </ActionForm>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
