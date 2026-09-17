import React, { useState, useEffect } from "react";
import { Moon, Sun, Shield, User, LogOut, CheckCircle, Sliders, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Backup Mode state stored in localStorage
  const [evaluationMode, setEvaluationMode] = useState<boolean>(() => {
    return localStorage.getItem("image_detection_backup_mode") === "true" || localStorage.getItem("image_detection_evaluation_mode") === "true";
  });
  const [groundTruth, setGroundTruth] = useState<string>(() =>
    localStorage.getItem("image_detection_ground_truth") || ""
  );

  useEffect(() => {
    localStorage.setItem("image_detection_backup_mode", evaluationMode ? "true" : "false");
  }, [evaluationMode]);

  useEffect(() => {
    if (groundTruth) localStorage.setItem("image_detection_ground_truth", groundTruth);
    else localStorage.removeItem("image_detection_ground_truth");
  }, [groundTruth]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Investigator";
  const userEmail = user?.email || "user@imagedetection.io";

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Interface appearance, evaluation mode, authentication, and data privacy protocols.
        </p>
      </div>

      {/* 1. Appearance (Light & Dark Theme) */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5" />
          <span>APPEARANCE &amp; THEME</span>
        </h2>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <p className="text-xs text-text-secondary">
            Select interface theme. Both Light and Dark modes are designed with strict contrast and neutral palettes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setDarkMode(false)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                !darkMode
                  ? "border-text-primary bg-surface-secondary text-text-primary font-semibold"
                  : "border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Light Mode</span>
            </button>

            <button
              onClick={() => setDarkMode(true)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                darkMode
                  ? "border-text-primary bg-surface-secondary text-text-primary font-semibold"
                  : "border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Backup Mode (Private Reference Testing) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>BACKUP MODE (PRIVATE TESTING)</span>
          </h2>
          <span className="text-[11px] font-mono text-text-muted">
            {evaluationMode ? "Active" : "Disabled"}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-primary">
                Backup Mode
              </p>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                Optional mode for demonstrating and evaluating the model against images with a known label.
                When enabled, choose the known label here before uploading the image. The label is strictly used for comparison and <b>never enters the ML prediction pipeline</b>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEvaluationMode(!evaluationMode)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium border transition-colors shrink-0 cursor-pointer ${
                evaluationMode
                  ? "border-text-primary bg-surface-secondary text-text-primary"
                  : "border-border bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              {evaluationMode ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4" />}
              <span>{evaluationMode ? "ON" : "OFF"}</span>
            </button>
          </div>

          <div className="p-3 rounded border border-border bg-surface-secondary text-[11px] text-text-muted">
            <b>Status:</b> {evaluationMode ? "Enabled — Testing Reference visible on Analyze page." : "Disabled (Default) — Standard upload workflow."}
          </div>

          {evaluationMode && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-text-primary">Label for the next image</p>
              <div className="flex gap-2">
                {[["real", "Real / Authentic"], ["ai_generated", "AI-Generated"]].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setGroundTruth(value)} className={`px-3 py-2 rounded border text-xs font-medium ${groundTruth === value ? "border-text-primary bg-surface-secondary text-text-primary" : "border-border text-text-secondary"}`}>
                    {groundTruth === value ? "✓ " : ""}{label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Account & Authentication */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>ACCOUNT &amp; AUTHENTICATION</span>
        </h2>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <p className="text-sm font-medium text-text-primary">{userName}</p>
              <p className="text-xs font-mono text-text-muted mt-0.5">{userEmail}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface-secondary text-[11px] font-mono text-text-secondary">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Google OAuth Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded border border-border bg-surface-secondary">
              <span className="text-text-muted text-[10px] block">Auth Provider</span>
              <span className="text-text-primary mt-0.5 block">Supabase Auth (Google)</span>
            </div>
            <div className="p-3 rounded border border-border bg-surface-secondary">
              <span className="text-text-muted text-[10px] block">User ID (Subject)</span>
              <span className="text-text-primary mt-0.5 block truncate" title={user?.id}>
                {user?.id || "Local / Demo User"}
              </span>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium border border-red-900/30 text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Data Handling */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          <span>PRIVACY &amp; DATA ISOLATION</span>
        </h2>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-3 text-xs leading-relaxed text-text-secondary">
          <p>
            • <b>Private Cloud Storage:</b> Uploaded images are stored in user-isolated directories within private Supabase Storage buckets protected by Row Level Security (RLS).
          </p>
          <p>
            • <b>Temporary Signed URLs:</b> Image previews and inspection thumbnails are rendered using short-lived temporary signed URLs. No permanent public URLs exist.
          </p>
          <p>
            • <b>Cascade Deletion:</b> Deleting any record from your History immediately removes both the analysis metadata and all associated cloud storage artifacts.
          </p>
          <p>
            • <b>Responsible AI:</b> Image Detection predictions reflect probabilistic feature assessments and are not independent proof of authenticity.
          </p>
        </div>
      </section>

    </div>
  );
};
