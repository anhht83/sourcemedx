import dotenv from 'dotenv'
import path from 'path'
import { IEmailConfig } from '../application/interfaces/email.interface'

// Determine which .env file to use
const envFile = `.env.${process.env.NODE_ENV || 'development'}`

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) })

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  landingUrl: process.env.LANDING_URL || 'http://localhost',
  jwt: {
    accessSecret: process.env.JWT_SECRET || 'default_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_secret',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    name: process.env.DB_NAME || 'smx',
  },
  emailProvider: process.env.EMAIL_PROVIDER || 'mailerSend',
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    senderEmail: process.env.SENDGRID_SENDER_EMAIL || '',
    templates: {
      resetPassword: process.env.SENDGRID_TEMPLATE_ID_RESET_PASSWORD || '',
    },
  } as IEmailConfig,
  mailerSend: {
    apiKey: process.env.MAILERSEND_API_KEY || '',
    senderEmail: process.env.MAILERSEND_SENDER_EMAIL || '',
    templates: {
      resetPassword: process.env.MAILERSEND_TEMPLATE_ID_RESET_PASSWORD || '',
      newsletterSignup:
        process.env.MAILERSEND_TEMPLATE_ID_NEWSLETTER_SIGNUP || '',
    },
  } as IEmailConfig,
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    // azure
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY || '',
    azureOpenAIApiInstanceName: process.env.sourcemedx || 'sourcemedx',
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME || 'gpt-4-turbo',
    azureOpenAIEndpoint:
      process.env.AZURE_OPENAI_ENDPOINT ||
      'https://sourcemedx.openai.azure.com/',
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || '2023-05-15',
    // openai
    openAIApiKey: process.env.OPENAI_API_KEY || '',
    openAIModel: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    openAIEmbeddingModel:
      process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    successUrl:
      process.env.STRIPE_SUCCESS_URL ||
      'http://localhost:3000/billing/stripe/successUrl',
    cancelUrl:
      process.env.STRIPE_CANCEL_URL ||
      'http://localhost:3000/billing/stripe/cancelUrl',
  },
  searchKey: {
    rewardRegister: process.env.SEARCH_KEY_REWARD_REGISTER || 2,
    basePrice: process.env.SEARCH_KEY_BASE_PRICE || 10,
    expirationDays: process.env.SEARCH_KEY_EXPIRATION_DAYS || 30,
    smallBundle: process.env.SEARCH_KEY_SMALL_BUNDLE || 5,
    smallDiscount: process.env.SEARCH_KEY_SMALL_DISCOUNT || 5,
    largeBundle: process.env.SEARCH_KEY_LARGE_BUNDLE || 20,
    largeDiscount: process.env.SEARCH_KEY_LARGE_DISCOUNT || 10,
  },
}
