import Redis from 'ioredis'
import { config } from './config'

export const redisConnection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
})
