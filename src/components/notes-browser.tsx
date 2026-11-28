"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { NotePinboardCard, type NotePinboardCardProps } from "@/components/note-pinboard-card";

export function NotesBrowser({ notes }: { notes: NotePinboardCardProps[] }) {
  const [query, setQuery] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = terms.length === 0 ? notes : notes.filter(note => {
    const haystack = [note.title, note.summary, note.topic, note.slug.replace(/-/g, " ")].join(" ").toLowerCase();
    return terms.every(term => haystack.includes(term));
  });

  function clear() {
    setQuery("");
    field.current?.focus();
  }

  return (
    <section id="all-notes" aria-labelledby="notes-list-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="notes-list-title" className="text-[22px] font-semibold tracking-[-0.025em]">All notes</h2>
        <p role="status" className="text-[13px] tabular-nums text-muted-foreground">{terms.length ? visible.length + " of " + notes.length : notes.length} {terms.length ? "matches" : "notes"}</p>
      </div>
      <div className="relative mt-3">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
        <input
          ref={field}
          type="search"
          aria-label="Search notes"
          value={query}
          maxLength={120}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search by topic or problem"
          className="notes-search-field h-12 w-full rounded-[14px] border border-transparent pl-11 pr-12 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && <button type="button" aria-label="Clear search" onClick={clear} className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden="true" className="size-4" /></button>}
      </div>
      {visible.length > 0 ? (
        <ul className="mt-3 divide-y divide-border/70">
          {visible.map(note => <li key={note.slug}><NotePinboardCard {...note} /></li>)}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border p-5">
          <p className="text-[16px] font-semibold">No matching notes</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a shorter search, such as WordPress or email.</p>
          <button type="button" onClick={clear} className="mt-3 text-sm font-medium text-[hsl(var(--note-accent))] underline underline-offset-4">Show all notes</button>
        </div>
      )}
    </section>
  );
}
