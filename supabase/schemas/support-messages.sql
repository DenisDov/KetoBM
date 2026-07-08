-- Individual messages in the "Help with chatbot" thread. Each message belongs to a
-- support_request (the conversation/ticket), so a chat and a ticket are one thing.
-- role distinguishes the user's messages from the assistant's replies.
create table public.support_messages (
  id uuid not null default gen_random_uuid(),

  -- The conversation this message belongs to. Cascade so deleting the ticket removes
  -- its messages.
  support_request_id uuid not null
    references public.support_requests on delete cascade,

  -- Denormalized owner, so RLS can gate on user_id without joining support_requests.
  user_id uuid not null references auth.users on delete cascade,

  -- Who sent the message.
  role text not null check (role in ('user', 'assistant')),

  content text not null,

  created_at timestamptz not null default now(),

  primary key (id)
);

-- Primary access pattern: a conversation's messages in chronological order.
create index support_messages_request_created_at_idx
  on public.support_messages (support_request_id, created_at);

alter table public.support_messages enable row level security;

grant select, insert on public.support_messages to authenticated;
grant select, insert, update, delete on public.support_messages to service_role;

-- A user can read their own conversation...
create policy "Support messages are viewable by owner"
  on public.support_messages for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ...and add their own messages. Assistant replies are written via service_role.
create policy "Support messages are insertable by owner"
  on public.support_messages for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
