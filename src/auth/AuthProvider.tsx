/**
 * Centralized Authentication Provider
 * ===================================
 * Single source of truth for ImageGuard authentication state.
 * Manages persistent login, background token refresh, and multi-tab sync.
 */

import React, { createContext, useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { authService } from "./authService";
import type { AuthState } from "./types";

export const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const currentSession = await authService.getSession();
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
      } catch (err) {
        console.error("[AuthProvider] Session restoration error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen for Supabase auth state changes (multi-tab sync, sign-in, token refresh)
    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (!isMounted) return;

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Local storage listener for dev session across tabs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "imageguard_dev_session") {
          try {
            const parsed = e.newValue ? JSON.parse(e.newValue) : null;
            setSession(parsed);
            setUser(parsed?.user || null);
          } catch {
            setSession(null);
            setUser(null);
          }
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => {
        isMounted = false;
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    await authService.signInWithGoogle(redirectTo);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthState = {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user && session),
    signInWithGoogle,
    signOut,
  };

  // During initial session check, render a calm minimal splash shell
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-border border-t-text-primary animate-spin" />
          <span className="text-xs font-mono text-text-secondary tracking-wider uppercase">
            Restoring session...
          </span>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
