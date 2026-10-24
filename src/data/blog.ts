import fs from "fs";
import { isPublished, isIndexable, type Publication } from "@/lib/publication";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Metadata = Publication & {
  title: string;
  summary: string;
  image?: string;
  dateLabel?: string;
  featuredOrder?: number;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      handlers: {
        heading(state, node) {
          const heading = state.all(node);
          const text = (children: typeof heading): string =>
            children.map((child) =>
              "value" in child ? child.value : "children" in child ? text(child.children) : ""
            ).join("");
          const id = text(heading).toLowerCase().trim()
            .replace(/\s+/g, "-").replace(/&/g, "-and-")
            .replace(/[^\w-]+/g, "").replace(/-+/g, "-");
          return { type: "element", tagName: `h${node.depth}`, properties: { id }, children: heading };
        },
      },
    })
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data } = matter(source);
  const metadata = data as Metadata;
  if (!isPublished(metadata)) return null;
  const content = await markdownToHTML(rawContent);
  return {
    source: content,
    metadata,
    slug,
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      return getPost(slug);
    }),
  );
  return posts.filter((post): post is NonNullable<typeof post> => post !== null);
}

export async function getPublishedPosts() {
  const posts = await getAllPosts(path.join(process.cwd(), "content"));
  return posts.sort((a, b) =>
    b.metadata.publishedAt.localeCompare(a.metadata.publishedAt) ||
    a.metadata.title.localeCompare(b.metadata.title)
  );
}

// One indexability policy drives the archive, featured Notes and sitemap.
export async function getBlogPosts() {
  return (await getPublishedPosts()).filter(post => isIndexable(post.metadata));
}
