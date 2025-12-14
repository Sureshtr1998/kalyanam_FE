import {
  KUNDLI_MATCHING_ASTRO_FEE,
  OVERVIEW_ASTRO_FEE,
  PERSONALIZED_ASTRO_FEE,
  SUPPORT_EMAIL,
} from "../../utils/constants";
import "./Astrology.scss";

const AstroNote = () => (
  <div className="consultation-disclaimer">
    <h3>About Your Astrology Reading</h3>
    <p>
      Astrology is a profound science, and while we strive for accuracy,
      interpretations can sometimes be general. Our astrologer will personally
      review your request to provide guidance.
    </p>
    <p>
      If you have follow-up questions or need more insights, please email us at{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
        {SUPPORT_EMAIL}
      </a>
      .
    </p>
    <p>
      <span className="font-bold"> Note:</span> We have an astrologer from
      Karnataka, and we use AI to translate from{" "}
      <span className="font-bold">Kannada</span> to English so that all users
      can easily understand the insights.
    </p>
    <p>
      {" "}
      We will send you a mail, once the insights are ready, you can view over
      here.
    </p>

    <ul>
      <li>
        <strong>Overview Analysis ₹{OVERVIEW_ASTRO_FEE}:</strong> Provides a
        short, focused description highlighting{" "}
        <span>7 key characters of your personality</span>.
      </li>
      <li>
        <strong>Personalized Query ₹{PERSONALIZED_ASTRO_FEE}:</strong> Gives
        detailed insights, remedies, and personalized predictions.
      </li>
      <li>
        <strong>Kundli Matching ₹{KUNDLI_MATCHING_ASTRO_FEE}:</strong> Provides
        a detailed compatibility analysis between partners, including Guna
        Milan, dosha checks, verdict, and outcome predictions.
      </li>
    </ul>

    <p className="warning">
      Our astrologer is available from <span>9:00 AM</span> to{" "}
      <span> 9:00 PM.</span>
      <br />
      If we receive your request outside these hours, you will get a reply the
      next working day. We recommend starting with the Overview Analysis. If{" "}
      <span>5 or more</span> of the 7 characters feel accurate, you can
      confidently proceed to a Personalized Query for a deeper reading.
    </p>
  </div>
);

export default AstroNote;
