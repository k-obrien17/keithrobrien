export type ProjectStatus = "active" | "maintained" | "dormant";

export interface Project {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  url?: string;
  repo?: string;
  featured?: boolean;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  draft?: boolean;
}
