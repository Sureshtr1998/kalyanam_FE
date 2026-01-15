import { REGISTRATION_FEE } from "../../utils/constants";
import "./Offers.scss";

const Offers = () => {
  return (
    <div className="offer-sticky">
      <div className="offer-container">
        <div className="offer-glow" />

        <div className="offer-card">
          <div className="offer-shimmer">
            <div className="shimmer-line" />
          </div>

          {/* Left Section */}
          <div className="offer-left">
            <div className="icon-wrapper">
              <div className="icon-ping" />
              <div className="offer-icon">
                <i className="pi pi-bolt" />
              </div>
            </div>

            <div className="offer-text animate-heartbeat">
              <p className="offer-title">
                FLASH SALE:&nbsp;{" "}
                <span className="discount-highlight">52% OFF</span>
              </p>

              <p className="offer-subtitle">
                <span className="mt-0.5"> Limited time only</span>
                <span className="offer-price">₹{REGISTRATION_FEE}/yr</span>
              </p>
            </div>
          </div>

          {/* Right Section (Desktop) */}
          <div className="offer-right">
            <div className="sparkle-group">
              {[1, 2, 3].map((i) => (
                <div key={i} className="sparkle-dot">
                  <i className="pi pi-sparkles" />
                </div>
              ))}
            </div>
            <span className="offer-badge">Act Fast!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
