import React, { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { getHistory, getReportDownloadUrl } from "../services/api";
import { useAuth } from "../auth/useAuth";
import type { AnalysisResult } from "../types";

export const Reports: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    getHistory(1, 30)
      .then((data) => setItems(data.items))
      .catch((err) => console.warn(err))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
          Reports
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Export and download formal PDF summaries for prior image detection analyses.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="p-8 text-center rounded-lg border border-border bg-surface">
          <FileText className="h-8 w-8 text-text-muted mx-auto mb-2" />
          <p className="text-xs text-text-primary font-medium">Authentication required</p>
          <p className="text-xs text-text-secondary mt-1">Sign in with Google to generate and download PDF reports.</p>
        </div>
      ) : isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-text-muted">
          Loading report records...
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-border bg-surface space-y-2">
          <p className="text-xs font-medium text-text-primary">No reports available</p>
          <p className="text-xs text-text-muted">Perform an analysis to generate an official PDF report.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded border border-border bg-surface-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-text-secondary" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {item.image_info?.filename || "image.jpg"}
                  </p>
                  <p className="text-[11px] font-mono text-text-muted">
                    {item.id} · {item.created_at.split(" ")[0]}
                  </p>
                </div>
              </div>

              <a
                href={getReportDownloadUrl(item.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-border bg-surface-secondary hover:bg-surface-hover text-text-primary transition-colors shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PDF Report</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
