import { Queue } from 'bullmq'
import { EQueueName, EQueueStatus } from '../enums/queu.enum'
import { redisConnection } from '../../configs/redis'

//AI response queue
export const aiQueue = new Queue(EQueueName.ai_response_queue, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60, // Keep the job for 60 seconds after completion
      count: 100, // Keep the last 1000 completed jobs
    },
  },
})

export const getAIQueueStatusForThread = async (
  threadId: string,
): Promise<EQueueStatus> => {
  const jobs = await aiQueue.getJobs(['active', 'waiting'])
  const hasJob = jobs.some((job) => job.data.thread?.id === threadId)
  console.log(hasJob ? `has active Job ${threadId}` : `no active job`)
  return hasJob ? EQueueStatus.pending : EQueueStatus.idle
}
