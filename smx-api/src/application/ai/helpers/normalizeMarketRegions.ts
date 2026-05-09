// --- Region normalization helper ---
const COUNTRY_CODE_MAP: Record<string, string> = {
  Germany: 'DE',
  USA: 'US',
  'United States': 'US',
  'United Kingdom': 'GB',
  UK: 'GB',
}

const REGION_BLOCKS = ['EU', 'ASEAN', 'Middle East', 'Africa']

export function normalizeMarketRegions(input: string[]): string[] {
  const results = new Set<string>()
  for (const region of input) {
    const trimmed = region.trim()
    if (REGION_BLOCKS.includes(trimmed)) {
      results.add(trimmed)
    } else if (COUNTRY_CODE_MAP[trimmed]) {
      results.add(COUNTRY_CODE_MAP[trimmed])
    } else {
      results.add(trimmed)
    }
  }
  return Array.from(results)
}
