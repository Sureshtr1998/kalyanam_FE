import { PRICING_COST, SUPPORT_EMAIL } from "../../utils/constants";
import "./Info.scss";

const Info = () => {
  return (
    <div className="interactive-element-container ml-8">
      <div className="relative inline-block icon-group group">
        <div className="click-me-badge">Click Me!</div>

        <div
          className="heart-icon-wrapper"
          tabIndex={0}
          aria-label="View Subscription and Contact Information">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M11.645 20.917c-.156.095-.328.167-.507.218-.216.06-.445.06-.667 0-.179-.051-.351-.123-.507-.218-2.618-1.554-7.699-5.118-8.73-8.816C.767 7.054 2.722 4 5.513 4c1.516 0 2.879.626 3.982 1.637l1.326 1.258 1.326-1.258c1.103-1.011 2.466-1.637 3.982-1.637 2.791 0 4.746 3.054 3.73 6.601-1.03 3.698-6.112 7.262-8.73 8.816Z" />
          </svg>
        </div>

        <div className="tooltip-popover">
          <p className="title">Pricing Details:</p>
          <p className="body"> ₹ {PRICING_COST}/year</p>

          <hr className="border-gray-200 mb-4" />

          <p className="title">Email Support:</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[#e07b00] text-sm font-medium hover:underline">
            {SUPPORT_EMAIL}
          </a>

          <div className="tooltip-arrow" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};

export default Info;
