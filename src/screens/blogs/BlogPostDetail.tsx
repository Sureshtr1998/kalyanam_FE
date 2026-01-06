import { useParams, useNavigate } from "react-router-dom";
import { blogPosts } from "./blogsContents";
import {
  ACCENT_COLOR,
  ACCENT_RING,
  BG_COLOR,
  BORDER_COLOR,
  CARD_BG,
  TEXT_COLOR,
} from "../../styles/variables";
import SEO from "../../components/misc/SEO";
import { SEO_URL } from "../../utils/constants";

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <div>Post not found</div>;

  return (
    <div className={`${BG_COLOR} min-h-screen px-4`}>
      <SEO
        title={`${post.title} | Seetha Rama Kalyana`}
        description={post.summary}
        keywords="matrimony tips, hindu wedding, seetha rama kalyana"
        url={`${SEO_URL}/blog/${post.slug}`}
        pageType="blog"
      />

      <main className="max-w-4xl py-20 mx-auto">
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
            onClick={() => navigate("/blog")}
            className={`mt-10 cursor-pointer w-full px-6 py-3 text-lg font-bold ${CARD_BG} rounded-full ${ACCENT_COLOR} transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 ${ACCENT_RING} shadow-lg shadow-amber-700/50`}>
            &larr; Return to Blog List
          </button>
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;
