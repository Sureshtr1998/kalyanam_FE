import { Fieldset } from "primereact/fieldset";
import "./RegisterNote.scss";

const RegisterNote = () => {
  return (
    <Fieldset
      collapsed
      className="important-note"
      legend="Before You Begin Your Journey"
      toggleable>
      <strong> 1) </strong>
      We've very recently launched the app, so you might not find many profiles
      initially. By <strong>November end</strong>, we’ll be adding all active
      profiles here.
      <strong>
        <br />
        2){" "}
      </strong>
      You’ll receive email notifications whenever someone sends you an interest
      or accepts your interest.
      <br />
      <strong> 3) </strong>
      We’re currently charging a{" "}
      <strong>minimal registration fee of ₹251 </strong>
      per year for our new users.
      <strong>
        <br />
        4){" "}
      </strong>
      For any issues or special assistance, please contact{" "}
      <a
        href="mailto:contactus@seetharamakalyana.in"
        style={{ color: "#e07b00", textDecoration: "none", fontWeight: 500 }}>
        contactus@seetharamakalyana.in
      </a>
      . We’ll respond to your query within <strong>24 hours</strong>.
    </Fieldset>
  );
};

export default RegisterNote;
