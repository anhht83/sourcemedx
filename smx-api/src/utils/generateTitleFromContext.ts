import { ISearchRequestContext } from '../application/interfaces/chat.interface'

export function generateTitleFromContext(
  context: ISearchRequestContext,
): string {
  const certPart = context?.certifications?.length
    ? ` within ${context.certifications.join(', ')}) certified `
    : ''
  const specPart = context?.specifications?.slice(0, 2).join(' ')
  const regionPart = context?.marketRegions?.length
    ? `for ${context.marketRegions.join(', ')}`
    : ''

  return `${specPart} ${certPart}${regionPart}`.trim()
}
