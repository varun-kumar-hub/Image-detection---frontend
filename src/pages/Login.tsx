import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const Login: React.FC = () => {
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/analyze";

  // If already authenticated, redirect to destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setErrorMessage("Google sign-in could not be completed. Please try again.");
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[360px] mx-auto text-center space-y-8">
        
        {/* Header Branding */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
              Image Detection
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-muted bg-surface-secondary">
              v4.0
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Image detection <br />
            made simple.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 text-xs rounded border border-red-900/30 bg-red-950/20 text-red-400 font-mono text-center">
            {errorMessage}
          </div>
        )}

        {/* Continue with Google Action Card */}
        <div className="p-6 rounded-lg border border-border bg-surface shadow-sm space-y-4">
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full h-11 px-4 flex items-center justify-center gap-3 rounded border border-border bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary text-xs font-medium transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {/* Google G Logo SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {signingIn ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <p className="text-[11px] text-text-muted leading-relaxed">
            By continuing, you analyze images with user-scoped isolation and private cloud storage.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-text-muted font-mono">
          Secure authentication powered by Google &amp; Supabase
        </div>

      </div>
    </div>
  );
};
