SET check_function_bodies = false;
CREATE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, email, first_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );
  return new;
end;
$function$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;
CREATE TABLE public.account_deletions (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, email text, reason text, deleted_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.account_deletions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletions ADD CONSTRAINT account_deletions_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_deletions TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_deletions TO authenticated;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.account_deletions TO service_role;
CREATE TABLE public.devices (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, name text, identifier text, created_at timestamp with time zone DEFAULT now() NOT NULL, last_connected_at timestamp with time zone);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ADD CONSTRAINT devices_pkey PRIMARY KEY (id);
ALTER TABLE public.devices ADD CONSTRAINT devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.devices TO anon;
GRANT ALL ON public.devices TO authenticated;
GRANT ALL ON public.devices TO service_role;
CREATE POLICY "Devices are deletable by owner" ON public.devices FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "Devices are insertable by owner" ON public.devices FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "Devices are updatable by owner" ON public.devices FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "Devices are viewable by owner" ON public.devices FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE TABLE public.profiles (id uuid NOT NULL, email text, first_name text, avatar_url text, terms_accepted_at timestamp with time zone, privacy_accepted_at timestamp with time zone, onboarding_step smallint DEFAULT 0 NOT NULL, onboarding_completed_at timestamp with time zone, deleted_at timestamp with time zone, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Profiles are insertable by owner" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY "Profiles are updatable by owner" ON public.profiles FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));
