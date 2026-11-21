import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/writing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.meta.title ?? "Writing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: title.length > 60 ? 44 : 56,
            color: "#15140f",
            fontFamily: "monospace",
            fontWeight: 600,
            lineHeight: 1.2,
            maxWidth: "1040px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#b9512a",
            marginTop: 24,
            fontFamily: "monospace",
          }}
        >
          Keith O&apos;Brien
        </div>
      </div>
    ),
    { ...size },
  );
}
