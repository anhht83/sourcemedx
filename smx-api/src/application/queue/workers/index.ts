import { aiWorker } from './aiWorker'
import { Server as SocketServer } from 'socket.io'
import { reportWorker } from './reportWorker'

export const initQueueWorkers = (io: SocketServer) => {
  aiWorker(io)
  reportWorker(io)
}
