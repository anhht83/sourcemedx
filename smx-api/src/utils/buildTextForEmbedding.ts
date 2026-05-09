import { cleanTextForTsvector } from './cleanTextForTsvector'
import { TDevice } from '../application/interfaces/device.interface'

export function buildTextForEmbedding(device: TDevice): string {
  const namePart = cleanTextForTsvector(device.name?.trim() || '')
  const descriptionPart = cleanTextForTsvector(device.description?.trim() || '')
  const gmdnPart =
    device.terms?.map((term) => cleanTextForTsvector(term.name)).join(', ') ||
    ''

  let combined = `${namePart}. ${descriptionPart}.`

  if (gmdnPart) {
    combined += ` Related terms: ${gmdnPart}.`
  }

  return combined.trim()
}
