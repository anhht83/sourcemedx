import { Socket, Server as SocketServer } from 'socket.io'
import { User } from '../application/entities'
import { Server as HttpServer } from 'http'
import { config } from './config'
import { socketAuth } from '../application/sockets/socketAuth'
import { registerSocketEvents } from '../application/sockets/socketHandler'

export let io: SocketServer

/**
 * Initializes the Socket.io server and registers event handlers.
 */
export const setupSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: config.frontendUrl, // Allow all origins (replace with specific origin in production)
      methods: '*', // Allow only GET and POST requests
      credentials: true, // Allow sending cookies and headers
    },
  })

  io.use((socket: Socket & { user?: User }, next: any) => {
    socketAuth(socket, next)
  })
  // Re
  registerSocketEvents(io)

  return io
}
