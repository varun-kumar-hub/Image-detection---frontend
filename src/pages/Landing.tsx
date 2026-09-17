import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Search, Database, Cpu, FileText, CheckCircle2 } from "lucide-react";

export const Landing: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Upload",
      desc: "Provide any image (JPG, PNG, WEBP up to 25 MB). Files are processed securely in memory.",
    },
    {
      num: "02",
      title: "Analyze",
      desc: "Our EfficientNet-B0 deep learning model and image analysis pipeline inspect textures, frequency patterns, and metadata.",
    },
    {
      num: "03",
      title: "Understand",
      desc: "Review probabilities, model confidence, supporting compression signals, and inspectable Grad-CAM activation maps.",
    },
  ];

  const features = [
    {
      icon: Cpu,
      title: "Deep Learning Classification",
      desc: "Trained on balanced real and AI-generated image distributions with EfficientNet-B0 transfer learning.",
    },
    {
      icon: Search,
      title: "Supporting Signal Analysis",
      desc: "Error Level Analysis (ELA), high-frequency Laplacian noise analysis, and EXIF structure extraction.",
    },
    {
      icon: Shield,
      title: "Decisive Verdicts & Review State",
      desc: "Provides calibrated thresholds: AI (>55%), Authentic (<45%), and a dedicated 'Needs Review' state for borderline inputs.",
    },
    {
      icon: Database,
      title: "Transparent Dataset Standards",
      desc: "Documented class-balanced training distributions with zero data leakage across train, validation, and test splits.",
    },
    {
      icon: FileText,
      title: "PDF Audit Reports",
      desc: "Export formal detection evaluation summaries formatted with exact metadata and responsible AI disclaimers.",
    },
    {
      icon: CheckCircle2,
      title: "Private & Secure",
      desc: "Built with strict payload validation, secure file handling, and local/isolated database records.",
    },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-border bg-surface-secondary text-text-secondary mb-8">
          <span>Enterprise Image Analysis</span>
          <span className="text-text-muted">•</span>
          <span>v4.0 Ready</span>
        </div>

        <h1 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">
          IMAGE AUTHENTICITY
        </h1>

        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary mb-6">
          Understand What You're Looking At.
        </h2>

        <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mb-10">
          Upload an image and receive a model prediction about whether it appears authentic or AI-generated, together with probability, confidence, and supporting analysis. Results are indicators—not absolute proof.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded text-sm font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center h-10 px-6 rounded text-sm font-medium border border-border bg-surface text-text-primary hover:bg-surface-secondary transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="border-t border-border pt-16">
          <div className="text-center mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
              HOW IT WORKS
            </h3>
            <p className="text-xl font-medium text-text-primary">
              From uploaded pixels to a readable result
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-lg border border-border bg-surface transition-colors"
              >
                <span className="font-mono text-xs text-text-muted block mb-4">
                  {step.num}
                </span>
                <h4 className="text-base font-medium text-text-primary mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="border-t border-border pt-16">
          <div className="text-center mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
              PLATFORM CAPABILITIES
            </h3>
          <p className="text-xl font-medium text-text-primary">
              Practical detail at every stage
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-surface flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-secondary text-text-primary mb-4">
                    <feat.icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium text-text-primary mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center border-t border-border pt-16 pb-8">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Ready to verify an image?
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Start with the original image. Preprocessing happens internally for the model, while your uploaded file remains unchanged for display and storage.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 h-9 px-5 rounded text-xs font-medium bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};
