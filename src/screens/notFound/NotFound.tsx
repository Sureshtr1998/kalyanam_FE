import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/PageHeader";
import SEO from "@/components/misc/SEO";

/** Any URL that matches no route. Served as dist/404.html with a 404 status. */
const NotFound = () => (
  <>
    <SEO
      title="Page not found | Seetha Rama Kalyana"
      description="This page does not exist. Find Hindu brides and grooms on Seetha Rama Kalyana."
      noindex
    />
    <div className="mx-auto max-w-2xl px-4 py-16">
      <EmptyState
        title="Page not found"
        description="The link may be old or mistyped."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/">Go to home page</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/blog">Read our blog</Link>
            </Button>
          </div>
        }
      />
    </div>
  </>
);

export default NotFound;
