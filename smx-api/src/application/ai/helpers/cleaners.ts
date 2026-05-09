import { genericWords } from './genericWords'

/**
 * Cleans and formats extracted specifications.
 * - Trims whitespace
 * - Capitalizes each word
 * - Normalizes multiple spaces
 */
export function cleanSpecifications(specifications: string[]): string[] {
  return specifications
    .filter(Boolean)
    .map((spec) =>
      spec
        .trim()
        .replace(/\s+/g, ' ') // normalize spaces
        .split(' ')
        .filter((word) => !genericWords.has(word.toLowerCase())) // remove generic terms
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' '),
    )
    .filter((spec, index, self) => self.indexOf(spec) === index) // deduplicate
}

/**
 * Cleans and formats extracted certifications.
 * - Trims whitespace
 * - Converts to uppercase
 */
export function cleanCertifications(certifications: string[]): string[] {
  return certifications
    .filter(Boolean)
    .map((cert) => cert.trim().toUpperCase())
    .filter((cert, index, self) => self.indexOf(cert) === index) // deduplicate
}

/**
 * Cleans and formats extracted market regions.
 * - Trims whitespace
 * - Converts to uppercase
 */
export function cleanMarketRegions(marketRegions: string[]): string[] {
  return marketRegions
    .filter(Boolean)
    .map((region) => region.trim().toUpperCase())
    .filter((region, index, self) => self.indexOf(region) === index) // deduplicate
}
