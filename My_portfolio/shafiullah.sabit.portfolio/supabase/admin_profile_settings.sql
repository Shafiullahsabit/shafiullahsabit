create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Shafiullah Sabit'
    check (char_length(trim(display_name)) between 1 and 60),
  accent_color text not null default '#22d3ee'
    check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  avatar_path text,
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

revoke all on public.admin_profiles from anon, authenticated;
grant select, insert, update on public.admin_profiles to authenticated;

drop policy if exists "Admins can read their own profile"
  on public.admin_profiles;
create policy "Admins can read their own profile"
  on public.admin_profiles
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.is_contact_admin())
  );

drop policy if exists "Admins can create their own profile"
  on public.admin_profiles;
create policy "Admins can create their own profile"
  on public.admin_profiles
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.is_contact_admin())
  );

drop policy if exists "Admins can update their own profile"
  on public.admin_profiles;
create policy "Admins can update their own profile"
  on public.admin_profiles
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.is_contact_admin())
  )
  with check (
    user_id = (select auth.uid())
    and (select public.is_contact_admin())
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'admin-avatars',
  'admin-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read their own profile images"
  on storage.objects;
create policy "Admins can read their own profile images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'admin-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_contact_admin())
  );

drop policy if exists "Admins can upload their own profile images"
  on storage.objects;
create policy "Admins can upload their own profile images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'admin-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_contact_admin())
  );

drop policy if exists "Admins can delete their own profile images"
  on storage.objects;
create policy "Admins can delete their own profile images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'admin-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_contact_admin())
  );

notify pgrst, 'reload schema';
