import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://keithrobrien.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Keith O'Brien",
    template: "%s · Keith O'Brien",
  },
  description:
    "Keith O'Brien: content strategist, big idea tinkerer, chill dude. Founder of Total Emphasis, plus software, newsletters, and writing.",
  openGraph: {
    title: "Keith O'Brien",
    description:
      "Content strategist, big idea tinkerer, chill dude. Founder of Total Emphasis, plus software, newsletters, and writing.",
    url: SITE_URL,
    siteName: "Keith O'Brien",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
