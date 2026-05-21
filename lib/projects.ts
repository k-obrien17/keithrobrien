import { Project, ProjectStatus } from "./types";

export const projects: Project[] = [
  { name: "141 Miles", slug: "141-miles", description: "Jersey Shore events site with an AI-written newsletter.", stack: ["TS", "Next.js", "Drizzle"], status: "active", url: "https://www.141miles.com", featured: true },
  { name: "The Diffraction", slug: "the-diffraction", description: "A music publication and newsletter.", stack: ["Newsletter"], status: "active", url: "https://www.thediffraction.com" },
  { name: "Survival Signal", slug: "survival-signal", description: "A newsletter about how to be an independent worker. On hiatus.", stack: ["Newsletter"], status: "active", url: "https://survivalsignal.beehiiv.com" },
  { name: "Total Emphasis Workflow", slug: "tew", description: "Desktop project management for the ghostwriting practice.", stack: ["TS", "React", "Tauri 2"], status: "active", featured: true },
  { name: "Ironlog", slug: "ironlog", description: "Obsidian-native fitness tracker: MCP server plus cron scripts.", stack: ["TS", "Node", "MCP"], status: "active", featured: true },
  { name: "Vault Chatbot", slug: "vault-chatbot", description: "CLI chatbot and MCP server over an Obsidian CRM vault.", stack: ["TS", "Tauri 2", "MCP"], status: "active" },
  { name: "Media Library", slug: "media-library", description: "Personal media consumption tracker.", stack: ["TS", "React"], status: "active" },
  { name: "Client Pulse", slug: "client-pulse", description: "Content-fuel pipeline that feeds research to ghostwriting clients.", stack: ["JS", "Node"], status: "active" },
  { name: "World Cup Price Tracker", slug: "wc-price-tracker", description: "Once-a-day SeatPick WC2026 price tracker with an HTML dashboard.", stack: ["TS", "Bun", "SQLite"], status: "active" },
  { name: "Soccer Trivia", slug: "soccer-trivia", description: "Kid-facing Chore Quest and Trivia FC, packaged as a macOS app.", stack: ["Python", "Pygame"], status: "active" },
  { name: "Daily 10", slug: "daily-10", description: "Daily practice app.", stack: ["JS", "React", "Tauri"], status: "active" },
  { name: "8th Chair", slug: "8th-chair", description: "Curated expert Q&A platform.", stack: ["JS", "React"], status: "active" },
  { name: "Backyard Marquee", slug: "backyard-marquee", description: "Concert lineup builder.", stack: ["JS", "React", "Express", "Turso"], status: "active" },
  { name: "Obsidian Interface", slug: "obsidian-interface", description: "Desktop interface for an Obsidian vault.", stack: ["JS", "Tauri 2"], status: "active" },
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
