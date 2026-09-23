function normalizeDimensionAttributes(input: string) {
  return input.replace(
    /\b(width|height)\s*=\s*([0-9]+)"/gi,
    (_, attr: string, value: string) => `${attr}="${value}"`,
  );
}

function normalizeBareDimensionAttributes(input: string) {
  return input.replace(
    /\b(width|height)\s*=\s*([0-9]+)(?=[\s/>])/gi,
    (_, attr: string, value: string) => `${attr}="${value}"`,
  );
}

export function normalizeCmsMarkdown(markdown: string) {
  if (!markdown) return markdown;

  // Some legacy SQLite migrations stored escaped line breaks literally. Turn
  // them back into real Markdown line breaks before parsing or indexing.
  let normalized = markdown.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  normalized = normalizeDimensionAttributes(normalized);
  normalized = normalizeBareDimensionAttributes(normalized);
  return normalized;
}
