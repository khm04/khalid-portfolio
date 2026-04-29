/**
 * useAuth — single source of truth for the signed-in user.
 *
 * Listens to Supabase auth state changes and exposes:
 *   - user:     the authenticated user (null when signed out)
 *   - loading:  true while we're resolving the initial session
 *   - isAdmin:  user.email matches ADMIN_EMAIL
 *   - signIn:   sends a magic-link email
 *   - signOut:  ends the session
 */
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, ADMIN_EMAIL } from "./supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Resolve the initial session (might already be cached in localStorage)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to future auth changes (sign in, sign out, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  /**
   * Send a magic link to the given email. The link redirects back to /admin.
   */
  const signIn = async (email: string) => {
    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `https://khalidportfolio.com/admin`,
      },
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const isAdmin = !!user?.email && user.email === ADMIN_EMAIL;

  return { user, loading, isAdmin, signIn, signOut };
}
