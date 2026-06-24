import { Project, ProjectStatus } from "./types";

export const projects: Project[] = [
  { name: "141 Miles", slug: "141-miles", description: "Jersey Shore events site with an AI-written newsletter.", stack: ["TS", "Next.js", "Drizzle"], status: "active", url: "https://www.141miles.com", featured: true },
  { name: "The Diffraction", slug: "the-diffraction", description: "A music publication and newsletter.", stack: ["Newsletter"], status: "active", url: "https://www.thediffraction.com" },
  { name: "Survival Signal", slug: "survival-signal", description: "A newsletter about how to be an independent worker. On hiatus.", stack: ["Newsletter"], status: "active", url: "https://survivalsignal.beehiiv.com" },
  { name: "Total Emphasis Workflow", slug: "tew", description: "A Tauri desktop app for managing client projects, stages, and deliverables across the ghostwriting practice.", stack: ["Tauri", "TypeScript", "Workflow"], status: "active", featured: true },
  { name: "Ironlog", slug: "ironlog", description: "Obsidian-native fitness tracker: MCP server plus cron scripts.", stack: ["TS", "Node", "MCP"], status: "active", featured: true },
  { name: "Vault Chatbot", slug: "vault-chatbot", description: "An MCP server that lets Claude query the Obsidian vault used as a CRM. Indexes 15,000 markdown files.", stack: ["MCP", "Bun", "TypeScript", "CRM"], status: "active" },
  { name: "Article Search", slug: "article-search", description: "An MCP server for searching across indexed article sources by date, organization, publication, tag, or topic.", stack: ["MCP", "Bun", "TypeScript"], status: "active" },
  { name: "Total Emphasis Portfolio", slug: "total-emphasis-portfolio", description: "Next.js 16 portfolio site syncing 575+ pieces from the vault, with an admin CMS, deployed on Vercel.", stack: ["Next.js", "TypeScript", "Vercel"], status: "active", url: "https://www.totalemphasis.com" },
  { name: "Control Panel", slug: "control-panel", description: "A central dashboard for managing tools, cron jobs, and quick actions across the Total Emphasis stack.", stack: ["Bun", "Dashboard"], status: "active" },
  { name: "Ideas", slug: "ideas", description: "A capture and synthesis tool for ideas, drafts, and one-line riffs that get processed into vault notes.", stack: ["Bun", "Claude", "Capture"], status: "active" },
  { name: "Personal Claude", slug: "personal-claude", description: "A configuration layer that personalizes Claude Code's behavior across all my projects.", stack: ["Claude Code", "Config"], status: "active" },
  { name: "Writing", slug: "writing-env", description: "A writing-assist environment for drafting bylines and blog posts with vault and source-material context loaded.", stack: ["TypeScript", "Writing"], status: "active" },
  { name: "Media Library", slug: "media-library", description: "Personal media consumption tracker.", stack: ["TS", "React"], status: "active" },
  { name: "Client Pulse", slug: "client-pulse", description: "A research feed that aggregates client press, market news, and competitor activity into a daily brief.", stack: ["Tauri", "Bun", "RSS", "Research"], status: "active" },
  { name: "World Cup Price Tracker", slug: "wc-price-tracker", description: "Once-a-day SeatPick WC2026 price tracker with an HTML dashboard.", stack: ["TS", "Bun", "SQLite"], status: "active" },
  { name: "Soccer Trivia", slug: "soccer-trivia", description: "Kid-facing Chore Quest and Trivia FC, packaged as a macOS app.", stack: ["Python", "Pygame"], status: "active" },
  { name: "Daily 10", slug: "daily-10", description: "Daily practice app.", stack: ["JS", "React", "Tauri"], status: "active" },
  { name: "8th Chair", slug: "8th-chair", description: "Curated expert Q&A platform.", stack: ["JS", "React"], status: "active" },
  { name: "Backyard Marquee", slug: "backyard-marquee", description: "Concert lineup builder.", stack: ["JS", "React", "Express", "Turso"], status: "active" },
  { name: "Obsidian Interface", slug: "obsidian-interface", description: "A local-first Bun server that exposes the Obsidian vault to other tools via HTTP. Runs under launchd.", stack: ["Bun", "Server", "Obsidian"], status: "active" },
];

export function projectsByStatus(): Record<ProjectStatus, Project[]> {
  return {
    active: projects.filter((p) => p.status === "active"),
    maintained: projects.filter((p) => p.status === "maintained"),
    dormant: projects.filter((p) => p.status === "dormant"),
  };
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
