export function cleanTextForTsvector(input: string | undefined): string {
  if (!input) return ''
  return input
    .replace(/[^\w\s]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim()
}
