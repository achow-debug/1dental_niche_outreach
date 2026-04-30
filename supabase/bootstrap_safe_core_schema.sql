-- Safe bootstrap for core Carter Dental admin schema.
-- Idempotent: safe to run multiple times.
-- Purpose: recover projects where initial migrations were not applied.

create extension if not exists "pgcrypto";

-- Enums used by core tables
do $$ begin
  create type public.profile_role as enum ('user', 'client', 'staff', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.profile_status as enum ('active', 'suspended', 'banned', 'pending_review');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.session_instance_status as enum ('scheduled', 'cancelled', 'completed');
exception
  when duplicate_object then null;
end $$;

-- Base profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  first_name text,
  last_name text,
  email text,
  phone text,
  phone_prefix text,
  phone_number text,
  avatar_url text,
  role public.profile_role not null default 'user',
  status public.profile_status not null default 'active',
  moderation_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Service catalog
create table if not exists public.session_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  sort_order int not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_types (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.session_categories (id) on delete set null,
  title text not null,
  description text,
  duration_minutes int not null check (duration_minutes > 0),
  price_cents int not null default 0,
  currency text not null default 'GBP',
  max_slots int not null default 1 check (max_slots >= 1),
  location_label text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Calendar + bookings
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_type_id uuid not null references public.session_types (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Europe/London',
  max_slots int not null check (max_slots >= 1),
  price_override_cents int,
  location_override text,
  status public.session_instance_status not null default 'scheduled',
  cancel_reason text,
  cancelled_at timestamptz,
  notes text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_time_order check (ends_at > starts_at)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null references public.sessions (id) on delete restrict,
  session_type_id uuid references public.session_types (id) on delete set null,
  status public.booking_status not null default 'pending',
  cancel_reason text,
  cancelled_at timestamptz,
  client_notes text,
  admin_notes text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_sessions_starts_at on public.sessions (starts_at);
create index if not exists idx_sessions_deleted_at on public.sessions (deleted_at) where deleted_at is null;
create index if not exists idx_bookings_user_created on public.bookings (user_id, created_at desc);
create index if not exists idx_bookings_session on public.bookings (session_id);
create index if not exists idx_bookings_deleted_at on public.bookings (deleted_at) where deleted_at is null;

-- shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_session_categories_updated_at on public.session_categories;
create trigger set_session_categories_updated_at
before update on public.session_categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_session_types_updated_at on public.session_types;
create trigger set_session_types_updated_at
before update on public.session_types
for each row
execute function public.set_updated_at();

drop trigger if exists set_sessions_updated_at on public.sessions;
create trigger set_sessions_updated_at
before update on public.sessions
for each row
execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

-- New auth user -> profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Minimal RLS helpers/policies for this app
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role in ('staff', 'admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.session_categories enable row level security;
alter table public.session_types enable row level security;
alter table public.sessions enable row level security;
alter table public.bookings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own_or_admin'
  ) then
    create policy "profiles_select_own_or_admin"
      on public.profiles for select
      using (auth.uid() = id or public.is_admin());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own_or_admin'
  ) then
    create policy "profiles_update_own_or_admin"
      on public.profiles for update
      using (auth.uid() = id or public.is_admin())
      with check (auth.uid() = id or public.is_admin());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'session_categories' and policyname = 'session_categories_select'
  ) then
    create policy "session_categories_select"
      on public.session_categories for select
      using ((deleted_at is null and is_active = true) or public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'session_categories' and policyname = 'session_categories_staff_all'
  ) then
    create policy "session_categories_staff_all"
      on public.session_categories for all
      using (public.is_staff())
      with check (public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'session_types' and policyname = 'session_types_select'
  ) then
    create policy "session_types_select"
      on public.session_types for select
      using ((deleted_at is null and is_active = true) or public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'session_types' and policyname = 'session_types_staff_all'
  ) then
    create policy "session_types_staff_all"
      on public.session_types for all
      using (public.is_staff())
      with check (public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'sessions' and policyname = 'sessions_select_bookable_or_staff'
  ) then
    create policy "sessions_select_bookable_or_staff"
      on public.sessions for select
      using (
        public.is_staff()
        or (
          deleted_at is null
          and status = 'scheduled'
          and starts_at > now()
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'sessions' and policyname = 'sessions_staff_write'
  ) then
    create policy "sessions_staff_write"
      on public.sessions for insert
      with check (public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'sessions' and policyname = 'sessions_staff_update'
  ) then
    create policy "sessions_staff_update"
      on public.sessions for update
      using (public.is_staff())
      with check (public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_select_own_or_staff'
  ) then
    create policy "bookings_select_own_or_staff"
      on public.bookings for select
      using (user_id = auth.uid() or public.is_staff());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_insert_own'
  ) then
    create policy "bookings_insert_own"
      on public.bookings for insert
      with check (user_id = auth.uid());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_update_own_or_staff'
  ) then
    create policy "bookings_update_own_or_staff"
      on public.bookings for update
      using (user_id = auth.uid() or public.is_staff())
      with check (user_id = auth.uid() or public.is_staff());
  end if;
end
$$;
