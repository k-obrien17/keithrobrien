import data from "@/content/site/projects.json";
import { Project } from "./types";

export const projects: Project[] = (data.list as Project[]);

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
