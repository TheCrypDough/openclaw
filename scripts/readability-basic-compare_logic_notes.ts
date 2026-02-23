/*
 * AUTO ANNOTATION
 * File: scripts/readability-basic-compare.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (readability-basic-compare.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createWebFetchTool } from "../src/agents/tools/web-tools.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_URLS = [
  "https://example.com/",
  "https://news.ycombinator.com/",
  "https://www.reddit.com/r/javascript/",
  "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent",
  "https://httpbin.org/html",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const urls = process.argv.slice(2);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const targets = urls.length > 0 ? urls : DEFAULT_URLS;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function runFetch(url: string, readability: boolean) {
  if (!readability) {
    throw new Error("Basic extraction removed. Set readability=true or enable Firecrawl.");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createWebFetchTool({
    config: {
      tools: {
        web: { fetch: { readability, cacheTtlMinutes: 0, firecrawl: { enabled: false } } },
      },
    },
    sandboxed: false,
  });
  if (!tool) {
    throw new Error("web_fetch tool is disabled");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await tool.execute("test", { url, extractMode: "markdown" });
  return result.details as {
    text?: string;
    title?: string;
    extractor?: string;
    length?: number;
    truncated?: boolean;
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function truncate(value: string, max = 160): string {
  if (!value) {
    return "";
  }
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function run() {
  for (const url of targets) {
    console.log(`\n=== ${url}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const readable = await runFetch(url, true);

    console.log(
      `readability: ${readable.extractor ?? "unknown"} len=${readable.length ?? 0} title=${truncate(
        readable.title ?? "",
        80,
      )}`,
    );
    if (readable.text) {
      console.log(`readability sample: ${truncate(readable.text)}`);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
