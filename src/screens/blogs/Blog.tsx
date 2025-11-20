import React, { useEffect, useState } from "react";
import traditionalUrl from "../../assets/traditional.png";
import tipsUrl from "../../assets/tips.png";
import { ArrowLeft } from "lucide-react";
import {
  CARD_BG,
  BORDER_COLOR,
  TEXT_COLOR,
  ACCENT_COLOR,
  ACCENT_RING,
  BG_COLOR,
} from "../../styles/variables";
import SEO from "../../components/misc/SEO";

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  category: "Tips" | "Success Stories" | "Lifestyle" | "Events";
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  fullContent: React.ReactNode[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to Create the Perfect Seetha Rama Kalyana Matrimony Profile",
    summary:
      "Learn how to make your Seetha Rama Kalyana matrimony profile stand out. Attract genuine matches with honesty, clarity, and a personal touch.",
    category: "Tips",
    readTime: "5 min read",
    imageUrl: tipsUrl,
    isFeatured: true,
    fullContent: [
      <>
        Your <strong>Seetha Rama Kalyana</strong> matrimony profile is the first
        impression for potential life partners. Ensure it is honest, engaging,
        and reflective of your true self. Avoid vague statements and focus on
        specifics regarding your lifestyle, values, and expectations.
      </>,
      <>
        <strong>Highlight Your Education and Profession:</strong> Clearly
        explain your education, career, and what drives you. Stability and
        ambition are attractive qualities in the Brahmin matrimony community.
      </>,
      <>
        <strong>Define Your Partner Preferences Clearly:</strong> Mention the
        qualities you seek realistically, including shared values, goals, or
        lifestyle preferences. Avoid focusing solely on physical attributes.
      </>,
      <>
        <strong>Use High-Quality Photos:</strong> Include 3-5 recent, clear
        photos. A portrait plus pictures of hobbies or interests help potential
        matches understand you better. Avoid heavily filtered images or group
        photos.
      </>,
      <>
        By following these tips, your profile on{" "}
        <strong>Seetha Rama Kalyana</strong> can attract genuine, compatible
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
    readTime: "6 min read",
    imageUrl: traditionalUrl,
    fullContent: [
      <>
        The name <strong>Seetha Rama Kalyana</strong> represents a sacred union
        built on commitment, respect, and shared dharma. In modern matrimony,
        this philosophy guides users in finding partners aligned with their core
        values and life purpose.
      </>,
      <>
        <strong>Mutual Respect Matters:</strong> Successful matches focus on
        empathy, maturity, and deep mutual consideration. Look beyond
        superficial attributes when reviewing profiles.
      </>,
      <>
        <strong>Commitment to Shared Dharma:</strong> Marriage is a partnership.
        Define life goals clearly professional, spiritual, and familiar and seek
        someone whose ambitions complement your own. A divine match supports
        each other’s journey toward fulfillment.
      </>,
      <>
        <strong>Patience and Integrity in Search:</strong> Just as the epic
        union of Sita and Rama was virtuous, maintain honesty and patience in
        your profile. Genuine connections built on these principles lead to
        lasting relationships.
      </>,
      <>
        Following the <strong>Seetha Rama Kalyanam</strong> philosophy helps
        Brahmin matrimony seekers find truly compatible partners, ensuring
        respect, values, and spiritual alignment in the match.
      </>,
    ],
  },
];

const BlogPostCard: React.FC<{
  post: BlogPost;
  onReadMore: (id: number) => void;
}> = ({ post, onReadMore }) => {
  return (
    <div
      className={`rounded-xl shadow-lg ${CARD_BG} border ${BORDER_COLOR} overflow-hidden transform hover:shadow-2xl transition-all duration-300`}>
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = `https://placehold.co/400x250/${
            BORDER_COLOR.split("-")[1]
          }/78350f?text=No+Image`;
        }}
      />

      <div className="p-5">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <span className={`${TEXT_COLOR} uppercase tracking-wider`}>
            {post.category}
          </span>
          <span className="text-gray-500">{post.readTime}</span>
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${TEXT_COLOR}`}>
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>

        <button
          onClick={() => onReadMore(post.id)}
          className={`cursor-pointer font-semibold text-lg ${ACCENT_COLOR.split(
            " "
          )[0].replace(
            "bg",
            "text"
          )} hover:text-amber-700 transition-colors duration-200 focus:outline-none`}>
          Read More &rarr;
        </button>
      </div>
    </div>
  );
};

const FeaturedPost: React.FC<{
  post: BlogPost;
  onReadMore: (id: number) => void;
}> = ({ post, onReadMore }) => {
  return (
    <div
      className={`mb-12 p-6 rounded-2xl shadow-2xl ${
        ACCENT_COLOR.split(" ")[0]
      }/10 border-4 ${BORDER_COLOR} grid grid-cols-1 lg:grid-cols-2 gap-8`}>
      {/* Image */}
      <div className="order-1 lg:order-2">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto rounded-xl object-cover shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/800x400/${ACCENT_COLOR.split(
              " "
            )[0].replace("bg", "")}/78350f?text=Featured+Article`;
          }}
        />
      </div>

      <div className="order-2 lg:order-1 flex flex-col justify-center">
        <span
          className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            ACCENT_COLOR.split(" ")[0]
          } ${CARD_BG} w-fit mb-3`}>
          Featured {post.category}
        </span>
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-4 ${TEXT_COLOR}`}>
          {post.title}
        </h2>
        <p className="text-gray-700 text-xl mb-6">{post.summary}</p>

        {/* Updated Featured button to use onReadMore handler */}
        <button
          onClick={() => onReadMore(post.id)}
          className={`w-fit px-6 py-3 text-lg cursor-pointer font-bold ${CARD_BG} rounded-full ${ACCENT_COLOR} transition-all duration-300 transform hover:scale-[1.05] focus:outline-none focus:ring-4 ${ACCENT_RING} shadow-lg shadow-amber-700/50`}>
          Read Full Article &rarr;
        </button>
      </div>
    </div>
  );
};

const BlogPostDetail: React.FC<{ post: BlogPost; onBack: () => void }> = ({
  post,
  onBack,
}) => {
  return (
    <main className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className={`inline-flex items-center text-lg font-semibold mb-6 ${TEXT_COLOR} hover:text-amber-700 transition-colors duration-200 focus:outline-none`}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to All Articles
      </button>

      <div
        className={`p-8 rounded-2xl shadow-2xl ${CARD_BG} border ${BORDER_COLOR}`}>
        <h1 className={`text-5xl font-extrabold mb-4 ${TEXT_COLOR}`}>
          {post.title}
        </h1>
        <div className="flex justify-between items-center text-gray-500 text-sm mb-6 pb-4 border-b border-amber-100">
          <span
            className={`uppercase tracking-wider font-semibold ${TEXT_COLOR}`}>
            {post.category}
          </span>
          <span>{post.readTime}</span>
        </div>

        {/* Article Image */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto rounded-xl object-cover mb-8 shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/800x400/${ACCENT_COLOR.split(
              " "
            )[0].replace("bg", "")}/78350f?text=Article+Image`;
          }}
        />

        {/* Full Content */}
        <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
          {post.fullContent && post.fullContent.length > 0 ? (
            post.fullContent.map((paragraph, index) => (
              <p key={index} className="indent-6">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-xl text-red-500 font-medium">
              The full content for this article is not yet available. Please
              check back later!
            </p>
          )}
        </div>

        <button
          onClick={onBack}
          className={`mt-10 cursor-pointer w-full px-6 py-3 text-lg font-bold ${CARD_BG} rounded-full ${ACCENT_COLOR} transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 ${ACCENT_RING} shadow-lg shadow-amber-700/50`}>
          &larr; Return to Blog List
        </button>
      </div>
    </main>
  );
};

const Blog = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const featuredPost = blogPosts.find((p) => p.isFeatured) || blogPosts[0];
  const recentPosts = blogPosts.filter(
    (p) => !p.isFeatured && p.id !== featuredPost.id
  );

  const selectedPost = blogPosts.find((p) => p.id === selectedPostId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  if (selectedPost) {
    return (
      <div className={`${BG_COLOR} min-h-screen  px-4 font-sans`}>
        <BlogPostDetail
          post={selectedPost}
          onBack={() => setSelectedPostId(null)}
        />
      </div>
    );
  }

  return (
    <div className="blogs">
      <SEO
        title="Blog | Seetha Rama Kalyana"
        description="Read the latest matrimony tips, success stories, and lifestyle advice on Seetha Rama Kalyana."
        keywords="blog, brahmin matrimony, seetha rama kalyana"
        pageType="blog"
        blogPosts={blogPosts}
      />

      <div className={`${BG_COLOR} min-h-screen py-24 px-4 font-sans`}>
        <header className="text-center mb-12">
          <h1 className={`text-6xl font-extrabold mb-3 ${TEXT_COLOR}`}>
            Matrimony Insights & Stories
          </h1>
          <p className="text-xl text-gray-600">
            Your source for tips, success stories, and expert advice on finding
            your perfect partner.
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          {featuredPost && (
            <FeaturedPost post={featuredPost} onReadMore={setSelectedPostId} />
          )}

          <h2
            className={`text-4xl font-extrabold mb-8 mt-12 ${TEXT_COLOR} border-b-4 w-fit border-amber-400 pb-1`}>
            Recent Articles
          </h2>

          {/* Recent Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onReadMore={setSelectedPostId}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blog;
