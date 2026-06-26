import Link from "next/link";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { IndexTable } from "@/components/index-table";
import { featuredProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/writing";
import { getHome } from "@/lib/site-content";

export default function Home() {
  const home = getHome();
  const featured = featuredProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <>
      {/* Hero */}
      <Container className="pt-[104px] pb-[88px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {`// ${home.tagline}`}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          {home.name}
        </h1>
        <p className="mt-[34px] text-[14.5px] leading-[1.95] text-[var(--color-body)] max-w-[600px]">
          {home.introPrefix}
          <span className="text-[var(--color-accent)]">{home.introHighlight}</span>
          {home.introSuffix}
        </p>
        <p className="mt-[18px] text-[13.5px] leading-[1.9] text-[var(--color-muted)] max-w-[580px]">
          {home.secondary}
        </p>
      </Container>

      {/* Explore / facets */}
      <Section label="Explore">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          {home.facets.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              {...(f.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group block"
            >
              <h3 className="text-[14px] font-medium text-[var(--color-fg)] transition-opacity group-hover:opacity-55">
                {f.label}{" "}
                <span className="text-[var(--color-accent)]">&rarr;</span>
              </h3>
              <p className="mt-[8px] text-[12.5px] leading-[1.8] text-[var(--color-muted)]">
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Selected projects */}
      {featured.length > 0 && (
        <Section
          label={
            <>
              Selected
              <br />
              projects
            </>
          }
        >
          <IndexTable
            columns={[
              { label: "#", className: "w-11", accent: true },
              { label: "PROJECT", className: "flex-1 pr-4" },
              { label: "STACK", className: "w-[160px]" },
            ]}
            rows={featured.map((p, i) => ({
              cells: [
                String(i + 1).padStart(2, "0"),
                <span key="t" className="flex flex-col gap-[6px]">
                  <span className="text-[var(--color-fg)] font-medium">
                    {p.name}
                  </span>
                  <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
                    {p.description}
                  </span>
                </span>,
                p.stack.slice(0, 2).join(" · "),
              ],
              href: p.url ?? "/projects",
              external: Boolean(p.url),
              ariaLabel: p.url ? `${p.name} (opens in new window)` : undefined,
            }))}
          />
          <Link
            href="/projects"
            className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
          >
            all projects &rarr;
          </Link>
        </Section>
      )}

      {/* Latest writing */}
      {posts.length > 0 && (
        <Section label="Writing">
          <IndexTable
            columns={[
              { label: "#", className: "w-11", accent: true },
              { label: "TITLE", className: "flex-1 pr-4" },
              { label: "DATE", className: "w-[110px] text-right" },
            ]}
            rows={posts.map((post, i) => ({
              cells: [
                String(i + 1).padStart(2, "0"),
                <span key="t" className="flex flex-col gap-[6px]">
                  <span className="text-[var(--color-fg)] font-medium">
                    {post.title}
                  </span>
                  <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
                    {post.excerpt}
                  </span>
                </span>,
                post.date,
              ],
              href: `/writing/${post.slug}`,
            }))}
          />
          <Link
            href="/writing"
            className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
          >
            all writing &rarr;
          </Link>
        </Section>
      )}
    </>
  );
}
