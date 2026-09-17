import React from "react";

export const Dataset: React.FC = () => {

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
          Dataset & Class Balancing
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Detailed breakdown of dataset distribution, scientific class balancing, and isolation verification.
        </p>
      </div>

      {/* Comparison: Original vs Balanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Original Distribution */}
        <div className="p-6 rounded-lg border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Original Ingestion Distribution
            </h2>
            <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded border border-border bg-surface-secondary">
              Imbalanced
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            The raw Kaggle dataset consists of 57,589 images with a severe 5.5:1 imbalance. Training on this directly would cause the model to default to predicting AI-generated.
          </p>

          <div className="space-y-2.5 font-mono text-xs pt-2">
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary">
              <span className="text-text-secondary">Authentic (Real)</span>
              <span className="text-text-primary font-medium">8,803 (15.3%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary">
              <span className="text-text-secondary">AI-Generated (Fake)</span>
              <span className="text-text-primary font-medium">48,786 (84.7%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary font-semibold">
              <span className="text-text-primary">Total Scanned Images</span>
              <span className="text-text-primary">57,589</span>
            </div>
          </div>
        </div>

        {/* Card 2: Balanced Working Dataset */}
        <div className="p-6 rounded-lg border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Balanced Training Pool
            </h2>
            <span className="text-[11px] font-mono text-text-primary px-2 py-0.5 rounded border border-border bg-surface-secondary">
              1:1 Ratio
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            All 8,803 available authentic images were paired with an exact 8,803 deterministic random sample of synthetic images (seed=42), creating an unbiased foundation.
          </p>

          <div className="space-y-2.5 font-mono text-xs pt-2">
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary">
              <span className="text-text-secondary">Authentic (Real)</span>
              <span className="text-text-primary font-medium">8,803 (50.0%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary">
              <span className="text-text-secondary">AI-Generated (Fake)</span>
              <span className="text-text-primary font-medium">8,803 (50.0%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded border border-border bg-surface-secondary font-semibold">
              <span className="text-text-primary">Total Balanced Subset</span>
              <span className="text-text-primary">17,606</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stratified Split Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">
          STRATIFIED PARTITION BREAKDOWN (70% / 15% / 15%)
        </h2>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Train Split */}
            <div className="p-4 rounded border border-border bg-surface-secondary space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-semibold text-text-primary">TRAIN SPLIT</span>
                <span className="text-text-muted">70.0%</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-text-secondary">
                  <span>Real Images:</span>
                  <span className="text-text-primary">6,162</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Fake Images:</span>
                  <span className="text-text-primary">6,162</span>
                </div>
                <div className="flex justify-between text-text-primary font-semibold pt-1 border-t border-border/50">
                  <span>Partition Total:</span>
                  <span>12,324</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted font-sans pt-1">
                Subtle real-time augmentations (rotation, zoom, flip) applied during training.
              </p>
            </div>

            {/* Validation Split */}
            <div className="p-4 rounded border border-border bg-surface-secondary space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-semibold text-text-primary">VALIDATION SPLIT</span>
                <span className="text-text-muted">15.0%</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-text-secondary">
                  <span>Real Images:</span>
                  <span className="text-text-primary">1,320</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Fake Images:</span>
                  <span className="text-text-primary">1,320</span>
                </div>
                <div className="flex justify-between text-text-primary font-semibold pt-1 border-t border-border/50">
                  <span>Partition Total:</span>
                  <span>2,640</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted font-sans pt-1">
                Strictly unaugmented. Used for hyperparameter checkpoints and early stopping.
              </p>
            </div>

            {/* Test Split */}
            <div className="p-4 rounded border border-border bg-surface-secondary space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-semibold text-text-primary">TEST SPLIT</span>
                <span className="text-text-muted">15.0%</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-text-secondary">
                  <span>Real Images:</span>
                  <span className="text-text-primary">1,321</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Fake Images:</span>
                  <span className="text-text-primary">1,321</span>
                </div>
                <div className="flex justify-between text-text-primary font-semibold pt-1 border-t border-border/50">
                  <span>Partition Total:</span>
                  <span>2,642</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted font-sans pt-1">
                Strictly hold-out. Evaluated only once after training completion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Integrity Checklist */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">
          DATA LEAKAGE PREVENTION GUARANTEES
        </h2>

        <div className="rounded-lg border border-border bg-surface p-6 space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <span className="font-mono text-text-primary">✓</span>
            <div>
              <p className="font-medium text-text-primary">Zero Image Overlap</p>
              <p className="text-text-secondary text-[11px] mt-0.5">
                Cryptographic and filename set-difference assertions verify no identical image exists in more than one partition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-mono text-text-primary">✓</span>
            <div>
              <p className="font-medium text-text-primary">Isolated Augmentation</p>
              <p className="text-text-secondary text-[11px] mt-0.5">
                Augmentations are applied dynamically in memory exclusively to training batches. Validation and test samples remain pristine.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-mono text-text-primary">✓</span>
            <div>
              <p className="font-medium text-text-primary">Deterministic Reproducibility</p>
              <p className="text-text-secondary text-[11px] mt-0.5">
                The sampling and stratified split were fixed with seed=42 and recorded in data/dataset_report.json.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
