import { OpenAI } from 'openai'
import { ChatOpenAI } from '@langchain/openai'
import { config } from '../../configs/config'

export class OpenAIService {
  static openai = new OpenAI({ apiKey: config.ai.openAIApiKey })
  static chat = new ChatOpenAI({ apiKey: config.ai.openAIApiKey })

  static generateEmbedding = async (text: string) => {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      //model: 'gpt-4', // cheap
      input: text,
    })
    return response.data[0].embedding
  }
}
