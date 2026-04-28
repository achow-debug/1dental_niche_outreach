-- Allow staff-facing admin pages (e.g. /admin/clients) to read profiles.
-- Existing policy only allowed "own row OR admin", which blocks staff users.

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;

CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_staff());
