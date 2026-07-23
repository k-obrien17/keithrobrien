import homeJson from "@/content/site/home.json";
import aboutJson from "@/content/site/about.json";
import llmsJson from "@/content/site/llms.json";
import nowJson from "@/content/site/now.json";
import shippedJson from "@/content/site/recently-shipped.json";
import listeningJson from "@/content/site/listening.json";

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

export interface Now {
  updated: string;
  intro: string;
  building: string;
  running: string;
  elsewhere: string;
}

export function getNow(): Now {
  return nowJson as Now;
}

export interface RecentlyShippedItem {
  name: string;
  date: string;
  what: string;
}

export function getRecentlyShipped(): RecentlyShippedItem[] {
  return (shippedJson as { list: RecentlyShippedItem[] }).list;
}

export interface Listening {
  playlistId: string;
  note: string;
}

export function getListening(): Listening {
  return listeningJson as Listening;
}

export interface LlmsPreamble {
  summary: string;
  bio: string;
  isNot: string[];
}

export function getLlmsPreamble(): LlmsPreamble {
  return llmsJson as LlmsPreamble;
}
