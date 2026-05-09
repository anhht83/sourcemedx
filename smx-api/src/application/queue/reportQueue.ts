import { Queue } from 'bullmq'
import { EQueueName } from '../enums/queu.enum'
import { redisConnection } from '../../configs/redis'

//AI response queue
export const reportQueue = new Queue(EQueueName.report_queue, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60, // Keep the job for 60 seconds after completion
      count: 1000, // Keep the last 1000 completed jobs
    },
  },
})
