import React, { useEffect, useState } from "react";

export const Model: React.FC = () => {

  const [evalData, setEvalData] = useState<any>(null);

  useEffect(() => {
    // Attempt to fetch actual evaluation results if available
    fetch("/models/evaluation_results.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setEvalData(data))
      .catch(() => {});
  }, []);

  const architectureLayers = [
    { name: "Input Image", detail: "224 × 224 × 3 (RGB, [0, 255] float32)" },
    { name: "EfficientNet-B0 Backbone", detail: "ImageNet Pretrained Feature Extractor (4.05M Params)" },
    { name: "GlobalAveragePooling2D", detail: "Feature dimension reduction (1280 channels)" },
    { name: "BatchNormalization", detail: "Feature regularization (head_bn1)" },
    { name: "Dense (256, ReLU)", detail: "Non-linear projection layer (327,936 params)" },
    { name: "Dropout (0.5)", detail: "Overfitting prevention" },
    { name: "Dense (128, ReLU)", detail: "Intermediate representation layer (32,896 params)" },
    { name: "Dropout (0.3)", detail: "Regularization" },
    { name: "Dense (1, Sigmoid)", detail: "Probability output (0 = Real, 1 = AI-Generated)" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
          Model Specification
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Technical architecture, transfer-learning parameters, and evaluation benchmark results.
        </p>
      </div>

      {/* Model Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded border border-border bg-surface font-mono">
          <span className="text-[11px] text-text-muted block uppercase tracking-wider">Backbone</span>
          <span className="text-sm font-semibold text-text-primary mt-1 block">EfficientNet-B0</span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">ImageNet pretrained</span>
        </div>

        <div className="p-4 rounded border border-border bg-surface font-mono">
          <span className="text-[11px] text-text-muted block uppercase tracking-wider">Input Resolution</span>
          <span className="text-sm font-semibold text-text-primary mt-1 block">224 × 224 × 3</span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">RGB color format</span>
        </div>

        <div className="p-4 rounded border border-border bg-surface font-mono">
          <span className="text-[11px] text-text-muted block uppercase tracking-wider">Classification</span>
          <span className="text-sm font-semibold text-text-primary mt-1 block">Binary Sigmoid</span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">Real vs AI-Generated</span>
        </div>

        <div className="p-4 rounded border border-border bg-surface font-mono">
          <span className="text-[11px] text-text-muted block uppercase tracking-wider">Decision Logic</span>
          <span className="text-sm font-semibold text-text-primary mt-1 block">&gt;55% AI / &lt;45% Real</span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">45–55%: Needs Review</span>
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">
          TRANSFER LEARNING ARCHITECTURE
        </h2>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="max-w-xl mx-auto space-y-2">
            {architectureLayers.map((layer, idx) => (
              <React.Fragment key={idx}>
                <div className="p-3 rounded border border-border bg-surface-secondary flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-text-primary">
                    {layer.name}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {layer.detail}
                  </span>
                </div>
                {idx < architectureLayers.length - 1 && (
                  <div className="text-center text-text-muted text-xs font-mono py-0.5">
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance & Honest Evaluation */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">
          TEST SET BENCHMARK METRICS
        </h2>

        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            Evaluated strictly on the untouched hold-out test set (2,642 balanced samples: 1,321 Real, 1,321 Fake). No training data leakage or validation overlap.
          </p>

          {evalData?.metrics ? (
            <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">

              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">ACCURACY</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.accuracy}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">PRECISION</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.precision}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">RECALL (SENSITIVITY)</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.recall}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">F1 SCORE</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.f1_score}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">AUC-ROC</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.auc_roc}
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">SPECIFICITY</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.specificity}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">FALSE POSITIVE RATE</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.false_positive_rate}%
                </span>
              </div>
              <div className="p-3 rounded border border-border bg-surface-secondary">
                <span className="text-text-muted block text-[10px]">FALSE NEGATIVE RATE</span>
                <span className="text-base font-semibold text-text-primary mt-1 block">
                  {evalData.metrics.false_negative_rate}%
                </span>
              </div>
            </div>

            {/* Diagnostic Visualizations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="p-4 rounded border border-border bg-surface-secondary space-y-2">
                <span className="text-xs font-mono font-medium text-text-primary block">
                  Test Confusion Matrix
                </span>
                <div className="rounded overflow-hidden border border-border bg-white flex justify-center">
                  <img
                    src="/models/confusion_matrix.png"
                    alt="Confusion Matrix"
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>

              <div className="p-4 rounded border border-border bg-surface-secondary space-y-2">
                <span className="text-xs font-mono font-medium text-text-primary block">
                  Receiver Operating Characteristic (ROC)
                </span>
                <div className="rounded overflow-hidden border border-border bg-white flex justify-center">
                  <img
                    src="/models/roc_curve.png"
                    alt="ROC Curve"
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            </div>
            </>
          ) : (
            <div className="p-6 rounded border border-border bg-surface-secondary text-center font-mono text-xs text-text-muted">
              Model test evaluation results will populate automatically upon completion of the test evaluation script.
            </div>
          )}
        </div>
      </div>
    </div>

  );
};
