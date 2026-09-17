import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Trash2, Download, ArrowUpRight } from "lucide-react";
import { getHistory, deleteResult, getReportDownloadUrl } from "../services/api";
import type { AnalysisResult } from "../types";

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    getHistory(1, 50, filter === "all" ? undefined : filter)
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message || "Failed to load history"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this analysis record?")) return;

    try {
      await deleteResult(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const filename = item.image_info?.filename?.toLowerCase() || "";
    const id = item.id.toLowerCase();
    return filename.includes(q) || id.includes(q);
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
            History
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Prior image detection analysis records and generated inspection reports.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center h-8 px-3.5 rounded text-xs font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
        >
          Analyze Image
        </Link>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded border border-border bg-surface text-xs text-text-primary">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded border border-border bg-surface w-full sm:w-auto text-xs overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "ai_generated", label: "AI Generated" },
            { id: "real", label: "Authentic" },
            { id: "needs_review", label: "Needs Review" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap text-xs cursor-pointer ${
                filter === tab.id
                  ? "bg-surface-secondary text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by ID or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-secondary"
          />
        </div>
      </div>

      {/* Loading / Empty State */}
      {isLoading ? (
        <div className="py-20 text-center text-xs font-mono text-text-muted">
          Loading history records...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-8 text-center py-16 px-4 rounded border border-border bg-surface">
          <p className="text-sm font-medium text-text-primary">No records found</p>
          <p className="text-xs text-text-secondary mt-1">
            {searchQuery ? "No records match your search criteria." : "You have not performed any analyses yet."}
          </p>
          <Link
            to="/analyze"
            className="inline-block mt-4 px-3 py-1.5 rounded text-xs font-medium bg-accent text-accent-contrast"
          >
            Analyze an Image
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block rounded-lg border border-border bg-surface overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted font-mono uppercase text-[10px] border-b border-border">
                <tr>
                  <th className="px-5 py-3">File / Preview</th>
                  <th className="px-5 py-3">Result</th>
                  <th className="px-5 py-3">Probability</th>
                  <th className="px-5 py-3">Confidence</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const isAI = item.classification === "ai_generated";
                  const isReview = item.classification === "needs_review";
                  const score = isAI ? item.ai_probability : item.real_probability;
                  const label = isAI ? "AI Generated" : isReview ? "Needs Review" : "Authentic";

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/results/${item.id}`)}
                      className="hover:bg-surface-secondary/60 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt=""
                              className="w-8 h-8 rounded object-cover border border-border bg-surface-secondary shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded border border-border bg-surface-secondary flex items-center justify-center shrink-0 text-text-muted text-[10px] font-mono">
                              IMG
                            </div>
                          )}
                          <div className="truncate max-w-[200px]">
                            <div className="font-medium text-text-primary truncate">
                              {item.image_info?.filename || "image.jpg"}
                            </div>
                            <div className="font-mono text-[11px] text-text-muted mt-0.5 truncate flex items-center gap-1.5">
                              <span>{item.id}</span>
                              {item.is_evaluation && (
                                <span className="px-1 py-0.2 rounded border border-border bg-surface-secondary text-text-primary text-[9px]">
                                  Evaluation
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-text-primary">
                          {label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-text-primary">
                        {score.toFixed(1)}%
                      </td>
                      <td className="px-5 py-3.5 capitalize text-text-secondary">
                        {item.confidence}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-text-muted">
                        {item.created_at.split(" ")[0]}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={getReportDownloadUrl(item.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary"
                            title="Download Report"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (below md) */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item) => {
              const isAI = item.classification === "ai_generated";
              const isReview = item.classification === "needs_review";
              const score = isAI ? item.ai_probability : item.real_probability;
              const label = isAI ? "AI GENERATED" : isReview ? "NEEDS REVIEW" : "AUTHENTIC";

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-4 rounded-lg border border-border bg-surface space-y-2 cursor-pointer active:bg-surface-secondary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.thumbnail_url && (
                        <img
                          src={item.thumbnail_url}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-border bg-surface-secondary shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      <div className="truncate">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {item.image_info?.filename || "image.jpg"}
                        </p>
                        <p className="text-[10px] font-mono text-text-muted truncate">
                          {item.id}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-text-primary font-medium shrink-0">
                      {score.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-text-secondary">
                        {label}
                      </span>
                      <span className="text-text-muted text-[11px]">·</span>
                      <span className="text-text-muted text-[11px]">
                        {item.created_at.split(" ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/results/${item.id}`);
                        }}
                        className="text-xs text-text-primary inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-xs text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
