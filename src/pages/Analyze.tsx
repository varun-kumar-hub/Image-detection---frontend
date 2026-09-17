import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UploadBox } from "../components/UploadBox";
import { ImagePreview } from "../components/ImagePreview";
import { ProcessingSteps } from "../components/ProcessingSteps";
import { ResultCard } from "../components/ResultCard";
import { analyzeImage } from "../services/api";
import { useAuth } from "../auth/useAuth";
import type { AnalysisResult } from "../types";
import { AlertCircle } from "lucide-react";

export const Analyze: React.FC = () => {
  const persistedImageKey = "image_detection_pending_image";
  const { isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Hidden Evaluation Mode state (configured in Settings)
  const [evaluationModeEnabled, setEvaluationModeEnabled] = useState<boolean>(false);
  const [groundTruth, setGroundTruth] = useState<string | null>(null);

  useEffect(() => {
    const isEvalEnabled = localStorage.getItem("image_detection_evaluation_mode") === "true";
    setEvaluationModeEnabled(isEvalEnabled);
    setGroundTruth(localStorage.getItem("image_detection_ground_truth"));

    const savedImage = localStorage.getItem(persistedImageKey);
    if (savedImage) {
      try {
        const parsed = JSON.parse(savedImage) as { name: string; type: string; data: string };
        fetch(parsed.data)
          .then((response) => response.blob())
          .then((blob) => setSelectedFile(new File([blob], parsed.name, { type: parsed.type })))
          .catch(() => localStorage.removeItem(persistedImageKey));
      } catch {
        localStorage.removeItem(persistedImageKey);
      }
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);

    if (file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(persistedImageKey, JSON.stringify({
          name: file.name,
          type: file.type,
          data: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    setResult(null);
    setGroundTruth(null);
    localStorage.removeItem(persistedImageKey);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    if (evaluationModeEnabled && !groundTruth) {
      setError("Select the known label for this image before running evaluation.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await analyzeImage(selectedFile, groundTruth || undefined);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setGroundTruth(null);
    localStorage.removeItem(persistedImageKey);
  };

  const handleSelectSample = async (type: "real" | "ai") => {
    try {
      const filename = type === "real" ? "sample_real.jpg" : "sample_ai.jpg";
      const response = await fetch(`/samples/${filename}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      handleFileSelect(file);
    } catch (err: any) {
      setError("Failed to load sample image.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Page Header */}
      {!result && (
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Analyze an Image
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
            Upload an image to inspect authenticity patterns and learned model representations.
          </p>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="max-w-xl mx-auto flex items-center gap-2.5 p-3.5 rounded border border-border bg-surface text-xs text-text-primary">
          <AlertCircle className="h-4 w-4 shrink-0 text-text-muted" />
          <span>{error}</span>
        </div>
      )}

      {/* State 1: Results View */}
      {result ? (
        <div className="space-y-6">
          {!isAuthenticated && (
            <div className="max-w-2xl mx-auto p-3 rounded border border-border bg-surface flex items-center justify-between gap-3 text-xs">
              <span className="text-text-secondary">
                Analyzed as guest. Sign in to save your analyses in private history.
              </span>
              <Link
                to="/login"
                className="shrink-0 px-3 py-1 rounded bg-accent text-accent-contrast font-medium text-xs hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          )}
          <ResultCard result={result} onAnalyzeAnother={handleAnalyzeAnother} />
        </div>
      ) : isLoading ? (
        /* State 2: Processing Progress */
        <div className="py-12">
          <ProcessingSteps />
        </div>
      ) : selectedFile ? (
        /* State 3: File Selected -> Preview & Optional Evaluation Chip */
        <div className="max-w-xl mx-auto space-y-4">
          <ImagePreview
            file={selectedFile}
            onRemove={handleRemove}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {/* Testing Reference: ONLY VISIBLE WHEN EVALUATION MODE IS ENABLED IN SETTINGS */}
          {false && evaluationModeEnabled && (
            <div className="p-3.5 rounded-lg border border-border bg-surface text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  Testing Reference (Evaluation Mode)
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  Ground Truth
                </span>
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Label this image using the known answer. This reference is used only to measure whether the model prediction was correct; it never enters the prediction pipeline.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setGroundTruth(groundTruth === "real" ? null : "real")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    groundTruth === "real"
                      ? "border border-text-primary bg-surface-secondary text-text-primary font-medium"
                      : "border border-border bg-surface text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {groundTruth === "real" ? "✓ Real / Authentic" : "Real / Authentic"}
                </button>
                <button
                  type="button"
                  onClick={() => setGroundTruth(groundTruth === "ai_generated" ? null : "ai_generated")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    groundTruth === "ai_generated"
                      ? "border border-text-primary bg-surface-secondary text-text-primary font-medium"
                      : "border border-border bg-surface text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {groundTruth === "ai_generated" ? "✓ AI-Generated" : "AI-Generated"}
                </button>
                {groundTruth && (
                  <button
                    type="button"
                    onClick={() => setGroundTruth(null)}
                    className="text-[11px] text-text-muted hover:text-text-primary ml-auto cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* State 4: Initial Dropzone & Samples */
        <div className="max-w-xl mx-auto space-y-5">
          <UploadBox onFileSelect={handleFileSelect} />

          {/* Minimal Demo Samples */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-lg border border-border bg-surface text-xs">
            <span className="text-text-muted">
              Or test an example:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectSample("real")}
                className="px-2.5 py-1 rounded border border-border bg-surface-secondary text-text-primary hover:bg-border transition-colors font-mono text-[11px] cursor-pointer"
              >
                Authentic image
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample("ai")}
                className="px-2.5 py-1 rounded border border-border bg-surface-secondary text-text-primary hover:bg-border transition-colors font-mono text-[11px] cursor-pointer"
              >
                AI-generated image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
