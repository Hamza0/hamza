import type { ErrorExample } from "@/lib/note-helpers";
import { AlertTriangle, FileWarning } from "lucide-react";

// These are illustrative reconstructions, not screenshots of client incidents.
// Keep error text available as HTML rather than embedding it in an image.
export function NoteErrorExample({ example }: { example: ErrorExample }) {
  const warning = example.kind === "warning";
  const Icon = warning ? AlertTriangle : FileWarning;

  return (
    <figure className="my-6 overflow-hidden rounded-[18px] border border-border/80 bg-card">
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b bg-muted/70 px-4 py-2.5">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded-md border bg-background/80 px-3 py-1 text-xs text-muted-foreground">example.com</span>
      </div>
      <div className="space-y-2.5 px-5 py-5 sm:px-6">
        <Icon aria-hidden="true" className={warning ? "size-7 text-red-600 dark:text-red-400" : "size-7 text-muted-foreground"} strokeWidth={1.6} />
        <p className="text-[19px] font-semibold leading-snug tracking-tight">{example.title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{example.detail}</p>
        <p className="break-words font-mono text-xs leading-relaxed text-muted-foreground">{example.code}</p>
      </div>
      <figcaption className="border-t px-5 pt-3 text-[12px] leading-relaxed text-muted-foreground">Illustrative error screen. Appearance may vary.</figcaption>
      <div className="px-5 pb-4 pt-2">
        <a href="#get-help" className="text-sm font-medium text-[hsl(var(--note-accent))] underline underline-offset-4">Seeing this now? Tell me what happened.</a>
      </div>
    </figure>
  );
}
