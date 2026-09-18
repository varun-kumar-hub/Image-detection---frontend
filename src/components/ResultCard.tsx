import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, RotateCcw, ChevronDown, ChevronUp, Eye, Info } from "lucide-react";
import type { AnalysisResult } from "../types";
import { getReportDownloadUrl } from "../services/api";

interface ResultCardProps {
  result: AnalysisResult;
  onAnalyzeAnother?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onAnalyzeAnother }) => {
  const [explanationExpanded, setExplanationExpanded] = useState<boolean>(true);
  const [supportingExpanded, setSupportingExpanded] = useState<boolean>(false);

  const isAI = result.classification === "ai_generated";
  const isNeedsReview = result.classification === "needs_review";

  const verdictLabel = isAI
    ? "AI-GENERATED"
    : isNeedsReview
    ? "NEEDS REVIEW"
    : "REAL / AUTHENTIC";

  const dominantPercent = isAI ? result.ai_probability : result.real_probability;
  const confidenceLabel = result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1);

  const explanation = result.explanation;
  const gradcam = result.gradcam || result.explanation;
  const briefExplanation = explanation?.summary || result.interpretation;
  const evidence = explanation?.primary_factors?.[0] || explanation?.supporting_observations?.[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      
      {/* 1. Header: Primary Analysis Result */}
      <div className="text-center pt-2 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
          Analysis Result
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
          {verdictLabel}
        </h2>
        <div className="text-4xl sm:text-5xl font-mono font-medium text-text-primary">
          {dominantPercent.toFixed(1)}%
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="text-text-muted">Model confidence:</span>
          <span className="font-medium text-text-primary">{confidenceLabel}</span>
        </div>
        {isNeedsReview && (
          <p className="text-xs text-text-muted max-w-sm mx-auto pt-1">
            The model did not produce a decisive signal between authentic and synthetic patterns.
          </p>
        )}
      </div>

      <div className="h-px bg-border w-full" />

      {/* 2. REQUIRED SECTION: "Why was this image classified this way?" */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExplanationExpanded(!explanationExpanded)}
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-text-secondary" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold">
              Why was this image classified this way?
            </h3>
          </div>
          <button className="text-text-muted hover:text-text-primary">
            {explanationExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {explanationExpanded && (
          <div className="space-y-3 text-sm text-text-secondary pt-2 border-t border-border">
            <p className="leading-relaxed text-text-primary font-medium">
              {briefExplanation}
            </p>
            {evidence && (
              <p className="leading-relaxed">
                The main supporting signal was: {evidence}
              </p>
            )}
            <p className="text-text-muted">
              This is a probability-based result, not definitive proof of the image’s origin.
            </p>
          </div>
        )}
      </div>

      {/* 3. Evaluation Reference (ONLY SHOWN IF EVALUATION MODE WAS USED) */}
      {false && result.is_evaluation && result.ground_truth && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Evaluation Reference (Ground Truth)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
              result.is_correct
                ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            }`}>
              {result.is_correct ? "CORRECT PREDICTION" : "INCORRECT PREDICTION"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded bg-surface-secondary">
              <span className="text-text-muted text-[10px] block">Known Ground Truth</span>
              <span className="font-medium text-text-primary capitalize">
                {result.ground_truth === "real" ? "Real / Authentic" : "AI-Generated"}
              </span>
            </div>
            <div className="p-2 rounded bg-surface-secondary">
              <span className="text-text-muted text-[10px] block">Model Prediction</span>
              <span className="font-medium text-text-primary capitalize">
                {result.classification === "real" ? "Real / Authentic" : "AI-Generated"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Probability Breakdown */}
      <div className="space-y-3 font-mono text-xs">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
          DETECTION PROBABILITY
        </h3>

        {/* AI-Generated Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-text-primary">
            <span>AI-generated</span>
            <span>{result.ai_probability.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden border border-border">
            <div
              style={{ width: `${result.ai_probability}%` }}
              className="h-full bg-text-primary transition-all duration-500"
            />
          </div>
        </div>

        {/* Authentic Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-text-primary">
            <span>Real / Authentic</span>
            <span>{result.real_probability.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden border border-border">
            <div
              style={{ width: `${result.real_probability}%` }}
              className="h-full bg-text-secondary transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border w-full" />

      {/* 5. Analyzed Image Preview */}
      {result.image_url && (
        <div className="space-y-3">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
            ANALYZED IMAGE
          </h3>
          <div className="rounded-lg border border-border bg-surface p-3 flex justify-center items-center overflow-hidden">
            <img
              src={result.image_url}
              alt={result.image_info?.filename || "Analyzed image"}
              className="max-h-72 max-w-full rounded object-contain border border-border bg-surface-secondary"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* 6. Model Focus (Grad-CAM Salience Map) */}
      {gradcam?.overlay_base64 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              MODEL FOCUS (GRAD-CAM)
            </h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            This visualization highlights image regions that contributed more strongly to the model's prediction. Highlighted areas should be treated as an explanation aid, not as independent proof.
          </p>
          <div className="rounded-lg border border-border bg-surface p-3 flex justify-center">
            <img
              src={gradcam.overlay_base64}
              alt="Grad-CAM Activation Heatmap"
              className="max-h-64 rounded object-contain"
            />
          </div>
        </div>
      )}

      {/* 7. Image Information & Supporting Analysis */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
          IMAGE INFORMATION
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">Filename</span>
            <span className="text-text-primary font-mono truncate block mt-0.5" title={result.image_info?.filename}>
              {result.image_info?.filename || "image.jpg"}
            </span>
          </div>

          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">Dimensions</span>
            <span className="text-text-primary font-mono block mt-0.5">
              {result.image_info?.dimensions || "224 × 224"}
            </span>
          </div>

          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">Format</span>
            <span className="text-text-primary font-mono block mt-0.5">
              {result.image_info?.format || "JPEG"}
            </span>
          </div>

          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">File Size</span>
            <span className="text-text-primary font-mono block mt-0.5">
              {result.image_info?.file_size_human || "N/A"}
            </span>
          </div>

          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">Analysis ID</span>
            <span className="text-text-primary font-mono block mt-0.5 truncate" title={result.id}>
              {result.id}
            </span>
          </div>

          <div className="p-3 rounded border border-border bg-surface">
            <span className="text-text-muted block text-[10px]">Processing Time</span>
            <span className="text-text-primary font-mono block mt-0.5">
              {(result.processing_time_ms / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {/* 8. Supporting Analysis (Expandable) */}
      {result.feature_analysis && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-primary font-medium">
            Learned Feature Analysis
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            The model represented this image with a {result.feature_analysis.embedding?.dimension || "learned"}-dimensional feature vector. These measurements describe model behavior; they are not human-readable labels such as “fake skin” or “artificial hair.”
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-surface-secondary"><span className="text-text-muted block">Preprocessing</span><span className="text-text-primary font-medium">{result.feature_analysis.preprocessing?.status || "MATCHED"}</span></div>
            <div className="p-2 rounded bg-surface-secondary"><span className="text-text-muted block">Color</span><span className="text-text-primary font-medium">{result.feature_analysis.preprocessing?.color_mode || "RGB"}</span></div>
            <div className="p-2 rounded bg-surface-secondary"><span className="text-text-muted block">Brightness</span><span className="text-text-primary font-medium">{result.feature_analysis.image_statistics?.brightness_mean ?? "—"}</span></div>
            <div className="p-2 rounded bg-surface-secondary"><span className="text-text-muted block">Contrast</span><span className="text-text-primary font-medium">{result.feature_analysis.image_statistics?.contrast_std ?? "—"}</span></div>
          </div>
          <p className="text-xs text-text-muted">Feature similarity is unavailable until reference embeddings are configured.</p>
        </div>
      )}

      {/* 8. Supporting Analysis (Expandable) */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setSupportingExpanded(!supportingExpanded)}
        >
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-primary font-medium">
            Supporting Image Analysis
          </h3>
          <button className="text-text-muted hover:text-text-primary">
            {supportingExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {supportingExpanded && (
          <div className="space-y-2 pt-2 border-t border-border text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-surface-secondary">
              <span className="text-text-secondary">EXIF Camera Metadata</span>
              <span className="font-mono text-text-primary">
                {result.manipulation?.metadata_status || "Not found"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-surface-secondary">
              <span className="text-text-secondary">Compression Characteristics (ELA)</span>
              <span className="font-mono text-text-primary">
                {result.manipulation?.compression_status || "Analyzed"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-surface-secondary">
              <span className="text-text-secondary">Noise &amp; Texture Consistency</span>
              <span className="font-mono text-text-primary">
                {result.manipulation?.filter_status || "Analyzed"}
              </span>
            </div>

            <p className="text-[11px] text-text-muted italic pt-1 leading-relaxed">
              These observations provide supporting analysis and are not by themselves independent proof of AI generation.
            </p>
          </div>
        )}
      </div>

      {/* 9. Model Architecture Specification */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
          MODEL SPECIFICATION
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded border border-border bg-surface">
            <span className="text-text-muted text-[10px] block">Backbone</span>
            <span className="text-text-primary font-medium mt-0.5 block">{result.model_name || "EfficientNet-B0"}</span>
          </div>
          <div className="p-2.5 rounded border border-border bg-surface">
            <span className="text-text-muted text-[10px] block">Model Version</span>
            <span className="text-text-primary font-medium mt-0.5 block">{result.model_version || "image_detection_v1"}</span>
          </div>
          <div className="p-2.5 rounded border border-border bg-surface">
            <span className="text-text-muted text-[10px] block">Input Tensor</span>
            <span className="text-text-primary font-medium mt-0.5 block">224 × 224 × 3</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border w-full" />

      {/* 10. Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={getReportDownloadUrl(result.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded text-xs font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Report</span>
          </a>

          <Link
            to="/history"
            className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded text-xs font-medium border border-border bg-surface text-text-primary hover:bg-surface-secondary transition-colors"
          >
            View in History
          </Link>
        </div>

        {onAnalyzeAnother && (
          <button
            onClick={onAnalyzeAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded text-xs font-medium border border-border bg-surface text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Analyze Another Image</span>
          </button>
        )}
      </div>

    </div>
  );
};
