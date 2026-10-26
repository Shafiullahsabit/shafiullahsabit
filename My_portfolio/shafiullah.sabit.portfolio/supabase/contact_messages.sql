create table if not exists public.contact_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text not null check (char_length(trim(last_name)) between 1 and 80),
  email text not null check (
    char_length(email) between 3 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  project_type text check (project_type is null or char_length(project_type) <= 100),
  message text not null check (char_length(trim(message)) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_admins enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.is_contact_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.contact_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_contact_admin() from public;
grant execute on function public.is_contact_admin() to authenticated;

revoke all on public.contact_admins from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
grant insert (first_name, last_name, email, project_type, message)
  on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant update (is_read) on public.contact_messages to authenticated;

drop policy if exists "Anyone can submit a contact message"
  on public.contact_messages;
create policy "Anyone can submit a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    char_length(trim(first_name)) between 1 and 80
    and char_length(trim(last_name)) between 1 and 80
    and char_length(email) between 3 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    and char_length(trim(message)) between 1 and 5000
    and (project_type is null or char_length(project_type) <= 100)
  );

drop policy if exists "Contact admins can read messages"
  on public.contact_messages;
create policy "Contact admins can read messages"
  on public.contact_messages
  for select
  to authenticated
  using ((select public.is_contact_admin()));

drop policy if exists "Contact admins can mark messages as read"
  on public.contact_messages;
create policy "Contact admins can mark messages as read"
  on public.contact_messages
  for update
  to authenticated
  using ((select public.is_contact_admin()))
  with check ((select public.is_contact_admin()));

drop policy if exists "Contact admins can delete messages"
  on public.contact_messages;
create policy "Contact admins can delete messages"
  on public.contact_messages
  for delete
  to authenticated
  using ((select public.is_contact_admin()));

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

notify pgrst, 'reload schema';
