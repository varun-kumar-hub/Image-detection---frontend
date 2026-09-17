export interface ImageInfo {
  filename: string;
  file_size_bytes: number;
  file_size_human: string;
  dimensions: string;
  format: string;
  color_mode: string;
}

export interface ManipulationDetails {
  compression_status: string;
  resize_status: string;
  filter_status: string;
  metadata_status: string;
  details?: {
    exif?: {
      available: boolean;
      camera_make?: string;
      camera_model?: string;
      software?: string;
      date_taken?: string;
      has_gps?: boolean;
    };
    ela?: {
      compression_status: string;
      ela_mean?: number;
      ela_std?: number;
      max_difference?: number;
    };
    noise?: {
      filter_status: string;
      noise_variance?: number;
      texture_uniformity?: string;
    };
    dimensions?: {
      aspect_ratio?: string;
      width?: number;
      height?: number;
    };
  };
}

export interface AnalysisResult {
  id: string;
  upload_id?: string;
  classification: "real" | "ai_generated" | "needs_review";
  ai_probability: number;
  real_probability: number;
  confidence: "high" | "medium" | "low";
  confidence_explanation: string;
  interpretation: string;
  disclaimer: string;
  processing_time_ms: number;
  model_name: string;
  model_version: string;
  created_at: string;
  image_info?: ImageInfo;
  manipulation?: ManipulationDetails;
  explanation?: {
    summary?: string;
    model_basis?: string;
    primary_factors?: string[];
    supporting_observations?: string[];
    limitations?: string[];
    available?: boolean;
    overlay_base64?: string;
    description?: string;
  };
  gradcam?: {
    available: boolean;
    overlay_base64?: string;
    description?: string;
  };
  image_url?: string;
  thumbnail_url?: string;
  ground_truth?: string;
  is_evaluation?: boolean;
  is_correct?: boolean | null;
}


export interface HistoryListResponse {
  total: number;
  page: number;
  limit: number;
  items: AnalysisResult[];
}
