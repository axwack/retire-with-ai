-- First, create profiles for existing users who don't have one
INSERT INTO public.profiles (id, email, full_name, credits)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data ->> 'full_name',
  10  -- Initial free credits
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();