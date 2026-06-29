import type { MetadataRoute } from "next";

const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "CCBot",
  "DuckAssistBot",
  "Amazonbot",
  "YouBot",
  "Diffbot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Bytespider",
  "ImagesiftBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://www.keithrobrien.com/sitemap.xml",
  };
}
