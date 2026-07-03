export type ProjectStatus = "active" | "maintained" | "dormant";
export type ProjectGroup =
  | "public"
  | "practice"
  | "knowledge"
  | "playground";

export interface Project {
  name: string;
  publicName?: string;
  slug: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  group: ProjectGroup;
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
