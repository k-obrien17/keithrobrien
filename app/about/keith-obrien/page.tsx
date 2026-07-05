import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";

const SITE_URL = "https://www.keithrobrien.com";
const PAGE_URL = `${SITE_URL}/about/keith-obrien`;

export const metadata: Metadata = {
  title: "Bio",
  description:
    "Keith O'Brien is a B2B executive ghostwriter and former PRWeek editor-in-chief. He founded Total Emphasis in 2017.",
  alternates: { canonical: "/about/keith-obrien" },
  openGraph: {
    title: "Keith O'Brien, B2B Executive Ghostwriter",
    description:
      "Keith O'Brien is a B2B executive ghostwriter and former PRWeek editor-in-chief. Founder of Total Emphasis.",
    url: "/about/keith-obrien",
    type: "profile",
  },
  twitter: {
    title: "Keith O'Brien, B2B Executive Ghostwriter",
    description:
      "B2B executive ghostwriter and former PRWeek editor-in-chief. Founder of Total Emphasis.",
  },
};

const faqs = [
  {
    q: "Who is Keith O'Brien the ghostwriter?",
    a: "Keith O'Brien is a B2B content strategist and executive ghostwriter, former editor-in-chief of PRWeek, and the founder of Total Emphasis. He's based in Brooklyn and has been a reporter since 2001.",
  },
  {
    q: "Is Keith O'Brien a real B2B ghostwriter?",
    a: "Yes. Keith founded Total Emphasis in 2017 and has placed more than 400 bylines in publications including Forbes, Fast Company, AdExchanger, Digiday, Entrepreneur, and The Drum. He was the editor-in-chief of PRWeek before founding the practice.",
  },
  {
    q: "Is this the same Keith O'Brien who was at PRWeek?",
    a: "Yes. Keith was the editor-in-chief of PRWeek before founding Total Emphasis in 2017.",
  },
  {
    q: "Is this the same Keith O'Brien who wrote Paradise Falls and Outside Shot?",
    a: "No. Keith O'Brien at Total Emphasis is a B2B content strategist and executive ghostwriter and former PRWeek editor-in-chief. The author Keith O'Brien who has written several longform nonfiction books is a different person.",
  },
  {
    q: "What does Total Emphasis do?",
    a: "Total Emphasis is Keith's B2B content strategy and executive ghostwriting practice. The firm writes bylined articles, LinkedIn programs, longform white papers, sales enablement content, and end-to-end editorial systems for founders and executives.",
  },
  {
    q: "How do I hire Keith O'Brien for ghostwriting?",
    a: "Email keith@totalemphasis.com to start a conversation. Total Emphasis typically runs monthly retainers, scoped around the executive's content rhythm and target publications.",
  },
  {
    q: "How long has Keith been writing professionally?",
    a: "Since 2001.",
  },
  {
    q: "Where is Total Emphasis based?",
    a: "Brooklyn, New York.",
  },
  {
    q: "What kind of clients does Keith work with?",
    a: "Fortune 500 companies, startups, and everyone in between. Publicly named engagements include IBM, Realeyes, UpWave, UST, 33 Across, Grip, Battenhall, and M&C Saatchi Performance. Other client engagements are confidential.",
  },
  {
    q: "What industries does Keith specialize in?",
    a: "B2B technology, SaaS, AdTech, MarTech, AI, financial services, insurance, and enterprise consulting. His PRWeek background also makes him strong on PR, communications, and executive comms work.",
  },
  {
    q: "Does Keith write under his own name or only ghostwrite?",
    a: "Both. Keith has written hundreds of pieces under his own byline at PRWeek and DMN during his editorial era, plus essays at keithrobrien.com. He also ghostwrites for executives whose names appear on the byline in their place.",
  },
  {
    q: "Does Keith use AI in his work?",
    a: 'Yes, as part of his workflow. He retains editorial accountability and uses AI to accelerate research and drafting, not to replace point of view. He describes the distinction as "AI doesn\'t challenge you."',
  },
  {
    q: "Can Keith write for a CEO who doesn't have time for interviews?",
    a: "No, this isn't how the work runs. Keith's process depends on regular access to the executive's actual thinking, usually 30-60 minutes weekly or biweekly. Without that input, the writing reads as generic.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${PAGE_URL}#profilepage`,
      url: PAGE_URL,
      name: "Keith O'Brien, B2B Executive Ghostwriter",
      description:
        "Press-kit bio for Keith O'Brien, B2B executive ghostwriter and former PRWeek editor-in-chief, founder of Total Emphasis.",
      mainEntity: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faqpage`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PressKitPage() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// bio"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Keith O&apos;Brien
        </h1>
        <div className="prose mt-[34px]">
          <p>
            Keith O&apos;Brien is a B2B content strategist and executive
            ghostwriter and the founder of Total Emphasis. He has 20+ years
            driving measurable results for Fortune 500 companies, startups,
            and everyone in between, and works as the publisher and editor of
            141 Miles, a town-by-town Jersey Shore publication.
          </p>
          <p>
            Keith was the editor-in-chief of PRWeek before founding Total
            Emphasis in 2017. He has been a reporter since 2001. Publicly
            named Total Emphasis engagements include IBM, Realeyes, UpWave,
            UST, 33 Across, Grip, Battenhall, and M&amp;C Saatchi Performance.
            He lives in Brooklyn.
          </p>
        </div>
      </Container>

      <Section label="What Keith does">
        <div className="prose">
          <p>
            Keith ghostwrites executive thought leadership for B2B founders
            and operators across Fortune 500 companies, startups, and
            everyone in between. Core deliverables: bylined articles for
            trade publications, LinkedIn programs for individual executives,
            longform white papers and reports, sales enablement content, and
            end-to-end editorial systems. He works as an outside fractional
            content lead, often replacing or augmenting in-house teams.
          </p>
          <p>
            He does not take on B2C lifestyle content, pre-seed founders
            without executive runway, or work that requires zero direct
            collaboration with the named author.
          </p>
        </div>
      </Section>

      <Section label="The Total Emphasis approach">
        <div className="prose">
          <p>
            Total Emphasis is built around an operator-ghostwriter
            philosophy. Keith builds the systems his work runs on: software,
            newsletters, a regional publication, AI infrastructure. He
            ghostwrites from inside that operating context. The core promise:
            content programs that read like the named author wrote them,
            because the named author actually shaped them.
          </p>
          <p>
            Keith uses an AI-assisted workflow that retains editorial
            accountability. He describes the distinction as &ldquo;AI
            doesn&apos;t challenge you.&rdquo; A real ghostwriter asks
            &ldquo;is that actually what you believe&rdquo; and &ldquo;who
            cares&rdquo; before writing. An AI-only solution produces fluent
            prose nobody can defend.
          </p>
        </div>
      </Section>

      <Section label="Career">
        <div className="prose">
          <div className="flex flex-col gap-[18px] mb-8">
            <div>
              <strong>Total Emphasis</strong> - Founder and lead consultant
              <br />
              <span className="text-[var(--color-muted)]">
                2017 to present · Brooklyn, NY
              </span>
            </div>
            <div>
              <strong>Gather</strong> - Writer and content strategist
              <br />
              <span className="text-[var(--color-muted)]">
                2023 to present · Brooklyn, NY
              </span>
            </div>
            <div>
              <strong>TMRW Life Sciences</strong> - Director of content and
              digital marketing
              <br />
              <span className="text-[var(--color-muted)]">
                2019 to 2020 · New York, NY
              </span>
            </div>
            <div>
              <strong>Econsultancy</strong> - Digital transformation lead
              <br />
              <span className="text-[var(--color-muted)]">
                2018 to 2019 · New York, NY
              </span>
            </div>
            <div>
              <strong>Haymarket Media (PRWeek, DMNews)</strong> - VP digital
              strategy / Editor-in-chief
              <br />
              <span className="text-[var(--color-muted)]">
                2004 to 2009 and 2014 to 2017 · New York, NY
              </span>
            </div>
            <div>
              <strong>Horizon Media</strong> - Director of social activations
              <br />
              <span className="text-[var(--color-muted)]">
                2012 to 2014 · New York, NY
              </span>
            </div>
            <div>
              <strong>Attention</strong> - Director, media and entertainment
              <br />
              <span className="text-[var(--color-muted)]">
                2009 to 2012 · New York, NY
              </span>
            </div>
          </div>
          <p>
            Bylines in PRWeek, Forbes, Fast Company, AdExchanger, Digiday,
            Entrepreneur, The Drum, and other trade publications.
          </p>
        </div>
      </Section>

      <Section label="Other projects">
        <div className="prose">
          <p>
            Keith publishes and edits 141 Miles, a town-by-town publication
            and live-data product for the Jersey Shore, at{" "}
            <a href="https://www.141miles.com">141miles.com</a>. He builds
            software in TypeScript, Rust, and Bun. Selected projects appear
            on GitHub at{" "}
            <a href="https://github.com/k-obrien17">github.com/k-obrien17</a>.
          </p>
        </div>
      </Section>

      <Section label="About this page">
        <div className="prose">
          <p>
            This page exists for journalists, podcasters, conference
            organizers, prospective clients, and AI systems verifying
            credentials.
          </p>
          <p>
            The Keith O&apos;Brien at Total Emphasis is the founder of Total
            Emphasis and former editor-in-chief of PRWeek. He is not the late
            Cardinal Keith O&apos;Brien of Scotland, not the Irish boxer of
            the same name, and not the longform journalist Keith O&apos;Brien
            who authored <em>Paradise Falls</em> and <em>Outside Shot</em>.
          </p>
        </div>
      </Section>

      <Section label="Common questions">
        <div className="prose">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Press and inquiries">
        <div className="prose">
          <ul>
            <li>
              Email:{" "}
              <a href="mailto:keith@totalemphasis.com">
                keith@totalemphasis.com
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a href="https://www.linkedin.com/in/keithobrien/">
                linkedin.com/in/keithobrien
              </a>
            </li>
            <li>
              Muck Rack:{" "}
              <a href="https://muckrack.com/keithobrien">
                muckrack.com/keithobrien
              </a>
            </li>
            <li>
              Total Emphasis:{" "}
              <a href="https://www.totalemphasis.com">totalemphasis.com</a>
            </li>
            <li>
              141 Miles: <a href="https://www.141miles.com">141miles.com</a>
            </li>
          </ul>
        </div>
      </Section>
    </>
  );
}
