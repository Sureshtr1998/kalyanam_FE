import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { SEO_URL } from "@/utils/constants";
import { blogPosts, type BlogPost } from "./blogsContents";

const Meta = ({ post }: { post: BlogPost }) => (
  <p className="text-xs font-bold uppercase tracking-wide text-gold-foreground">
    {post.category} · {post.readTime}
  </p>
);

const Blog = () => {
  const [q, setQ] = useState("");
  const featured = blogPosts.find((p) => p.isFeatured) || blogPosts[0];
  const needle = q.toLowerCase();
  const posts = blogPosts.filter(
    (p) =>
      (p.title.toLowerCase().includes(needle) || p.keywords?.toLowerCase().includes(needle)) &&
      (q || p.id !== featured.id)
  );

  return (
    <>
      <SEO
        title="Blog | Seetha Rama Kalyana"
        description="Read the latest matrimony tips, success stories, and lifestyle advice on Seetha Rama Kalyana."
        keywords="blog, hindu matrimony, seetha rama kalyana"
        pageType="blog"
        blogPosts={blogPosts.map((p) => ({ title: p.title, summary: p.summary, slug: p.slug }))}
        url={SEO_URL + "/blog"}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 text-center">
          <Lotus className="mx-auto h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Matrimony insights &amp; stories</h1>
          <p className="mt-3 text-muted-foreground">Tips, traditions and guidance for your journey.</p>
          <div className="relative mx-auto mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles: Brahmin, rituals, kundli…"
              className="h-12 rounded-full bg-card pl-11"
            />
          </div>
        </header>

        {!q && featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group mb-12 grid overflow-hidden rounded-[2rem] border border-gold/40 bg-card shadow-lg lg:grid-cols-2">
            <img src={featured.imageUrl} alt="" className="aspect-[16/10] size-full object-cover lg:aspect-auto" />
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-10">
              <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Featured
              </span>
              <Meta post={featured} />
              <h2 className="font-display text-3xl font-bold leading-tight group-hover:text-primary sm:text-4xl">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.summary}</p>
              <span className="flex items-center gap-1 font-semibold text-primary">
                Read article <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        <h2 className="mb-6 font-display text-3xl font-bold">{q ? `Results for “${q}”` : "Recent articles"}</h2>
        {posts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <img src={p.imageUrl} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <Meta post={p} />
                  <h3 className="font-display text-xl font-bold leading-snug group-hover:text-primary">{p.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No articles match your search.</p>
            <Button variant="link" onClick={() => setQ("")}>Clear search</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
