import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/misc/SEO";
import NotFound from "@/screens/notFound/NotFound";
import { SEO_URL } from "@/utils/constants";
import { blogPosts } from "./blogsContents";

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  const more = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <SEO
        title={`${post.title} | Seetha Rama Kalyana`}
        description={post.summary}
        keywords={post.keywords || "matrimony tips, hindu wedding, seetha rama kalyana"}
        url={`${SEO_URL}/blog/${post.slug}`}
        type="article"
        image={post.imageUrl}
        additionalSchema={[
          {
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            image: post.imageUrl.startsWith("http") ? post.imageUrl : `${SEO_URL}${post.imageUrl}`,
            url: `${SEO_URL}/blog/${post.slug}`,
            author: { "@type": "Organization", name: "Seetha Rama Kalyana" },
            publisher: { "@id": `${SEO_URL}/#organization` },
          },
        ]}
      />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link to="/blog">
            <ArrowLeft /> All articles
          </Link>
        </Button>
        <p className="text-xs font-bold uppercase tracking-wide text-gold-foreground">
          {post.category} · {post.readTime}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.summary}</p>
        <img src={post.imageUrl} alt="" className="my-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-lg" />
        <div className="space-y-5 text-[17px] leading-8 text-foreground/85 [&_strong]:text-foreground">
          {post.fullContent.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
      <section className="border-t border-border bg-accent/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {more.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <img src={p.imageUrl} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <p className="p-4 font-semibold leading-snug group-hover:text-primary">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
