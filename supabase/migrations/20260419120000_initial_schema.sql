-- Carter Dental Studio — initial schema, RLS, profile trigger
-- Apply via Supabase Dashboard → SQL Editor, or `supabase db push` when linked.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE public.profile_role AS ENUM ('user', 'client', 'staff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.profile_status AS ENUM ('active', 'suspended', 'banned', 'pending_review');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.session_instance_status AS ENUM ('scheduled', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.availability_exception_type AS ENUM ('closed', 'extra');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Profiles (1:1 auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  avatar_url text,
  role public.profile_role NOT NULL DEFAULT 'user',
  status public.profile_status NOT NULL DEFAULT 'active',
  moderation_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Session catalog
CREATE TABLE IF NOT EXISTS public.session_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.session_categories (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  price_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'GBP',
  max_slots int NOT NULL DEFAULT 1 CHECK (max_slots >= 1),
  location_label text,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}',
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Singleton practice settings
CREATE TABLE IF NOT EXISTS public.practice_settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  max_advance_booking_days int NOT NULL DEFAULT 90 CHECK (max_advance_booking_days >= 0),
  timezone text NOT NULL DEFAULT 'Europe/London',
  practice_name text,
  contact_email text,
  contact_phone text,
  cancellation_copy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.practice_settings (singleton) VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

-- Calendar instances
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type_id uuid NOT NULL REFERENCES public.session_types (id) ON DELETE RESTRICT,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'Europe/London',
  max_slots int NOT NULL CHECK (max_slots >= 1),
  price_override_cents int,
  location_override text,
  status public.session_instance_status NOT NULL DEFAULT 'scheduled',
  cancel_reason text,
  cancelled_at timestamptz,
  notes text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sessions_time_order CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE RESTRICT,
  session_type_id uuid REFERENCES public.session_types (id) ON DELETE SET NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  cancel_reason text,
  cancelled_at timestamptz,
  client_notes text,
  admin_notes text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL CHECK (scope IN ('global', 'session_type')),
  session_type_id uuid REFERENCES public.session_types (id) ON DELETE CASCADE,
  rule jsonb NOT NULL DEFAULT '{}',
  effective_from date,
  effective_to date,
  timezone text NOT NULL DEFAULT 'Europe/London',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  type public.availability_exception_type NOT NULL,
  reason text,
  session_type_id uuid REFERENCES public.session_types (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_exceptions_time CHECK (ends_at > starts_at)
);

-- History / audit (append-only inserts from app or triggers later)
CREATE TABLE IF NOT EXISTS public.booking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  old_status public.booking_status,
  new_status public.booking_status,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.auth_login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  ip inet,
  user_agent text,
  method text,
  success boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  bucket text NOT NULL,
  path text NOT NULL,
  mime text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_starts_at ON public.sessions (starts_at);
CREATE INDEX IF NOT EXISTS idx_sessions_deleted_at ON public.sessions (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_user_created ON public.bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON public.bookings (session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at ON public.bookings (deleted_at) WHERE deleted_at IS NULL;

-- updated_at touch
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_session_categories_updated_at ON public.session_categories;
CREATE TRIGGER set_session_categories_updated_at BEFORE UPDATE ON public.session_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_session_types_updated_at ON public.session_types;
CREATE TRIGGER set_session_types_updated_at BEFORE UPDATE ON public.session_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_practice_settings_updated_at ON public.practice_settings;
CREATE TRIGGER set_practice_settings_updated_at BEFORE UPDATE ON public.practice_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_sessions_updated_at ON public.sessions;
CREATE TRIGGER set_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_availability_rules_updated_at ON public.availability_rules;
CREATE TRIGGER set_availability_rules_updated_at BEFORE UPDATE ON public.availability_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RBAC helpers (SECURITY DEFINER reads profiles; safe with search_path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('staff', 'admin')
  );
$$;

-- Prevent non-admins from escalating role/status on profiles
CREATE OR REPLACE FUNCTION public.enforce_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (
      NEW.role IS DISTINCT FROM OLD.role
      OR NEW.status IS DISTINCT FROM OLD.status
      OR NEW.moderation_note IS DISTINCT FROM OLD.moderation_note
    ) AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change role, status, or moderation fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_privileges ON public.profiles;
CREATE TRIGGER enforce_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_privileged_columns();

-- New auth user → profile row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_none"
  ON public.profiles FOR INSERT
  WITH CHECK (false);

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Catalog: clients read active; staff full
CREATE POLICY "session_categories_select"
  ON public.session_categories FOR SELECT
  USING (
    deleted_at IS NULL AND is_active = true
    OR public.is_staff()
  );

CREATE POLICY "session_categories_staff_all"
  ON public.session_categories FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "session_types_select"
  ON public.session_types FOR SELECT
  USING (
    (deleted_at IS NULL AND is_active = true)
    OR public.is_staff()
  );

CREATE POLICY "session_types_staff_all"
  ON public.session_types FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "practice_settings_staff"
  ON public.practice_settings FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Anyone can read singleton settings (e.g. max advance window for /book); writes are staff-only above.
CREATE POLICY "practice_settings_select_public"
  ON public.practice_settings FOR SELECT
  USING (true);

-- sessions: clients see bookable future non-deleted; staff all
CREATE POLICY "sessions_select_bookable_or_staff"
  ON public.sessions FOR SELECT
  USING (
    public.is_staff()
    OR (
      deleted_at IS NULL
      AND status = 'scheduled'
      AND starts_at > now()
    )
  );

CREATE POLICY "sessions_staff_write"
  ON public.sessions FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "sessions_staff_update"
  ON public.sessions FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "sessions_staff_delete"
  ON public.sessions FOR DELETE
  USING (public.is_staff());

-- bookings
CREATE POLICY "bookings_select_own_or_staff"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY "bookings_insert_own"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookings_update_own_or_staff"
  ON public.bookings FOR UPDATE
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

-- availability
CREATE POLICY "availability_rules_staff"
  ON public.availability_rules FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "availability_exceptions_staff"
  ON public.availability_exceptions FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- history
CREATE POLICY "booking_history_select"
  ON public.booking_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.is_staff())
    )
  );

CREATE POLICY "booking_history_insert_staff"
  ON public.booking_history FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "session_history_select_staff"
  ON public.session_history FOR SELECT
  USING (public.is_staff());

CREATE POLICY "session_history_insert_staff"
  ON public.session_history FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "auth_login_history_own_or_admin"
  ON public.auth_login_history FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "auth_login_history_insert_own"
  ON public.auth_login_history FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "audit_log_staff"
  ON public.audit_log FOR SELECT
  USING (public.is_staff());

CREATE POLICY "audit_log_insert_staff"
  ON public.audit_log FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "media_assets_own"
  ON public.media_assets FOR ALL
  USING (owner_id = auth.uid() OR public.is_staff())
  WITH CHECK (owner_id = auth.uid() OR public.is_staff());
