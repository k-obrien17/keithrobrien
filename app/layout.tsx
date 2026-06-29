import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

// IBM Plex Mono — the whole site is mono by default (structure, headings,
// chrome). Plex Sans is the sibling cut used only for long-form article bodies
// (see .prose in globals.css). next/font self-hosts + subsets both, so there's
// no Google Fonts <link>.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.keithrobrien.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Keith O'Brien: B2B Executive Ghostwriter, Former PRWeek EIC",
    template: "%s · Keith O'Brien",
  },
  description:
    "Keith O'Brien is a B2B content strategist and executive ghostwriter and former PRWeek editor-in-chief. Founder of Total Emphasis. Operator-ghostwriter for B2B founders and executives. Builds the systems his work runs on.",
  openGraph: {
    title: "Keith O'Brien, B2B Executive Ghostwriter",
    description:
      "B2B executive ghostwriter and former PRWeek editor-in-chief. Founder of Total Emphasis.",
    url: SITE_URL,
    siteName: "Keith O'Brien",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien, B2B Executive Ghostwriter",
    description:
      "B2B executive ghostwriter and former PRWeek editor-in-chief. Founder of Total Emphasis.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Keith O'Brien",
      alternateName: "Keith R. O'Brien",
      url: SITE_URL,
      jobTitle: "B2B Executive Ghostwriter",
      description:
        "Keith O'Brien is a B2B content strategist and executive ghostwriter and former editor-in-chief of PRWeek. Founder of Total Emphasis (2017). 20+ years driving measurable results for Fortune 500 companies, startups, and everyone in between, including IBM, Realeyes, UpWave, and UST. Operates as an operator-ghostwriter for B2B founders and executives, building the systems his work runs on. Based in Brooklyn.",
      disambiguatingDescription:
        "B2B executive ghostwriter and founder of Total Emphasis. Former editor-in-chief of PRWeek. Based in Brooklyn, New York. Not the late Cardinal Keith O'Brien of Scotland, the Irish boxer, or the longform journalist Keith O'Brien who authored Paradise Falls and Outside Shot.",
      homeLocation: {
        "@type": "Place",
        name: "Brooklyn, New York",
      },
      alumniOf: [
        {
          "@type": "Organization",
          name: "PRWeek",
          url: "https://www.prweek.com",
        },
        {
          "@type": "Organization",
          name: "Haymarket Media Group",
          url: "https://www.haymarket.com",
        },
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "B2B Executive Ghostwriter",
          occupationalCategory: "Content Strategy",
        },
        {
          "@type": "Occupation",
          name: "Editor-in-Chief, PRWeek (former)",
          occupationalCategory: "Journalism",
        },
      ],
      knowsAbout: [
        "Operator-Ghostwriting",
        "Executive Ghostwriting",
        "B2B Content Strategy",
        "Executive Thought Leadership",
        "Executive Communications",
        "LinkedIn Ghostwriting",
        "Bylined Article Placement",
        "AI-Assisted Writing",
        "Editorial Workflow Design",
        "Founder-Led Content",
        "AI Overview Optimization",
        "Generative Engine Optimization",
        "Newsletter Strategy",
        "Personal Branding",
        "SEO Content",
        "Longform Content",
        "Whitepapers",
        "Sales Enablement Content",
        "Content Systems",
        "Trade Press Pitching",
        "AdTech",
        "MarTech",
        "SaaS",
        "Fintech",
        "Software Development",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Total Emphasis",
        url: "https://www.totalemphasis.com",
      },
      sameAs: [
        "https://www.linkedin.com/in/keithobrien/",
        "https://github.com/k-obrien17",
        "https://www.totalemphasis.com",
        "https://muckrack.com/keithobrien",
        "https://www.141miles.com",
        "https://www.thediffraction.com",
        "https://www.keithrobrien.com/bylines",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Keith O'Brien",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable} ${plexSans.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
