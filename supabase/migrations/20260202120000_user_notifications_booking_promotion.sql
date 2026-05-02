-- User notifications, first-booking promotion to client, session visibility for own bookings,
-- and profile role transition guard.

-- 1) Allow users to read sessions they have a booking for (past + future), so booking joins work under RLS.
DROP POLICY IF EXISTS "sessions_select_own_booked" ON public.sessions;
CREATE POLICY "sessions_select_own_booked"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.session_id = sessions.id
        AND b.user_id = auth.uid()
        AND b.deleted_at IS NULL
    )
  );

-- 2) User notifications (in-app feed + bell)
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  body text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  read_at timestamptz,
  href text,
  related_booking_id uuid REFERENCES public.bookings (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_created
  ON public.user_notifications (user_id, created_at DESC);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_notifications_select_own" ON public.user_notifications;
CREATE POLICY "user_notifications_select_own"
  ON public.user_notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_notifications_update_own" ON public.user_notifications;
CREATE POLICY "user_notifications_update_own"
  ON public.user_notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3) Relax profile privilege trigger: allow user -> client only when they already have a booking.
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

-- 4) After booking: notify user + promote role user -> client (first booking onward)
CREATE OR REPLACE FUNCTION public.on_booking_created_notify_and_promote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  st_title text;
BEGIN
  SELECT st.title INTO st_title
  FROM public.session_types st
  WHERE st.id = NEW.session_type_id
  LIMIT 1;

  INSERT INTO public.user_notifications (
    user_id,
    type,
    title,
    body,
    severity,
    href,
    related_booking_id
  )
  VALUES (
    NEW.user_id,
    'booking',
    'Booking request received',
    'Your ' || COALESCE(NULLIF(trim(st_title), ''), 'treatment') || ' booking is pending confirmation.',
    'info',
    '/dashboard/bookings',
    NEW.id
  );

  UPDATE public.profiles
  SET role = 'client'::public.profile_role,
      updated_at = now()
  WHERE id = NEW.user_id
    AND role = 'user'::public.profile_role;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_booking_created_notify ON public.bookings;
CREATE TRIGGER on_booking_created_notify
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.on_booking_created_notify_and_promote();
