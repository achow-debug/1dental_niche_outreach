-- Service-role updates (e.g. admin API with service key) may set role/status when creating users.
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
      IF coalesce(auth.jwt() ->> 'role', '') IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'Only admins can change role, status, or moderation fields';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
