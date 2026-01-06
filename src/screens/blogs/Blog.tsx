import React, { useState } from "react";
import {
  CARD_BG,
  BORDER_COLOR,
  TEXT_COLOR,
  ACCENT_COLOR,
  BG_COLOR,
} from "../../styles/variables";
import SEO from "../../components/misc/SEO";
import { SEO_URL } from "../../utils/constants";
import { Link } from "react-router-dom";
import { blogPosts, type BlogPost } from "./blogsContents";

const BlogPostCard: React.FC<{
  post: BlogPost;
}> = ({ post }) => {
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
        <Link to={`/blog/${post.slug}`} className="text-amber-600 font-bold">
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

const FeaturedPost: React.FC<{
  post: BlogPost;
}> = ({ post }) => {
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

        <Link to={`/blog/${post.slug}`} className="text-amber-600 font-bold">
          Read Full Article &rarr;
        </Link>
      </div>
    </div>
  );
};

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = blogPosts.find((p) => p.isFeatured) || blogPosts[0];

  // 2. Filter posts based on the search query
  // We check if the title or keywords include the search string (case-insensitive)
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && post.id !== featuredPost.id;
  });

  return (
    <div className="blogs">
      <SEO
        title="Blog | Seetha Rama Kalyana"
        description="Read the latest matrimony tips, success stories, and lifestyle advice on Seetha Rama Kalyana."
        keywords="blog, hindu matrimony, seetha rama kalyana"
        pageType="blog"
        blogPosts={blogPosts}
        url={SEO_URL + "/blog"}
      />

      <div className={`${BG_COLOR} min-h-screen py-24 px-4 font-sans`}>
        <header className="text-center mb-12">
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-3 ${TEXT_COLOR}`}>
            Matrimony Insights & Stories
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your source for tips, success stories, and expert advice.
          </p>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by title (e.g., Brahmin, Rituals...)"
              className="w-full px-6 py-3 rounded-full border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-5 top-3.5 text-gray-400">🔍</span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {/* Only show featured post if there is no active search */}
          {!searchQuery && featuredPost && <FeaturedPost post={featuredPost} />}

          <h2
            className={`text-4xl font-extrabold mb-8 mt-12 ${TEXT_COLOR} border-b-4 w-fit border-amber-400 pb-1`}>
            {searchQuery ? `Results for "${searchQuery}"` : "Recent Articles"}
          </h2>

          {/* Recent Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-2xl text-gray-500">
                  No articles found matching your search.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-amber-600 font-bold underline">
                  Clear search
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blog;
