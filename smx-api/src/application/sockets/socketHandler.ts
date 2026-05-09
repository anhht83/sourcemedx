import { Server as SocketServer, Socket } from 'socket.io'
import { User } from '../entities'
import { ESocketEvent } from '../enums/socket.enum'
import { getAIQueueStatusForThread } from '../queue/aiQueue'
import { EQueueName } from '../enums/queu.enum'

/**
 * Initializes the Socket.io server and registers event handlers.
 */
export const registerSocketEvents = (io: SocketServer) => {
  io.on('connection', (socket: Socket & { user?: User }) => {
    socket.on(ESocketEvent.joinThread, async (threadId: string, callback) => {
      try {
        socket.join(threadId)

        const aiQueueStatus = await getAIQueueStatusForThread(threadId)

        // Instead of emitting 'aiStatus', just return it via callback
        callback?.({
          success: true,
          message: {
            [EQueueName.ai_response_queue]: aiQueueStatus,
          },
        })
      } catch (err: any) {
        callback?.({ success: false, error: err.message })
      }
    })

    socket.on(ESocketEvent.leaveThread, (threadId) => {
      socket.leave(threadId)
    })

    socket.on('Disconnect socket', () => {})
  })
}
