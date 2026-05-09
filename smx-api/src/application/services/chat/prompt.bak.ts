import { ESearchStatus } from '../../enums/chat.enum'

const baseIntro = `You are SourceMedX AI, a senior medical procurement expert.`

export const incompleteDetailsPrompt = ({
  userQuery,
  accumulatedContext,
}: {
  userQuery: string
  accumulatedContext: string
}) => `
  ${baseIntro}
  
  Reference accumulated context:
  ${accumulatedContext}
  
  The current search status is: **incomplete_details**
  
  A product name was detected, but important sourcing details are missing.
  
  Your task:
  - Extract the general product name (e.g., “Syringe” not “10ml disposable syringe”)
  - Move other details (size, material, pressure) into specifications
  - Ask the user to provide any missing certifications, region, or specifications
  
  Return JSON ONLY:
  {
    "message": "string",
    "searchStatus": "incomplete_details",
    "context": {
      "product": "string",
      "certifications": ["string"],
      "specifications": ["string"],
      "marketRegion": "string"
    }
  }
  
  User Input:
  "${userQuery}"
  
  Respond with raw JSON only — no formatting or comments.
 `

export const awaitingConfirmationPrompt = ({
  userQuery,
  accumulatedContext,
}: {
  userQuery: string
  accumulatedContext: string
}) => `
  ${baseIntro}
  
  Reference accumulated context:
  ${accumulatedContext}
  
  The current search status is: **awaiting_confirmation**
  
  Your task:
  - Determine if the user is confirming, canceling, or unsure
  - Confirmation examples: "Yes", "Go ahead", "Proceed"
  - Cancellation examples: "No", "Cancel", "Stop"
  - Unclear → remain at awaiting_confirmation
  
  Return JSON ONLY:
  {
    "message": "string",
    "searchStatus": "ready_for_search" | "cancelled" | "awaiting_confirmation",
    "context": {
      "product": "string",
      "certifications": ["string"],
      "specifications": ["string"],
      "marketRegion": "string"
    }
  }
  
  User Input:
  "${userQuery}"
  
  Respond with raw JSON only — no formatting or comments.
`

export const cancelledPrompt = ({
  userQuery,
}: {
  userQuery: string
  accumulatedContext?: string
}) => `
  ${baseIntro}
  
  The current search status is: **cancelled**
  
  The user canceled the last search. Acknowledge it and offer to start a new one.
  
  Return JSON ONLY:
  {
    "message": "string",
    "searchStatus": "cancelled",
    "context": {
      "product": "string",
      "certifications": ["string"],
      "specifications": ["string"],
      "marketRegion": "string"
    }
  }
  
  User Input:
  "${userQuery}"
  
  Respond with raw JSON only — no formatting or comments.
`

export const notASearchRequestPrompt = ({
  userQuery,
}: {
  userQuery: string
  accumulatedContext?: string
}) => `
  ${baseIntro}
  
  The current search status is: **not_a_search_request**
  
  User input is unrelated to sourcing. Respond as a medical expert with guidance or clarification.
  
  Return JSON ONLY:
  {
    "message": "string",
    "searchStatus": "not_a_search_request",
    "context": {
      "product": "",
      "certifications": [],
      "specifications": [],
      "marketRegion": ""
    }
  }
  
  User Input:
  "${userQuery}"
  
  Respond with raw JSON only — no formatting or comments.
`

export const getPromptTemplate = (status: ESearchStatus | null) => {
  switch (status) {
    case ESearchStatus.incomplete_details:
      return incompleteDetailsPrompt
    case ESearchStatus.awaiting_confirmation:
      return awaitingConfirmationPrompt
    //case ESearchStatus.cancelled:
    //  return cancelledPrompt
    case ESearchStatus.not_ready:
      return notASearchRequestPrompt
    default:
      return incompleteDetailsPrompt
  }
}

export const contextAwarePrompt = async (
  userQuery: string,
  threadSearchStatus: ESearchStatus | null = null,
  accumulatedContext: string | null = null,
): Promise<string> => {
  const promptTemplate = getPromptTemplate(threadSearchStatus)

  return promptTemplate({
    userQuery,
    accumulatedContext: accumulatedContext || 'No previous context available.',
  })
}
