import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Internal link used inside long-form blog content. */
const BlogLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-semibold text-primary underline-offset-4 hover:underline">
    {children}
  </Link>
);

export default BlogLink;
