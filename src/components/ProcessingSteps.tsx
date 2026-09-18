import React, { useEffect, useState } from "react";

interface ProcessingStepsProps {
  onComplete?: () => void;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = () => {
  const [currentStep, setCurrentStep] = useState(2);

  const stepList = [
    "Image validated",
    "Image preprocessed",
    "Running detection model",
    "Running supporting analysis",
    "Preparing result",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(3), 600);
    const t2 = setTimeout(() => setCurrentStep(4), 1300);
    const t3 = setTimeout(() => setCurrentStep(5), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto rounded-lg border border-border bg-surface p-6">
      <h3 className="text-sm font-medium text-text-primary mb-4">
        Analyzing image
      </h3>

      <div className="space-y-2.5 text-xs font-mono">
        {stepList.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-colors ${
                isDone
                  ? "text-text-primary"
                  : isCurrent
                  ? "text-text-primary font-medium"
                  : "text-text-muted"
              }`}
            >
              <span className="w-3 text-center">
                {isDone ? "✓" : isCurrent ? "●" : "○"}
              </span>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
