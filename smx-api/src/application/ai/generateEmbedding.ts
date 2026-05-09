import { openAi } from '../../configs/openai'

export const generateEmbedding = async (text: string) => {
  return openAi.generateEmbedding(text)
}
