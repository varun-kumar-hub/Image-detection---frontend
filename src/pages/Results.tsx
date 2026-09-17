import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ResultCard } from "../components/ResultCard";
import { getResult } from "../services/api";
import type { AnalysisResult } from "../types";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    getResult(id)
      .then((data) => setResult(data))
      .catch((err) => setError(err.message || "Failed to load analysis record."))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to History</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-xs font-mono text-text-muted">Loading analysis record...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto p-6 rounded border border-border bg-surface text-center space-y-3">
          <AlertCircle className="h-5 w-5 text-text-muted mx-auto" />
          <h3 className="text-sm font-medium text-text-primary">Record Not Found</h3>
          <p className="text-xs text-text-muted">{error}</p>
          <Link
            to="/analyze"
            className="inline-block mt-2 px-3.5 py-1.5 text-xs font-medium bg-accent text-accent-contrast rounded"
          >
            Analyze an Image
          </Link>
        </div>
      ) : result ? (
        <ResultCard result={result} />
      ) : null}
    </div>
  );
};
