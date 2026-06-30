SET check_function_bodies = false;
ALTER FUNCTION public.set_updated_at() SET search_path TO '';
ALTER TABLE public.profiles ADD CONSTRAINT profiles_onboarding_step_check CHECK (onboarding_step >= 0 AND onboarding_step <= 4);
REVOKE DELETE ON public.profiles FROM authenticated;
