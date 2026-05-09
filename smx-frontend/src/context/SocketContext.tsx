'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import { ESocketEvent } from '@/enums/socket.enum'
import { EQueueName, EQueueStatus } from '@/enums/queue.enum'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

interface ISocketContext {
  socket: Socket | null
  isConnected: boolean
  loadingAIResponse: boolean
  setLoadingAIResponse: (loading: boolean) => void
}

interface IJoinedThreadResponse {
  success: boolean
  message?: {
    [EQueueName.ai_response_queue]?: EQueueStatus
  }
  error?: string
}

const SocketContext = createContext<ISocketContext | undefined>(undefined)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { threadId } = useParams()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loadingAIResponse, setLoadingAIResponse] = useState(false)

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error('Socket URL is not defined')
      return
    }
    if (!socket) {
      const socketInstance = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 3, // Try reconnecting 3 times
        withCredentials: true, // Allow cookies
      })

      socketInstance.on('connect', () => {
        setIsConnected(true)
      })

      socketInstance.on('disconnect', () => {
        setIsConnected(false)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect() // Cleanup on unmount
      }
    } else {
      return () => {
        socket.disconnect() // Cleanup on unmount
      }
    }
  }, [])

  useEffect(() => {
    if (!socket || !threadId) return
    socket.emit(
      ESocketEvent.joinThread,
      threadId,
      (response: IJoinedThreadResponse) => {
        if (response.success) {
          if (
            response.message?.[EQueueName.ai_response_queue] ===
            EQueueStatus.pending
          ) {
            setLoadingAIResponse(true)
          } else {
            setLoadingAIResponse(false)
          }
        }
      },
    ) // Join room

    return () => {
      socket.emit(ESocketEvent.leaveThread, threadId) // Leave room when unmounting
      //setLoadingAIResponse(false)
    }
  }, [socket, threadId]) // Run when `threadId` changes

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        loadingAIResponse: loadingAIResponse && isConnected,
        setLoadingAIResponse,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
