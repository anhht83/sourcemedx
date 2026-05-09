export function cleanTextForExcel(input: string | undefined | null): string {
  if (!input) return ''

  return (
    String(input)
      // Remove null bytes and control characters
      .replace(/\x00/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

      // Remove or replace problematic characters for Excel
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
      .replace(/[\uFFFD]/g, '') // Replacement character

      // Handle common problematic characters
      .replace(/[\u2018\u2019]/g, "'") // Smart quotes to regular quotes
      .replace(/[\u201C\u201D]/g, '"') // Smart double quotes to regular quotes
      .replace(/[\u2013\u2014]/g, '-') // Em dash and en dash to regular dash
      .replace(/[\u2022]/g, '•') // Bullet point to regular bullet

      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  )
}
