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
  feature_analysis?: {
    embedding?: {
      dimension?: number;
      l2_norm?: number;
      source_layer?: string;
      note?: string;
    };
    preprocessing?: {
      status?: string;
      input_size?: string;
      color_mode?: string;
      value_range?: string;
    };
    image_statistics?: {
      brightness_mean?: number;
      contrast_std?: number;
      edge_strength_mean?: number;
    };
    similarity?: { available?: boolean; note?: string };
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
