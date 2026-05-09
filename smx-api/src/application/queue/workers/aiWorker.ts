import { ChatUseCase } from '../../usecases/chat.usecase'
import { Worker } from 'bullmq'
import { redisConnection } from '../../../configs/redis'
import { EQueueName } from '../../enums/queu.enum'
import { Server as SocketServer } from 'socket.io'
import { ESocketEvent } from '../../enums/socket.enum'
import { ESender } from '../../enums/chat.enum'

export const aiWorker = (io: SocketServer) => {
  const worker = new Worker(
    EQueueName.ai_response_queue,
    async (job: any) => {
      const chatUseCase = new ChatUseCase()
      try {
        return await chatUseCase.aiResponse(job.data.message, job.data.thread)
      } catch (error: any) {
        return {
          id: Date.now(),
          text: error?.message || 'AI failed to respond. Please try again.',
          sender: ESender.AI,
          threadId: job.data.thread.id,
        }
      }
    },
    { connection: redisConnection },
  )

  worker.on('completed', (job, result) => {
    // Emit message to the correct thread room
    io.to(job.data.thread.id).emit(ESocketEvent.newMessage, result)
  })
}
