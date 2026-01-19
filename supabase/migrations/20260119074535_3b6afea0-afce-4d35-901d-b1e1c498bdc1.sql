-- Drop existing policies with potential recursion issues
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update any donation" ON public.donations;

-- Create role checking function with security definer
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id
$$;

-- Recreate admin policies using the function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update any donation"
  ON public.donations FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');