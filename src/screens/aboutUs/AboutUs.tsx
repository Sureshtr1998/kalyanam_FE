import HeaderSection from "./sections/HeaderSection";
import MissionSection from "./sections/MissionSection";
import CommitmentSection from "./sections/CommitmentSection";
import ActionSection from "./sections/ActionSection";
import QuickLinks from "./sections/QuickLinks";
import SEO from "../../components/misc/SEO";

const AboutUs = () => {
  return (
    <div className="about-us">
      <SEO
        title="About Us | Seetha Rama Kalyana"
        description="Learn about Seetha Rama Kalyana, our mission, and our dedicated team serving the Brahmin community."
        keywords="brahmin matrimony, kannada brahmin matrimony, about us, seetha rama kalyana"
        url="https://seetharamakalyana.in/about-us"
      />

      <div className="header-section">
        <HeaderSection />
      </div>
      <div className="mission-section">
        <MissionSection />
      </div>
      <div className="team-section">
        <QuickLinks />
      </div>
      <div className="commitment-section">
        <CommitmentSection />
      </div>
      <div className="action-section">
        <ActionSection />
      </div>
    </div>
  );
};

export default AboutUs;
