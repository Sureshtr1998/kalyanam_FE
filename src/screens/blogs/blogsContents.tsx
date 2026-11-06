import tipsUrl from "../../assets/blogs/tips.webp";
import traditionalUrl from "../../assets/blogs/traditional.webp";
import threeUrl from "../../assets/blogs/3.webp";
import fourUrl from "../../assets/blogs/4.webp";
import fiveUrl from "../../assets/blogs/5.webp";
import sixUrl from "../../assets/blogs/6.webp";
import sevenUrl from "../../assets/blogs/7.webp";
import eightUrl from "../../assets/blogs/8.webp";
import nineUrl from "../../assets/blogs/9.webp";
import tenUrl from "../../assets/blogs/10.webp";
import elevenUrl from "../../assets/blogs/11.webp";
import genUrl from "../../assets/blogs/gen.webp";
import { LONG_POSTS } from "./longPosts";
import { GUIDE_POSTS } from "./guidePosts";
import { COMMUNITY_POSTS } from "./communityPosts";
import { POST_FAQS } from "./postFaqs";

// Every post went live on BLOG_PUBLISHED and was last rewritten on BLOG_UPDATED, unless the
// post sets its own dates. Give a post a new `updatedAt` whenever its content really changes.
// Keep BLOG_UPDATED in sync with scripts/routes.mjs.
export const BLOG_PUBLISHED = "2026-01-06";
export const BLOG_UPDATED = "2026-10-31";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  keywords: string;
  summary: string;
  category: "Tips" | "Lifestyle" | "Events";
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  /** A two or three sentence direct answer, shown first: what search snippets and AI assistants quote. */
  answer?: string;
  /** Short factual takeaways, shown as a list under the answer. */
  keyFacts?: string[];
  fullContent: React.ReactNode[];
  /** Long-form body after `fullContent`: each section gets an <h2>; a block is a paragraph or a bullet list. */
  sections?: BlogSection[];
}

export type BlogBlock = React.ReactNode | { list: React.ReactNode[] };
export interface BlogSection {
  heading: string;
  blocks: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to Create the Perfect Seetha Rama Kalyana Matrimony Profile",
    summary:
      "Learn how to make your Seetha Rama Kalyana matrimony profile stand out. Attract genuine matches with honesty, clarity, and a personal touch.",
    category: "Tips",
    slug: "create-perfect-matrimony-profile",
    updatedAt: "2026-11-08",
    keywords:
      "matrimony profile tips, online dating profile, Hindu matrimony profile bio",
    readTime: "5 min read",
    imageUrl: tipsUrl,
    isFeatured: true,
    fullContent: [
      <>
        Your <strong> Seetha Rama Kalyana </strong> matrimony profile is the
        first impression for potential life partners.Ensure it is honest,
        engaging, and reflective of your true self.Avoid vague statements and
        focus on specifics regarding your lifestyle, values, and expectations.
      </>,
      <>
        <strong>Highlight Your Education and Profession: </strong> Clearly
        explain your education, career, and what drives you.Stability and
        ambition are attractive qualities in the Hindu matrimony community.
      </>,
      <>
        <strong>Define Your Partner Preferences Clearly: </strong> Mention the
        qualities you seek realistically, including shared values, goals, or
        lifestyle preferences.Avoid focusing solely on physical attributes.
      </>,
      <>
        <strong>Use High- Quality Photos: </strong> Include 3-5 recent, clear
        photos.A portrait plus pictures of hobbies or interests help potential
        matches understand you better.Avoid heavily filtered images or group
        photos.
      </>,
      <>
        By following these tips, your profile on{" "}
        <strong> Seetha Rama Kalyana </strong> can attract genuine, compatible
        matches efficiently.
      </>,
    ],
  },
  {
    id: 2,
    title: "Discover the Seetha Rama Kalyanam Philosophy for a Divine Match",
    summary:
      "Explore the principles of Seetha Rama Kalyana, emphasizing dharma, mutual respect, and commitment in finding a compatible life partner.",
    category: "Lifestyle",
    slug: "top-10-brahmin-wedding-traditions",
    updatedAt: "2026-11-08",
    keywords:
      "Seetha Rama Kalyanam philosophy, Hindu matrimony values, Dharma in marriage, divine match search, spiritual compatibility, traditional marriage principles, mutual respect in matrimony, Seetha Rama Kalyana lifestyle",
    readTime: "6 min read",
    imageUrl: traditionalUrl,
    fullContent: [
      <>
        The name <strong> Seetha Rama Kalyana </strong> represents a sacred
        union built on commitment, respect, and shared dharma.In modern
        matrimony, this philosophy guides users in finding partners aligned with
        their core values and life purpose.
      </>,
      <>
        <strong>Mutual Respect Matters: </strong> Successful matches focus on
        empathy, maturity, and deep mutual consideration.Look beyond superficial
        attributes when reviewing profiles.
      </>,
      <>
        <strong>Commitment to Shared Dharma: </strong> Marriage is a
        partnership. Define life goals clearly professional, spiritual, and
        familiar and seek someone whose ambitions complement your own.A divine
        match supports each other’s journey toward fulfillment.
      </>,
      <>
        <strong>Patience and Integrity in Search: </strong> Just as the epic
        union of Sita and Rama was virtuous, maintain honesty and patience in
        your profile.Genuine connections built on these principles lead to
        lasting relationships.
      </>,
      <>
        Following the <strong> Seetha Rama Kalyanam </strong> philosophy helps
        Hindu matrimony seekers find truly compatible partners, ensuring
        respect, values, and spiritual alignment in the match.
      </>,
    ],
  },
  {
    id: 3,
    title: "Essential Checklist for Modern Grooms: Beyond the Wedding Day",
    slug: "modern-groom-checklist-india",
    updatedAt: "2026-11-08",
    keywords:
      "Indian groom tips, marriage preparation for men, modern Hindu wedding, life after marriage for men, groom responsibilities",
    summary:
      "A comprehensive guide for the modern Indian man preparing for marriage, focusing on emotional readiness, financial planning, and shared responsibilities.",
    imageUrl: threeUrl,
    category: "Tips",
    readTime: "7 min read",
    fullContent: [
      <>
        The transition from bachelorhood to marriage is a significant milestone.
        For the modern Indian groom, preparation goes beyond choosing the
        perfect sherwani; it involves emotional and mental readiness for a
        shared life.
      </>,
      <>
        <strong>Emotional Intelligence:</strong> A successful marriage thrives
        on communication. Practice active listening and empathy to understand
        your partner's perspectives and aspirations from the very beginning.
      </>,
      <>
        <strong>Financial Transparency:</strong> Discussing finances early is
        crucial. Be open about your savings, investments, and future financial
        goals to build a foundation of trust and security.
      </>,
      <>
        <strong>Shared Responsibilities:</strong> Modern marriages are
        partnerships. Be prepared to share household chores and decision-making,
        ensuring a balanced and supportive environment for both of you.
      </>,
    ],
  },
  {
    id: 4,
    title:
      "Understanding Kundali Matching: Scientific vs. Traditional Perspectives",
    slug: "understanding-kundali-matching-significance",
    updatedAt: "2026-11-08",
    keywords:
      "kundali matching, guna milan significance, Vedic astrology marriage, horoscope compatibility India, ashta koota matching",
    summary:
      "Demystifying horoscope matching (Guna Milan) for the modern generation while respecting Vedic traditions.",
    imageUrl: fourUrl,
    category: "Lifestyle",
    readTime: "9 min read",
    fullContent: [
      <>
        Kundali Matching, or Guna Milan, is a time-honored tradition in Hindu
        matrimony. It is a Vedic astrological method used to check the
        compatibility of two individuals based on their birth charts.
      </>,
      <>
        <strong>The Eight Kootas:</strong> The process involves "Ashta Koota"
        matching, which assesses eight different aspects of life, including
        mental compatibility, health, and temperament.
      </>,
      <>
        <strong>Modern Interpretation:</strong> While many follow these charts
        strictly, many modern couples use Kundali matching as a guide rather
        than a rule, balancing astrological insights with personal understanding
        and values.
      </>,
      <>
        <strong>Beyond the Points:</strong> A high score is auspicious, but
        mutual respect and shared goals remain the ultimate deciders of a happy
        marriage in the <strong>Seetha Rama Kalyana</strong> philosophy.
      </>,
    ],
  },
  {
    id: 5,
    title:
      "Bridging Cultures: Success Tips for Inter-Community Hindu Marriages",
    slug: "inter-community-hindu-marriage-tips",
    updatedAt: "2026-11-08",
    keywords:
      "inter-community marriage, diverse Hindu wedding, cultural integration in marriage, pan-India matrimony, cross-cultural relationship",
    summary:
      "How to celebrate diversity within Hindu traditions when two different linguistic or regional backgrounds come together.",
    imageUrl: fiveUrl,
    category: "Tips",
    readTime: "6 min read",
    fullContent: [
      <>
        India is a land of diverse cultures, and Hindu matrimony often brings
        together individuals from different linguistic and regional backgrounds,
        creating a beautiful blend of traditions.
      </>,
      <>
        <strong>Celebrate Diversity:</strong> View cultural differences as an
        opportunity to learn. Whether it is a difference in cuisine or wedding
        rituals, embrace the uniqueness of your partner's heritage.
      </>,
      <>
        <strong>Open Communication with Families:</strong> Families play a huge
        role in Indian weddings. Facilitate open dialogues between both sides to
        ensure everyone feels respected and included.
      </>,
      <>
        <strong>Creating Your Own Traditions:</strong> While honoring your
        roots, do not be afraid to create new traditions as a couple that
        represent your unique combined identity on{" "}
        <strong>Seetha Rama Kalyana</strong>.
      </>,
    ],
  },
  {
    id: 6,
    title: "5 Red Flags to Watch for When Searching for a Partner Online",
    slug: "online-matrimony-safety-guide",
    updatedAt: "2026-11-08",
    keywords:
      "matrimony safety tips, verify matrimony profile, avoid matrimony fraud, safe online dating India, secure matrimony search",
    summary:
      "Protecting yourself from scammers and fake profiles. Learn how to verify information safely while maintaining privacy.",
    imageUrl: sixUrl,
    category: "Tips",
    readTime: "5 min read",
    fullContent: [
      <>
        While online platforms like <strong>Seetha Rama Kalyana</strong> make
        finding a partner easier, your safety should always be a top priority.
        Being vigilant helps ensure a secure experience.
      </>,
      <>
        <strong>Verify Before You Trust:</strong> Take your time to verify the
        details provided in a profile. Do not hesitate to ask for professional
        background or social media links to confirm authenticity.
      </>,
      <>
        <strong>Protect Your Privacy:</strong> Avoid sharing sensitive financial
        information or exact home addresses in the early stages. Keep your
        interactions within the platform’s secure messaging.
      </>,
      <>
        <strong>Meet in Public Places:</strong> When you decide to meet in
        person, always choose a busy public location and inform a family member
        or friend about your plans.
      </>,
    ],
  },
  {
    id: 7,
    title: "Sacred Steps: The Deep Meaning Behind the Saptapadi",
    slug: "meaning-of-saptapadi-seven-vows",
    updatedAt: "2026-11-08",
    keywords:
      "saptapadi meaning, seven vows of Hindu marriage, Hindu wedding rituals explained, sacred marriage vows, saat phere significance",
    summary:
      "Explaining the seven vows of a Hindu marriage and how they apply to modern couples today.",
    imageUrl: sevenUrl,
    category: "Lifestyle",
    readTime: "8 min read",
    fullContent: [
      <>
        The Saptapadi, or the Seven Steps, is perhaps the most important ritual
        in a Hindu wedding. It represents the legal and spiritual completion of
        the marriage union.
      </>,
      <>
        <strong>The Seven Vows:</strong> Each step around the sacred fire (Agni)
        corresponds to a vow, ranging from providing for the family and
        maintaining health to remaining lifelong friends.
      </>,
      <>
        <strong>The Spiritual Bond:</strong> These steps signify that the couple
        is no longer two individuals but a single entity moving forward in
        life’s journey together, guided by dharma.
      </>,
      <>
        <strong>Universal Essence:</strong> Whether it is called Saptapadi in
        the South or Saat Phere in the North, the core essence of commitment and
        mutual support remains the same.
      </>,
    ],
  },
  {
    id: 8,
    title:
      "First Call Jitters? 10 Meaningful Questions to Ask Your Potential Match",
    slug: "questions-to-ask-matrimony-match",
    updatedAt: "2026-11-08",
    keywords:
      "first call matrimony questions, deep conversation starters for marriage, understanding partner compatibility, matrimony talk tips",
    summary:
      "Move beyond small talk with these deep, value-based questions to understand compatibility during your first interaction.",
    imageUrl: eightUrl,
    category: "Tips",
    readTime: "6 min read",
    fullContent: [
      <>
        The first few conversations with a potential match are vital. Moving
        beyond small talk helps you gauge if your core values and long-term
        goals truly align.
      </>,
      <>
        <strong>Focus on Values:</strong> Ask questions about their views on
        family, career growth, and how they handle challenges. This provides
        deeper insight than just discussing hobbies.
      </>,
      <>
        <strong>Future Aspirations:</strong> Discuss where you see yourselves in
        five to ten years. Understanding each other's professional ambitions is
        key to a supportive partnership.
      </>,
      <>
        <strong>Conflict Resolution:</strong> Gently ask how they prefer to
        handle disagreements. A partner who values calm discussion over heated
        arguments is essential for a peaceful home life.
      </>,
    ],
  },
  {
    id: 9,
    title: "Supporting Ambition: How Modern Couples Balance Two Careers",
    slug: "career-and-marriage-balance",
    updatedAt: "2026-11-08",
    keywords:
      "working couples India, balancing career and marriage, dual-income households, supportive life partner, career growth marriage",
    summary:
      "Advice for ambitious professionals on finding a partner who supports their career growth and shares domestic responsibilities.",
    imageUrl: nineUrl,
    category: "Lifestyle",
    readTime: "7 min read",
    fullContent: [
      <>
        In today’s fast-paced world, many couples are ambitious professionals.
        Balancing two careers with a fulfilling marriage requires planning and
        mutual respect.
      </>,
      <>
        <strong>Supporting Ambition:</strong> A divine match involves two people
        who champion each other's dreams. Celebrate your partner's successes and
        provide a support system during stressful periods.
      </>,
      <>
        <strong>Time Management:</strong> Quality over quantity. Dedicate
        specific "no-tech" times to reconnect with your spouse, ensuring work
        stress does not bleed into your personal sanctuary.
      </>,
      <>
        <strong>Flexible Roles:</strong> Be willing to adjust household
        responsibilities based on workload. Flexibility is the secret to harmony
        in the <strong>Seetha Rama Kalyana</strong> lifestyle.
      </>,
    ],
  },
  {
    id: 10,
    title: "The Family's Role in Modern Arranged Marriages",
    slug: "family-role-modern-arranged-marriage",
    updatedAt: "2026-11-08",
    keywords:
      "parents role in matrimony, modern arranged marriage India, family involvement in wedding, choosing a life partner",
    summary:
      "How to involve parents and relatives in your search while maintaining personal autonomy and choice.",
    imageUrl: tenUrl,
    category: "Tips",
    readTime: "6 min read",
    fullContent: [
      <>
        The concept of arranged marriage has evolved. Today, it is a
        collaborative effort between the individual and their family, blending
        traditional wisdom with personal choice.
      </>,
      <>
        <strong>Guidance, Not Control:</strong> Families offer a wealth of
        experience and can help filter matches based on long-term compatibility.
        Use their insights as a foundation for your decision.
      </>,
      <>
        <strong>Setting Boundaries:</strong> Clearly communicate your
        deal-breakers and preferences to your family. This ensures they are
        looking for the same qualities you are, reducing friction.
      </>,
      <>
        <strong>The Joint Support System:</strong> In India, marriage is a union
        of families. Building a strong bond between families early on provides a
        massive emotional safety net for the couple.
      </>,
    ],
  },
  {
    id: 11,
    title: "Top 5 Budget-Friendly Destination Wedding Locations in India",
    slug: "budget-destination-weddings-india",
    updatedAt: "2026-11-08",
    keywords:
      "destination wedding India, budget wedding locations, unique wedding venues India, Indian wedding planning, affordable wedding spots",
    summary:
      "Discover stunning and affordable locations across India to host your dream wedding without overspending.",
    imageUrl: elevenUrl,
    category: "Events",
    readTime: "10 min read",
    fullContent: [
      <>
        A destination wedding does not always require a palace. India offers
        breathtaking hidden gems that provide a royal feel on a realistic
        budget.
      </>,
      <>
        <strong>Rishikesh & Jim Corbett:</strong> For couples seeking spiritual
        or nature-inspired vibes, these locations offer stunning riverbanks and
        forest resorts at competitive rates.
      </>,
      <>
        <strong>Pondicherry:</strong> With its French colonial charm and quiet
        beaches, Pondicherry is perfect for an intimate, elegant, and
        cost-effective coastal wedding.
      </>,
      <>
        <strong>Jaipur (Off-season):</strong> You can still have a royal haveli
        wedding by choosing dates in the shoulder seasons, allowing you to
        access premium venues at a fraction of the cost.
      </>,
    ],
  },
  {
    id: 12,
    title: "Financial Harmony: Why Couples Should Talk About Money",
    slug: "financial-planning-for-newly-married-couples",
    updatedAt: "2026-11-08",
    keywords:
      "marriage financial planning, Indian couples money management, pre-marriage financial talk, financial compatibility",
    summary:
      "A guide on discussing debt, savings, and investments with your future partner to ensure a stress-free start.",
    imageUrl: genUrl,
    category: "Tips",
    readTime: "8 min read",
    fullContent: [
      <>
        While it may seem unromantic, financial compatibility is a pillar of a
        lasting marriage. Discussing money early prevents future
        misunderstandings.
      </>,
      <>
        <strong>Disclosure of Assets and Debts:</strong> Be honest about your
        current financial standing, including loans and savings. This
        transparency builds the bedrock of trust.
      </>,
      <>
        <strong>Defining Financial Goals:</strong> Aligning your investment
        strategies early, whether it is buying a home or traveling, ensures you
        are moving in the same direction.
      </>,
      <>
        <strong>The "Money Date":</strong> Set a monthly habit to review
        finances together. Treat it as a team meeting where you both work toward
        a prosperous future on your journey together.
      </>,
    ],
  },
  {
    id: 13,
    title:
      "Why Seetha Rama Kalyana is the Top Matrimony Site for Global Indians",
    slug: "top-matrimony-site-global-indians",
    updatedAt: "2026-11-08",
    keywords:
      "top matrimony site, best matrimony website India, trusted matrimony services, top rated marriage sites, Seetha Rama Kalyana reviews",
    summary:
      "Discover why thousands of families trust Seetha Rama Kalyana as the top matrimony site for finding compatible life partners with verified profiles.",
    category: "Tips",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        Finding a partner online requires a platform that balances technology
        with tradition. <strong>Seetha Rama Kalyana</strong> has emerged as a{" "}
        <strong>top matrimony site</strong> by prioritizing user security and
        cultural alignment.
      </>,
      <>
        <strong>Strict Verification:</strong> Unlike other platforms, we
        manually verify profiles to ensure you are connecting with genuine
        individuals. This commitment to safety makes us the{" "}
        <strong>best matrimony website</strong> for serious seekers.
      </>,
      <>
        <strong>Advanced Compatibility Filters:</strong> Our algorithm doesn't
        just look at age and location; it considers lifestyle, values, and
        family backgrounds, cementing our status as a{" "}
        <strong>trusted matrimony service</strong>.
      </>,
      <>
        Join the community today and see why we are consistently ranked among
        the <strong>top rated marriage sites</strong> for the modern Hindu
        diaspora.
      </>,
    ],
  },
  {
    id: 14,
    title:
      "The Ultimate Guide to Brahmin Matrimony: Finding Your Perfect Match",
    slug: "brahmin-matrimony-guide-perfect-match",
    updatedAt: "2026-11-08",
    keywords:
      "Brahmin matrimony, best Brahmin marriage site, Brahmin bride and groom, Iyer matrimony, Iyengar matrimony, Kannada Brahmin matrimony",
    summary:
      "Explore the nuances of Brahmin matrimony and learn how to find matches that respect sub-sect traditions, Gothras, and Vedic values.",
    category: "Lifestyle",
    readTime: "8 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        Brahmin weddings are deeply rooted in Vedic traditions.{" "}
        <strong>Brahmin matrimony</strong> on our platform is designed to help
        you find partners who understand the sanctity of Gothras and Pravaras.
      </>,
      <>
        <strong>Sub-sect Specificity:</strong> Whether you are looking for{" "}
        <strong>Iyer matrimony</strong>, <strong>Iyengar matrimony</strong>, or{" "}
        <strong>Kannada Brahmin matrimony</strong>, our filters allow you to
        narrow down choices with precision.
      </>,
      <>
        <strong>Gothra and Horoscope:</strong> We understand that for many
        families, Gothra matching and horoscope compatibility are
        non-negotiable. Our platform simplifies this search for every{" "}
        <strong>Brahmin bride and groom</strong>.
      </>,
      <>
        By blending ancient values with modern convenience, we provide the{" "}
        <strong>best Brahmin marriage site</strong> experience for families
        worldwide.
      </>,
    ],
  },
  {
    id: 15,
    title: "10 Reasons to Choose a Trusted Hindu Matrimony Platform",
    slug: "reasons-to-choose-trusted-hindu-matrimony",
    updatedAt: "2026-11-08",
    keywords:
      "trusted Hindu matrimony, safe marriage site, Indian matrimony services, best site for Hindu wedding, matrimonial profile safety",
    summary:
      "In a world of unlimited choices, here is why choosing a specialized and trusted Hindu matrimony platform is essential for your partner search.",
    category: "Tips",
    readTime: "5 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        When it comes to marriage, security is paramount. A{" "}
        <strong>trusted Hindu matrimony</strong> platform like{" "}
        <strong>Seetha Rama Kalyana</strong> offers peace of mind through a
        community-centric approach.
      </>,
      <>
        <strong>Cultural Nuance:</strong> General dating apps often miss the
        importance of family involvement and religious rituals. We are built
        specifically as the <strong>best site for Hindu weddings</strong> and
        family unions.
      </>,
      <>
        <strong>Profile Authenticity:</strong> Our team works tirelessly to
        eliminate fake accounts, ensuring that your{" "}
        <strong>Indian matrimony services</strong> experience is productive and
        safe.
      </>,
      <>
        Focus your energy on building connections rather than worrying about
        authenticity on our <strong>safe marriage site</strong>.
      </>,
    ],
  },
  {
    id: 16,
    title: "Understanding Gothras in Brahmin Matrimony: Why it Matters",
    slug: "understanding-gothras-brahmin-matrimony",
    updatedAt: "2026-11-08",
    keywords:
      "Gothra significance, same Gothra marriage, Brahmin Gothra list, marriage within Gothra, Brahmin wedding traditions",
    summary:
      "A deep dive into the significance of Gothras in Brahmin weddings and why it remains a key factor in choosing a life partner.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        In <strong>Brahmin matrimony</strong>, the Gothra represents the lineage
        or the root of a family. Traditionally,{" "}
        <strong>same Gothra marriage</strong> (Sagotra) is avoided to maintain
        genetic health and lineage purity.
      </>,
      <>
        <strong>The Lineage of Sages:</strong> Every Brahmin family traces its
        roots back to one of the seven sages (Saptarishis). Understanding your{" "}
        <strong>Brahmin Gothra list</strong> helps in ensuring a compatible and
        traditional union.
      </>,
      <>
        <strong>Modern Scientific Perspective:</strong> Interestingly, the
        ancient rule against <strong>marriage within Gothra</strong> aligns with
        modern genetics regarding the avoidance of consanguineous marriages.
      </>,
      <>
        At <strong>Seetha Rama Kalyana</strong>, we make it easy to filter
        profiles based on Gothra, respecting this core tenet of{" "}
        <strong>Brahmin wedding traditions</strong>.
      </>,
    ],
  },
  {
    id: 26,
    title: "Kannada Matrimony: Traditional Values in a Modern World",
    slug: "kannada-matrimony-traditions-modern-world",
    updatedAt: "2026-11-08",
    keywords:
      "Kannada matrimony, Karnataka Brahmin marriage, Kannada bride and groom, Madhwa matrimony, Smartha matrimony",
    summary:
      "Discover how Kannada matrimony blends deep-rooted cultural values with modern lifestyle preferences for Karnataka-based families.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Kannada matrimony</strong> is a beautiful confluence of
        simplicity and tradition. Whether you belong to the{" "}
        <strong>Madhwa</strong> or <strong>Smartha</strong> communities, finding
        a partner who understands your heritage is essential.
      </>,
      <>
        In Karnataka, marriage is not just a union of two people but a
        celebration involving the extended family. Our platform specializes in{" "}
        <strong>Karnataka Brahmin marriage</strong>, ensuring that Gothra and
        family lineage are respected.
      </>,
      <>
        From the simple 'Kashi Yatra' to the joyous 'Dhareherdu,' we help you
        find a <strong>Kannada bride or groom</strong> who values these rituals
        as much as you do.
      </>,
      <>
        Join <strong>Seetha Rama Kalyana</strong> to explore verified profiles
        within the Kannada-speaking community worldwide.
      </>,
    ],
  },
  {
    id: 27,
    title: "Telugu Brahmin Matrimony: Finding Harmony in Traditions",
    slug: "telugu-brahmin-matrimony-traditions",
    updatedAt: "2026-11-08",
    keywords:
      "Telugu Brahmin matrimony, Telugu marriage rituals, Niyogi Brahmin matrimony, Vaidiki Brahmin bride, Telugu wedding traditions",
    summary:
      "A guide to Telugu Brahmin weddings, focusing on the significance of rituals like Jeelakarra Bellam and finding compatible matches.",
    category: "Lifestyle",
    readTime: "8 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        The Telugu wedding is a vibrant affair, often lasting several days.{" "}
        <strong>Telugu Brahmin matrimony</strong> requires a deep understanding
        of sub-sects like <strong>Niyogi</strong> and <strong>Vaidiki</strong>.
      </>,
      <>
        We provide a dedicated space for those seeking a{" "}
        <strong>Vaidiki Brahmin bride</strong> or a Niyogi groom, making the
        search for <strong>Telugu marriage rituals</strong> compatibility much
        easier.
      </>,
      <>
        One of the most sacred moments is the 'Jeelakarra Bellam,' signifying
        the inseparable bond between the couple. Our filters help you find
        someone who cherishes these <strong>Telugu wedding traditions</strong>.
      </>,
      <>
        Start your journey on the most trusted site for Telugu-speaking Hindu
        families today.
      </>,
    ],
  },
  {
    id: 28,
    title: "Tamil Matrimony: Exploring the Grace of Iyer and Iyengar Weddings",
    slug: "tamil-matrimony-iyer-iyengar-weddings",
    updatedAt: "2026-11-08",
    keywords:
      "Tamil matrimony, Iyer matrimony, Iyengar matrimony, Tamil Brahmin bride, Tamil wedding rituals, Chennai matrimony",
    summary:
      "Deep dive into Tamil Brahmin matrimony, focusing on the distinct cultures of Iyer and Iyengar communities and their sacred wedding rites.",
    category: "Lifestyle",
    readTime: "8 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        Tamil weddings are known for their elegance and adherence to Vedic
        rites. <strong>Tamil matrimony</strong> on our platform caters
        specifically to the unique needs of the <strong>Iyer</strong> and{" "}
        <strong>Iyengar</strong> communities.
      </>,
      <>
        Finding a <strong>Tamil Brahmin bride</strong> involves looking for
        shared cultural markers, from the love for Carnatic music to the strict
        observance of 'Madi' and 'Acharam.'
      </>,
      <>
        Rituals like 'Oonjal' (the swing ceremony) and 'Kanyadaan' are handled
        with great sanctity. We simplify your <strong>Chennai matrimony</strong>{" "}
        search by focusing on community-specific values.
      </>,
      <>
        Connect with verified Tamil Brahmin profiles globally through our
        specialized search features.
      </>,
    ],
  },
  {
    id: 29,
    title: "North Indian Pandit Matrimony: Sacred Rituals and Global Matches",
    slug: "north-indian-pandit-matrimony-rituals",
    updatedAt: "2026-11-08",
    keywords:
      "Pandit matrimony, North Indian Brahmin marriage, Kashmiri Pandit matrimony, Saraswat Brahmin bride, Kanya Pujan traditions",
    summary:
      "Understanding the unique customs of North Indian Pandit communities and how to find a match that respects ancestral traditions.",
    category: "Lifestyle",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Pandit matrimony</strong> covers a vast geographic area, from
        the valleys of Kashmir to the plains of Uttar Pradesh.{" "}
        <strong>North Indian Brahmin marriage</strong> is built on the
        foundation of shared Kuldevi and Kuldevta worship.
      </>,
      <>
        Whether you are searching for a <strong>Kashmiri Pandit</strong> match
        or a <strong>Saraswat Brahmin bride</strong>, our platform offers the
        filters you need to maintain your family's Vedic lineage.
      </>,
      <>
        Rituals like 'Sagan' and 'Jago' add a unique flavor to these weddings.
        We help families navigate these <strong>Kanya Pujan traditions</strong>{" "}
        to find the most compatible life partners.
      </>,
      <>
        Trust <strong>Seetha Rama Kalyana</strong> to bring traditional North
        Indian families together.
      </>,
    ],
  },
  {
    id: 30,
    title: "The Importance of Language in Matrimony: Why Mother Tongue Matters",
    slug: "importance-of-mother-tongue-in-matrimony",
    updatedAt: "2026-11-08",
    keywords:
      "matrimony by language, mother tongue marriage, importance of native language, linguistic compatibility in marriage",
    summary:
      "Why sharing a mother tongue can lead to better emotional connection and easier cultural integration for newly married couples.",
    category: "Tips",
    readTime: "5 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        While love knows no boundaries,{" "}
        <strong>linguistic compatibility in marriage</strong> often provides a
        smoother path for emotional bonding and family integration.
      </>,
      <>
        Sharing a mother tongue means sharing jokes, lullabies, and nuances that
        are often lost in translation. <strong>Matrimony by language</strong>{" "}
        allows for a deeper level of comfort between the couple and their
        respective families.
      </>,
      <>
        When you search for a partner based on{" "}
        <strong>mother tongue marriage</strong>, you are often also searching
        for shared dietary habits and festivals, which reduces friction in daily
        life.
      </>,
      <>
        Our platform allows you to filter by{" "}
        <strong>Kannada, Tamil, Telugu, Hindi, and Marathi</strong>, ensuring
        your cultural roots remain strong.
      </>,
    ],
  },
  {
    id: 31,
    title: "Kerala Brahmin Matrimony: The Unique Traditions of Namboothiris",
    slug: "kerala-brahmin-matrimony-namboothiri-traditions",
    updatedAt: "2026-11-08",
    keywords:
      "Kerala Brahmin matrimony, Namboothiri marriage, Kerala wedding rituals, Malayalam matrimony, Palakkad Iyer matrimony",
    summary:
      "Explore the serene and deeply spiritual world of Kerala Brahmin weddings, from Namboothiri customs to Palakkad Iyer traditions.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Kerala Brahmin matrimony</strong> is distinct for its simplicity
        and focus on temple-based rituals. The{" "}
        <strong>Namboothiri marriage</strong> customs are among the oldest
        surviving Vedic traditions in India.
      </>,
      <>
        For those in the <strong>Palakkad Iyer</strong> community, the culture
        is a beautiful mix of Tamil and Kerala traditions. Finding a partner
        through <strong>Malayalam matrimony</strong> requires a focus on these
        unique regional blends.
      </>,
      <>
        From 'Veli' to 'Thalikettu,' <strong>Kerala wedding rituals</strong>{" "}
        emphasize the spiritual growth of the couple. We help you find a partner
        who values this tranquil lifestyle.
      </>,
      <>
        Join our community to find your divine match within the Kerala Brahmin
        diaspora.
      </>,
    ],
  },
  {
    id: 32,
    title: "Marathi Brahmin Matrimony: From Peshwa Legacy to Modern Unions",
    slug: "marathi-brahmin-matrimony-peshwa-legacy",
    updatedAt: "2026-11-08",
    keywords:
      "Marathi Brahmin matrimony, Deshastha Brahmin marriage, Kokanastha Brahmin bride, Marathi wedding rituals, Pune matrimony",
    summary:
      "Focusing on the intellectual and cultural richness of Marathi Brahmin communities like Deshastha and Kokanastha.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Marathi Brahmin matrimony</strong> is characterized by an
        emphasis on education, culture, and 'Sanskriti.' Whether you are a{" "}
        <strong>Deshastha</strong>, <strong>Kokanastha</strong>, or{" "}
        <strong>Karhade</strong> Brahmin, your search is highly specific.
      </>,
      <>
        Finding a <strong>Kokanastha Brahmin bride</strong> or groom often
        involves looking for a partner who values the intellectual heritage of
        Maharashtra. Our <strong>Pune matrimony</strong> focus ensures you find
        matches from the heart of the community.
      </>,
      <>
        Rituals like 'Sakharpuda' and 'Antarpat' are central to{" "}
        <strong>Marathi wedding rituals</strong>. We make it easy to find a
        partner who will walk the 'Saptapadi' with you in true Maharashtrian
        style.
      </>,
      <>
        Register today to find your Marathi-speaking soulmate on{" "}
        <strong>Seetha Rama Kalyana</strong>.
      </>,
    ],
  },
  {
    id: 33,
    title: "Rajput Matrimony: Honoring the Legacy of Valor and Tradition",
    slug: "rajput-matrimony-traditions-legacy",
    updatedAt: "2026-11-08",
    keywords:
      "Rajput matrimony, Rajput wedding rituals, Thakur marriage, Rajput bride and groom, Kshatriya matrimony",
    summary:
      "Explore the grand traditions of Rajput weddings, focusing on the cultural values that define this vibrant community.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Rajput matrimony</strong> is synonymous with grandeur and a deep
        respect for ancestral lineage. Finding a{" "}
        <strong>Rajput bride or groom</strong> involves matching not just
        horoscopes, but family values and heritage.
      </>,
      <>
        Rituals like 'Tilak' and 'Bann-Goro' are central to{" "}
        <strong>Rajput wedding rituals</strong>. Our platform allows{" "}
        <strong>Thakur</strong> and other Rajput sub-clans to find matches that
        honor their history.
      </>,
      <>
        Whether you are looking for a partner within Rajasthan or the global
        Rajput diaspora, <strong>Seetha Rama Kalyana</strong> provides a secure
        environment for <strong>Kshatriya matrimony</strong>.
      </>,
    ],
  },
  {
    id: 34,
    title: "Aggarwal and Baniya Matrimony: Success through Shared Values",
    slug: "aggarwal-baniya-matrimony-success",
    updatedAt: "2026-11-08",
    keywords:
      "Aggarwal matrimony, Baniya marriage site, Gupta matrimony, Jain Baniya wedding, business community matrimony",
    summary:
      "Why the Aggarwal and Baniya communities prioritize business ethics and family stability in their partner search.",
    category: "Lifestyle",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        The <strong>Aggarwal matrimony</strong> search is often focused on
        finding a partner with a similar entrepreneurial spirit and strong
        family orientation.
      </>,
      <>
        Our <strong>Baniya marriage site</strong> features allow families to
        filter by sub-sects like <strong>Gupta, Garg, and Bansal</strong>,
        ensuring that traditional 'Gotra' rules are followed while seeking
        modern compatibility.
      </>,
      <>
        From grand 'Sangeet' ceremonies to the sacred 'Pheras,' we support the
        unique <strong>Jain Baniya wedding</strong> traditions that bring
        successful families together.
      </>,
    ],
  },
  {
    id: 35,
    title: "Lingayat Matrimony: The Path of Simple and Sacred Unions",
    slug: "lingayat-matrimony-traditions-karnataka",
    updatedAt: "2026-11-08",
    keywords:
      "Lingayat matrimony, Lingayat wedding rituals, Veerashaiva marriage, Karnataka Lingayat bride, Shiva marriage traditions",
    summary:
      "Understanding the unique, non-Vedic yet deeply spiritual traditions of Lingayat weddings in Karnataka.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Lingayat matrimony</strong> is unique in its focus on equality
        and the worship of Ishtalinga. A <strong>Veerashaiva marriage</strong>{" "}
        is often a simple yet profound spiritual event.
      </>,
      <>
        For those seeking a <strong>Karnataka Lingayat bride</strong> or groom,
        our platform offers specialized filters to connect with families who
        follow the teachings of Basavanna.
      </>,
      <>
        We respect the specific <strong>Shiva marriage traditions</strong>, such
        as the absence of a fire-ritual in some sub-sects, making us a trusted
        space for the community.
      </>,
    ],
  },
  {
    id: 36,
    title: "Jat Matrimony: Culture, Community, and Compatibility",
    slug: "jat-matrimony-search-traditions",
    updatedAt: "2026-11-08",
    keywords:
      "Jat matrimony, Jat wedding customs, Haryanvi Jat marriage, Punjabi Jat bride, Jat community matchmaking",
    summary:
      "Focusing on the strong community bonds and cultural pride of the Jat community across Haryana, Punjab, and UP.",
    category: "Lifestyle",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Jat matrimony</strong> is built on the pillars of strength, land
        heritage, and community loyalty. Whether you are looking for a{" "}
        <strong>Haryanvi Jat marriage</strong> or a{" "}
        <strong>Punjabi Jat bride</strong>, lineage (Gotra) plays a vital role.
      </>,
      <>
        Our platform simplifies <strong>Jat community matchmaking</strong> by
        allowing users to skip the 4-Gotra rule commonly followed in the
        community to find the perfect compatible match.
      </>,
      <>
        Experience a transparent search process that respects the bold and
        beautiful <strong>Jat wedding customs</strong>.
      </>,
    ],
  },
  {
    id: 37,
    title: "Yadav Matrimony: Heritage of the Yaduvanshi Lineage",
    slug: "yadav-matrimony-heritage-lineage",
    updatedAt: "2026-11-08",
    keywords:
      "Yadav matrimony, Yaduvanshi marriage, Ahir community wedding, Yadav bride and groom, North Indian Yadav matrimony",
    summary:
      "Connecting Yaduvanshi families across India to find partners who share their proud cultural and historical roots.",
    category: "Lifestyle",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        With a population spread across India, <strong>Yadav matrimony</strong>{" "}
        is one of our most active segments. We help <strong>Yaduvanshi</strong>{" "}
        families find matches that align with their social and cultural values.
      </>,
      <>
        From UP and Bihar to Haryana and the South, finding a{" "}
        <strong>Yadav bride or groom</strong> is made easier through our
        regional and sub-caste filters.
      </>,
      <>
        We honor the <strong>Ahir community wedding</strong> traditions,
        ensuring that your search for a life partner is both modern and rooted
        in tradition.
      </>,
    ],
  },
  {
    id: 38,
    title: "Maratha Matrimony: Celebrating the Royal Heritage of Maharashtra",
    slug: "maratha-matrimony-maharashtra-traditions",
    updatedAt: "2026-11-08",
    keywords:
      "Maratha matrimony, Maratha 96 Kuli, Maratha wedding rituals, Mumbai matrimony, Marathi Kshatriya marriage",
    summary:
      "A guide for the Maratha community to find matches within the 96 Kuli and other lineages with ease.",
    category: "Lifestyle",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Maratha matrimony</strong> is deeply connected to the history of
        Maharashtra. For families seeking a <strong>Maratha 96 Kuli</strong>{" "}
        match, verification and lineage are the top priorities.
      </>,
      <>
        Our <strong>Mumbai matrimony</strong> and Pune-focused filters help you
        connect with <strong>Marathi Kshatriya marriage</strong> seekers who
        value tradition and professional success equally.
      </>,
      <>
        Celebrate your union with <strong>Maratha wedding rituals</strong> like
        'Simant Pujan' by finding the right partner on Seetha Rama Kalyana.
      </>,
    ],
  },
  {
    id: 39,
    title: "The Vivaha of Rama and Seetha: The Blueprint for a Perfect Union",
    slug: "rama-seetha-marriage-blueprint",
    updatedAt: "2026-11-08",
    keywords:
      "Rama Seetha marriage story, ideal Hindu couple, lessons from Ramayana marriage, divine union Rama Sita",
    summary:
      "Why the marriage of Lord Rama and Mother Seetha remains the ultimate inspiration for every Hindu couple seeking a lasting bond.",
    category: "Lifestyle",
    readTime: "8 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        The <strong>Rama Seetha marriage story</strong> is not just an ancient
        epic; it is a guidebook for modern relationships. Their union represents
        the perfect balance of Dharma and love.
      </>,
      <>
        As the <strong>ideal Hindu couple</strong>, they showed that a
        successful marriage is built on mutual sacrifice and unwavering trust,
        even in the face of immense challenges.
      </>,
      <>
        By naming our platform <strong>Seetha Rama Kalyana</strong>, we aim to
        bring a touch of this <strong>divine union</strong> to every profile we
        host.
      </>,
    ],
  },
  {
    id: 41,
    title: "The Symbolism of Vivaha Panchami in Hindu Matrimony",
    slug: "vivaha-panchami-significance-marriage",
    updatedAt: "2026-11-08",
    keywords:
      "Vivaha Panchami, Rama Sita wedding date, auspicious marriage dates, Hindu wedding calendar",
    summary:
      "Exploring the significance of Vivaha Panchami, the day Lord Rama and Seetha were married, and why it's auspicious for new beginnings.",
    category: "Events",
    readTime: "5 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        <strong>Vivaha Panchami</strong> celebrates the day of the{" "}
        <strong>Rama Sita wedding</strong>. It is one of the most{" "}
        <strong>auspicious marriage dates</strong> in the{" "}
        <strong>Hindu wedding calendar</strong>.
      </>,
      <>
        This day serves as a reminder that a 'Kalyana' (marriage) is a sacred
        event that brings two families and two souls together for lifetimes.
      </>,
      <>
        Whether you marry on this date or any other, let the spirit of Seetha
        Rama guide your <strong>Kalyana</strong> journey.
      </>,
    ],
  },
  {
    id: 44,
    title: "Top 10 Tips to Find Your Match on an Indian Matrimony Site",
    slug: "top-tips-find-match-indian-matrimony",
    updatedAt: "2026-11-08",
    keywords:
      "how to find life partner online, matrimony search tips, successful marriage search, best way to use matrimony sites",
    summary:
      "A masterclass in navigating Indian matrimony sites to move from 'Searching' to 'Married' within a year.",
    category: "Tips",
    readTime: "7 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        If you're wondering <strong>how to find a life partner online</strong>{" "}
        effectively, consistency is key. Set aside 15 minutes a day to review
        new matches and respond to interests.
      </>,
      <>
        Use <strong>matrimony search tips</strong> like updating your photos
        every 6 months and being specific about your 'Partner Preferences' to
        see a 300% increase in profile views.
      </>,
      <>
        The <strong>best way to use matrimony sites</strong> is to be proactive.
        Don't just wait for interests; send them to profiles that align with
        your values.
      </>,
    ],
  },
  {
    id: 45,
    title: "Marriage Bureau vs. Matrimony Apps: Which One is Right for You?",
    slug: "marriage-bureau-vs-matrimony-apps",
    updatedAt: "2026-11-08",
    keywords:
      "marriage bureau near me, online matrimony vs traditional, finding match through agent, modern matrimonial services",
    summary:
      "Comparing the personal touch of a marriage bureau with the global reach and speed of a matrimony app.",
    category: "Tips",
    readTime: "6 min read",
    imageUrl: genUrl,
    fullContent: [
      <>
        Many families still search for a{" "}
        <strong>marriage bureau near me</strong>, but the limitations of local
        agents are clear: limited database and high commission fees.
      </>,
      <>
        <strong>Online matrimony vs traditional</strong> bureaus: Our platform
        offers the best of both. You get the{" "}
        <strong>modern matrimonial services</strong> reach of a global app with
        the community trust of a traditional bureau.
      </>,
      <>
        By moving your search to <strong>Seetha Rama Kalyana</strong>, you
        access thousands of profiles that a local agent could never show you.
      </>,
    ],
  },
  {
    id: 48,
    title: "From Profile to Wedding in Six Months: A Practical Plan",
    slug: "matrimony-success-stories-within-6-months",
    updatedAt: "2026-11-08",
    keywords:
      "find a match quickly, matrimony search plan, how long to find a match, arranged marriage timeline, matrimony tips",
    summary:
      "A month-by-month plan for families who want to move from creating a matrimony profile to a confirmed alliance within about six months.",
    category: "Tips",
    readTime: "7 min read",
    imageUrl: genUrl,
    answer:
      "Six months is realistic when the profile is complete in the first week, you send and answer interests every week, horoscopes are matched before meetings, and the family agrees on non-negotiables early. Most delays come from incomplete profiles and slow replies.",
    keyFacts: [
      "Month 1: complete profile, recent photos, horoscope details and clear partner preferences.",
      "Months 2 and 3: send interests weekly, reply within a few days, and shortlist after kundli matching.",
      "Months 3 and 4: family calls and first meetings with shortlisted matches.",
      "Months 5 and 6: second meetings, family visits and a decision.",
    ],
    fullContent: [
      <>
        There is no guaranteed timeline for finding a life partner, but
        families who follow a simple plan usually move much faster than those
        who wait for the right profile to appear.
      </>,
      <>
        <strong>Month 1, get the profile right:</strong> fill every section,
        add three to five recent photos, and enter the birth details needed
        for horoscope matching. Write partner preferences that reflect what
        truly matters, not a long wish list.
      </>,
      <>
        <strong>Months 2 and 3, stay active:</strong> send a few interests
        every week and reply to the ones you receive within a few days. Use{" "}
        <strong>kundli matching</strong> and community filters to shortlist
        before anyone gets on a call.
      </>,
      <>
        <strong>Months 3 and 4, talk and meet:</strong> start with a family
        call, then a first meeting. Prepare a few honest questions about
        career plans, where you will live and expectations from each family.
      </>,
      <>
        <strong>Months 5 and 6, decide:</strong> second meetings and family
        visits help both sides decide with confidence. If a match is not
        right, say so politely and keep the search going.
      </>,
      <>
        On <strong>Seetha Rama Kalyana</strong>, verified profiles and privacy
        controls keep the search focused on families who fit your preferences,
        so your time goes into conversations that matter.
      </>,
    ],
  },
];

// Long-form rewrites replace the short originals (see longPosts.tsx).
const REWRITES = { ...LONG_POSTS, ...GUIDE_POSTS, ...COMMUNITY_POSTS };
// Titles kept under ~60 characters so Google shows them in full.
const SHORT_TITLES: Record<string, string> = {
  "aggarwal-baniya-matrimony-success": "Agarwal and Baniya Matrimony: Gotras and Traditions",
  "brahmin-matrimony-guide-perfect-match": "Brahmin Matrimony: A Guide to Finding the Right Match",
  "create-perfect-matrimony-profile": "How to Create a Matrimony Profile That Gets Noticed",
  "importance-of-mother-tongue-in-matrimony": "Why Mother Tongue Matters in Matrimony",
  "inter-community-hindu-marriage-tips": "Inter-Community Hindu Marriage: Tips for Families",
  "jat-matrimony-search-traditions": "Jat Matrimony: Gotra Rules and Wedding Customs",
  "kerala-brahmin-matrimony-namboothiri-traditions": "Namboothiri Matrimony: Kerala Brahmin Traditions",
  "marathi-brahmin-matrimony-peshwa-legacy": "Marathi Brahmin Matrimony: Traditions and Matchmaking",
  "marriage-bureau-vs-matrimony-apps": "Marriage Bureau vs Matrimony Apps: Which Is Better?",
  "north-indian-pandit-matrimony-rituals": "North Indian Brahmin Weddings: Rituals and Matchmaking",
  "questions-to-ask-matrimony-match": "Questions to Ask a Potential Match Before Marriage",
  "tamil-matrimony-iyer-iyengar-weddings": "Tamil Brahmin Weddings: Iyer and Iyengar Traditions",
  "understanding-kundali-matching-significance": "Kundli Matching Explained: 36 Gunas, Doshas, Poruthams",
  "yadav-matrimony-heritage-lineage": "Yadav Matrimony: Heritage and Wedding Customs",
};
for (const post of blogPosts) {
  Object.assign(post, REWRITES[post.slug]);
  if (SHORT_TITLES[post.slug]) post.title = SHORT_TITLES[post.slug];
  const faqs = POST_FAQS[post.slug];
  if (faqs) {
    post.sections = [
      ...(post.sections ?? []),
      { heading: "Frequently asked questions", blocks: faqs.map(([q, a]) => <><strong>{q}</strong> {a}</>) },
    ];
  }
}
