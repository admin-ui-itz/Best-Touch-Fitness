-- ---------------------------------------------------------------------------
-- 0003: make enquiries.message optional
--
-- The redesign brief asks for the Message field to be optional unless there
-- is a genuine operational requirement for it — there isn't one, so it's
-- relaxed from "required, 10-2000 chars" to "optional, up to 2000 chars".
-- ---------------------------------------------------------------------------

alter table public.enquiries
  alter column message drop not null;

-- Postgres's default name for the original inline column check.
alter table public.enquiries
  drop constraint if exists enquiries_message_check;

alter table public.enquiries
  add constraint enquiries_message_check
  check (message is null or char_length(message) <= 2000);
