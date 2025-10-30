import { ACCENT_COLOR, TEXT_COLOR } from "../../../../styles/variables";

const StepIndicator = (props: { step: number }) => {
  const { step } = props;
  return (
    <div className="flex justify-between items-center mb-10 w-full max-w-sm relative">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex-1 text-center">
          <div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              s <= step ? ACCENT_COLOR : "bg-gray-200 text-gray-500"
            }`}>
            {s}
          </div>
          <p
            className={`text-xs mt-1 transition-colors duration-300 ${
              s <= step ? TEXT_COLOR : "text-gray-500"
            }`}>
            {s === 1 ? "Identity" : s === 2 ? "Background" : "Profile"}
          </p>
        </div>
      ))}
      <div
        className={`absolute left-0 right-0 top-[18px] z-[-1] mx-auto w-1/2`}>
        <div className={`h-1 bg-gray-200 rounded-full`}>
          <div
            className={`${ACCENT_COLOR} h-1 rounded-full transition-all duration-500`}
            style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
