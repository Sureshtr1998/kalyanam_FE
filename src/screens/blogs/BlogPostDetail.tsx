import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/misc/SEO";
import NotFound from "@/screens/notFound/NotFound";
import { SEO_URL } from "@/utils/constants";
import { BLOG_PUBLISHED, BLOG_UPDATED, blogPosts } from "./blogsContents";

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  const more = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const url = `${SEO_URL}/blog/${post.slug}`;
  const published = post.publishedAt ?? BLOG_PUBLISHED;
  const updated = post.updatedAt ?? BLOG_UPDATED;
  const dateLabel = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <SEO
        title={`${post.title} | Seetha Rama Kalyana`}
        description={post.summary}
        keywords={post.keywords || "matrimony tips, hindu wedding, seetha rama kalyana"}
        url={url}
        type="article"
        image={post.imageUrl}
        additionalSchema={[
          {
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            image: post.imageUrl.startsWith("http") ? post.imageUrl : `${SEO_URL}${post.imageUrl}`,
            url,
            mainEntityOfPage: { "@id": `${url}#webpage` },
            datePublished: published,
            dateModified: updated,
            inLanguage: "en-IN",
            articleSection: post.category,
            keywords: post.keywords,
            author: { "@type": "Organization", name: "Seetha Rama Kalyana", url: SEO_URL },
            publisher: { "@id": `${SEO_URL}/#organization` },
            ...(post.answer ? { abstract: post.answer } : {}),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SEO_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SEO_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
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
        <p className="mt-3 text-sm text-muted-foreground">
          Updated <time dateTime={updated}>{dateLabel(updated)}</time>
        </p>
        {post.answer && (
          <aside className="mt-6 rounded-2xl border border-gold/40 bg-accent/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-foreground">Quick answer</p>
            <p className="mt-2 leading-7">{post.answer}</p>
            {post.keyFacts?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-foreground/85">
                {post.keyFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        )}
        <img
          src={post.imageUrl}
          alt={post.title}
          width={1280}
          height={720}
          fetchPriority="high"
          className="my-8 aspect-[16/9] h-auto w-full rounded-3xl object-cover shadow-lg"
        />
        <div className="space-y-5 text-[17px] leading-8 text-foreground/85 [&_strong]:text-foreground">
          {post.fullContent.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {post.sections?.map((section) => (
            <section key={section.heading} className="space-y-5 pt-4">
              <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-[28px]">
                {section.heading}
              </h2>
              {section.blocks.map((block, i) =>
                block && typeof block === "object" && "list" in block ? (
                  <ul key={i} className="list-disc space-y-2 pl-6 marker:text-primary">
                    {block.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{block}</p>
                ),
              )}
            </section>
          ))}
        </div>
      </article>
      <section className="border-t border-border bg-accent/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {more.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <img src={p.imageUrl} alt="" loading="lazy" width={640} height={400} className="aspect-[16/10] h-auto w-full object-cover" />
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
