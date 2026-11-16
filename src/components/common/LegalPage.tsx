import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { Lotus } from "./Brand";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

/** Long-form policy page with a sticky table of contents on desktop. */
export const LegalPage = ({
  title,
  description,
  effective,
  sections,
  labels = {
    contents: "Contents",
    jump: "Jump to a section",
    updated: "Last updated",
    englishPrevails: "",
  },
}: {
  title: string;
  description: string;
  effective?: string;
  sections: LegalSection[];
  /** Page chrome in the reader's language; englishPrevails shows a note on translations. */
  labels?: {
    contents: string;
    jump: string;
    updated: string;
    englishPrevails: string;
  };
}) => {
  const { hash } = useLocation();
  // Open at the linked section, e.g. /kn/terms#safety from a social post.
  useEffect(() => {
    if (hash)
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView();
  }, [hash]);
  return (
    <div className="bg-kolam">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 text-center">
          <Lotus className="mx-auto h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {description}
          </p>
          {effective && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
              {labels.updated} · {effective}
            </p>
          )}
          {labels.englishPrevails && (
            <p className="mx-auto mt-3 max-w-2xl text-xs text-muted-foreground">
              {labels.englishPrevails}
            </p>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <nav className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <ScrollText className="size-4" /> {labels.contents}
              </p>
              <ul className="space-y-0.5">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-lg px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent hover:text-primary"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <details className="mb-6 rounded-xl bg-muted p-3 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">
                {labels.jump}
              </summary>
              <ul className="mt-2 space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-sm text-primary">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
            <div className="divide-y divide-border">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 py-6 first:pt-0 last:pb-0"
                >
                  <h2 className="mb-3 font-display text-2xl font-bold text-primary sm:text-3xl">
                    {s.title}
                  </h2>
                  <div className="space-y-3 text-[15px] leading-relaxed text-foreground/85 [&_li]:marker:text-gold [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
                    {s.content}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
