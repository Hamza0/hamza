import remarkParse from "remark-parse";
import { unified } from "unified";

export type NoteHeading = {
  id: string;
  title: string;
};

const textParser = unified().use(remarkParse);

// Reuse the existing Markdown parser's character-reference handling. Parsing
// each reference separately leaves literal punctuation in heading text intact.
function decodeReferences(value: string): string {
  return value.replace(/&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, (reference) => {
    const paragraph = textParser.parse(reference).children[0];
    if (paragraph?.type !== "paragraph" || paragraph.children.length !== 1) return reference;
    const text = paragraph.children[0];
    return text.type === "text" ? text.value : reference;
  });
}

// Only call this with the HTML compiled from local note content. Preserve the
// existing IDs rather than creating a second, potentially different slug rule.
export function extractNoteHeadings(html: string): NoteHeading[] {
  const headings: NoteHeading[] = [];
  const seen = new Set<string>();
  const pattern = /<h2\b([^>]*)>([\s\S]*?)<\/h2\s*>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const attribute = /(?:^|\s)id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(match[1]);
    if (!attribute) continue;

    const id = decodeReferences(attribute[1] ?? attribute[2] ?? attribute[3]);
    const title = decodeReferences(match[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, ""))
      .replace(/\s+/g, " ")
      .trim();

    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    headings.push({ id, title });
  }

  return headings;
}

export function splitNoteLead(html: string): { lead: string; body: string } {
  const leadingParagraph = /^\s*<p(?:\s[^>]*)?>[\s\S]*?<\/p\s*>/i.exec(html);
  if (!leadingParagraph) return { lead: "", body: html };

  return {
    lead: leadingParagraph[0],
    body: html.slice(leadingParagraph[0].length),
  };
}
