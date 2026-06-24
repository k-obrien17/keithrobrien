import homeJson from "@/content/site/home.json";

export interface Facet {
  label: string;
  desc: string;
  href: string;
  external?: boolean;
}

export interface Home {
  name: string;
  tagline: string;
  introPrefix: string;
  introHighlight: string;
  introSuffix: string;
  secondary: string;
  facets: Facet[];
}

export function getHome(): Home {
  return homeJson as Home;
}
