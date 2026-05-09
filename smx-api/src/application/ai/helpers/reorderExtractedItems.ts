/**
 * Advanced Reorder Extracted data:
 * - Case-insensitive
 * - Fuzzy matches (allow partial phrase match)
 * - Ignore minor plural/singular differences
 *
 * @param {string} userQuery - The user input
 * @param {string[]} extracted - The extracted specifications/certifications/market regions
 * @returns {string[]} - Reordered items
 */
export function reorderExtractedItems(
  userQuery: string,
  extracted: string[],
): string[] {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, ' ') // normalize spaces
      .replace(/[^a-z0-9\s]/g, '') // remove non-alphanumeric
      .trim()

  const singularize = (word: string) => word.replace(/s$/, '') // very simple singular form

  const loweredQuery = normalize(userQuery)

  // Map each item to their best match index
  const itemPositions = extracted
    .map((item) => {
      const normalizedItem = normalize(item)

      // Try direct full match
      let index = loweredQuery.indexOf(normalizedItem)

      // If not found, try singularized version
      if (index === -1) {
        const singularItem = singularize(normalizedItem)
        index = loweredQuery.indexOf(singularItem)
      }

      // Still not found? Try individual words
      if (index === -1) {
        const words = normalizedItem.split(' ')
        for (const word of words) {
          const singularWord = singularize(word)
          const wordIndex = loweredQuery.indexOf(word)
          const singularWordIndex = loweredQuery.indexOf(singularWord)
          if (wordIndex !== -1) {
            index = wordIndex
            break
          } else if (singularWordIndex !== -1) {
            index = singularWordIndex
            break
          }
        }
      }

      return {
        item,
        index,
      }
    })
    // Only keep ones that found a match
    .filter((item) => item.index !== -1)

  // Sort by first appearance
  itemPositions.sort((a, b) => a.index - b.index)

  return itemPositions.map((item) => item.item)
}
