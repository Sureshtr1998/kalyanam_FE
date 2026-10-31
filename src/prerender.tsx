// Build-time entry: renders one public page to HTML so crawlers that don't run JavaScript
// (most AI search bots) still see its content. Built with `vite build --ssr` and driven by
// scripts/prerender.mjs.
import { prerenderToNodeStream } from "react-dom/static";
import App from "./App.tsx";

export const render = async (url: string): Promise<string> => {
  // Waits for every lazy page chunk to load, unlike renderToString.
  const { prelude } = await prerenderToNodeStream(<App location={url} />);
  let html = "";
  for await (const chunk of prelude) html += chunk;
  return html;
};
