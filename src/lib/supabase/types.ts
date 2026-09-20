/**
 * Hand-maintained database types matching supabase/migrations.
 * Regenerate with `supabase gen types typescript` once the project exists,
 * keeping the shape below.
 */

export type EnquiryStatus = "new" | "contacted" | "closed" | "spam";
export type EmailKind = "acknowledgement" | "owner_notification";
export type EmailStatus = "pending" | "sent" | "failed" | "abandoned";

export type EnquiryRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string | null;
  marketing_consent: boolean;
  status: EnquiryStatus;
  client_token: string;
  ip_hash: string | null;
  user_agent: string | null;
  notes: string | null;
};

export type EnquiryInsert = Omit<EnquiryRow, "id" | "created_at" | "updated_at" | "status" | "notes"> & {
  status?: EnquiryStatus;
  notes?: string | null;
};

export type EmailDeliveryRow = {
  id: string;
  enquiry_id: string;
  kind: EmailKind;
  status: EmailStatus;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  provider_message_id: string | null;
  next_attempt_at: string;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminUserRow = {
  user_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      enquiries: {
        Row: EnquiryRow;
        Insert: EnquiryInsert;
        Update: Partial<EnquiryRow>;
        Relationships: [];
      };
      email_deliveries: {
        Row: EmailDeliveryRow;
        Insert: Pick<EmailDeliveryRow, "enquiry_id" | "kind"> & Partial<EmailDeliveryRow>;
        Update: Partial<EmailDeliveryRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: AdminUserRow;
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      count_recent_enquiries: { Args: { p_ip_hash: string; p_since: string }; Returns: number };
    };
    Enums: {
      enquiry_status: EnquiryStatus;
      email_kind: EmailKind;
      email_status: EmailStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
