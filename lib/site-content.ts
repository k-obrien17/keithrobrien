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

import aboutJson from "@/content/site/about.json";

export interface AboutLink {
  label: string;
  href: string;
}

export interface About {
  bio: string;
  newsletters: string;
  previously: string;
  outsideOfWork: string;
  links: AboutLink[];
}

export function getAbout(): About {
  return aboutJson as About;
}
