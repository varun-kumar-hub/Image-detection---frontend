import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scan, ArrowRight } from "lucide-react";
import { getHistory } from "../services/api";
import { useAuth } from "../auth/useAuth";
import type { AnalysisResult } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recentItems, setRecentItems] = useState<AnalysisResult[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [realCount, setRealCount] = useState<number>(0);
  const [aiCount, setAiCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    getHistory(1, 10)
      .then((data) => {
        setRecentItems(data.items);
        setTotalCount(data.total);
        const ai = data.items.filter((i) => i.classification === "ai_generated").length;
        const real = data.items.filter((i) => i.classification === "real").length;
        setAiCount(ai);
        setRealCount(real);
      })
      .catch((err) => {
        console.warn("Failed to load dashboard history:", err);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      
      {/* 1. Hero / Value Proposition */}
      <div className="p-6 sm:p-8 rounded-lg border border-border bg-surface relative overflow-hidden">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-surface-secondary text-[11px] font-mono text-text-secondary">
            <span>EfficientNet-B0 Deep Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Image Detection
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Upload an image to determine whether it appears authentic or AI-generated using high-dimensional learned visual feature representations.
          </p>
          <div className="pt-3">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
            >
              <Scan className="h-4 w-4" />
              <span>Analyze Image</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Overview Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border bg-surface space-y-1">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Analyses</span>
          <p className="text-2xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? totalCount : "—"}
          </p>
          <p className="text-[11px] text-text-muted">Analyses processed by model</p>
        </div>

        <div className="p-4 rounded-lg border border-border bg-surface space-y-1">
          <span className="text-[11px] font-mono text-text-muted uppercase">Authentic Images</span>
          <p className="text-2xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? realCount : "—"}
          </p>
          <p className="text-[11px] text-text-muted">Classified as camera/authentic</p>
        </div>

        <div className="p-4 rounded-lg border border-border bg-surface space-y-1">
          <span className="text-[11px] font-mono text-text-muted uppercase">AI-Generated Images</span>
          <p className="text-2xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? aiCount : "—"}
          </p>
          <p className="text-[11px] text-text-muted">Classified as synthetic/AI</p>
        </div>
      </div>

      {/* 3. Recent Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Recent Analyses</h2>
          {isAuthenticated && (
            <Link to="/history" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
              View all history →
            </Link>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="p-8 text-center rounded-lg border border-border bg-surface space-y-3">
            <p className="text-xs text-text-secondary">
              Sign in with Google to view and save your analysis history across devices.
            </p>
            <Link
              to="/login"
              className="inline-block px-3.5 py-1.5 rounded text-xs font-medium border border-border bg-surface-secondary text-text-primary hover:bg-surface-hover"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-text-muted rounded-lg border border-border bg-surface">
            Loading recent analyses...
          </div>
        ) : recentItems.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-border bg-surface space-y-2">
            <p className="text-xs font-medium text-text-primary">No recent analyses yet</p>
            <p className="text-xs text-text-muted">Upload an image to start evaluating authenticity.</p>
            <Link
              to="/analyze"
              className="inline-block mt-2 px-3 py-1 rounded text-xs font-medium bg-accent text-accent-contrast"
            >
              Analyze an Image
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface overflow-hidden divide-y divide-border">
            {recentItems.slice(0, 5).map((item) => {
              const isAI = item.classification === "ai_generated";
              const isReview = item.classification === "needs_review";
              const label = isAI ? "AI Generated" : isReview ? "Needs Review" : "Authentic";
              const score = isAI ? item.ai_probability : item.real_probability;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="w-9 h-9 rounded object-cover border border-border bg-surface-secondary shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded border border-border bg-surface-secondary flex items-center justify-center shrink-0 text-text-muted text-[10px] font-mono">
                        IMG
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {item.image_info?.filename || "image.jpg"}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted mt-0.5">
                        <span>{item.id}</span>
                        <span>·</span>
                        <span>{item.created_at.split(" ")[0]}</span>
                        {item.is_evaluation && (
                          <span className="px-1 py-0.2 rounded border border-border bg-surface-secondary text-text-primary">
                            Evaluation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono text-xs text-text-primary font-medium block">
                        {score.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-text-muted capitalize block">
                        {label}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
