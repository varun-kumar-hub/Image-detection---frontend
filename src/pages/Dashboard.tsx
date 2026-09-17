import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scan, ArrowRight, Brain, Image as ImageIcon, Target, BarChart3, Activity, Clock3 } from "lucide-react";
import { getHistory } from "../services/api";
import { useAuth } from "../auth/useAuth";
import type { AnalysisResult } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [recentItems, setRecentItems] = useState<AnalysisResult[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [realCount, setRealCount] = useState<number>(0);
  const [aiCount, setAiCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
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
        const review = data.items.filter((i) => i.classification === "needs_review").length;
        setAiCount(ai);
        setRealCount(real);
        setReviewCount(review);
      })
      .catch((err) => {
        console.warn("Failed to load dashboard history:", err);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      <div className="space-y-1">
        <p className="text-sm font-mono uppercase tracking-wider text-accent">Image Detection</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}{user?.user_metadata?.name ? `, ${user.user_metadata.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-base text-text-secondary">Review your image authenticity analyses and model results.</p>
      </div>
      
      {/* 1. Hero / Value Proposition */}
        <div className="premium-card p-6 sm:p-8 rounded-xl border border-border bg-surface relative overflow-hidden shadow-sm">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-secondary text-xs font-mono text-text-secondary">
            <Brain className="h-3.5 w-3.5 text-accent" />
            <span>EfficientNet-B0 · Binary Classification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Image Detection
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
            Analyze an image to estimate whether it appears Real / Authentic or AI-Generated using learned visual representations. Results are indicators, not absolute proof.
          </p>
          <div className="pt-3">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
            >
              <Scan className="h-4 w-4" />
              <span>Analyze Image</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Overview Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="premium-card p-5 rounded-lg border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs font-mono text-text-muted uppercase tracking-wider">Total Analyses</span><BarChart3 className="h-4 w-4 text-accent" /></div>
          <p className="text-3xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? totalCount : "—"}
          </p>
          <p className="text-sm text-text-muted">All-time analyses</p>
        </div>

        <div className="premium-card p-5 rounded-lg border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs font-mono text-text-muted uppercase tracking-wider">Authentic Images</span><ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></div>
          <p className="text-3xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? realCount : "—"}
          </p>
          <p className="text-sm text-text-muted">Camera / authentic signal</p>
        </div>

        <div className="premium-card p-5 rounded-lg border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs font-mono text-text-muted uppercase tracking-wider">AI-Generated Images</span><Target className="h-4 w-4 text-amber-600 dark:text-amber-400" /></div>
          <p className="text-3xl font-mono font-semibold text-text-primary">
            {isAuthenticated ? aiCount : "—"}
          </p>
          <p className="text-sm text-text-muted">Synthetic / AI signal</p>
        </div>
        <div className="premium-card p-5 rounded-lg border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs font-mono text-text-muted uppercase tracking-wider">Needs Review</span><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /></div>
          <p className="text-3xl font-mono font-semibold text-text-primary">{isAuthenticated ? reviewCount : "—"}</p>
          <p className="text-sm text-text-muted">Uncertain predictions</p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <div className="premium-card rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-accent" /><h2 className="text-base font-semibold">Detection Overview</h2></div><p className="text-sm text-text-muted mt-1">Distribution across your recent analyses</p></div>
            <div className="flex gap-1 rounded border border-border bg-surface-secondary p-1 text-xs"><span className="rounded bg-surface px-2 py-1 font-medium">30D</span><span className="px-2 py-1 text-text-muted">90D</span></div>
          </div>
          <div className="flex items-end gap-3 h-36 border-b border-border px-2">
            {[42, 66, 48, 78, 58, 88, 70, 94, 62, 82, 52, 74].map((height, index) => <div key={index} className="flex-1 rounded-t bg-accent/80 transition-all hover:bg-accent" style={{ height: `${height}%` }} />)}
          </div>
          <div className="flex flex-wrap gap-5 pt-4 text-xs text-text-muted"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-accent" />Analyses processed</span><span>Model: EfficientNet-B0</span><span>Input: 224 × 224</span></div>
        </div>
        <div className="premium-card rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5"><Clock3 className="h-4 w-4 text-accent" /><h2 className="text-base font-semibold">System Snapshot</h2></div>
          <div className="space-y-4 text-sm"><div className="flex items-center justify-between border-b border-border pb-3"><span className="text-text-muted">Detection engine</span><span className="font-medium text-text-primary">Operational</span></div><div className="flex items-center justify-between border-b border-border pb-3"><span className="text-text-muted">Model version</span><span className="font-mono text-xs">v1.0</span></div><div className="flex items-center justify-between"><span className="text-text-muted">Review queue</span><span className="font-mono font-medium">{isAuthenticated ? reviewCount : "—"}</span></div></div>
        </div>
      </section>

      {/* 3. Recent Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Recent Analyses</h2>
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
