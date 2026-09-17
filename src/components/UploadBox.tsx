import React, { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndHandleFile = (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported format. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed is 25 MB.`);
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center py-16 px-6 text-center rounded-lg border border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-text-primary bg-surface-secondary"
            : "border-border hover:border-text-secondary bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndHandleFile(e.target.files[0]);
            }
          }}
        />

        <p className="text-sm font-medium text-text-primary">
          {isDragging ? "Drop image now" : "Drop image here"}
        </p>

        <span className="my-2 text-xs text-text-muted">or</span>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded text-xs font-medium border border-border bg-surface-secondary text-text-primary hover:bg-border transition-colors pointer-events-none"
        >
          Browse files
        </button>

        <p className="mt-5 text-[11px] font-mono text-text-muted">
          JPG · PNG · WEBP · Max 25 MB
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-text-primary bg-surface-secondary border border-border rounded">
          <AlertCircle className="h-4 w-4 shrink-0 text-text-muted" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
