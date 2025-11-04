import React from "react";
import { ACCENT_COLOR, TEXT_COLOR } from "../../../../styles/variables";

interface StepIndicatorProps {
  step: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step }) => {
  const stepLabels = [
    { num: 1, label: "Identity" },
    { num: 2, label: "Background" },
    { num: 3, label: "Profile" },
    { num: 4, label: "Verification" },
  ];

  const totalTransitions = stepLabels.length - 1;
  const progressBarWidth = ((step - 1) / totalTransitions) * 100;

  // Dynamically calculate the offset so the progress bar aligns between step circles
  const offsetPercent = 100 / (stepLabels.length * 2);

  return (
    <div className="flex justify-between items-center mb-10 w-full max-w-lg relative">
      {/* Step circles + labels */}
      {stepLabels.map((s) => (
        <div key={s.num} className="flex-1 text-center">
          <div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              s.num <= step
                ? `${ACCENT_COLOR} text-white`
                : "bg-gray-200 text-gray-500"
            }`}>
            {s.num}
          </div>
          <p
            className={`text-xs mt-1 transition-colors duration-300 ${
              s.num <= step ? TEXT_COLOR : "text-gray-500"
            }`}>
            {s.label}
          </p>
        </div>
      ))}

      {/* Progress bar — dynamically aligned between step centers */}
      <div
        className="absolute top-[18px] z-[-1]"
        style={{
          left: `calc(${offsetPercent}%)`,
          right: `calc(${offsetPercent}%)`,
        }}>
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className={`${ACCENT_COLOR} h-1 rounded-full transition-all duration-500`}
            style={{ width: `${progressBarWidth}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
