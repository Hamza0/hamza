// Only exact, standalone suggestion lines are toggled. Edited prose and
// user-entered details are never rewritten or truncated.
export function hasNoteStarter(message: string, starter: string): boolean {
  return message.split(/\r?\n/).some(line => line === starter);
}

export function toggleNoteStarter(message: string, starter: string, limit: number): string {
  if (hasNoteStarter(message, starter)) {
    return message.split(/\r?\n/).filter(line => line !== starter).join("\n");
  }
  const separator = message.length && !message.endsWith("\n") ? "\n" : "";
  const next = message + separator + starter;
  return next.length <= limit ? next : message;
}
