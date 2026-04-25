-- Phase 3 hardening: restrict catalog writes + global history to admins.
-- Keeps existing helper public.is_admin() as the source of truth.

-- Catalog write policies (admin only)
DROP POLICY IF EXISTS "session_categories_staff_all" ON public.session_categories;
CREATE POLICY "session_categories_admin_all"
  ON public.session_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "session_types_staff_all" ON public.session_types;
CREATE POLICY "session_types_admin_all"
  ON public.session_types FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sessions_staff_write" ON public.sessions;
CREATE POLICY "sessions_admin_insert"
  ON public.sessions FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sessions_staff_update" ON public.sessions;
CREATE POLICY "sessions_admin_update"
  ON public.sessions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sessions_staff_delete" ON public.sessions;
CREATE POLICY "sessions_admin_delete"
  ON public.sessions FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "practice_settings_staff" ON public.practice_settings;
CREATE POLICY "practice_settings_admin_write"
  ON public.practice_settings FOR INSERT
  WITH CHECK (public.is_admin());
CREATE POLICY "practice_settings_admin_update"
  ON public.practice_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
CREATE POLICY "practice_settings_admin_delete"
  ON public.practice_settings FOR DELETE
  USING (public.is_admin());

-- Global histories readable only to admins.
DROP POLICY IF EXISTS "session_history_select_staff" ON public.session_history;
CREATE POLICY "session_history_select_admin"
  ON public.session_history FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "auth_login_history_own_or_admin" ON public.auth_login_history;
CREATE POLICY "auth_login_history_select_own_or_admin"
  ON public.auth_login_history FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "audit_log_staff" ON public.audit_log;
CREATE POLICY "audit_log_select_admin"
  ON public.audit_log FOR SELECT
  USING (public.is_admin());
