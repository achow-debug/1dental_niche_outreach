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

alter table public.session_types add column if not exists category_id uuid;
alter table public.session_types add column if not exists deleted_at timestamptz;
alter table public.session_types add column if not exists location_label text;
alter table public.session_types add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.sessions add column if not exists deleted_at timestamptz;
alter table public.sessions add column if not exists price_override_cents int;
alter table public.sessions add column if not exists location_override text;

alter table public.bookings add column if not exists deleted_at timestamptz;

create index if not exists idx_session_types_deleted_at on public.session_types (deleted_at) where deleted_at is null;
create index if not exists idx_sessions_deleted_at on public.sessions (deleted_at) where deleted_at is null;
create index if not exists idx_bookings_deleted_at on public.bookings (deleted_at) where deleted_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'session_types_category_id_fkey'
      and conrelid = 'public.session_types'::regclass
  ) then
    alter table public.session_types
      add constraint session_types_category_id_fkey
      foreign key (category_id) references public.session_categories(id) on delete set null;
  end if;
end $$;
