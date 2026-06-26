import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

// import * as Burnt from "burnt";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  restoreSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      initialized: true,
    });

    // Listen to changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
    });
  },

  // REGISTER
  register: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log(error);
      alert(error.message);
      // Burnt.toast({
      //   title: "Error",
      //   preset: "error",
      //   message: error.message,
      //   from: "bottom",
      // });
    }

    set({ loading: false });
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
      // Burnt.toast({
      //   title: "Error",
      //   preset: "error",
      //   message: error.message,
      //   from: "bottom",
      // });
      alert(error.message);
    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
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
