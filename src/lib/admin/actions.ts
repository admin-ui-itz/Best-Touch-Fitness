"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdmin } from "@/lib/auth/require-admin";
import { retryDueDeliveries } from "@/lib/email/deliveries";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminActionState = { ok?: boolean; error?: string; info?: string };

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed", "spam"]),
});

const notesSchema = z.object({
  id: z.string().uuid(),
  notes: z.string().trim().max(4000),
});

/**
 * All admin mutations re-check admin membership on the server and go through
 * the cookie-backed client so RLS applies (only status/notes are grantable).
 */
export async function updateEnquiryStatus(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "You are not allowed to do that." };
  }
  const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return { error: "Invalid status." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Not configured." };
  const { error } = await supabase.from("enquiries").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);
  return { ok: true, info: `Status set to "${parsed.data.status}".` };
}

export async function updateEnquiryNotes(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "You are not allowed to do that." };
  }
  const parsed = notesSchema.safeParse({ id: formData.get("id"), notes: formData.get("notes") ?? "" });
  if (!parsed.success) return { error: "Notes are too long (4000 characters max)." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Not configured." };
  const { error } = await supabase
    .from("enquiries")
    .update({ notes: parsed.data.notes === "" ? null : parsed.data.notes })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);
  return { ok: true, info: "Notes saved." };
}

export async function retryEnquiryEmails(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "You are not allowed to do that." };
  }
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid enquiry." };
  const summary = await retryDueDeliveries(10, { force: true, enquiryId: id.data });
  revalidatePath(`/admin/enquiries/${id.data}`);
  if (summary.error) return { error: summary.error };
  if (summary.processed === 0) return { ok: true, info: "Nothing to retry: all emails are sent or abandoned." };
  return {
    ok: true,
    info: `Retried ${summary.processed}: ${summary.sent} sent, ${summary.failed} failed, ${summary.abandoned} abandoned.`,
  };
}
