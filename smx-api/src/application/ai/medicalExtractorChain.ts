import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { openAi } from '../../configs/openai'
import { EAiSearchRequestStatus } from '../enums/chat.enum'
import { ISearchRequestContext } from '../interfaces/chat.interface'
import { normalizeMarketRegions } from './helpers/normalizeMarketRegions'
import {
  cleanCertifications,
  cleanMarketRegions,
  cleanSpecifications,
} from './helpers/cleaners'
import { reorderExtractedItems } from './helpers/reorderExtractedItems'

// --- Zod schema ---
const extractionSchema = z.object({
  message: z.string(),
  searchStatus: z.nativeEnum(EAiSearchRequestStatus),
  context: z.object({
    specifications: z.array(z.string()),
    certifications: z.array(z.string()),
    marketRegions: z.array(z.string()),
  }),
})

const parser = StructuredOutputParser.fromZodSchema(extractionSchema)

// --- Prompt Template ---
const contextAwarePrompt = `
You are SourceMedX AI — a senior procurement assistant for medical devices.

Your task:
- Always extract structured fields:
  • specifications: general device names, material, size, connectors, sterility (from user input)
  • certifications: CE, FDA, MDR, ISO
  • marketRegions: ISO 2-char codes like "DE", or region blocks like "EU"
- Always add any useful keywords even from partial, short, or fragmentary input.
- Merge extracted data with previous context (no duplicates).

Rules:
IF threadStatus = "awaiting_confirmation":
- If user confirms (e.g. yes, proceed) → searchStatus = "ready_for_search"
- If user rejects or cancels → searchStatus = "cancelled", and reset context to empty
- Else → searchStatus = "awaiting_confirmation" and ask for confirmation

IF threadStatus ≠ "awaiting_confirmation":
- If specifications is empty → searchStatus = "incomplete_details"
- Else → searchStatus = "awaiting_confirmation"

Return only valid JSON. No markdown. No explanations. No markdown formatting.

{{
  "message": "...",
  "searchStatus": "...",
  "context": {{
    "specifications": ["..."],
    "certifications": ["..."],
    "marketRegions": ["..."]
  }}
}}

threadStatus: {threadSearchStatus}
Previous context: {context}
User input: {userQuery}
`

// --- Model & Chain Setup ---
const model = openAi.chat()

export const buildMedicalExtractorChain = () => {
  const prompt = ChatPromptTemplate.fromTemplate(contextAwarePrompt)
  return RunnableSequence.from([prompt, model, parser])
}

// --- Post-processing: merge or reset context ---
export const processExtractedResponse = (
  userQuery: string,
  response: Awaited<
    ReturnType<ReturnType<typeof buildMedicalExtractorChain>['invoke']>
  >,
  previousContext: ISearchRequestContext = {},
): typeof response => {
  if (response.searchStatus === 'cancelled') {
    response.context = {
      specifications: [],
      certifications: [],
      marketRegions: [],
    }
    return response
  }

  const merge = (a: string[] = [], b: string[] = []) =>
    Array.from(new Set([...a, ...b]))

  response.context = {
    specifications: cleanSpecifications(
      merge(
        previousContext?.specifications || [],
        reorderExtractedItems(
          userQuery,
          response?.context?.specifications || [],
        ),
      ),
    ),
    certifications: cleanCertifications(
      merge(
        previousContext?.certifications || [],
        response?.context?.certifications || [],
      ),
    ),
    marketRegions: cleanMarketRegions(
      normalizeMarketRegions(
        merge(
          previousContext?.marketRegions || [],
          response?.context?.marketRegions || [],
        ),
      ),
    ),
  }

  return response
}
