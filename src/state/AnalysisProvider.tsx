import React, { createContext, useContext, useEffect, useState } from "react";
import { getResult } from "../services/api";
import { useAuth } from "../auth/useAuth";
import type { AnalysisResult } from "../types";

const ACTIVE_ANALYSIS_KEY = "image_detection_active_analysis";

type AnalysisContextValue = {
  result: AnalysisResult | null;
  isRestoring: boolean;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysis: () => void;
};

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const id = localStorage.getItem(ACTIVE_ANALYSIS_KEY);
    if (!isAuthenticated) {
      setResult(null);
      localStorage.removeItem(ACTIVE_ANALYSIS_KEY);
      setIsRestoring(false);
      return;
    }
    if (!id) {
      setIsRestoring(false);
      return;
    }
    let cancelled = false;
    getResult(id)
      .then((restored) => { if (!cancelled) setResult(restored); })
      .catch(() => { /* Keep the ID; a transient backend wake-up must not erase state. */ })
      .finally(() => { if (!cancelled) setIsRestoring(false); });
    return () => { cancelled = true; };
  }, [authLoading, isAuthenticated]);

  const setAnalysisResult = (next: AnalysisResult) => {
    setResult(next);
    localStorage.setItem(ACTIVE_ANALYSIS_KEY, next.id);
  };

  const clearAnalysis = () => {
    setResult(null);
    localStorage.removeItem(ACTIVE_ANALYSIS_KEY);
  };

  return <AnalysisContext.Provider value={{ result, isRestoring, setAnalysisResult, clearAnalysis }}>{children}</AnalysisContext.Provider>;
};

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return context;
}
