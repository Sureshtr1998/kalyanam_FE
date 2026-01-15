import { useState, useEffect } from "react";
import { REGISTRATION_FEE, SUPPORT_EMAIL } from "../../utils/constants";
import "./Info.scss";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const [showMail, setShowMail] = useState(true);
  const [showTooltipHint, setShowTooltipHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowTooltipHint(true);

    const timer = setTimeout(() => {
      setShowTooltipHint(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMail((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="interactive-element-container ml-8">
      <div className="relative inline-block icon-group group">
        {/* <div className="click-me-badge">Click Me!</div> */}

        <div
          className="heart-icon-wrapper"
          tabIndex={0}
          aria-label="View Subscription and Contact Information">
          {/* ❤️ Heart SVG as Background */}
          <svg
            className="heart-base"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>

          {/* 💌 Mail Icon */}
          <div className={`inner-icon icon-fade ${showMail ? "show" : "hide"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.38 1.61.73 2.37a2 2 0 0 1-.45 2.11L8.09 9.91a16.06 16.06 0 0 0 6 6l1.71-1.71a2 2 0 0 1 2.11-.45c.76.35 1.56.61 2.37.73a2 2 0 0 1 1.72 2z" />
            </svg>
          </div>

          {/* ₹ Rupee Icon */}
          <div className={`inner-icon icon-fade ${showMail ? "hide" : "show"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M5 4h14v2H9.55a4.5 4.5 0 0 1 4.4 3.5H19v2h-4.96a4.5 4.5 0 0 1-4.4 3.5H11l5 6h-2.8l-5-6H5v-2h4.8a2.5 2.5 0 0 0 2.45-2H5V9h7.25A2.5 2.5 0 0 0 9.8 7H5V4z" />
            </svg>
          </div>
        </div>

        <div
          className={`tooltip-popover ${showTooltipHint ? "show-hint" : ""}`}>
          <div className="price-wrapper">
            <div className="price-card">
              <div className="price-row">
                <div className="price-old">
                  <p>₹1600/year</p>
                  <div className="price-strike" />
                </div>

                <div className="price-new animate-heartbeat">
                  <span className="price-label">Today's Price</span>
                  <p className="price-amount">
                    ₹{REGISTRATION_FEE}
                    <span className="price-duration">/year</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/pricing")}
                className="price-btn">
                <span>Membership Details</span>
                <i className="ml-1 pi pi-arrow-right price-btn-icon" />
              </button>
            </div>
          </div>
          <div className="help-wrapper mt-2">
            <p className="help-label ">Need help?</p>

            <a href={`mailto:${SUPPORT_EMAIL}`} className="help-link">
              <i className="pi pi-envelope help-icon" />
              <span className="help-email">{SUPPORT_EMAIL}</span>
            </a>
          </div>
          <div className="tooltip-arrow" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};

export default Info;
