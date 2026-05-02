# Supabase

## Apply the schema

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of `migrations/20260419120000_initial_schema.sql`, or use the Supabase CLI (`supabase db push`) after linking the project.
3. In **Authentication → URL configuration**, add your local site URL (e.g. `http://localhost:3000`) and redirect URL `http://localhost:3000/auth/callback`.

4. **Email sign-up (optional but recommended for this app):** In **Authentication → Providers → Email**, turn off **Confirm email** if you want new patients to land in `/dashboard` immediately after sign-up (matches the app flow). Keep **Secure email change** on unless your security policy says otherwise. Use the same setting on staging so behaviour matches production.

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` from **Project Settings → API**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Project Settings → API**
- `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings → API** (required for admin create flows like add client/add booking)

## First admin user (manual)

After a user exists in **Authentication** and has a row in `public.profiles` (created by the signup trigger), promote them in the **Table Editor** or SQL:

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-uuid>';
```

Use that account to sign in and open `/admin`. Standard users stay on `/dashboard`.
