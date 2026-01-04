import { useState, useMemo } from "react";
import { communities, generateCommunitiesSchema } from "./seoComm";
import "./Communities.scss";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/misc/SEO";

interface CommunityIn {
  id: number;
  name: string;
  sub: string;
  slug: string;
}

interface Props {
  community: CommunityIn;
}
const CommunityCard = (props: Props) => {
  const { community } = props;

  return (
    <div className="community-card">
      <div className="community-card-header">
        <div className="community-icon-box">
          <i className="pi pi-users community-icon" />
        </div>

        <span className="community-badge">Hindu Community</span>
      </div>

      <h3 className="community-title">{community.name} Matrimony</h3>

      <p className="community-sub">{community.sub}...</p>

      <div className="community-cta">
        <span>Find Your Match</span>
        <i className="pi pi-chevron-right community-arrow" />
      </div>
    </div>
  );
};

const CommunitiesServe = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const filteredCommunities = useMemo(() => {
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sub.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <SEO
        title="Communities We Serve - Seetha Rama Kalyana"
        description="Explore Hindu Matrimony communities across India. Find verified profiles for Agarwal, Brahmin, Reddy, Patel, Maratha, Naidu, and 500+ Hindu sub-castes."
        keywords="Hindu Matrimony, Agarwal Matrimony, Brahmin Matrimony, Reddy Matrimony, Patel Matrimony, Maratha Matrimony, Naidu Matrimony, Indian Matrimony"
        pageType="default"
        additionalSchema={[generateCommunitiesSchema(communities)]}
      />
      <SEO
        title="Hindu Matrimony by Community | Brahmin, Reddy, Patel & More – Seetha Rama Kalyana"
        description="Seetha Rama Kalyana offers trusted Hindu matrimonial services for all communities including Brahmin, Reddy, Patel, Naidu, and 500+ sub-castes. Connect with verified profiles for a sacred and culturally aligned marriage."
        keywords="Hindu Matrimony, Brahmin Matrimony, Reddy Matrimony, Patel Matrimony, Naidu Matrimony, Hindu Marriage by Community, Verified Hindu Matrimony, Sacred Hindu Matrimony"
        url="https://www.seetharamakalyana.in/communities-we-serve"
      />
      <div className="min-h-screen bg-[#fffbeb] text-[#78350f]">
        {/* Hero Section */}
        <header className="hero">
          <div className="hero-badge">
            <i className="pi pi-sparkles" />
            <span>Trusted Hindu Matrimony Service</span>
          </div>

          <h1 className="hero-title">
            Divine Matches for the
            <span className="accent"> Hindu Community</span>
          </h1>

          <p className="hero-subtitle">
            Seetha Rama Kalyana is a premium, exclusive platform for Hindu
            marriage. Connect with verified profiles across all traditions and
            castes for a sacred union.
          </p>

          <div className="search-box">
            <i className="pi pi-search search-icon" />
            <input
              type="text"
              placeholder="Search your caste (e.g. Brahmin, Reddy, Patel, Naidu)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* NEW: Why Choose Seetha Rama Kalyana (SEO Content + Benefits) */}
        <section className="why-section">
          <div className="why-header">
            <h2>Why Seetha Rama Kalyana?</h2>
            <p>
              Experience the most secure and culturally aligned Hindu matrimony
              platform designed for serious marriage seekers.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="pi pi-verified" />
              </div>
              <h3>100% Verified</h3>
              <p>
                Strict manual screening of every Hindu profile to ensure zero
                fake accounts and maximum trust.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <i className="pi pi-lock" />
              </div>
              <h3>Total Privacy</h3>
              <p>
                Control who sees your photos and contact details. We prioritize
                your security in the sacred search.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <i className="pi pi-tags" />
              </div>
              <h3>Caste Specific</h3>
              <p>
                Over 500+ Hindu sub-castes supported, ensuring you find a match
                that shares your roots and values.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <i className="pi pi-heart" />
              </div>
              <h3>Sacred Matching</h3>
              <p>
                Algorithm-driven suggestions based on Gothram, Star, and
                traditional compatibility factors.
              </p>
            </div>
          </div>
        </section>

        {/* Community Grid */}
        <main className="community-section">
          <div className="community-header">
            <div>
              <h2>Find Your Community</h2>
              <div className="community-underline" />
            </div>

            <div className="community-count">
              {communities.length}+ Featured Communities
            </div>
          </div>

          {filteredCommunities.length > 0 ? (
            <div className="community-grid">
              {filteredCommunities.map((community) => (
                <div key={community.id} onClick={handleNavigate}>
                  <CommunityCard community={community} />
                </div>
              ))}
            </div>
          ) : (
            <div className="community-empty">
              <i className="pi pi-users community-empty-icon" />
              <h3>Caste not found?</h3>
              <p>
                Don't worry, we support all Hindu sub-castes. You can select
                your specific community during the detailed registration
                process.
              </p>
            </div>
          )}
        </main>

        {/* Premium Membership Info */}
        <section className="premium-section">
          <div className="premium-card">
            <div className="premium-content">
              <h2>A Sacred Journey for Serious Seekers</h2>

              <p>
                Seetha Rama Kalyana is a premium, paid service. Our membership
                ensures a safe, high-quality environment where you meet only
                verified individuals committed to Hindu marriage traditions.
              </p>

              <div className="premium-actions">
                <button
                  onClick={handleNavigate}
                  className="premium-primary-btn">
                  Create Sacred Profile
                </button>

                <button
                  onClick={() => navigate("/pricing")}
                  className="premium-secondary-btn">
                  Membership Plans
                </button>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="premium-circle premium-circle-top" />
            <div className="premium-circle premium-circle-bottom" />
          </div>
        </section>

        {/* Detailed SEO Keywords Section */}
        <section className="seo-section">
          <div className="seo-container">
            <h2 className="seo-title">
              Dedicated Hindu Matrimonial Services Across India
            </h2>

            <div className="seo-grid">
              <div className="seo-block">
                <h4>North & Central India Matrimony</h4>
                <p>
                  In the Northern heartland, Seetha Rama Kalyana is the leading
                  destination for <strong>Brahmin Matrimony</strong>, covering
                  sub-castes like Kanyakubja, Bhumihar, and Tyagi. We also serve{" "}
                  <strong>Rajput Matrimony</strong> seekers from Chauhan,
                  Rathore, and Thakur families. For business families, our{" "}
                  <strong>Agarwal</strong> and <strong>Baniya Matrimony</strong>{" "}
                  categories include specialized filters for Gupta, Goyal, and
                  Varshney profiles. We also host verified profiles for{" "}
                  <strong>Jat</strong>, <strong>Yadav</strong>,{" "}
                  <strong>Kayastha</strong>, and <strong>Khatri</strong>{" "}
                  communities.
                </p>
              </div>

              <div className="seo-block">
                <h4>South India Hindu Matrimony</h4>
                <p>
                  Our presence in South India is robust, catering to{" "}
                  <strong>Reddy Matrimony</strong>,{" "}
                  <strong>Kamma Matrimony</strong> (Chowdary), and{" "}
                  <strong>Naidu Matrimony</strong>. We are a trusted platform
                  for <strong>Nair Matrimony</strong> (Menon, Pillai) and{" "}
                  <strong>Ezhava Matrimony</strong>. For the Tamil community, we
                  offer dedicated services for <strong>Mudaliar</strong>,{" "}
                  <strong>Vanniyar</strong>, <strong>Gounder</strong>, and{" "}
                  <strong>Chettiar</strong>. We also support{" "}
                  <strong>Arya Vysya</strong>, <strong>Lingayat</strong>, and{" "}
                  <strong>Vellalar</strong> traditions.
                </p>
              </div>

              <div className="seo-block">
                <h4>West & East India Hindu Matrimony</h4>
                <p>
                  In Western India, we provide extensive support for{" "}
                  <strong>Maratha Matrimony</strong>, focusing on 96 Kuli and
                  Patil families. Our <strong>Patel Matrimony</strong> section
                  covers Leuva and Kadva Patidars. We also cater to{" "}
                  <strong>Maheshwari</strong>, <strong>Lohana</strong>,{" "}
                  <strong>Sindhi</strong>, and <strong>Kumbhar</strong>{" "}
                  communities. In Eastern India, we host profiles for{" "}
                  <strong>Kurmi</strong>, <strong>Mali</strong>, and{" "}
                  <strong>Sonar</strong> families.
                </p>
              </div>

              <div className="seo-block">
                <h4>Professional Hindu Community Hub</h4>
                <p>
                  Seetha Rama Kalyana is more than just a directory; it is a
                  sacred space for <strong>Vishwakarma Matrimony</strong>,{" "}
                  <strong>Saini Matrimony</strong>, and{" "}
                  <strong>Teli Matrimony</strong>. We understand the importance
                  of sub-caste compatibility in <strong>Hindu Matrimony</strong>
                  . Whether you are looking within <strong>Arora</strong>,{" "}
                  <strong>Koli</strong>, or <strong>Dhoba</strong> communities,
                  our platform ensures a dignified and successful search.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunitiesServe;
