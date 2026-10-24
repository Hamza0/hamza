import { ImageResponse } from "next/og";
import { getPost, getPublishedPosts } from "@/data/blog";
import { CASE_STUDY } from "@/lib/case-study";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return [...(await getPublishedPosts()).map(post => ({ slug: post.slug })), { slug: CASE_STUDY.slug }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = slug === CASE_STUDY.slug ? null : await getPost(slug);
  if (!post && slug !== CASE_STUDY.slug) return new Response("Not found", { status: 404 });
  const title = post?.metadata.title ?? CASE_STUDY.title;
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#101113", color: "#fafafa", padding: "70px 80px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 26, color: "#a6b0bd" }}>{post ? "TECHNICAL NOTES" : "ENGINEERING CASE STUDY"}</div>
      <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 64, lineHeight: 1.12, fontWeight: 700, letterSpacing: "-2px" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 26 }}>
        <div style={{ display: "flex" }}>Hamza Shakeel · Software Developer</div>
        <div style={{ display: "flex", color: "#a6b0bd", fontSize: 22 }}>hamzashakeel.ca</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
