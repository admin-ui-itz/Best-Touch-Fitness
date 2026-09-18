import type { Metadata } from "next";
import Link from "next/link";

import { interestLabel } from "@/config/classes";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listUnconfiguredIntegrations } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

const statuses: Array<{ value: EnquiryStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-lime-400 text-charcoal-900",
  contacted: "bg-charcoal-900 text-cream-100",
  closed: "bg-cream-300 text-charcoal-900",
  spam: "bg-danger-soft text-danger",
};

type AdminPageProps = { searchParams: Promise<{ status?: string }> };

export default async function AdminEnquiriesPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = statuses.some((s) => s.value === status) ? (status as EnquiryStatus | "all") : "all";

  // Cookie-backed client: RLS enforces admin-only read.
  const supabase = await getSupabaseServerClient();
  let query = supabase!
    .from("enquiries")
    .select("id, created_at, name, email, interest, status")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter !== "all") query = query.eq("status", filter);
  const { data: enquiries, error } = await query;
  const missing = listUnconfiguredIntegrations();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl">Enquiries</h1>
          <p className="mt-1 text-ink-muted">Newest first. Click a name to review, change status or add notes.</p>
        </div>
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Link
              key={s.value}
              href={s.value === "all" ? "/admin" : `/admin?status=${s.value}`}
              aria-current={filter === s.value ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                filter === s.value ? "bg-charcoal-900 text-cream-100" : "bg-cream-200 text-charcoal-900 hover:bg-cream-300"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      {missing.length ? (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
          <p className="font-semibold">Integrations needing attention</p>
          <ul className="mt-1 list-disc pl-5">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
          Could not load enquiries: {error.message}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-charcoal-900/10 bg-cream-50">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Enquiries list</caption>
          <thead className="border-b border-charcoal-900/10 font-display text-xs uppercase tracking-[0.14em] text-ink-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Received</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Interest</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(enquiries ?? []).map((e) => (
              <tr key={e.id} className="border-b border-charcoal-900/5 last:border-0 hover:bg-cream-100">
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-muted">
                  <time dateTime={e.created_at}>{new Date(e.created_at).toLocaleString("en-GB")}</time>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/enquiries/${e.id}`} className="font-semibold underline decoration-lime-500 decoration-2 underline-offset-4">
                    {e.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{e.email}</td>
                <td className="px-4 py-3">{interestLabel(e.interest)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${statusStyles[e.status]}`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
            {!error && (enquiries ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-muted">
                  No enquiries {filter === "all" ? "yet" : `with status "${filter}"`}.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
