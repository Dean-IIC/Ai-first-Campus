/** Splits markdown into sections at each "## Heading". Text before the first heading is the intro. */
export function splitSections(md: string): { intro: string; sections: { id: string; title: string; body: string }[] } {
  const parts = md.split(/^## +/m);
  const intro = parts.shift()?.trim() ?? "";
  const sections = parts.map((part) => {
    const [first, ...rest] = part.split("\n");
    const title = first.trim();
    return {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      body: rest.join("\n").trim(),
    };
  });
  return { intro, sections };
}
