import { Link } from "react-router-dom";
import { blogPosts } from "@/screens/blogs/blogsContents";

/** The three newest blog cards. Its own chunk, so the landing page doesn't ship every article. */
const LatestPosts = () => (
  <>
    {blogPosts.slice(0, 3).map((p) => (
      <Link
        key={p.id}
        to={`/blog/${p.slug}`}
        className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        <img src={p.imageUrl} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gold-foreground">{p.category} · {p.readTime}</p>
          <h3 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-primary">{p.title}</h3>
        </div>
      </Link>
    ))}
  </>
);

export default LatestPosts;
