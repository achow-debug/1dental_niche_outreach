-- Profile fields used by /profile, /admin/clients, and API routes (synced on admin-created users).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_prefix text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line1 text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line2 text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS county text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS post_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;
