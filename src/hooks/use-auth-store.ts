import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/database.types";

export type Profile = Tables<"profiles">;

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.log(error);
    return null;
  }
  return data;
};

type AuthState = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  acceptTerms: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  cancelAccountDeletion: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  restoreSession: async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    const profile = user ? await fetchProfile(user.id) : null;
    set({
      session: data.session,
      user,
      profile,
      loading: false,
      initialized: true,
    });

    // Listen to changes
    supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

      if (!nextUser) {
        set({ session: null, user: null, profile: null });
        return;
      }

      if (get().user?.id === nextUser.id) {
        set({ session, user: nextUser });
        return;
      }

      // New sign-in: load the profile before exposing the user so route
      // guards see both at once. Deferred with setTimeout because supabase-js
      // holds its auth lock while notifying listeners — queries started
      // directly inside this callback can deadlock.
      setTimeout(async () => {
        const profile = await fetchProfile(nextUser.id);
        set({ session, user: nextUser, profile });
      }, 0);
    });
  },

  // REGISTER
  register: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    if (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
  },

  // VERIFY EMAIL OTP (6-digit code sent after signup)
  verifyEmailOtp: async (email, token) => {
    set({ loading: true });
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    set({ loading: false });
    if (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
  },

  // ACCEPT TERMS & PRIVACY POLICY (timestamps on the profiles row)
  acceptTerms: async () => {
    const userId = get().user?.id;
    if (!userId) return;

    set({ loading: true });
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        terms_accepted_at: now,
        privacy_accepted_at: now,
      })
      .select()
      .single();
    set({ loading: false });
    if (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
    set({ profile: data });
  },

  // REQUEST ACCOUNT DELETION (soft delete). A scheduled server job hard-deletes
  // the auth user 7 days after deleted_at is set, cascading all data and writing
  // the account_deletions audit row. The user stays signed in during the grace
  // period and can undo via cancelAccountDeletion.
  requestAccountDeletion: async () => {
    const userId = get().user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
    set({ profile: data });
  },

  // CANCEL A PENDING DELETION (undo). Clears deleted_at before the grace period
  // ends so the scheduled job skips the account.
  cancelAccountDeletion: async () => {
    const userId = get().user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({ deleted_at: null })
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
    set({ profile: data });
  },

  // LOGIN
  login: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error);
      alert(error.message);
    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  signInWithGoogle: async () => {
    console.log("signInWithGoogle");
    // const redirectUrl = AuthSession.makeRedirectUri({ path: '/' })
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: { redirectTo: redirectUrl },
    // })
    // if (error) console.error(error)
    // if (data?.url) await WebBrowser.openAuthSessionAsync(data.url)
  },

  signInWithApple: async () => {
    console.log("signInWithApple");
    // const redirectUrl = AuthSession.makeRedirectUri({ path: '/' })
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'apple',
    //   options: { redirectTo: redirectUrl },
    // })
    // if (error) console.error(error)
    // if (data?.url) await WebBrowser.openAuthSessionAsync(data.url)
  },
}));
