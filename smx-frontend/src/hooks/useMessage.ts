'use client'

import { useEffect, useState } from 'react'
import { IMessage, IThread } from '@/types/chat'
import { EAiSearchRequestStatus, ESender } from '@/enums/chat.enum'
import { useSocket } from '@/context/SocketContext'
import { ESocketEvent } from '@/enums/socket.enum'
import { threadKey } from '@/services/chatService'
import { useQueryClient } from '@tanstack/react-query'

type TUseMessageProps = {
  thread?: IThread
}
/*
 * Hook to load messages of a thread, also handle new messages from AI / USER
 */
export const useMessage = ({ thread }: TUseMessageProps) => {
  const [messages, setMessages] = useState<IMessage[]>(thread?.messages || [])
  const { socket, setLoadingAIResponse } = useSocket()
  const queryClient = useQueryClient()

  const handleNewMessage = (message: IMessage) => {
    // update current thread
    setMessages((prev) => {
      if (!prev.some((m) => m.id === message.id)) {
        return [...prev, message]
      } else {
        return prev
      }
    })

    // update thread status
    if (message.searchStatus === EAiSearchRequestStatus.ready_for_search) {
      queryClient.invalidateQueries({
        queryKey: threadKey(message.threadId),
      })
    }

    // loading indicator to wait for AI response
    if (message.sender === ESender.AI) {
      setLoadingAIResponse(false)
    }
  }

  useEffect(() => {
    setMessages(thread?.messages || [])
  }, [thread?.messages])

  useEffect(() => {
    if (!socket || !thread?.id) return

    // Register event listener (once per socket change)
    socket.on(ESocketEvent.newMessage, handleNewMessage)

    // Cleanup function to remove listener when component unmounts
    return () => {
      socket.off(ESocketEvent.newMessage, handleNewMessage)
    }
  }, [socket, thread?.id]) // Re-run only when `socket` or `threadId` changes

  return {
    handleNewMessage,
    messages,
  }
}
