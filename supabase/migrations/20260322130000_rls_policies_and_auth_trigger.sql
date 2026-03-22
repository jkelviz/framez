-- Replace legacy RLS policies with consolidated policies + auth signup trigger.
-- Run this migration in Supabase (Dashboard → SQL or supabase db push).

-- Drop existing policies (legacy + previous write policies)
DROP POLICY IF EXISTS "own data" ON public.photographers;
DROP POLICY IF EXISTS "photographers_own" ON public.photographers;

DROP POLICY IF EXISTS "own sessions" ON public.sessions;
DROP POLICY IF EXISTS "public active sessions" ON public.sessions;
DROP POLICY IF EXISTS "sessions_own" ON public.sessions;
DROP POLICY IF EXISTS "sessions_public_read" ON public.sessions;
DROP POLICY IF EXISTS "insert own sessions" ON public.sessions;
DROP POLICY IF EXISTS "update own sessions" ON public.sessions;
DROP POLICY IF EXISTS "delete own sessions" ON public.sessions;

DROP POLICY IF EXISTS "own photos" ON public.photos;
DROP POLICY IF EXISTS "public photos" ON public.photos;
DROP POLICY IF EXISTS "photos_own" ON public.photos;
DROP POLICY IF EXISTS "photos_public_read" ON public.photos;
DROP POLICY IF EXISTS "insert own photos" ON public.photos;
DROP POLICY IF EXISTS "update own photos" ON public.photos;
DROP POLICY IF EXISTS "delete own photos" ON public.photos;

-- Enable RLS on all tables
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Photographers: user sees only their own profile
CREATE POLICY "photographers_own" ON public.photographers
  FOR ALL USING (user_id = auth.uid());

-- Sessions: photographer sees only their own sessions
CREATE POLICY "sessions_own" ON public.sessions
  FOR ALL USING (
    photographer_id = (
      SELECT id FROM public.photographers WHERE user_id = auth.uid()
    )
  );

-- Sessions: public can read active sessions (for gallery)
CREATE POLICY "sessions_public_read" ON public.sessions
  FOR SELECT USING (status = 'active');

-- Photos: photographer sees only their own photos
CREATE POLICY "photos_own" ON public.photos
  FOR ALL USING (
    session_id IN (
      SELECT id FROM public.sessions WHERE photographer_id = (
        SELECT id FROM public.photographers WHERE user_id = auth.uid()
      )
    )
  );

-- Photos: public can read photos of active sessions
CREATE POLICY "photos_public_read" ON public.photos
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM public.sessions WHERE status = 'active'
    )
  );

-- Auto-create photographer row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.photographers (user_id, name, slug, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    lower(regexp_replace(
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      '[^a-z0-9]', '-', 'g'
    )) || '-' || substr(NEW.id::text, 1, 6),
    'free'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
