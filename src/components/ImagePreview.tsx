import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onRemove,
  onAnalyze,
  isLoading,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const sizeKb = file.size / 1024;
  const sizeStr = sizeKb < 1024 ? `${sizeKb.toFixed(1)} KB` : `${(sizeKb / 1024).toFixed(2)} MB`;
  const formatStr = file.type ? file.type.split("/")[1]?.toUpperCase() : "JPEG";
  const dimStr = dimensions ? `${dimensions.width} × ${dimensions.height}` : "Loading...";

  return (
    <div className="w-full rounded-lg border border-border bg-surface overflow-hidden">
      {/* Top Image Preview */}
      <div className="w-full max-h-[360px] bg-surface-secondary flex items-center justify-center p-4 border-b border-border overflow-hidden">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-[320px] max-w-full object-contain rounded"
          />
        )}
      </div>

      {/* Info & Actions Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary truncate max-w-sm sm:max-w-md">
            {file.name}
          </h4>
          <p className="text-xs font-mono text-text-muted mt-1">
            {dimStr} · {formatStr} · {sizeStr}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onRemove}
            disabled={isLoading}
            className="px-3 py-1.5 rounded text-xs font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Remove
          </button>
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span>{isLoading ? "Analyzing..." : "Analyze Image"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
