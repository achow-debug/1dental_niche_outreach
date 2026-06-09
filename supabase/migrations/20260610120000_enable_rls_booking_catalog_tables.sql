-- Enable RLS on exposed booking/catalog tables and restore policies.
-- Aligns live DB with repo RLS model (admin writes, public read active catalog).

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

ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_types_select" ON public.session_types;
CREATE POLICY "session_types_select"
  ON public.session_types FOR SELECT
  USING (
    (deleted_at IS NULL AND is_active = true)
    OR public.is_staff()
  );

DROP POLICY IF EXISTS "session_types_admin_all" ON public.session_types;
CREATE POLICY "session_types_admin_all"
  ON public.session_types FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "session_categories_select" ON public.session_categories;
CREATE POLICY "session_categories_select"
  ON public.session_categories FOR SELECT
  USING (
    deleted_at IS NULL AND is_active = true
    OR public.is_staff()
  );

DROP POLICY IF EXISTS "session_categories_admin_all" ON public.session_categories;
CREATE POLICY "session_categories_admin_all"
  ON public.session_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select_bookable_or_staff" ON public.sessions;
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

DROP POLICY IF EXISTS "sessions_admin_insert" ON public.sessions;
CREATE POLICY "sessions_admin_insert"
  ON public.sessions FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sessions_admin_update" ON public.sessions;
CREATE POLICY "sessions_admin_update"
  ON public.sessions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sessions_admin_delete" ON public.sessions;
CREATE POLICY "sessions_admin_delete"
  ON public.sessions FOR DELETE
  USING (public.is_admin());

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select_own_or_staff" ON public.bookings;
CREATE POLICY "bookings_select_own_or_staff"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "bookings_update_own_or_staff" ON public.bookings;
CREATE POLICY "bookings_update_own_or_staff"
  ON public.bookings FOR UPDATE
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());
