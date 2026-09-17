import type { AnalysisResult, HistoryListResponse } from "../types";
import { authService } from "../auth/authService";

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}/api`
  : import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await authService.getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function checkHealth(): Promise<{ status: string; model_loaded: boolean; model_version: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function analyzeImage(file: File, groundTruth?: string): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (groundTruth) {
    formData.append("ground_truth", groundTruth);
  }

  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: authHeaders,
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    const message = json?.error?.message || "Failed to analyze image";
    throw new Error(message);
  }

  return json.data;
}

export async function getResult(analysisId: string): Promise<AnalysisResult> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/results/${analysisId}`, {
    headers: authHeaders,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Failed to load result");
  }
  return json.data;
}

export async function getResultImageUrl(analysisId: string): Promise<string> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/results/${analysisId}/image`, {
    headers: authHeaders,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Failed to fetch image URL");
  }
  return json.data.url;
}

export async function getHistory(
  page: number = 1,
  limit: number = 20,
  classification?: string
): Promise<HistoryListResponse> {
  const url = new URL(`${API_BASE}/history`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  if (classification && classification !== "all") {
    url.searchParams.append("classification", classification);
  }

  const authHeaders = await getAuthHeaders();
  const res = await fetch(url.toString(), {
    headers: authHeaders,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Failed to load history");
  }
  return json.data;
}

export async function deleteResult(analysisId: string): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/results/${analysisId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error?.message || "Failed to delete result");
  }
}

export function getReportDownloadUrl(analysisId: string): string {
  return `${API_BASE}/results/${analysisId}/report`;
}
