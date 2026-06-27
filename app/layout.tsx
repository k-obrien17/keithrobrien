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

const SITE_URL = "https://keithrobrien.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Keith O'Brien: Content Strategist, Ghostwriter, Builder",
    template: "%s · Keith O'Brien",
  },
  description:
    "Keith O'Brien is a content strategist, thought-leadership ghostwriter, and builder, and the founder of Total Emphasis. He helps founders and executives turn what they know into content people consume, then builds the tools that get it out the door.",
  openGraph: {
    title: "Keith O'Brien",
    description:
      "Builder, operator, big idea tinkerer. Runs Total Emphasis, plus software, newsletters, and writing.",
    url: SITE_URL,
    siteName: "Keith O'Brien",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien",
    description:
      "Builder, operator, big idea tinkerer. Runs Total Emphasis.",
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
      jobTitle: "Content Strategist, Thought-Leadership Ghostwriter & Builder",
      description:
        "Content strategist and thought-leadership ghostwriter who helps founders and executives turn what they know into content people consume, then builds the tools that get it out the door. A reporter since 2001 and former editor-in-chief of PRWeek, founder of Total Emphasis (2017). Based in Brooklyn.",
      knowsAbout: [
        "Executive Thought Leadership",
        "B2B Content Strategy",
        "Ghostwriting",
        "Executive Communications",
        "LinkedIn Ghostwriting",
        "Personal Branding",
        "Bylined Articles",
        "Newsletters",
        "Whitepapers",
        "Longform Content",
        "SEO Content",
        "Content Systems",
        "AdTech",
        "MarTech",
        "SaaS",
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
