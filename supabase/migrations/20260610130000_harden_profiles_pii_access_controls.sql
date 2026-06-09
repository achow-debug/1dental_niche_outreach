-- Harden profiles PII: block privilege escalation, restrict inserts to auth trigger,
-- and prevent direct RPC execution of internal SECURITY DEFINER helpers.

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
      IF coalesce(auth.jwt() ->> 'role', '') = 'service_role' THEN
        RETURN NEW;
      END IF;
      IF (
        OLD.role = 'user'::public.profile_role
        AND NEW.role = 'client'::public.profile_role
        AND NOT (NEW.status IS DISTINCT FROM OLD.status)
        AND NOT (NEW.moderation_note IS DISTINCT FROM OLD.moderation_note)
        AND EXISTS (
          SELECT 1 FROM public.bookings b
          WHERE b.user_id = NEW.id AND b.deleted_at IS NULL
          LIMIT 1
        )
      ) THEN
        RETURN NEW;
      END IF;
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

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "profiles_insert_none"
  ON public.profiles FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

REVOKE EXECUTE ON FUNCTION public.enforce_profile_privileged_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_staff() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_booking_created_notify_and_promote() FROM PUBLIC, anon, authenticated;
