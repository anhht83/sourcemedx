import { OpenAI } from 'openai'
import { ChatOpenAI, AzureChatOpenAI } from '@langchain/openai'
import { config } from './config'

export const openAi = {
  openai: new OpenAI({ apiKey: config.ai.openAIApiKey }),
  chat: (model?: string) => {
    switch (config.ai.provider) {
      case 'azure':
        return new AzureChatOpenAI({
          azureOpenAIApiKey: config.ai.azureOpenAIApiKey,
          azureOpenAIApiInstanceName: config.ai.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName: config.ai.azureOpenAIApiDeploymentName,
          azureOpenAIEndpoint: config.ai.azureOpenAIEndpoint,
          azureOpenAIApiVersion: config.ai.azureOpenAIApiVersion,
          temperature: 0.3,
        })
      default:
        return new ChatOpenAI({
          apiKey: config.ai.openAIApiKey,
          model: model || config.ai.openAIModel,
          temperature: 0.3,
        })
    }
  },
  generateEmbedding: async (text: string) => {
    const response = await openAi.openai.embeddings.create({
      model: config.ai.openAIEmbeddingModel,
      input: text,
    })
    return response.data[0].embedding
  },
}
