import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

export const authService = {
  /**
   * Initiates Google OAuth authentication via Supabase Auth.
   * Redirect destination is automatically derived from the current environment.
   */
  async signInWithGoogle(customRedirect?: string): Promise<void> {
    if (!isSupabaseConfigured) {
      console.warn("[AuthService] Supabase credentials not set in frontend .env; using local developer demo session.");
      // Set dummy dev session in localStorage for local testing
      const mockSession = {
        access_token: "dev-mock-jwt-token",
        user: {
          id: "00000000-0000-0000-0000-000000000001",
          email: "developer@imageguard.local",
          user_metadata: {
            full_name: "Demo Investigator",
            avatar_url: ""
          }
        }
      };
      localStorage.setItem("imageguard_dev_session", JSON.stringify(mockSession));
      window.location.reload();
      return;
    }

    const redirectUrl = customRedirect || `${window.location.origin}/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      throw error;
    }
  },

  /**
   * Signs out user and clears local session.
   */
  async signOut(): Promise<void> {
    localStorage.removeItem("imageguard_dev_session");
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthService] Error during Supabase sign out:", error);
      }
    }
  },

  /**
   * Retrieves current session.
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) {
      const dev = localStorage.getItem("imageguard_dev_session");
      if (dev) {
        try {
          return JSON.parse(dev) as Session;
        } catch {
          return null;
        }
      }
      return null;
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("[AuthService] Error retrieving session:", error.message);
      return null;
    }
    return session;
  },

  /**
   * Gets current Bearer access token if authenticated.
   */
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token || null;
  }
};
